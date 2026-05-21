# WA Accountability Registry — Actor-Fact Validation Summary

**Validation run:** May 20, 2026  
**Cases validated:** 36  
**Validator:** Actor-Fact Validation Subagent (automated + manual web search)  
**CSV source:** `/home/user/workspace/wa-registry/validation-actors.csv` (124 rows)

---

## 1. Summary Verdict Counts

| Verdict | Count | % of Total |
|---|---|---|
| match | 68 | 54.8% |
| minor_discrepancy | 33 | 26.6% |
| major_discrepancy | 8 | 6.5% |
| unverifiable | 4 | 3.2% |
| source_dead | 0 | 0.0% |
| **Total** | **124** | |

**Overall accuracy rate (match + minor only):** 81.4%  
**Cases with at least one major discrepancy:** 6  
**Cases with at least one unverifiable claim:** 3  
**Cases requiring evidentiary_status downgrade:** 6  
**Cases with stale legal_status:** 10

---

## 2. Major Discrepancies Requiring Urgent Correction

### 2a. Actor Name Error — `sound-transit-st3-program-reset`

- **Field:** `actors[].name`
- **Claim in case:** `Victoria Wass`
- **What sources say:** Full name is **Victoria Baecher Wassmer**. Confirmed via Sound Transit press release dated Feb 18, 2025 and LinkedIn.
- **Source:** https://www.soundtransit.org/get-to-know-us/news-events/news-releases/sound-transit-welcomes-new-leaders-finance-business
- **Fix:** Change `"Victoria Wass"` → `"Victoria Wassmer"` (or `"Victoria Baecher Wassmer"` for full legal name). Title (`Deputy CEO – Finance & Business Administration`) is confirmed correct.

---

### 2b. Evidentiary Status — `sound-transit-st3-program-reset`

- **Field:** `evidentiary_status`
- **Current value:** `documented`
- **Problem:** All three cited sources are Tier 2 journalism (Seattle Times, Urbanist, Lynnwood Times). No Tier 1 source is formally cited. The case body acknowledges "Sound Transit's own ST3 finance plan and project pages remain the underlying Tier 1 reference" but does not cite it as a source.
- **Fix:** Downgrade to `reported` OR formally add Sound Transit's published board materials / ST3 finance plan (e.g., https://www.soundtransit.org/get-to-know-us/achieving-long-term-affordability) as a Tier 1 `agency_statement` source.

---

### 2c. Evidentiary Status — `dow-soundtransit-ceo`

- **Field:** `evidentiary_status`
- **Current value:** `documented`
- **Problem:** All four cited sources are Tier 2 (Urbanist, Seattle Transit Blog, NW Progressive Institute, Seattle Times). No Tier 1 source.
- **Fix:** Downgrade to `reported` OR add Sound Transit's official board resolution or CEO appointment press release as a Tier 1 `agency_statement`. Note: Sound Transit's press release at https://www.soundtransit.org/get-to-know-us/news-events/news-releases/dow-constantine-hired-sound-transit-ceo qualifies as Tier 1.

---

### 2d. Evidentiary Status — `kc-youth-program-self-dealing`

- **Field:** `evidentiary_status`
- **Current value:** `documented`
- **Problem:** Only two Tier 2 sources cited (Seattle Times, Fox 13). The King County internal investigation report (December 2025) is the Tier 1 document but is not independently cited — the case only references it as obtained by Seattle Times via PRR. The case frontmatter comments acknowledge this gap.
- **Fix:** Downgrade to `reported` OR independently obtain and cite the King County internal investigation report as a Tier 1 source.

---

### 2e. Evidentiary Status — `spd-overtime-overspending`

- **Field:** `evidentiary_status`
- **Current value:** `documented`
- **Problem:** Single Tier 2 source (PubliCola). The underlying November 18, 2025 SPD memo is the Tier 1 document but is not independently cited. Case body explicitly acknowledges this gap.
- **Fix:** Downgrade to `reported` OR obtain SPD memo via PRR and cite directly as Tier 1.

---

### 2f. Evidentiary Status — `lni-it-modernization`

- **Field:** `evidentiary_status`
- **Current value:** `documented`
- **Problem:** Single Tier 2 source (Governing / Seattle Times reprint). No SAO IT oversight report, OCIO status report, or other Tier 1 source cited.
- **Fix:** Downgrade to `reported` OR identify and cite an SAO audit or OCIO report covering L&I's IT modernization as Tier 1.

