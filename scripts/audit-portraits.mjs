#!/usr/bin/env node
/**
 * Dump every official portrait used on the site with its license and source.
 * Output: PORTRAIT_AUDIT.md
 *
 * Anything without a documented gov-page or CC license should be pulled.
 * Right of publicity in WA: RCW 63.60. Government works and CC-licensed
 * portraits are safe. Scraped news/campaign photos are not.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('src/data/officials.json', 'utf-8'));
const officials = data.officials;

let md = `# Portrait audit\n\n`;
md += `Generated: ${new Date().toISOString().slice(0, 10)}\n\n`;
md += `Every portrait rendered on the site (Documented and Reported case pages only) is listed below with its license and source. Portraits without a documented gov-page or CC license should be pulled.\n\n`;
md += `Right-of-publicity baseline: RCW 63.60. Government works (federal, state, county, municipal) and properly licensed Creative Commons / Wikimedia files are safe. News photos, campaign photos, and unsourced images are not.\n\n`;

md += `## Portraits in use\n\n`;
md += `| Slug | Name | Title | License | Source |\n`;
md += `|------|------|-------|---------|--------|\n`;
for (const [slug, o] of Object.entries(officials)) {
  if (!o.photo) continue;
  const src = o.source_url ? `[link](${o.source_url})` : '\u2014';
  md += `| \`${slug}\` | ${o.name} | ${o.title} | ${o.license || '\u2014'} | ${src} |\n`;
}

md += `\n## No-portrait entries (text-only fallback)\n\n`;
md += `| Slug | Name | Title |\n`;
md += `|------|------|-------|\n`;
for (const [slug, o] of Object.entries(officials)) {
  if (o.photo) continue;
  md += `| \`${slug}\` | ${o.name} | ${o.title} |\n`;
}

md += `\n## Reviewer checklist\n\n`;
md += `For every portrait in use:\n\n`;
md += `1. License is one of: Wikimedia Commons (any CC variant), federal/state/county/municipal government work, official agency portrait released for public use.\n`;
md += `2. Source URL points to the canonical license page (Wikimedia file page, gov bio page).\n`;
md += `3. The portrait file at \`public/img/officials/<slug>.jpg\` was downloaded from the documented \`download_url\` and is not a derivative work that strips attribution.\n`;
md += `4. If any of the above fails: set \`photo: null\` in officials.json and let the page fall back to text-only.\n\n`;
md += `Portraits are only rendered on Documented and Reported case pages, not on Alleged-tier pages (enforced in src/pages/cases/[slug].astro \`shouldShowFaces()\`).\n`;

writeFileSync('PORTRAIT_AUDIT.md', md);
console.log('[portrait-audit] Wrote PORTRAIT_AUDIT.md');
