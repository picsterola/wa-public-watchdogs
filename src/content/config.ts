import { defineCollection, z } from 'astro:content';

const evidentiaryStatus = z.enum(['documented', 'reported', 'alleged']);

const roleType = z.enum([
  'elected',
  'bureaucrat',
  'agency',
  'contractor',
  'nonprofit',
  'board_appointee',
]);

const partyEnum = z.enum(['D', 'R', 'NP']);

const severityType = z.enum([
  'criminal_fraud',
  'conflict_of_interest',
  'structural_failure',
  'rule_gaming',
  'special_privileges',
  'misuse_public_resources',
]);

const reformsImplicated = z.string(); // open-ended reform slug

const legalStatus = z.enum([
  'no_action',
  'complaint_filed',
  'under_investigation',
  'audit_finding',
  'civil_filed',
  'criminal_charged',
  'settled',
  'convicted',
  'dismissed',
  'closed_no_action',
]);

const sourceType = z.enum([
  'audit',
  'court_filing',
  'indictment',
  'leb_opinion',
  'sao_report',
  'pdc_filing',
  'ig_report',
  'ombudsman_report',
  'news',
  'agency_statement',
  'foia_response',
]);

const reviewStatus = z.enum([
  'draft',
  'internal_review',
  'published',
  'retracted',
  'updated',
]);

const actor = z.object({
  name: z.string(),
  role_type: roleType,
  title: z.string().nullable().optional(),
  party: partyEnum.nullable().optional(),
  jurisdiction: z.string(),
});

// Dates in YAML may be a real Date (2025-05-15), a partial string ('2025'),
// or a year number. Try string/number before coercing to Date so partial
// values are preserved verbatim instead of being interpreted as epoch ms.
const flexibleDate = z
  .union([z.string(), z.number(), z.coerce.date()])
  .nullable()
  .optional();

const source = z.object({
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  type: sourceType,
  title: z.string(),
  publisher: z.string().optional(),
  author: z.string().nullable().optional(),
  date: flexibleDate,
  url: z.string().url().optional(),
  archive_url: z.string().url().nullable().optional(),
  quote: z.string().nullable().optional(),
});

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    // Identity
    id: z.string(),
    title: z.string(),
    // NB: Astro reserves `slug` for the entry slug derived from the filename.
    // The schema's `slug:` frontmatter field is intentionally not validated here;
    // the canonical URL slug is the filename stem (e.g. `2025-dchs-systemic-audit`).
    date_surfaced: z.coerce.date(),
    date_conduct_start: z.coerce.date().nullable().optional(),
    date_conduct_end: z.coerce.date().nullable().optional(),
    last_updated: z.coerce.date(),
    last_verified: z.coerce.date().optional(),

    // Actors
    actors: z.array(actor).min(1),

    // Classification
    evidentiary_status: evidentiaryStatus,
    severity_type: z.array(severityType).min(1),
    reforms_implicated: z.array(reformsImplicated).default([]),

    // Scale
    dollars_at_issue: z.number().nullable().optional(),
    dollars_basis: z.string().nullable().optional(),
    dollars_confirmed_loss: z.number().nullable().optional(),

    // Status
    legal_status: legalStatus,
    outcome_summary: z.string().nullable().optional(),

    // Sources
    sources: z.array(source).default([]),

    // Reform linkage
    reform_argument: z.string().nullable().optional(),

    // Governance metadata
    review_status: reviewStatus.default('draft'),
    retraction_note: z.string().nullable().optional(),
    contributor: z.string().optional(),
    tags: z.array(z.string()).default([]),

    // Featured ranking
    featured_pin: z.boolean().default(false),  // Editorial override: forces case into Top 5 regardless of score.
  }),
});

export const collections = { cases };
