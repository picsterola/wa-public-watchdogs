# WA Accountability Registry — Source Tier Policy

Version 1.0 · 2026-05-20 · Owner: Viet Nguyen

This document defines what counts as a Tier 1, Tier 2, or Tier 3 source for the registry, and how each tier is used. It is the canonical reference for source classification during intake (§3 of INTAKE.md) and during validation passes.

If a source isn't on these lists, the agent must make a tier judgment using the test in §4 and document the call in the case file or corrections log.

---

## 1. Tier 1 — Primary documentary sources

Tier 1 sources are required as the lead source for any case marked `evidentiary_status: documented`. They are the bedrock of the registry's credibility.

### Tier 1 categories

| Category | Examples | `source.type` enum value |
|---|---|---|
| **Government audits** | Washington State Auditor's Office (SAO) accountability and financial audits; King County Auditor reports; agency internal audits (Port of Seattle Internal Audit, Seattle City Auditor) | `audit`, `sao_report` |
| **Court filings** | Federal and state court complaints, indictments, dockets, settlement agreements, judgments. Includes PACER and Washington Courts ([wacourts.gov](https://www.courts.wa.gov/)) records. | `court_filing`, `indictment` |
| **Ethics and oversight body opinions** | Legislative Ethics Board (LEB) opinions; Public Disclosure Commission (PDC) findings; Seattle Ethics and Elections Commission (SEEC) decisions; King County Ombudsman reports; King County Board of Ethics opinions | `leb_opinion`, `pdc_filing`, `ombudsman_report` |
| **Inspector General reports** | Reports from any federal, state, or local IG. King County does not currently have an IG (that's case `KC-2026-007`), so this is mostly federal IGs and the future KC IG once established. | `ig_report` |
| **Official agency statements** | Agency-issued press releases, official board minutes, formal agency communications addressing the matter at hand. Includes Sound Transit board action items, Seattle City Council resolutions, agency public letters from elected officials acting in their public capacity. | `agency_statement` |
| **FOIA / PRA returned records** | Documents released in response to a public records request, with the request and response chain documented. | `foia_response` |

### Tier 1 verification requirements

Every Tier 1 source must have:
1. **A URL on an official `.gov` or institutional domain** (or an archived equivalent — see §5).
2. **A document date** matching the event in the case record.
3. **An `archive_url`** captured via [Internet Archive Wayback Machine](https://web.archive.org/) at the time of intake. Government URLs rot; this is non-negotiable.

A news article that summarizes a Tier 1 document is NOT itself Tier 1. The underlying document is. The article is Tier 2.

---

## 2. Tier 2 — Established journalism

Tier 2 sources are named-byline reporting from established news organizations. They are the lead source allowed for `evidentiary_status: reported`. They are supporting sources for `documented` records.

### Tier 2 publications (canonical list)

| Publication | Notes |
|---|---|
| [The Seattle Times](https://www.seattletimes.com/) | Daily newspaper of record. Strongest Tier 2 source for WA/King County. |
| [KUOW](https://www.kuow.org/) | NPR affiliate. Public radio, strong investigative desk. |
| [Cascade PBS / Crosscut](https://www.cascadepbs.org/) | Long-form regional reporting. Formerly Crosscut. |
| [KING 5](https://www.king5.com/) | NBC affiliate. Investigators desk. |
| [Fox 13 Seattle](https://www.fox13seattle.com/) | TV news. Investigates desk. |
| [KIRO 7](https://www.kiro7.com/) | CBS affiliate. |
| [PubliCola](https://publicola.com/) | Independent local. City Hall and policy focus. |
| [The Urbanist](https://www.theurbanist.org/) | Urbanism/transit policy focus. Editorial slant on land use; factual reporting accepted as Tier 2. |
| [MyNorthwest](https://mynorthwest.com/) | News desk content only. Opinion/talk-radio content is Tier 3. |
| [Axios Seattle](https://www.axios.com/local/seattle) | Local newsletter. |
| [GeekWire](https://www.geekwire.com/) | Tech/business focus. Tier 2 for business stories touching public agencies. |
| [Associated Press](https://apnews.com/) | Wire service. |
| [Bloomberg](https://www.bloomberg.com/), [Reuters](https://www.reuters.com/), [Wall Street Journal](https://www.wsj.com/), [New York Times](https://www.nytimes.com/), [Washington Post](https://www.washingtonpost.com/) | National outlets when they cover WA matters. |

### Tier 2 verification requirements

Every Tier 2 source must have:
1. A **named byline** (no "Staff" or unsigned editorials).
2. A **publication date** within or after the event.
3. A **live URL**.
4. An `archive_url` is recommended but not required.

### What is not Tier 2

- Anonymous staff posts on otherwise-Tier-2 outlets (no byline = no Tier 2)
- Editorial board pieces (these are opinion, not reporting)
- TV anchor talk segments without a reported package
- Talk radio commentary segments (KIRO Radio talk shows, KVI, etc.) — the news desks of these stations may be Tier 2; the talk content is not
- Reposts and aggregator sites

---

## 3. Tier 3 — Excluded

Tier 3 sources do not appear in case records, period. They may appear in commentary or further-reading sections on reform proposal pages, clearly labeled as opinion or advocacy.

### Tier 3 categories (non-exhaustive)

| Category | Examples |
|---|---|
| **Partisan advocacy organizations** | [Change Washington](https://changewashington.org/), [Shift WA](https://shiftwa.org/), [Washington Policy Center](https://washingtonpolicy.org/), [Discovery Institute](https://www.discovery.org/), Economic Opportunity Institute, Sightline Institute |
| **Political party communications** | WA GOP, WA State Democrats, county party committees, campaign press releases |
| **Personal blogs and substacks** | Even from credentialed individuals. If the same person publishes in a Tier 2 outlet, cite that piece instead. |
| **Anonymous tips and leaks** | Unless the leaked document itself qualifies as Tier 1 (e.g., a leaked audit). Then cite the document, not the leak channel. |
| **Social media** | Tweets, Facebook posts, LinkedIn posts, even from public officials. Use the official agency communication that followed instead, if any. |
| **Press releases from interest groups** | Chamber of Commerce, SEIU 775, MLK Labor, AGC of WA, etc. These are advocacy, not reporting. |
| **PR / public relations firms** | Any communication paid for or distributed by a PR firm on behalf of a party to the case. |
| **Polling organizations and pundits** | Crosstabs do not establish facts. |
| **YouTube and podcast commentary** | Even if hosted by named individuals with policy expertise. |

### Why this matters

Tier 3 sources are not necessarily wrong; they are not citable for this registry. The standard is whether the source is **structurally independent of the matter being reported**. Advocacy organizations have a stake in framing; bylined journalists with editor accountability do not (or have far less). The registry's credibility depends on this line.

---

## 4. Tier judgment test (for sources not on the canonical lists)

When evaluating an unfamiliar source, apply this test in order:

1. **Is the source a primary document from a government body, court, or official oversight entity?** → Tier 1.
2. **Is the source named-byline reporting from a news organization with an editor of record, a corrections policy, and structural independence from the parties involved?** → Tier 2. Borderline: check whether the outlet has been cited by any of the canonical Tier 2 outlets as a peer source.
3. **Does the source have a direct stake in the outcome — political, financial, advocacy, or PR?** → Tier 3.
4. **Is the source anonymous, unsigned, or unverifiable?** → Tier 3.
5. **Default to Tier 3** if uncertain. The registry can survive a missing source; it cannot survive a bad one.

When a tier judgment is made for an unfamiliar source, document it in the case file's source entry with a brief note (e.g., `tier_note: "Treated as Tier 2 per canonical-list test; bylined investigative reporting, editorial board independence verified."`).

---

## 5. Archival policy

| Tier | Archive requirement |
|---|---|
| 1 | **Required.** Capture an `archive_url` via Wayback Machine at intake. Government URLs change frequently. |
| 2 | Recommended. Especially for sources behind paywalls or with frequent URL restructuring (Seattle Times has restructured twice in recent years). |
| 3 | N/A (excluded). |

To archive a URL: visit [https://web.archive.org/save](https://web.archive.org/save) and paste the URL. Wait for capture confirmation, then copy the archived URL into the `archive_url` field.

---

## 6. Special cases

### Press releases from agencies that are subjects of the case
A press release from an agency that is itself the subject of the case is Tier 1 for what the agency says, NOT Tier 1 for the underlying facts. Example: Sound Transit's CEO appointment press release is Tier 1 for confirming Constantine was appointed; it is NOT a Tier 1 source for whether the appointment process was conflicted. The audit, court filing, or Ombudsman finding would be.

### Reports commissioned by an agency from a private firm
Forensic audits, consulting reports, and outside counsel investigations commissioned by the agency under review are Tier 1 if they are publicly released in full and conducted by a credentialed firm (e.g., Clark Nuber's KCRHA forensic audit). They are Tier 2 if only the executive summary is released. They are Tier 3 if the report is undisclosed and only the agency's characterization is available.

### Statements by elected officials
A statement by an elected official acting in their public capacity (floor speech, official letter, board action) is Tier 1 `agency_statement`. A statement by an elected official to a reporter is Tier 2 (the reporter is the source, the official is the quote).

### Cases under active litigation
Court filings are Tier 1 the moment they are docketed. Settlements and judgments are Tier 1 when entered. Allegations in a complaint are Tier 1 as documentation that the allegations were made, NOT as documentation that the allegations are true. The case's `evidentiary_status` should reflect this distinction.

### Federal sources
Federal agency reports (HUD OIG, DOJ press releases, FBI affidavits in support of search warrants) are Tier 1 for federal matters touching WA entities. SEC filings by WA-based companies operating with public agencies are Tier 1 for the financial facts disclosed.

---

## 7. Anti-patterns to watch

Mistakes the registry has made or could easily make:

| Anti-pattern | Why it's wrong | Correct approach |
|---|---|---|
| **Citing a news article as Tier 1 because it summarizes an audit** | The article is Tier 2. The underlying audit is Tier 1. | Cite both. The audit is the lead source; the article is supporting. |
| **Citing a Tier 3 advocacy report because its conclusions match a Tier 2 article** | Sourcing-by-proxy. The Tier 3 source still doesn't qualify. | Cite only the Tier 2 article. Drop the Tier 3 reference. |
| **Treating a Tier 2 outlet's editorial as if it were reporting** | Editorials are opinion. They do not establish facts. | If the editorial cites specific facts, find the underlying reporting or document those facts come from. |
| **Treating an elected official's tweet as Tier 1** | Tweets are not official agency communications. | Find the official letter, action, or statement, if one exists. If not, treat the tweet as Tier 3 and don't cite. |
| **Filling `archive_url` with the live URL** | An archive URL must be from `web.archive.org` or another archival service. The live URL is not an archive. | Run the URL through Wayback before populating the field. |
| **Treating a single Tier 2 source as sufficient for naming a private individual** | The naming policy requires public coverage. A single bylined article is sufficient for inclusion; the question is whether the registry's added publication contributes to ongoing public exposure. | Two-source rule: name a private individual only if two independent Tier 2 sources name them, OR one Tier 1 source names them. |

---

## 8. Connection to other policy documents

- **[INTAKE.md](./INTAKE.md)** §1 G3 (source tier gate), §3 (source validation), §4 X4 (named actor consistency) all reference this document.
- **[SCHEMA.md](./SCHEMA.md)** §"Tier definitions" contains a short public-facing version of this policy that appears on the About page. This document is the operational long-form version.
- **Corrections page** ([corrections.astro](./src/pages/corrections.astro)) logs any tier reclassification of a previously-cited source.
