# WA Accountability Registry — Intake Schema

Version 1.0 · 2026-05-20 · Owner: Viet Nguyen

This document defines how a new case, or a material update to an existing case, enters the registry. It is the operational complement to the schema spec. If a step is skipped, the case does not publish.

---

## 0. Entry point

Intake accepts either:
- **A raw URL, headline, or one-line description.** Agent does triage, source discovery, drafting, validation, and publish.
- **A partial draft from Viet.** Facts and primary sources provided; agent validates, structures, cross-references, publishes.

Agent decides which mode to use per case based on what's supplied. If unclear, agent asks one clarifying question and then commits.

---

## 1. Hard-reject gate (run first, no exceptions)

A submission is rejected before drafting if ANY of the following are true. Agent reports the specific reason; no draft is produced.

| Gate | Rule | Source of truth |
|---|---|---|
| **G1 · Time horizon** | Event, audit, ruling, or filing date must be within the trailing 2 years (currently 2024-05-20 onward). Older cases rejected unless they had a material development inside the window. | Editorial policy |
| **G2 · Naming basis** | If a private individual is named, there must already be a public story in Tier 1 or Tier 2 media using that name. Agent runs a media search to verify before drafting. Public officials acting in their public capacity are exempt. | Editorial policy |
| **G3 · Source tier** | At least one Tier 1 (primary agency document, court filing, official statement) OR Tier 2 (established news org) source must exist and be reachable. Tier 3 (advocacy blogs, partisan opinion) cannot be the sole basis. | Editorial policy |
| **G4 · Jurisdictional scope** | Must involve a Washington State entity within the registry's tracked agencies (state, King County, Seattle, KCRHA, Sound Transit, PSRC, PSCAA, PSESD, PSP, Port of Seattle, SPS) or have direct material impact on them. | Registry scope |
| **G5 · Substantive content** | Must involve one of the six `severity_type` categories: criminal fraud, conflict of interest, structural failure, rule gaming, special privileges, misuse of public resources. Pure policy disagreements rejected. | Schema |

If rejected, agent reports which gate failed and why. No draft, no publish.

---

## 2. Triage and classification

If all gates pass, agent assigns:

1. **Jurisdiction** → which agency prefix (`WA-`, `KC-`, `SEA-`, `KCRHA-`, `ST-`, etc.)
2. **Case ID** → next sequential number in `<PREFIX>-<YYYY>-<NNN>` format. Check `parsed-cases.json` for collisions.
3. **Slug** → kebab-case, descriptive, year-prefixed filename: `YYYY-<descriptive-slug>.md`
4. **`severity_type`** → one of six enum values
5. **`legal_status`** → from enum; default to most conservative tier supported by evidence
6. **`evidentiary_status`** → `documented` requires Tier 1 source; `reported` if Tier 2 only; `alleged` if claims are not yet substantiated by either

Decision rule for `documented` vs `reported`: if removing all Tier 2 journalism sources leaves at least one Tier 1 primary document standing the claim, it's `documented`. Otherwise `reported`.

---

## 3. Source discovery and validation

For each claim in the draft, agent performs:

1. **Primary source pull.** Identify the underlying agency document, court filing, LEB opinion, audit report, or PDC filing. Fetch and verify URL is live.
2. **Tier assignment per source.** Tier 1 (agency primary), Tier 2 (established news org), Tier 3 (rejected — never used as a source).
3. **Dollar figure cross-check.** Every dollar amount in the case must trace to a specific source citation. Compare against the primary document directly, not summary reporting.
4. **Actor verification.** Names, titles, party affiliations, jurisdictions checked against official agency rosters, LEB filings, or Ballotpedia for elected officials.
5. **Date verification.** Event date matched against the primary source's stated date, not the news article's publish date.

---

## 4. Cross-reference checks (hybrid by severity)

### Inline (run before publish, blocks publish if fails)

These are high-impact fields where drift breaks the registry's credibility:

| Check | What it does |
|---|---|
| **X1 · Case ID collision** | New ID does not duplicate any existing case in `parsed-cases.json`. |
| **X2 · Cross-reference resolution** | Every `KC-YYYY-NNN` style reference in the body resolves to an actual case in the dataset. |
| **X3 · Dollar baseline reconciliation** | If the case references a dollar figure that appears in another case, baselines (YOE vs constant dollars, gross vs net, fiscal year vs calendar year) are stated explicitly. |
| **X4 · Named actor consistency** | If a named person appears in another case, their name spelling, party, and title-at-time-of-event match. Role-at-time-of-event rule applies (see §6). |
| **X5 · Schema validation** | All enum fields use allowed values. All required fields present. |
| **X6 · Resolution tracking present** | `remediation_status` and `reform_status` are explicitly set (use `unknown` if not yet researched — never omit). Powers the /cases resolution filter. |

