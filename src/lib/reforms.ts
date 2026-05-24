// Reform descriptions for landing pages. The slug values used in case
// frontmatter are open-ended (z.string()), so this list documents the
// reforms that recur across multiple cases and warrant their own page.
//
// Build rule: any reform slug appearing in 2+ cases gets a landing page.
// If we don't have a description here, the page falls back to a generated
// title (from humanizeReform) and a generic intro.

export interface ReformEntry {
  slug: string;
  title: string;        // landing-page H1, plain English
  short: string;        // sentence-form title used in lists
  description: string;  // one or two paragraphs, neutral framing
}

export const REFORMS: ReformEntry[] = [
  {
    slug: 'independent_inspector_general',
    title: 'Independent inspectors general',
    short: 'Stand up independent inspectors general across state and local government.',
    description:
      "Most Washington jurisdictions audit themselves. Findings route back through the same chain of command that approved the spending. The recurring proposal across these cases is to stand up independent inspectors general with subpoena power and a separate reporting line, so investigations don't depend on the goodwill of the agencies they investigate.",
  },
  {
    slug: 'ethics_enforcement_teeth',
    title: 'Real consequences for ethics findings',
    short: 'Put real consequences behind ethics findings.',
    description:
      "A documented ethics violation that ends in a polite letter is not a consequence; that's the current default for the Legislative Ethics Board and several other accountability bodies. Cases tagged here propose monetary penalties, mandatory disclosures, or removal mechanisms with statutory teeth.",
  },
  {
    slug: 'leb_transparency',
    title: 'Searchable legislative ethics record',
    short: 'Make legislative ethics decisions searchable.',
    description:
      "You can't compare Legislative Ethics Board rulings against legislators today without a law degree and a free weekend. The LEB enforcement-pattern cases consistently flag the absence of a public, searchable database of complaints, dispositions, and penalties.",
  },
  {
    slug: 'subrecipient_monitoring',
    title: 'Audit the nonprofits that spend public money',
    short: 'Actually audit the nonprofits that spend public money.',
    description:
      'Public agencies are required to monitor a defined share of subrecipient nonprofit spending each year. Several cases in this group document instances where that share was not met or where monitoring was performed on paper only. The reform calls for verified, sampled, on-the-ground monitoring with published results.',
  },
  {
    slug: 'procurement_reform',
    title: 'Conflict-of-interest rules on public contracts',
    short: 'Tighten conflict-of-interest rules on public contracts.',
    description:
      'Public contracts in Washington can be awarded without disclosure of the bidder\'s relationships to selecting officials, and with limited competition. Cases in this group recur on procurement gaps; the reform tightens disclosure, requires public conflict screening, and broadens competition requirements.',
  },
  {
    slug: 'public_resources_firewall',
    title: 'Keep public resources out of campaigns',
    short: 'Keep public staff and channels out of campaign work.',
    description:
      "Using public staff time, official accounts, and government channels for campaign work is currently policed one complaint at a time, after the fact. The pattern in LEB cases is that violations end with mild advisory opinions, not deterrents. Reform calls for a clearer ex-ante firewall with enforcement teeth.",
  },
  {
    slug: 'cost_transparency_reporting',
    title: 'Honest cost math, every time',
    short: 'Make agencies show their cost math, every time.',
    description:
      "Agencies routinely switch between ballot dollars, current dollars, year-of-expenditure dollars, and various baselines when reporting program cost growth. The Sound Transit and IT-modernization cases illustrate the pattern. Reform requires a single transparent reconciliation methodology with each cost update.",
  },
  {
    slug: 'child_welfare_oversight',
    title: 'Child welfare oversight',
    short: 'Independent oversight of the child welfare system.',
    description:
      "DCYF cases recur on critical-incident reviews, fatality reviews, and ombuds findings. The recurring reform proposal is to strengthen OFCO's authority and ensure DCYF cannot effectively gate the documents and access OFCO needs to do its job.",
  },
  {
    slug: 'behavioral_health_capacity',
    title: 'Behavioral health capacity',
    short: 'Behavioral health capacity to meet statutory obligations.',
    description:
      "Trueblood contempt and other DSHS cases stem in part from inadequate behavioral-health capacity to meet statutory timelines for court-ordered evaluations and treatment. Reform here is operational rather than legal: actual capacity, not promised capacity.",
  },
  {
    slug: 'it_modernization_governance',
    title: 'IT modernization governance',
    short: 'Independent review of major public IT projects.',
    description:
      "Several cases here cover IT projects that doubled in cost or missed major delivery milestones (DOL, OSPI, L&I). The reform pattern: external technical review at fixed cost-overrun and schedule-slip thresholds, with public reporting.",
  },
  {
    slug: 'transit_governance_reform',
    title: 'Sound Transit governance',
    short: "Fix the conflicts baked into Sound Transit's board structure.",
    description:
      "The Sound Transit board hires the CEO, and some board members have themselves been eligible candidates. Cost-reporting conventions on ST3 have also fragmented across baselines. Reform addresses both: structural conflict screening and standardized cost reporting.",
  },
  {
    slug: 'federal_grant_compliance',
    title: 'Federal grant compliance',
    short: 'Force districts and agencies to actually close federal audit findings.',
    description:
      'Several cases here cover recurring federal Single Audit findings that remained open across multiple fiscal years. Reform requires a tracked corrective-action plan with public quarterly status, rather than the current default of restating the same finding annually.',
  },
  {
    slug: 'program_outcome_auditing',
    title: 'Outcome audits, not just compliance audits',
    short: 'Audit whether big programs delivered, not just whether dollars were spent in compliance.',
    description:
      "Compliance audits confirm that money was spent the way the contract said. Outcome audits ask whether the program achieved its stated goal. Most large WA public programs have the first but not the second; the reform calls for statutory outcome auditing on programs above a dollar threshold.",
  },
  {
    slug: 'dchs_grant_administration',
    title: 'DCHS grant administration',
    short: 'Stricter DCHS grant administration and subrecipient controls.',
    description:
      'King County DCHS cases recur on subrecipient monitoring and grant administration. The reform is narrower than agency-wide IG: stricter operational requirements on DCHS grant award, monitoring, and close-out.',
  },
  {
    slug: 'contracted_outcome_tracking',
    title: 'Contracted outcome tracking',
    short: 'Track whether contractors delivered, not just whether they invoiced.',
    description:
      'Several cases document long-term contracts where outcome metrics were not collected, were collected but not reviewed, or were collected and ignored when results fell short. The reform requires standard outcome metrics in any contract above a dollar threshold and a public dashboard of results.',
  },
  {
    slug: 'campaign_finance_reform',
    title: 'Campaign finance gray zones',
    short: 'Close campaign finance gray zones before complaints, not after.',
    description:
      "The PDC keeps writing new rules after each high-profile complaint gets dismissed on a technicality. The pattern is regulation by case, not in advance. Reform here aims at clearer ex-ante definitions of regulated activity.",
  },
  {
    slug: 'pdc_enforcement',
    title: 'PDC enforcement and vacancies',
    short: 'Tighten Public Disclosure Commission enforcement and vacancy backstops.',
    description:
      "PDC vacancies and backlog have repeatedly delayed or weakened campaign-finance enforcement. Reform here covers statutory deadlines for filling PDC seats, alternate-commissioner backstops during vacancies, and clearer enforcement authority on the books.",
  },
  {
    slug: 'federal_oversight_response',
    title: 'Responses to federal oversight',
    short: 'Take federal oversight findings seriously, before they escalate.',
    description:
      'Several Washington agencies have been the subject of HHS-OIG, USDOJ, or other federal oversight findings. Reform addresses agencies\' patterns of slow or partial response and proposes statutory tracking of federal findings parallel to state SAO findings.',
  },
  {
    slug: 'conflict_disclosure_grants',
    title: 'Conflict disclosure on grants',
    short: 'Disclose relationships between grant-makers and grantees.',
    description:
      'Cases here document grant awards where awarding-side staff or board members had undisclosed relationships with grantee organizations. Reform requires standardized conflict disclosure at award and at any material amendment.',
  },
  {
    slug: 'personnel_oversight',
    title: 'Senior personnel investigations',
    short: 'Route senior-official misconduct complaints to outside investigators.',
    description:
      'When complaints land against department directors or other senior officials, internal HR is rarely the right venue. Reform routes those investigations to an outside body with subpoena power and publishes the outcome.',
  },
  {
    slug: 'executive_accountability',
    title: 'Executive departures with a paper trail',
    short: "Make executives publish what happened when senior staff leave under a cloud.",
    description:
      'Settlements that end senior-staff disputes routinely include non-disclosure clauses or vague public explanations. Reform requires public disclosure of the underlying findings whenever a senior departure is tied to a misconduct complaint.',
  },
  {
    slug: 'mandatory_reporting_enforcement',
    title: 'Mandatory reporting enforcement',
    short: 'Track every mandatory report from receipt to resolution.',
    description:
      'Statutory mandatory-reporting regimes (CPS, DDA, adult-protection) only work if reports are tracked from receipt to resolution. Cases here document reports that disappeared in intake. Reform requires end-to-end tracking with public aggregate statistics.',
  },
  {
    slug: 'appointment_accountability',
    title: 'Appointment deadlines and screening',
    short: 'Put deadlines and consequences on public appointments.',
    description:
      'Statutory deadlines for filling public positions get missed; conflict screening for appointees often happens after complaints, not before. Reform sets enforceable deadlines and requires screening at nomination.',
  },
  {
    slug: 'it_project_oversight',
    title: 'IT project oversight',
    short: 'Stop letting public IT projects double in cost without independent review.',
    description:
      "Distinct from broader IT-modernization governance: this targets project-level oversight, requiring external technical review at fixed cost-overrun and schedule-slip thresholds for any IT project above a dollar threshold.",
  },
];

export const REFORM_BY_SLUG: Record<string, ReformEntry> = Object.fromEntries(REFORMS.map((r) => [r.slug, r]));

export function reformIsCurated(slug: string): boolean {
  return slug in REFORM_BY_SLUG;
}
