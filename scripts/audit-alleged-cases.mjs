#!/usr/bin/env node
/**
 * Walk every case in src/content/cases/, surface the ones with
 * evidentiary_status: alleged or reported, and dump every named actor
 * with their role_type. Output goes to LEGAL_AUDIT.md at the repo root.
 *
 * Purpose: legal-hardening review. Flag any private individual (non-elected,
 * non-senior staff) named in an unproven-tier case. Public figures stay.
 * Private figures get a closer read.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';

const CASES_DIR = 'src/content/cases';
const OUT = 'LEGAL_AUDIT.md';

const files = readdirSync(CASES_DIR).filter((f) => f.endsWith('.md'));
const cases = files.map((f) => {
  const raw = readFileSync(join(CASES_DIR, f), 'utf-8');
  const { data } = matter(raw);
  return { file: f, slug: basename(f, '.md').replace(/^\d{4}-/, ''), data };
});

const byStatus = (s) => cases.filter((c) => c.data.evidentiary_status === s);
const alleged = byStatus('alleged');
const reported = byStatus('reported');

// Public-figure heuristics. Agencies and offices are entities, not people.
// Elected and senior officials carry full Sullivan actual-malice protection.
// Anyone with a public-facing title (Chief, Director, Superintendent, etc.)
// is treated as a public figure for the purposes of this audit. Everyone
// else gets a PRIVATE-FIGURE FLAG for a closer human read.
const PUBLIC_TITLE_RX = /(chief|director|superintendent|speaker|ceo|coo|cfo|commissioner|president|secretary|mayor|governor|senator|representative|councilmember|attorney general|prosecutor|sheriff|deputy ceo|executive director|head)/i;
function actorLine(a) {
  const flags = [];
  const isEntity = a.role_type === 'agency' || /(department|caucus|committee|office of|district|authority|commission|board|solutions)/i.test(a.name);
  const isElectedOrSenior = a.role_type === 'elected' || a.role_type === 'senior_staff' || a.role_type === 'agency_head';
  const titleIsPublic = a.title && PUBLIC_TITLE_RX.test(a.title);
  if (!isEntity && !isElectedOrSenior && !titleIsPublic) {
    flags.push('PRIVATE-FIGURE FLAG');
  }
  return `  - **${a.name}** (${a.role_type}${a.title ? ` — ${a.title}` : ''}${a.party ? `, ${a.party}` : ''}${a.jurisdiction ? `, ${a.jurisdiction}` : ''})${flags.length ? ' — ' + flags.join(', ') : ''}`;
}

let md = `# Legal audit \u2014 unproven-tier cases\n\n`;
md += `Generated: ${new Date().toISOString().slice(0, 10)}\n\n`;
md += `Purpose: surface every actor named in a case where evidentiary_status is not "documented". `;
md += `Public officials (elected, agency heads, senior staff) carry full Sullivan actual-malice protection. `;
md += `Private individuals only need to show negligence under RCW 4.24 / Washington common law. `;
md += `Anyone flagged **PRIVATE-FIGURE FLAG** below should be reviewed and likely removed or rewritten to refer only to the role, not the person.\n\n`;
md += `## Summary\n\n`;
md += `- ${alleged.length} alleged-tier cases\n`;
md += `- ${reported.length} reported-tier cases\n`;
md += `- ${cases.filter((c) => c.data.evidentiary_status === 'documented').length} documented-tier cases (not audited here)\n\n`;

md += `---\n\n## Alleged tier (${alleged.length})\n\n`;
for (const c of alleged) {
  md += `### ${c.data.id} \u2014 ${c.data.title}\n`;
  md += `Slug: \`${c.slug}\` \u00b7 Legal status: \`${c.data.legal_status}\`\n\n`;
  md += `Actors:\n`;
  for (const a of c.data.actors || []) {
    md += actorLine(a) + '\n';
  }
  md += `\n`;
}

md += `---\n\n## Reported tier (${reported.length})\n\n`;
for (const c of reported) {
  md += `### ${c.data.id} \u2014 ${c.data.title}\n`;
  md += `Slug: \`${c.slug}\` \u00b7 Legal status: \`${c.data.legal_status}\`\n\n`;
  md += `Actors:\n`;
  for (const a of c.data.actors || []) {
    md += actorLine(a) + '\n';
  }
  md += `\n`;
}

md += `---\n\n## Reviewer checklist\n\n`;
md += `For every PRIVATE-FIGURE FLAG above:\n\n`;
md += `1. Is the person identifiable by role alone (e.g. "the procurement officer")? If yes, rewrite to drop the name.\n`;
md += `2. Is the person a public-facing official (regular media appearances, signs official communications)? If yes, document why they qualify and leave in.\n`;
md += `3. Is the conduct described as alleged in the body prose? Spot-check; the rewrite pass should have caught this but verify.\n`;
md += `4. Does the case page show the AllegationBanner above the h1? Yes if evidentiary_status is "alleged" or "reported" (now enforced in the template).\n\n`;
md += `For every alleged-tier case overall:\n\n`;
md += `1. Body lede explicitly says "alleged" before any conduct verb.\n`;
md += `2. Headline does not assert conduct as fact (no "Senator X used public resources" \u2014 must be "alleged use of public resources").\n`;
md += `3. Sources include the underlying complaint or docket filing, not just news coverage.\n`;
md += `4. Legal status field accurately reflects the docket (complaint_filed, closed_no_action, etc.).\n`;

writeFileSync(OUT, md);
console.log(`[audit] Wrote ${OUT}`);
console.log(`[audit] ${alleged.length} alleged, ${reported.length} reported`);