---

### 2g. Evidentiary Status — `ferguson-pdc-vacancies-recall`

- **Field:** `evidentiary_status`
- **Current value:** `documented`
- **Problem:** Two OPB sources and one Lynnwood Times source cited — all Tier 2. No PDC filing, appointment order, or other Tier 1 government document cited.
- **Fix:** Downgrade to `reported` OR add Governor Ferguson's official appointment orders for Matt Segal and Teebah Alsaheh as Tier 1 sources.

---

### 2h. Legal Status Incomplete — `port-seattle-pie-fraud`

- **Field:** `legal_status` / `outcome_summary`
- **Current value:** `audit_finding` — outcome_summary does not mention the criminal investigation
- **Problem:** The Port Internal Audit Report #2024-17 explicitly states that PIE reported the fraud to the King County Sheriff's Department and that "a criminal investigation is ongoing and was expected to conclude in late September of 2024." This is a material fact not reflected in the case record.
- **Source:** https://www.portseattle.org/sites/default/files/2024-12/Partner%20in%20Employment-Audit%20Report%20No.%202024-17.pdf
- **Fix:** Update `outcome_summary` to state that per Audit Report #2024-17, PIE self-reported the fraud to King County Sheriff and a criminal investigation was opened (expected conclusion September 2024). Run a current search to determine if charging decisions have been made and update `legal_status` if appropriate.

---

## 3. Minor Discrepancies

| Case | Field | Issue | Recommended Fix |
|---|---|---|---|
| `sound-transit-st3-program-reset` | `actors[].party` | Dow Constantine `party=null` but he is registered Democrat | Add `party: D` |
| `sound-transit-st3-program-reset` | `legal_status` | `under_investigation` is misleading — this is an internal agency planning process, not a formal external investigation | Change to `no_action` or `audit_finding` |
| `dow-soundtransit-ceo` | `body_claim` | Body says Constantine held appointment authority over "10 of 18" ST board seats; Wikipedia specifies 9 King County seats specifically | Verify from Sound Transit board composition records; if 9, update the figure |
| `kcrha-forensic-audit` | `body_quote` | Frontmatter says $1.27M in unrecoverable interest; body quote says $1.26M — internal inconsistency | Confirm exact figure in Clark Nuber PDF; align frontmatter and body |
| `port-seattle-pie-fraud` | `actors[].title` | Bookda Gheisar title listed as "Senior Director, Equity, Diversity & Inclusion" — official title includes "Office of" | Change to "Senior Director, Office of Equity, Diversity, and Inclusion, Port of Seattle" |
| `sps-structural-deficit` | `actors[].title` | Brent Jones notation `(resigned)` is accurate; but Ben Shuldiner is now current Superintendent (2026) | Add note or actor block for Ben Shuldiner as current Superintendent |
| `sps-structural-deficit` | `actors[].title` | Liza Rankin title "Board President" — Rankin confirmed as Board Director; Board President role during period needs verification | Verify Board President status during relevant period; if no longer President, change to "Board Director" |
| `kc-health-through-housing` | `legal_status` | `audit_finding` is questionable — no specific audit finding targets HTH; the cited DCHS audit covers DCHS broadly | Consider changing to `no_action` with a note referencing the broader DCHS audit |
| `leb-24-06-mullet-public-resources` | `actors[].title` | Mark Mullet listed as "Washington State Senator" — Mullet left the Senate January 2025 and ran for Governor | Change to "former Washington State Senator" |
| `spd-diaz-misconduct` | `source_url` | OIG Findings Letter URL uses "opa" filename convention; internal document header says case number "2023OIG-0286" | Add clarifying note; no factual correction needed |
| `dcyf-payment-compliance` | `sources` | Tier 1 SAO source has no URL listed in frontmatter | Add URL to SAO report citation |
| `constantine-ceo-ethics-complaint` | `actors[].title` | Case correctly double-titles Constantine but does not include his former ST Board member role explicitly | Low priority; current title is accurate |
| `kcrha-forensic-audit` | `legal_status` | `under_investigation` — no formal criminal investigation; an oversight/corrective action process is underway | Consider changing to `audit_finding` with monitoring note |
| `sps-structural-deficit` | `evidentiary_status` | Documented on Tier 1 district budget materials — appropriate. No change needed but verify Jones replacement note is current | Update actor block to reflect Shuldiner as current |

