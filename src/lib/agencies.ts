// Agency normalization: actor.name strings are written by humans across many
// case files and accumulate variants (e.g. "King County Department of Community
// and Human Services" vs "...(DCHS)"). For landing-page generation we collapse
// these into a single canonical slug so /agencies/king-county-dchs covers all
// of them.
//
// The mapping is conservative: when a name doesn't appear in AGENCY_OVERRIDES,
// we slugify it as-is. Add overrides as new cases introduce ambiguity.

export interface AgencyEntry {
  slug: string;
  name: string;        // canonical display name
  short?: string;      // optional short label (e.g. "WSP")
  description: string; // one-paragraph plain-English description, written for the
                       // landing page intro. Be honest, not promotional.
}

// Canonical agencies that get their own landing page. Listed here so the
// description is curated rather than derived from the first case's free text.
// Only build pages for agencies with 2+ cases in the registry; the build
// script enforces that minimum.
export const AGENCIES: AgencyEntry[] = [
  {
    slug: 'seattle-public-schools',
    name: 'Seattle Public Schools',
    short: 'SPS',
    description:
      "Washington's largest school district. Cases in the registry document a multi-year structural deficit, unresolved federal Every Child Family Foundation findings, civil rights litigation, and several school-level incidents that produced settlements or open audit findings.",
  },
  {
    slug: 'king-county-dchs',
    name: 'King County Department of Community and Human Services',
    short: 'KC DCHS',
    description:
      "King County's main social-services department, responsible for behavioral health, homelessness response, veterans' programs, and adult and juvenile justice services. Subject of an ombuds investigation, a Clark Nuber forensic audit, and recurring questions about subrecipient monitoring of nonprofit contractors.",
  },
  {
    slug: 'doc',
    name: 'Washington State Department of Corrections',
    short: 'DOC',
    description:
      'Operates the state prison system. The registry tracks Office of the Corrections Ombuds findings on solitary confinement, use of force at the Washington Corrections Center for Women, unexpected-fatality reviews, and the federal CRIPA investigation underway at WCCW.',
  },
  {
    slug: 'dcyf',
    name: 'Washington State Department of Children, Youth, and Families',
    short: 'DCYF',
    description:
      'Combined child welfare, early learning, and juvenile rehabilitation agency created in 2017. Registry cases include the Oakley Carlson fatality review, multiple Office of the Family and Children\'s Ombuds annual findings, and federal payment-compliance issues raised by the Single Audit.',
  },
  {
    slug: 'oco',
    name: 'Office of the Corrections Ombuds',
    short: 'OCO',
    description:
      'Independent oversight office that investigates complaints and publishes statutory reports on conditions in Washington state prisons. The registry mirrors OCO findings rather than evaluating them, because OCO is itself the primary-source investigator on most DOC cases here.',
  },
  {
    slug: 'dshs',
    name: 'Washington State Department of Social and Health Services',
    short: 'DSHS',
    description:
      'Operates programs serving people with developmental disabilities, behavioral-health patients, vulnerable adults, and seniors in residential care. Registry cases cover Trueblood contempt, Special Commitment Center facility conditions, Developmental Disabilities Administration ombuds findings, and adult family home oversight failures flagged by HHS-OIG.',
  },
  {
    slug: 'wsp',
    name: 'Washington State Patrol',
    short: 'WSP',
    description:
      'Statewide law enforcement agency. Recent cases in the registry document three Public Records Act matters across roughly 18 months (one alleging actual records destruction tied to the 2021 COVID vaccine-mandate terminations; two alleging withholding/delay), totaling roughly $548,000 in settlements and court-ordered fines.',
  },
  {
    slug: 'commerce',
    name: 'Washington State Department of Commerce',
    short: 'Commerce',
    description:
      'State agency that administers federal pass-through grants and several economic-development programs. Registry cases focus on COVID-relief questioned costs and the Digital Navigator subrecipient audit.',
  },
  {
    slug: 'ofco',
    name: "Office of the Family and Children's Ombuds",
    short: 'OFCO',
    description:
      "Independent ombuds office for DCYF and the broader child welfare system. As with OCO, the registry mirrors OFCO findings rather than re-investigating them, because OFCO is the primary-source investigator on the child-welfare cases.",
  },
  {
    slug: 'ospi',
    name: 'Office of Superintendent of Public Instruction',
    short: 'OSPI',
    description:
      'State agency overseeing K-12 public schools. Registry cases include the IDEA settlement involving a non-disabled-student plaintiff and longstanding deficiencies in the school-funding apportionment IT system.',
  },
  {
    slug: 'port-seattle',
    name: 'Port of Seattle',
    short: 'Port',
    description:
      "Operates Sea-Tac Airport and Port of Seattle marine facilities. Registry cases include the Rhysida ransomware breach and a passenger-facility-charge fraud matter.",
  },
  {
    slug: 'city-of-seattle',
    name: 'City of Seattle',
    short: 'Seattle',
    description:
      'Seattle municipal government across departments. Registry cases reference the SAO accountability audit and the gun-violence prevention audit. Department-specific cases are tagged separately under SPD, SPS, and the Mayor\'s Office.',
  },
  {
    slug: 'sound-transit',
    name: 'Sound Transit',
    short: 'ST',
    description:
      'Regional transit authority covering Pierce, King, and Snohomish counties. Registry cases focus on ST3 program-reset cost growth, West Seattle Link cost escalation, and the board\'s CEO selection process and conflict exposure.',
  },
];

const SLUG_BY_NAME = new Map<string, string>();
const NAME_OVERRIDES: Record<string, string> = {
  'King County Department of Community and Human Services': 'king-county-dchs',
  'King County Department of Community and Human Services (DCHS)': 'king-county-dchs',
  'Washington State Department of Children, Youth, and Families': 'dcyf',
  'Washington State Department of Children, Youth and Families': 'dcyf',
  'Washington State Department of Corrections': 'doc',
  'Office of the Corrections Ombuds': 'oco',
  "Office of the Family and Children's Ombuds": 'ofco',
  'Washington State Department of Social and Health Services': 'dshs',
  'Washington DSHS Developmental Disabilities Administration': 'dshs',
  'Washington DSHS Home and Community Services': 'dshs',
  'Washington Corrections Center for Women': 'doc',
  'Washington State Patrol': 'wsp',
  'Washington State Department of Commerce': 'commerce',
  'Office of Superintendent of Public Instruction': 'ospi',
  'Seattle Public Schools': 'seattle-public-schools',
  'Port of Seattle': 'port-seattle',
  'City of Seattle': 'city-of-seattle',
  'Seattle Mayor\u2019s Office': 'city-of-seattle',
  "Seattle Mayor's Office": 'city-of-seattle',
  'Sound Transit': 'sound-transit',
  'Sound Transit Board of Directors': 'sound-transit',
};
for (const [name, slug] of Object.entries(NAME_OVERRIDES)) SLUG_BY_NAME.set(name, slug);

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function agencySlugFromName(name: string): string {
  return SLUG_BY_NAME.get(name) ?? slugify(name);
}

export const AGENCY_BY_SLUG: Record<string, AgencyEntry> = Object.fromEntries(
  AGENCIES.map((a) => [a.slug, a]),
);
