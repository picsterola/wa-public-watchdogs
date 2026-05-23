#!/usr/bin/env node
// Backfill resolution-tracking fields on 15 LEB cases.
// All defer their structural resolution-tracking to the meta-case WA-2026-META-LEB.
// Procedural disposition stays in the existing legal_status / outcome_summary.

import fs from "node:fs";
import path from "node:path";

const CASES_DIR = "/home/user/workspace/wa-registry/src/content/cases";

const LEB_FILES = [
  "2024-leb-24-01-saldana-public-resources.md",
  "2024-leb-24-06-mullet-public-resources.md",
  "2024-leb-24-09-dhingra-website-info.md",
  "2024-leb-24-10-trudeau-website-election.md",
  "2024-leb-24-11-wilson-public-records.md",
  "2025-leb-25-01-hackney-conflict.md",
  "2025-leb-25-02-caldier-special-privileges.md",
  "2025-leb-25-03-house-dem-caucus-social-media.md",
  "2025-leb-25-04-zahn-outside-employment.md",
  "2025-leb-25-06-walen-outside-employment.md",
  "2025-leb-25-09-jinkins-public-resources.md",
  "2025-leb-25-10-troyer-wirtz-public-resources.md",
  "2025-leb-25-11-alvarado-outside-employment.md",
  "2025-leb-25-37-parshley-conflict.md",
  "2026-leb-25-38-simmons-special-privileges.md",
];

const RESOLUTION_BLOCK = `remediation_status: not_required
remediation_note: "LEB cases are procedural ethics adjudications; structural resolution is tracked at the meta-case level (WA-2026-META-LEB). Individual case disposition is reflected in legal_status and outcome_summary above."
reform_status: none_proposed
reform_status_note: "Structural reform of LEB enforcement (penalty modernization, staffing, public-hearing frequency) is tracked at the meta-case level (WA-2026-META-LEB)."
next_milestone: null
next_milestone_date: null
`;

let updated = 0;
let skipped = 0;

for (const file of LEB_FILES) {
  const p = path.join(CASES_DIR, file);
  let body = fs.readFileSync(p, "utf-8");

  if (body.includes("remediation_status:")) {
    console.log(`SKIP (already has resolution fields): ${file}`);
    skipped++;
    continue;
  }

  // Insert the block before the `sources:` line (which exists in every LEB case)
  // Robust pattern: match the `# === SOURCES ===` comment line OR a bare `sources:` at column 0
  let replaced = false;
  const newBody = body.replace(/^(# === SOURCES ===\n)/m, (_, mark) => {
    replaced = true;
    return `# === RESOLUTION TRACKING ===\n${RESOLUTION_BLOCK}\n${mark}`;
  });

  if (!replaced) {
    // Fallback: insert before bare `sources:` line at column 0
    const newBody2 = body.replace(/^(sources:)/m, (_, mark) => {
      replaced = true;
      return `${RESOLUTION_BLOCK}\n${mark}`;
    });
    if (replaced) {
      fs.writeFileSync(p, newBody2);
      console.log(`UPDATED (fallback insert): ${file}`);
      updated++;
      continue;
    }
    console.log(`!! COULD NOT INSERT into ${file}`);
    continue;
  }

  fs.writeFileSync(p, newBody);
  console.log(`UPDATED: ${file}`);
  updated++;
}

console.log(`\nDone. Updated: ${updated}. Skipped: ${skipped}.`);