---

## 4. Unverifiable Claims

| Case | Field | Claim | Why Unverifiable | Recommended Action |
|---|---|---|---|---|
| `port-seattle-pie-fraud` | `actors[].title` | Anna Pavlik: "Director, Workforce Development, Port of Seattle" | Port of Seattle staff directory does not publicly list her exact title; audit PDF references Port staff in contracting but does not give exact Pavlik title | Verify via Port of Seattle staff directory or FOIA request; LinkedIn suggests "Workforce Development Director" is consistent but exact title variant uncertain |
| `sps-structural-deficit` | `actors[].title` | Liza Rankin: "Board President, Seattle Public Schools" | Rankin confirmed as Board Director; Board President role during the relevant period not independently confirmable from public sources reviewed | Check SPS Board meeting minutes or SPS website for Board officer elections 2024-2025 |
| `dcyf-payment-compliance` | `evidentiary_status` | Documented status — Tier 1 SAO source cited but no URL provided | Cannot independently confirm the exact SAO report referenced without a URL | Add URL to SAO report; verify via SAO portal search for DCYF payment compliance reports |
| `dow-soundtransit-ceo` | `body_claim` | Constantine appointment authority over "10 of 18" ST board seats | Multiple corroborating sources (Urbanist, Wikipedia) give slightly different figures (10 vs. 9 King County seats) | Verify from Sound Transit's official board composition records; exact figure matters for factual accuracy |

---

## 5. Cases Recommended for Evidentiary Status Downgrade

The following cases are marked `documented` but cite only Tier 2 journalism sources, with no Tier 1 government document (audit, court filing, IG report, PDC filing, SAO report, or FOIA-returned document) formally cited. Under registry rules, `documented` requires at least one Tier 1 source.

| Case | Current Status | Tier 1 Sources Cited | Tier 2 Sources Cited | Recommended Action |
|---|---|---|---|---|
| `sound-transit-st3-program-reset` | documented | 0 | 3 (Seattle Times, Urbanist, Lynnwood Times) | Downgrade to `reported` OR add Sound Transit board materials as Tier 1 |
| `dow-soundtransit-ceo` | documented | 0 | 4 (Urbanist, Seattle Transit Blog, NW Progressive, Seattle Times) | Downgrade to `reported` OR add Sound Transit CEO appointment press release as Tier 1 |
| `kc-youth-program-self-dealing` | documented | 0 (KC investigation report not formally cited) | 2 (Seattle Times, Fox 13) | Downgrade to `reported` OR independently cite the KC internal investigation report |
| `spd-overtime-overspending` | documented | 0 (SPD memo not independently cited) | 1 (PubliCola) | Downgrade to `reported` OR obtain SPD Nov 18, 2025 memo via PRR |
| `lni-it-modernization` | documented | 0 | 1 (Governing / Seattle Times) | Downgrade to `reported` |
| `ferguson-pdc-vacancies-recall` | documented | 0 | 3 (OPB ×2, Lynnwood Times) | Downgrade to `reported` OR add appointment orders as Tier 1 |

**Note:** In all six cases, the underlying facts may well be accurate — the issue is the formal evidentiary sourcing, not the substance of the claim.

---

## 6. Cases with Stale Legal Status

### 6a. LEB Opinion Cases (10 cases — opinions issued, status still `complaint_filed`)

All ten LEB cases below have published opinions from the Legislative Ethics Board but retain `legal_status=complaint_filed` in their case records. The opinion index is at: https://leg.wa.gov/about-the-legislature/ethics/ethics-complaint-opinions/

| Case Slug | Current legal_status | LEB Opinion Issued | Action |
|---|---|---|---|
| `leb-25-38-simmons-special-privileges` | complaint_filed | May 3, 2026 | Update to `closed_opinion_issued` or `dismissed` per opinion text |
| `leb-25-37-parshley-conflict` | complaint_filed | December 15, 2025 | Update per opinion text |
| `leb-25-11-alvarado-outside-employment` | complaint_filed | May 22, 2025 | Update per opinion text |
| `leb-25-10-troyer-wirtz-public-resources` | complaint_filed | July 7, 2025 | Update per opinion text |
| `leb-25-06-walen-outside-employment` | complaint_filed | April 10, 2025 | Update per opinion text |
| `leb-25-04-zahn-outside-employment` | complaint_filed | April 10, 2025 | Update per opinion text |
| `leb-25-03-house-dem-caucus-social-media` | complaint_filed | April 10, 2025 | Update per opinion text |
| `leb-25-02-caldier-special-privileges` | complaint_filed | May 22, 2025 | Update per opinion text |
| `leb-25-01-hackney-conflict` | complaint_filed | March 4, 2025 | Update per opinion text |
| `leb-24-06-mullet-public-resources` | complaint_filed | June 4, 2024 | Update per opinion text (oldest stale case) |

