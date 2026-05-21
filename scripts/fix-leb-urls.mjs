#!/usr/bin/env node
// Replace the LEB opinions index URL with per-opinion canonical URLs in case files.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CASES_DIR = 'src/content/cases';
const INDEX_URL = 'https://leg.wa.gov/about-the-legislature/ethics/ethics-complaint-opinions/';
const STALE_URL = 'https://leg.wa.gov/legislativeagencies/ethics/';

// Map of file-name patterns to canonical opinion-page slugs on leg.wa.gov.
// Most map 1:1. 25-09 and 25-10 are rollups; their pages exist as listed.
const URL_MAP = {
  'leb-24-01': '24-01',
  'leb-24-06': '24-06',
  'leb-24-09': '24-09',
  'leb-24-10': '24-10',
  'leb-24-11': '24-11',
  'leb-25-01': '25-01',
  'leb-25-02': '25-02',
  'leb-25-03': '25-03',
  'leb-25-04': '25-04',
  'leb-25-06': '25-06',
  'leb-25-09': '25-09',
  'leb-25-10': '25-10',
  'leb-25-11': '25-11',
  'leb-25-37': '25-37',
  'leb-25-38': '25-38',
};

const files = readdirSync(CASES_DIR).filter((f) => /-leb-/.test(f));
let changed = 0;
for (const f of files) {
  const key = Object.keys(URL_MAP).find((k) => f.includes(k));
  if (!key) {
    console.warn(`[skip] no mapping for ${f}`);
    continue;
  }
  const slug = URL_MAP[key];
  const canonical = `https://leg.wa.gov/about-the-legislature/ethics/ethics-complaint-opinions/${slug}/`;
  const path = join(CASES_DIR, f);
  let txt = readFileSync(path, 'utf8');
  const before = txt;
  // Replace exactly the index URL (with or without trailing slash) and the stale path.
  txt = txt.replaceAll(INDEX_URL, canonical);
  txt = txt.replaceAll(STALE_URL, canonical);
  if (txt !== before) {
    writeFileSync(path, txt);
    changed++;
    console.log(`[fix] ${f} -> ${slug}/`);
  } else {
    console.warn(`[noop] ${f} (no replacement made)`);
  }
}
console.log(`\n[done] ${changed}/${files.length} files updated`);
