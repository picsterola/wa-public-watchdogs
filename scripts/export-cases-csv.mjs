import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CASES_DIR = path.resolve('src/content/cases');
const OUT = path.resolve('dist/wa-registry-cases.csv');

const files = fs.readdirSync(CASES_DIR).filter(f => f.endsWith('.md')).sort();

const rows = [];
for (const f of files) {
  const raw = fs.readFileSync(path.join(CASES_DIR, f), 'utf8');
  const { data } = matter(raw);
  const actors = (data.actors || []).map(a => {
    if (typeof a === 'string') return a;
    return [a.name, a.role, a.entity].filter(Boolean).join(' / ');
  }).join(' | ');
  const sources = (data.sources || []).map(s => {
    const url = s.url || '';
    const title = (s.title || '').replace(/\|/g, '/');
    const pub = s.publisher || '';
    return `[T${s.tier || '?'}] ${title} (${pub}) ${url}`;
  }).join(' || ');
  const reforms = Array.isArray(data.reforms_implicated) ? data.reforms_implicated.join('; ') : (data.reforms_implicated || '');
  const tags = Array.isArray(data.tags) ? data.tags.join('; ') : (data.tags || '');
  const severity = Array.isArray(data.severity_type) ? data.severity_type.join('; ') : (data.severity_type || '');

  rows.push({
    id: data.id || '',
    title: data.title || '',
    slug: data.slug || f.replace(/\.md$/, ''),
    jurisdiction: data.jurisdiction || '',
    agency: data.agency || '',
    date_first_reported: data.date_first_reported || '',
    date_incident_start: data.date_incident_start || '',
    date_incident_end: data.date_incident_end || '',
    actors,
    evidentiary_status: data.evidentiary_status || '',
    severity_type: severity,
    legal_status: data.legal_status || '',
    dollars_at_issue: data.dollars_at_issue ?? '',
    dollars_confirmed_loss: data.dollars_confirmed_loss ?? '',
    reforms_implicated: reforms,
    outcome_summary: (data.outcome_summary || '').replace(/\s+/g, ' ').trim(),
    sources,
    review_status: data.review_status || '',
    contributor: data.contributor || '',
    tags,
    url: `https://picsterola.github.io/wa-public-watchdogs/cases/${data.slug || f.replace(/\.md$/, '')}/`,
  });
}

const headers = Object.keys(rows[0]);
const escape = (v) => {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const csv = [
  headers.join(','),
  ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
].join('\n');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, csv);
console.log(`Wrote ${rows.length} rows to ${OUT}`);
