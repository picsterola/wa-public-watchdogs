// Shared formatting and label utilities.

export const SEVERITY_LABELS: Record<string, string> = {
  criminal_fraud: 'Criminal fraud',
  conflict_of_interest: 'Conflict of interest',
  structural_failure: 'Structural failure',
  rule_gaming: 'Rule gaming',
  special_privileges: 'Special privileges',
  misuse_public_resources: 'Misuse of public resources',
};

export const STATUS_LABELS: Record<string, string> = {
  documented: 'Documented',
  reported: 'Reported',
  alleged: 'Alleged',
};

export const LEGAL_STATUS_LABELS: Record<string, string> = {
  no_action: 'No action',
  complaint_filed: 'Complaint filed',
  under_investigation: 'Under investigation',
  audit_finding: 'Audit finding',
  civil_filed: 'Civil case filed',
  criminal_charged: 'Criminal charges filed',
  settled: 'Settled',
  convicted: 'Convicted',
  dismissed: 'Dismissed',
  closed_no_action: 'Closed, no action',
};

export const ROLE_LABELS: Record<string, string> = {
  elected: 'Elected',
  bureaucrat: 'Bureaucrat',
  agency: 'Agency',
  contractor: 'Contractor',
  nonprofit: 'Nonprofit',
  board_appointee: 'Board appointee',
};

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  audit: 'Audit',
  court_filing: 'Court filing',
  indictment: 'Indictment',
  leb_opinion: 'LEB opinion',
  sao_report: 'SAO report',
  pdc_filing: 'PDC filing',
  ig_report: 'IG report',
  ombudsman_report: 'Ombudsman report',
  news: 'News',
  agency_statement: 'Agency statement',
  foia_response: 'FOIA response',
};

export function formatDollars(n: number | null | undefined): string {
  if (n == null) return '—';
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(n % 1_000_000_000 === 0 ? 0 : 2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString('en-US')}`;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (d == null) return '—';
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatYear(d: Date | string | null | undefined): string {
  if (d == null) return '—';
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) {
    const s = String(d);
    const m = s.match(/\d{4}/);
    return m ? m[0] : s;
  }
  return String(date.getUTCFullYear());
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Acronyms that should remain uppercase when humanizing slugs.
const ACRONYMS = new Set([
  'leb', 'pdc', 'ig', 'it', 'seec', 'pra', 'foia', 'sao', 'ecf', 'pii', 'rcw', 'ag',
  'wa', 'kc', 'kcrha', 'wsdot', 'dcyf', 'dshs', 'dchs', 'sps', 'spd',
]);

export function humanizeReform(slug: string): string {
  return slug
    .split('_')
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export function severityBadge(s: string): string {
  return SEVERITY_LABELS[s] ?? s;
}

// Map a case's actors to a single government-body group used for navigation
// on the Cases index page. Priority: regional/special bodies first (Sound
// Transit, KCRHA, Port, SPS) so a Sound Transit case anchored to a Washington
// State jurisdiction still groups under Sound Transit. Falls back to the
// jurisdiction string.
export type CaseGroup =
  | 'Sound Transit'
  | 'KCRHA'
  | 'Port of Seattle'
  | 'Seattle Public Schools'
  | 'City of Seattle'
  | 'King County'
  | 'Washington State'
  | 'Other';

export const GROUP_ORDER: CaseGroup[] = [
  'Washington State',
  'King County',
  'City of Seattle',
  'Seattle Public Schools',
  'Sound Transit',
  'KCRHA',
  'Port of Seattle',
  'Other',
];

export const GROUP_SLUG: Record<CaseGroup, string> = {
  'Washington State': 'wa-state',
  'King County': 'king-county',
  'City of Seattle': 'seattle',
  'Seattle Public Schools': 'sps',
  'Sound Transit': 'sound-transit',
  'KCRHA': 'kcrha',
  'Port of Seattle': 'port',
  'Other': 'other',
};

export const GROUP_BLURB: Record<CaseGroup, string> = {
  'Washington State': 'Governor, Legislature, statewide officials, and state agencies.',
  'King County': 'County Executive, Council, Prosecutor, Sheriff, and departments.',
  'City of Seattle': 'Mayor, Council, departments, and Seattle Police Department.',
  'Seattle Public Schools': 'SPS board, central office, and individual schools.',
  'Sound Transit': 'Regional transit authority. Sales tax, MVET, property tax.',
  'KCRHA': 'King County Regional Homelessness Authority. Joint city/county body.',
  'Port of Seattle': 'Sea-Tac Airport and maritime operations. Independent taxing district.',
  'Other': 'Other regional or special-purpose bodies in scope.',
};

type ActorLike = { name?: string; title?: string | null; jurisdiction?: string };

export function caseGroup(actors: ActorLike[] | undefined): CaseGroup {
  if (!actors || actors.length === 0) return 'Other';
  const blob = actors
    .map((a) => `${a.name ?? ''} | ${a.title ?? ''}`.toLowerCase())
    .join(' || ');
  if (blob.includes('sound transit')) return 'Sound Transit';
  if (blob.includes('kcrha') || blob.includes('regional homelessness authority')) return 'KCRHA';
  if (blob.includes('port of seattle')) return 'Port of Seattle';
  if (
    blob.includes('seattle public schools') ||
    blob.includes(' sps ') ||
    blob.startsWith('sps ') ||
    blob.includes('garfield high') ||
    blob.includes('nathan hale high')
  )
    return 'Seattle Public Schools';
  // Jurisdiction-based fallbacks
  const jurs = actors.map((a) => a.jurisdiction ?? '').join(' | ');
  if (jurs.includes('City of Seattle')) return 'City of Seattle';
  if (jurs.includes('King County')) return 'King County';
  if (jurs.includes('Washington State')) return 'Washington State';
  return 'Other';
}

export function bodySnippet(raw: string, maxLen = 240): string {
  // Strip markdown headings + take first paragraph after the first H2 ("What happened") or first non-heading line.
  const lines = raw.split('\n');
  let collecting = false;
  const paras: string[] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (/^##\s/.test(line)) {
      if (current.length) { paras.push(current.join(' ').trim()); current = []; }
      collecting = true;
      continue;
    }
    if (!collecting) continue;
    if (line.trim() === '') {
      if (current.length) { paras.push(current.join(' ').trim()); current = []; }
    } else {
      current.push(line.trim());
    }
  }
  if (current.length) paras.push(current.join(' ').trim());
  const text = (paras[0] ?? '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}
