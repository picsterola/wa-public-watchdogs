#!/usr/bin/env node
// Inventory unique actors across Documented + Reported cases (skip Alleged + retracted).
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CASES_DIR = path.join(process.cwd(), 'src/content/cases');
const files = fs.readdirSync(CASES_DIR).filter((f) => f.endsWith('.md'));

const actorIndex = new Map();
for (const f of files) {
  const raw = fs.readFileSync(path.join(CASES_DIR, f), 'utf8');
  const { data } = matter(raw);
  if (!data) continue;
  if (data.review_status === 'retracted') continue;
  if (data.evidentiary_status === 'alleged') continue; // user chose: Documented + Reported only

  const caseSlug = f.replace(/\.md$/, '').replace(/^\d{4}-/, '');
  const status = data.evidentiary_status;
  for (const a of data.actors || []) {
    if (!a.name) continue;
    // Skip placeholders / collectives
    if (/^additional respondents/i.test(a.name)) continue;
    if (/^additional /i.test(a.name)) continue;
    // Skip generic agency entries (no person)
    if (a.role_type === 'agency') continue;
    if (a.role_type === 'contractor') continue;
    if (a.role_type === 'nonprofit') continue;
    const key = a.name.trim();
    if (!actorIndex.has(key)) {
      actorIndex.set(key, {
        name: key,
        role_type: a.role_type,
        title: a.title,
        party: a.party,
        jurisdiction: a.jurisdiction,
        cases: [],
      });
    }
    actorIndex.get(key).cases.push({ slug: caseSlug, status });
  }
}

const out = Array.from(actorIndex.values()).sort((a, b) => b.cases.length - a.cases.length || a.name.localeCompare(b.name));
console.log(JSON.stringify(out, null, 2));
console.log('\n# Total unique actors:', out.length);
console.log('# Multi-case actors:', out.filter(a => a.cases.length > 1).length);