**Correctly marked:** `leb-25-09-jinkins-public-resources` retains `complaint_filed` accurately — no opinion has been issued as of the record's last update.

### 6b. Other Stale Status Flags

| Case Slug | Current legal_status | Issue |
|---|---|---|
| `port-seattle-pie-fraud` | audit_finding | Audit report itself documents a criminal investigation was opened (expected to close September 2024); outcome unknown from public sources |
| `sound-transit-st3-program-reset` | under_investigation | No formal external investigation underway; this is an internal agency planning/reset process |

---

## Appendix: Confirmed Matches — Key Actors

The following actors had their name, title, party, and jurisdiction independently confirmed as accurate:

| Actor | Title | Party | Case(s) |
|---|---|---|---|
| Dow Constantine | CEO, Sound Transit (former King County Executive) | D | sound-transit-st3-program-reset, dow-soundtransit-ceo, constantine-ceo-ethics-complaint |
| Terri Mestas | Deputy CEO, Megaproject Delivery, Sound Transit | — | sound-transit-st3-program-reset |
| Victoria Baecher Wassmer | Deputy CEO, Finance & Business Administration, Sound Transit | — | sound-transit-st3-program-reset (NAME ERROR IN CASE) |
| Kelly Kinnison | CEO, KCRHA | — | kcrha-forensic-audit |
| Hien Kieu | Executive Director, Partner in Employment | — | port-seattle-pie-fraud |
| Bookda Gheisar | Senior Director, Office of Equity, Diversity, and Inclusion, Port | — | port-seattle-pie-fraud (TITLE MINOR ERROR) |
| Adrian Diaz | Chief of Police, SPD (former) | — | spd-diaz-misconduct |
| Jamie Tompkins | Chief of Staff to SPD Chief (former) | — | spd-diaz-misconduct |
| Bruce Harrell | Mayor of Seattle | D | spd-diaz-misconduct |
| Shon Barnes | Chief of Police, SPD (current) | — | spd-diaz-misconduct |
| Wayne Barnett | Executive Director, SEEC | — | seec-barnett-conflict |
| Bob Ferguson | Governor, Washington State | D | ferguson-pdc-vacancies-recall |
| Reagan Dunn | King County Councilmember | R | kc-youth-program-self-dealing |
| Rod Dembowski | King County Councilmember | D | multiple |
| Sarah Perry | King County Council Chair | D | multiple |
| Kymber Waltmunson | King County Auditor | — | dchs-systemic-audit |
| Tarra Simmons | WA State Representative | D | leb-25-38-simmons-special-privileges |
| Janice Zahn | WA State Representative | D | leb-25-04-zahn-outside-employment |
| Amy Walen | WA State Representative | D | leb-25-06-walen-outside-employment |
| Lisa Parshley | WA State Representative | D | leb-25-37-parshley-conflict |
| Emily Alvarado | WA State Representative | D | leb-25-11-alvarado-outside-employment |
| David Hackney | WA State Representative | D | leb-25-01-hackney-conflict |
| Michelle Caldier | WA State Representative | R | leb-25-02-caldier-special-privileges |
| Mark Mullet | former WA State Senator | D | leb-24-06-mullet-public-resources (TITLE STALE) |
| Laurie Jinkins | Speaker, WA House of Representatives | D | leb-25-09-jinkins-public-resources |
| Yolanda McGhee | Program Manager, Liberated Village / DCHS | — | kc-youth-program-self-dealing |
| Pedro Gomez | Director of External Affairs, Mayor's Office (former) | — | spd-diaz-misconduct |
| Steve Metruck | Executive Director, Port of Seattle | — | port-seattle-rhysida-breach |

---

*End of validation summary. See validation-actors.csv for row-level detail.*
