#!/usr/bin/env node
/**
 * One-off: apply the resolution-tracking backfill to case frontmatter.
 *
 * Reads /home/user/workspace/wa-registry-backfill/backfill_results.json
 * and merges remediation_status / reform_status / next_milestone fields
 * into the YAML frontmatter of the corresponding case files. Idempotent:
 * re-running with the same input is a no-op.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CASES_DIR = join(ROOT, 'src', 'content', 'cases');
const RESULTS_PATH = '/home/user/workspace/wa-registry-backfill/backfill_results.json';

const data = JSON.parse(readFileSync(RESULTS_PATH, 'utf8'));
const cases = data.cases;

let applied = 0;
let skipped = 0;
const issues = [];

for (const [slug, fields] of Object.entries(cases)) {
  const filePath = join(CASES_DIR, `${slug}.md`);
  if (!existsSync(filePath)) {
    issues.push(`MISSING FILE: ${slug}.md`);
    skipped++;
    continue;
  }
  const raw = readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const d = parsed.data;

  // Only set fields that aren't already set (preserve any manual edits).
  // Use 'unknown' as the default-but-overridable signal.
  const ALWAYS_SET = ['remediation_status', 'reform_status'];
  const NULLABLE = ['remediation_note', 'reform_status_note', 'next_milestone', 'next_milestone_date'];

  let changed = false;
  for (const f of ALWAYS_SET) {
    const cur = d[f];
    const next = fields[f];
    if (next == null) continue;
    if (cur === undefined || cur === 'unknown') {
      d[f] = next;
      changed = true;
    } else if (cur !== next) {
      issues.push(`${slug}: ${f} already set to '${cur}', backfill wants '${next}' — leaving existing`);
    }
  }
  for (const f of NULLABLE) {
    const next = fields[f];
    if (next == null || next === '') continue;
    if (d[f] === undefined || d[f] === null || d[f] === '') {
      d[f] = next;
      changed = true;
    }
  }

  // Bump last_updated to today so the case listings reflect the change
  if (changed) {
    d.last_updated = new Date().toISOString().slice(0, 10);
    const out = matter.stringify(parsed.content, d);
    writeFileSync(filePath, out);
    applied++;
    console.log(`[backfill] ${slug}: remediation=${d.remediation_status} reform=${d.reform_status}`);
  } else {
    skipped++;
    console.log(`[backfill] ${slug}: no changes`);
  }
}

console.log(`\n[backfill] Done. applied=${applied} skipped=${skipped}`);
if (issues.length) {
  console.log(`\n[backfill] Issues (${issues.length}):`);
  for (const i of issues) console.log(`  - ${i}`);
}
