#!/usr/bin/env node
// Backfill remaining cases with honest "unknown" resolution defaults.
// We do not invent statuses we haven't researched. We mark them unknown
// honestly so the schema is consistent and the filter UI works.

import fs from "node:fs";
import path from "node:path";

const CASES_DIR = "/home/user/workspace/wa-registry/src/content/cases";

const BLOCK = `remediation_status: unknown
remediation_note: "Resolution tracking not yet researched. To be backfilled."
reform_status: unknown
reform_status_note: "Reform tracking not yet researched. To be backfilled."
next_milestone: null
next_milestone_date: null
`;

const files = fs.readdirSync(CASES_DIR).filter((f) => f.endsWith(".md"));
let updated = 0;
let skipped = 0;
let failed = [];

for (const file of files) {
  const p = path.join(CASES_DIR, file);
  let body = fs.readFileSync(p, "utf-8");

  if (body.includes("\nremediation_status:") || body.startsWith("remediation_status:")) {
    skipped++;
    continue;
  }

  // Try the SOURCES comment marker first
  let replaced = false;
  let next = body.replace(/^(# === SOURCES ===\n)/m, (_, mark) => {
    replaced = true;
    return `# === RESOLUTION TRACKING ===\n${BLOCK}\n${mark}`;
  });

  if (!replaced) {
    next = body.replace(/^(sources:)/m, (_, mark) => {
      replaced = true;
      return `${BLOCK}\n${mark}`;
    });
  }

  if (!replaced) {
    failed.push(file);
    continue;
  }

  fs.writeFileSync(p, next);
  updated++;
}

console.log(`Updated: ${updated}`);
console.log(`Skipped (already had fields): ${skipped}`);
if (failed.length) {
  console.log(`FAILED (no insertion point found):`);
  failed.forEach((f) => console.log(`  - ${f}`));
}