### Deferred (caught by periodic audit, does not block publish)

These can drift without breaking factual integrity:

- Tag normalization (snake_case, no near-duplicates)
- Reform-page cross-links
- Related-case suggestion completeness
- Metadata field uniformity (jurisdiction strings, role_type)

A periodic audit pass (like the one run 2026-05-20) catches these. Cadence: monthly, or after every 10 new cases, whichever comes first.

---

## 5. Unified intake / amend workflow

The same intake process handles new cases AND material updates to existing cases. An "amendment" is any of the following:

| Trigger | Action |
|---|---|
| New ruling, filing, or audit issued | Update existing case file; corrections log entry |
| Exoneration | Tombstone existing case at same URL; "Exonerated on [date]" note added; corrections log entry |
| Dollar figure correction | Update case file; corrections log entry with old → new |
| `legal_status` change | Update case file; corrections log entry |
| `evidentiary_status` upgrade/downgrade | Update case file; corrections log entry |
| Named-actor correction | Update case file AND any other cases referencing same actor; corrections log entry |

**Corrections log entry is mandatory for every amendment.** Format matches existing `/corrections` page sections: date heading, case link, field changed, source.

Stylistic edits and typo fixes are not logged.

---

## 6. Standing schema rules (resolve ambiguity once, apply forever)

These are the rules that resolved low-severity drift in the 2026-05-20 audit. Apply them on every intake.

| Rule | Decision |
|---|---|
| **R1 · Role at time of event** | `role_type`, `title`, and `jurisdiction` reflect the actor's role at the time of the documented event, not their current role. Constantine as KC Executive when the ST CEO selection began; as ST CEO from March 27, 2025 forward. Ferguson as AG before January 2025; as Governor from January 15, 2025 forward. |
| **R2 · Dollar baseline disclosure** | When citing a dollar figure that exists in another case with a different baseline, state the baseline convention inline (YOE vs constant dollars, fiscal vs calendar, gross vs net). |
| **R3 · Tag normalization** | Tags are snake_case, singular noun where possible, no near-duplicates. Canonical list lives in `parsed-cases.json` tag inventory; intake checks against it. |
| **R4 · Party affiliation** | Only included for elected officials, judicial nominees, and partisan-appointed positions. Civil servants and agency staff get no `party` field. |
| **R5 · `last_verified` timestamp** | Every case gets a `last_verified: YYYY-MM-DD` field set to intake or last-amendment date. Audits update this field even when no other change is made. |

R5 is new and requires a schema spec update and a one-time backfill across all 36 existing cases.

---

## 7. Publish checklist (final gate)

Before `npm run build && deploy_website`:

- [ ] All §1 gates passed
- [ ] All §3 source validations passed
- [ ] All §4 inline cross-reference checks passed
- [ ] `last_verified` field set
- [ ] If amendment: corrections log entry written
- [ ] `parsed-cases.json` regenerated
- [ ] Build succeeds with no errors
- [ ] Spot-check at least one rendered HTML page for the affected case(s)

---

## 8. What intake does NOT do

- Does not file PRRs. PRR-derived documents are inputs to intake, not outputs.
- Does not editorialize. Outcome summaries are descriptive, not normative.
- Does not fake partisan balance. If asymmetry exists in the cases, it is named openly.
- Does not assign a confidence score. Evidence speaks for itself via `evidentiary_status` and source tier.

---

## 9. Failure modes to watch

Things that have broken before and intake must guard against:

- **Case ID drift** — KC-2025-007 vs KC-2026-001 confusion. Always verify against current `parsed-cases.json`.
- **Stale `legal_status`** — LEB cases left as `complaint_filed` after opinion issued. Check the LEB opinion index whenever an LEB case is touched.
- **Dollar errata** — DCHS audit was originally $1.87B, then corrected to $1.8B + $922M baseline. Always pull the latest errata PDF, not the original audit PDF.
- **Name spelling** — Wassmer not "Wass". Verify against the agency's own press release.
- **Tier 3 sneak-in** — Change Washington, Shift WA, Discovery Institute, advocacy blogs are not sources. Ever.

---

## 10. Trigger phrases

When Viet says any of these, agent runs this intake process without further prompting:

- "Add this case: [URL or description]"
- "Intake: [URL or description]"
- "New case: [...]"
- "Update [case-slug] with [new development]"
- "Amend [case-slug]: [...]"
- "Exonerate [case-slug]: [date and source]"
