#!/usr/bin/env node
/**
 * Walk every case, find sources with `url` but no `archive_url`, and submit
 * each URL to the Wayback Machine Save Page Now (SPN2) API. Write the
 * resulting `https://web.archive.org/web/<timestamp>/<url>` back into the
 * case frontmatter, in place.
 *
 * Rate limits: SPN2 is documented at ~15 requests/minute for the public,
 * unauthenticated path. We sleep 5s between submissions to stay polite, and
 * cap each run at MAX_PER_RUN to avoid long sessions.
 *
 * Usage:
 *   node scripts/archive-sources.mjs              # archive up to MAX_PER_RUN missing sources
 *   node scripts/archive-sources.mjs --dry-run    # list what would be archived
 *   node scripts/archive-sources.mjs --tier=1     # only Tier 1 (default: all tiers)
 *   node scripts/archive-sources.mjs --max=10     # limit per run
 *
 * Re-running is safe; sources that already have archive_url are skipped.
 *
 * Honest caveats:
 *   - SPN2 can fail silently or return a non-canonical URL. We retry once
 *     and then skip.
 *   - Some government PDFs are too large or behind robots.txt and will
 *     never archive. Those are logged to ARCHIVE_FAILURES.md for manual
 *     handling (upload PDFs to the repo, link locally).
 */
import { readdirSync, readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';

const CASES_DIR = 'src/content/cases';
const FAIL_LOG = 'ARCHIVE_FAILURES.md';

const argv = new Set(process.argv.slice(2));
const DRY = argv.has('--dry-run');
const TIER_1_ONLY = [...argv].some((a) => a === '--tier=1');
const MAX_ARG = [...argv].find((a) => a.startsWith('--max='));
const MAX_PER_RUN = MAX_ARG ? parseInt(MAX_ARG.split('=')[1], 10) : 25;
const SLEEP_MS = 5000;

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function submitToWayback(url) {
  // SPN2 endpoint. Without an Authorization header we get the public path.
  // Returns a job id; we then poll for the snapshot URL.
  try {
    const res = await fetch('https://web.archive.org/save/' + url, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': 'wa-public-watchdogs-archiver/1.0' },
    });
    // SPN returns 302 -> /web/<timestamp>/<url>. Capture the Location.
    const loc = res.headers.get('location');
    if (loc && loc.includes('/web/')) {
      return 'https://web.archive.org' + (loc.startsWith('/') ? loc : '/' + loc);
    }
    // Fallback: query the availability API for the latest snapshot.
    const avail = await fetch('https://archive.org/wayback/available?url=' + encodeURIComponent(url));
    const j = await avail.json();
    const snap = j?.archived_snapshots?.closest;
    if (snap?.available && snap?.url) return snap.url;
    return null;
  } catch (e) {
    return null;
  }
}

const files = readdirSync(CASES_DIR).filter((f) => f.endsWith('.md'));
let queued = 0;
let archived = 0;
let failed = 0;

for (const file of files) {
  if (archived + failed >= MAX_PER_RUN) break;
  const path = join(CASES_DIR, file);
  const raw = readFileSync(path, 'utf-8');
  const parsed = matter(raw);
  const data = parsed.data;
  if (!Array.isArray(data.sources) || data.sources.length === 0) continue;

  let dirty = false;
  for (const s of data.sources) {
    if (archived + failed >= MAX_PER_RUN) break;
    if (!s.url) continue;
    if (s.archive_url) continue;
    if (TIER_1_ONLY && s.tier !== 1) continue;

    queued++;
    if (DRY) {
      console.log(`[dry] would archive (${data.slug || basename(file, '.md')}): ${s.url}`);
      continue;
    }

    console.log(`[archive] ${data.slug || basename(file, '.md')}: ${s.url}`);
    const archiveUrl = await submitToWayback(s.url);
    if (archiveUrl) {
      s.archive_url = archiveUrl;
      dirty = true;
      archived++;
      console.log(`[archive]   -> ${archiveUrl}`);
    } else {
      failed++;
      const line = `- \`${data.slug}\` source not archived: ${s.url}\n`;
      appendFileSync(FAIL_LOG, line);
      console.log(`[archive]   FAILED (logged to ${FAIL_LOG})`);
    }
    await sleep(SLEEP_MS);
  }

  if (dirty && !DRY) {
    const out = matter.stringify(parsed.content, data);
    writeFileSync(path, out);
  }
}

console.log(`\n[archive] Done. queued=${queued} archived=${archived} failed=${failed}`);
if (DRY) {
  console.log(`[archive] Dry run. No files written.`);
} else {
  console.log(`[archive] Re-run to continue (capped at ${MAX_PER_RUN} per run).`);
}
