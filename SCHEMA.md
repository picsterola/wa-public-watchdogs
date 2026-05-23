# Case Record Schema v0.1

Every case in the registry is a single Markdown file with YAML frontmatter plus a free-text body. The frontmatter is the structured record; the body is the human-readable narrative.

File naming: `cases/YYYY-slug.md` where YYYY is the year the case became public (not the year of conduct). Example: `cases/2025-dchs-systemic-audit.md`.

---

## Schema spec

```yaml
# === IDENTITY ===
id: KC-2025-001                    # Stable ID. Prefix: KC (King County), WA (state), MUN (other municipal). Never reused.
title: short, neutral, descriptive # No adjectives. No "shocking", "scandal", "exposed". Just what happened.
slug: dchs-systemic-audit          # URL-safe. Matches filename.
date_surfaced: 2025-05-15          # When this entered the public record (audit release, indictment, complaint filed).
date_conduct_start: 2019-01-01     # When the underlying conduct began (best estimate, null if unknown).
date_conduct_end: 2024-12-31       # When it ended, or null if ongoing.
last_updated: 2026-05-20           # Last time you touched this record.
last_verified: 2026-05-20          # Last time sources and facts were actively re-checked, not just edited. Updated by audit passes even when no other field changes.

# === ACTORS ===
# One or more. Use 'role_type' to distinguish elected vs bureaucrat vs contractor vs nonprofit.
actors:
  - name: King County Department of Community and Human Services
    role_type: agency               # elected | bureaucrat | agency | contractor | nonprofit | board_appointee
    title: null
    party: null                     # Only populate for elected officials. Use D, R, NP, or null.
    jurisdiction: King County
  - name: Leo Flor
    role_type: bureaucrat
    title: DCHS Director (during audit period)
    party: null
    jurisdiction: King County

# === CLASSIFICATION (the three-axis taxonomy) ===
evidentiary_status: documented      # documented | reported | alleged
                                    # documented = audit, court doc, LEB opinion, SAO, PDC finding, IG report
                                    # reported   = named-byline journalism, no official finding yet
                                    # alleged    = complaint filed, no adjudication

severity_type:                      # Multi-select. At least one required.
  - structural_failure              # criminal_fraud | conflict_of_interest | structural_failure | rule_gaming | special_privileges | misuse_public_resources

reforms_implicated:                 # Multi-select. Links to your reform proposal pages.
  - independent_inspector_general
  - subrecipient_monitoring
  - procurement_reform

# === SCALE ===
dollars_at_issue: 1870000000        # Best-available number in USD. Null if not applicable or unknown.
dollars_basis: "DCHS contracting budget reviewed in 2023-2024 audit scope"
dollars_confirmed_loss: null        # Only populate if there's a finding of actual loss (restitution, clawback, conviction).

# === STATUS ===
legal_status: audit_finding         # no_action | complaint_filed | under_investigation | audit_finding
                                    # | civil_filed | criminal_charged | settled | convicted | dismissed | closed_no_action
outcome_summary: null               # Short text. Populate when there's a resolution.

# === RESOLUTION TRACKING (REQUIRED) ===
# Every case must commit to a remediation_status and a reform_status. Use
# 'unknown' explicitly if not yet researched — do not omit. These fields
# drive the /cases resolution-status filter and tell readers whether the
# underlying dysfunction was actually fixed and whether the implied
# structural reform actually happened.
remediation_status: unknown         # unknown | not_required | not_started | in_progress
                                    # | implemented_unverified | verified_resolved | repeat_finding | regressed
remediation_note: "Resolution tracking not yet researched. To be backfilled."
reform_status: unknown              # unknown | none_proposed | bill_introduced | bill_in_committee
                                    # | bill_passed | bill_died | rulemaking_in_progress
                                    # | structural_change_implemented | structural_change_failed
reform_status_note: "Reform tracking not yet researched. To be backfilled."
next_milestone: null                # Short text. The next watchable event (hearing, audit, bill vote).
next_milestone_date: null           # ISO date if known. Drives the registry's 'what we are watching' surface.

# === SOURCES (the credibility backbone) ===
# Sources are tiered. Tier 1 is required for evidentiary_status = documented.
sources:
  - tier: 1
    type: audit
    title: "King County Auditor's Office — DCHS Contract Oversight Audit"
    publisher: King County Auditor
    date: 2025-05-15
    url: https://kingcounty.gov/...
    archive_url: https://web.archive.org/...   # ALWAYS archive Tier 1 sources. Government URLs rot.
    quote: null                                # Optional pull-quote for direct citation.
  - tier: 2
    type: news
    title: "King County audit finds $1.87B program had only 1% of spending reviewed"
    publisher: Seattle Times
    author: "Sydney Brownstone"
    date: 2025-05-16
    url: https://seattletimes.com/...
    archive_url: https://web.archive.org/...

# Source types: audit | court_filing | indictment | leb_opinion | sao_report | pdc_filing
#               | ig_report | ombudsman_report | news | agency_statement | foia_response

# === REFORM LINKAGE (what makes this a reform platform, not a gossip site) ===
reform_argument: |
  The audit found only 1% of expenditures were reviewed despite a 33% requirement.
  An independent Inspector General with subpoena power and a separate reporting line
  to the Council (not the Executive) would have caught this years earlier. The current
  structure puts oversight inside the same chain of command that approved the spending.

# === GOVERNANCE METADATA ===
review_status: published            # draft | internal_review | published | retracted | updated
retraction_note: null               # If retracted or materially corrected, document why.
contributor: vn                     # Initials. Useful later if you take volunteer contributions.
tags:                               # Free-form for cross-cutting themes.
  - homelessness_funding
  - grant_oversight
  - dchs

# === FEATURED RANKING ===
featured_pin: false                 # Editorial override. If true, case is forced into homepage Top 5 regardless of computed score.
```

