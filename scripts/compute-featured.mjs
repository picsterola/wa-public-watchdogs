#!/usr/bin/env node
/**
 * compute-featured.mjs
 *
 * Computes the homepage Top 5 by scoring every published case on objective
 * metadata in its frontmatter. Writes to src/data/featured.json which the
 * homepage reads at build time.
 *
 * Scoring rules are documented in SCHEMA.md ("Featured score" section).
 * Cases with featured_pin: true are forced in regardless of score, up to 5.
 *
 * Usage:
 *   node scripts/compute-featured.mjs            # write featured.json
 *   node scripts/compute-featured.mjs --dry-run  # print top 10 with reasons, no write
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const CASES_DIR = join(ROOT, 'src/content/cases');
const OUT_DIR = join(ROOT, 'src/data');
const OUT_FILE = join(OUT_DIR, 'featured.json');

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

function scoreLegalStatus(s) {
  if (['settled', 'convicted', 'audit_finding'].includes(s)) return [5, `legal:${s}=+5`];
  if (['civil_filed', 'criminal_charged', 'complaint_filed'].includes(s)) return [3, `legal:${s}=+3`];
  if (s === 'under_investigation') return [2, `legal:${s}=+2`];
  return [0, null];
}

function scoreEvidentiary(s) {
  if (s === 'documented') return [4, 'evid:documented=+4'];
  if (s === 'reported') return [2, 'evid:reported=+2'];
  if (s === 'alleged') return [1, 'evid:alleged=+1'];
  return [0, null];
}

function scoreDollars(d) {
  if (d == null) return [0, null];
  if (d >= 10_000_000) return [5, `$${(d / 1e6).toFixed(0)}M>=10M=+5`];
  if (d >= 1_000_000) return [3, `$${(d / 1e6).toFixed(1)}M>=1M=+3`];
  if (d >= 100_000) return [1, `$${(d / 1e3).toFixed(0)}K>=100K=+1`];
  return [0, null];
}

function scoreTier1(sources) {
  if (!Array.isArray(sources)) return [0, null];
  const hasTier1 = sources.some((s) => s && s.tier === 1);
  return hasTier1 ? [3, 'tier1=+3'] : [0, null];
}

function scoreRecency(lastVerified) {
  if (!lastVerified) return [0, null];
  const d = lastVerified instanceof Date ? lastVerified : new Date(lastVerified);
  if (Number.isNaN(d.getTime())) return [0, null];
  const ageMs = Date.now() - d.getTime();
  return ageMs <= NINETY_DAYS_MS ? [2, 'recent<=90d=+2'] : [0, null];
}

function scoreSeverity(sev) {
  if (!Array.isArray(sev)) return [0, null];
  const hit = sev.includes('criminal_fraud') || sev.includes('structural_failure');
  return hit ? [2, 'severity:criminal_or_structural=+2'] : [0, null];
}

function scoreCrossRefs(slug, caseId, allBodies) {
  // Count OTHER case bodies that reference this case's slug or its ID.
  // Cross-refs in bodies use either /cases/<slug> or the case ID (e.g. SPS-2024-001).
  let refs = 0;
  for (const [otherSlug, body] of Object.entries(allBodies)) {
    if (otherSlug === slug) continue;
    const hitsSlug = body.includes(`/cases/${slug}`);
    const hitsId = caseId ? body.includes(caseId) : false;
    if (hitsSlug || hitsId) refs++;
  }
  return refs >= 2 ? [2, `xref:${refs}=+2`] : [0, null];
}

function scoreCase(c, allBodies) {
  const reasons = [];
  let total = 0;
  for (const [pts, r] of [
    scoreLegalStatus(c.data.legal_status),
    scoreEvidentiary(c.data.evidentiary_status),
    scoreDollars(c.data.dollars_at_issue),
    scoreTier1(c.data.sources),
    scoreRecency(c.data.last_verified),
    scoreSeverity(c.data.severity_type),
    scoreCrossRefs(c.slug, c.data.id, allBodies),
  ]) {
    total += pts;
    if (r) reasons.push(r);
  }
  return { total, reasons };
}

function tieBreakKey(c) {
  const lv = c.data.last_verified ? new Date(c.data.last_verified).getTime() : 0;
  const dollars = c.data.dollars_at_issue ?? 0;
  return [-lv, -dollars, c.slug];
}

function compareTie(a, b) {
  const ka = tieBreakKey(a);
  const kb = tieBreakKey(b);
  for (let i = 0; i < ka.length; i++) {
    if (ka[i] < kb[i]) return -1;
    if (ka[i] > kb[i]) return 1;
  }
  return 0;
}

async function loadCases() {
  const files = (await readdir(CASES_DIR)).filter((f) => f.endsWith('.md'));
  const cases = [];
  const allBodies = {};
  for (const f of files) {
    const raw = await readFile(join(CASES_DIR, f), 'utf8');
    const parsed = matter(raw);
    const slug = f.replace(/\.md$/, '').replace(/^\d{4}-/, '');
    // Only include published cases
    const review = parsed.data.review_status ?? 'draft';
    if (review !== 'published') continue;
    cases.push({ slug, data: parsed.data });
    allBodies[slug] = parsed.content;
  }
  return { cases, allBodies };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const { cases, allBodies } = await loadCases();

  const scored = cases.map((c) => ({
    ...c,
    score: scoreCase(c, allBodies),
  }));

  // Sort by score desc, then tiebreakers
  scored.sort((a, b) => {
    if (b.score.total !== a.score.total) return b.score.total - a.score.total;
    return compareTie(a, b);
  });

  // Build Top 5: pins first (up to 5), then highest-scoring non-pinned to fill.
  const pinned = scored.filter((c) => c.data.featured_pin === true).slice(0, 5);
  const remaining = 5 - pinned.length;
  const pinnedSlugs = new Set(pinned.map((c) => c.slug));
  const unpinned = scored.filter((c) => !pinnedSlugs.has(c.slug)).slice(0, remaining);
  const top5 = [...pinned, ...unpinned];

  if (dryRun) {
    console.log('=== TOP 10 ===');
    scored.slice(0, 10).forEach((c, i) => {
      const pin = c.data.featured_pin ? ' [PINNED]' : '';
      console.log(`${i + 1}. ${c.slug} (score=${c.score.total})${pin}`);
      console.log(`   ${c.score.reasons.join(' | ')}`);
    });
    console.log('\n=== SELECTED TOP 5 ===');
    top5.forEach((c, i) => {
      const pin = c.data.featured_pin ? ' [PINNED]' : '';
      console.log(`${i + 1}. ${c.slug} (score=${c.score.total})${pin}`);
    });
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  const payload = {
    generated_at: new Date().toISOString(),
    method: 'objective metadata scoring per SCHEMA.md',
    top5: top5.map((c) => ({
      slug: c.slug,
      score: c.score.total,
      pinned: c.data.featured_pin === true,
      reasons: c.score.reasons,
    })),
  };
  await writeFile(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${OUT_FILE}`);
  console.log('Top 5:');
  top5.forEach((c, i) => {
    const pin = c.data.featured_pin ? ' [PINNED]' : '';
    console.log(`  ${i + 1}. ${c.slug} (score=${c.score.total})${pin}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