---

## Featured score (automated Top 5 selection)

The homepage Top 5 is computed monthly by `scripts/compute-featured.mjs`. The score is purely additive on objective metadata already in the schema. No human judgment, no subjective severity. Cases with `featured_pin: true` are forced in regardless of score.

| Signal | Points |
|---|---|
| `legal_status` = settled, convicted, or audit_finding | +5 |
| `legal_status` = civil_filed, criminal_charged, complaint_filed | +3 |
| `legal_status` = under_investigation | +2 |
| `evidentiary_status` = documented | +4 |
| `evidentiary_status` = reported | +2 |
| `evidentiary_status` = alleged | +1 |
| `dollars_at_issue` >= $10M | +5 |
| `dollars_at_issue` >= $1M and < $10M | +3 |
| `dollars_at_issue` >= $100K and < $1M | +1 |
| Any source with `tier: 1` (court, audit, AG, IG, LEB, SAO, indictment, FOIA) | +3 |
| `last_verified` within last 90 days | +2 |
| Referenced by >= 2 other cases (computed via cross-refs in case bodies) | +2 |
| `severity_type` includes `criminal_fraud` or `structural_failure` | +2 |

Tiebreakers (in order): `last_verified` desc, `dollars_at_issue` desc, slug asc.

The score never appears on case pages. It is internal ranking metadata only.

---

## Body conventions

After the frontmatter, write 3-6 short paragraphs in this order:

1. **What happened** — neutral, past-tense, factual. No adjectives like "shocking" or "egregious".
2. **What the primary source says** — pull the key finding verbatim if useful, with quote marks and source link.
3. **Status** — where the matter stands as of `last_updated`.
4. **Why it's in the registry** — explicit. "This is a documented audit finding of [X]." Don't make the reader guess why you included it.
5. **Reform implication** — one paragraph mapping to `reforms_implicated`. This is the reform-platform part.

Hard rules for body text:
- Every factual claim must have a Tier 1 or Tier 2 source attached, ideally inline as a Markdown link.
- Never characterize an `alleged` case as anything more than alleged. The word "alleged" in front of the verb, every single time.
- For non-public-figure individuals (mid-level staff, contractors, nonprofit EDs), use the most minimal naming consistent with the public source. If the SAO names them, you can. If only a local TV report names them, weigh whether the registry needs the name to make its point.
- Never assert motive ("she did this to enrich her family"). Only assert conduct ("payments totaling $813K went to four relatives, per county investigation").

---

## Tier definitions (public-facing, lives on the About page too)

| Tier | What counts | Role in a record |
|------|-------------|------------------|
| 1 | SAO reports, King County Auditor, King County Ombudsman, LEB opinions, PDC findings, court filings, federal indictments, agency IG reports, FOIA-returned documents | Required as lead source for `documented` records. Always archive. |
| 2 | Named-byline reporting from Seattle Times, KUOW, Crosscut/Cascade PBS, KING 5, Fox 13, PubliCola, The Urbanist, MyNorthwest news desk | Supporting source. Lead source allowed for `reported` records. |
| 3 | Change Washington, WAGOP, WSDCC, partisan blogs, advocacy releases, anonymous tips, social media | Excluded from case records entirely. May appear in "Commentary" or "Further reading" sections on reform pages, clearly labeled. |

---

## Open questions for you to decide before v1

1. **Naming non-public-figure individuals.** Default policy: name only if a Tier 1 source names them, OR if two independent Tier 2 sources name them. Acceptable?
2. **Statute of limitations on inclusion.** Cap at 10 years back? Or include older cases as historical context? Recommend 10-year cap with a "Historical" section for famous older cases (Cantwell-era stuff, etc.) so the registry doesn't become a permanent grievance archive.
3. **Republicans in the dataset.** You have very few in the current 23. Either (a) actively hunt for GOP cases to balance, (b) note explicitly on the About page that the dataset reflects who holds power in WA and KC and will skew accordingly, or (c) both. Recommend (c). Pretending balance you don't have is worse than naming the asymmetry.
4. **What to do when a case resolves favorably to the accused.** Update the record, don't delete. Add `outcome_summary` and change `legal_status`. Keep the record visible — retraction without history is worse than the original allegation.
5. **Do you want a `confidence` field** separate from `evidentiary_status`? I left it out because the tier already encodes confidence. Adding a 1-5 score invites you to play judge. Recommend: no.
