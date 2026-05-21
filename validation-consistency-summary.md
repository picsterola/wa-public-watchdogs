# Cross-Case Consistency Audit — Washington Accountability Registry

**Audit scope:** 36 case files  
**Total issues found:** 20  
**Broken cross-references:** 2

## 1. Verdict Counts

| issue_type | count |
|---|---|
| actor_jurisdiction_divergence | 2 |
| actor_title_divergence | 5 |
| broken_case_id_reference | 2 |
| date_disagreement | 1 |
| dollar_figure_disagreement | 2 |
| tag_near_duplicate | 8 |

| severity | count |
|---|---|
| high | 4 |
| medium | 5 |
| low | 11 |

## 2. High-Severity Issues

### H1. broken_case_id_reference — `port-seattle-pie-fraud`
**Conflicting case:** `kcrha-forensic-audit`  
**Field:** `body_text`  
**Value A:** KC-2025-007 (referenced as "KCRHA Clark Nuber forensic audit")  
**Value B:** KC-2026-001 (actual KCRHA forensic audit case ID)  
**Fix:** Replace KC-2025-007 with KC-2026-001 in port-seattle-pie-fraud body text. The KCRHA forensic audit is KC-2026-001 (kcrha-forensic-audit), not KC-2025-007.

### H2. broken_case_id_reference — `kc-youth-program-self-dealing`
**Conflicting case:** `kc-inspector-general-proposal`  
**Field:** `body_text`  
**Value A:** KC-2026-002 (referenced as "Inspector General proposal")  
**Value B:** KC-2026-007 (actual Inspector General proposal case ID)  
**Fix:** Replace KC-2026-002 with KC-2026-007 in kc-youth-program-self-dealing body text. The KC Inspector General proposal is KC-2026-007 (kc-inspector-general-proposal), not KC-2026-002.

### H3. date_disagreement — `constantine-ceo-ethics-complaint`
**Conflicting case:** `dow-soundtransit-ceo`  
**Field:** `Constantine CEO appointment date (body text)`  
**Value A:** March 28, 2025 (constantine-ceo-ethics-complaint body: "appointed CEO on March 28, 2025")  
**Value B:** March 27, 2025 (dow-soundtransit-ceo body: "formally appointed him on March 27, 2025"; date_surfaced: 2025-03-27; Sound Transit press release dated March 27)  
**Fix:** Update constantine-ceo-ethics-complaint body text to read "March 27, 2025" for the CEO appointment. The Sound Transit official press release (Tier 1) is dated March 27, 2025. The March 26, 2025 date in the same file is correct — that is when Aspelund filed the ethics complaint.

### H4. dollar_figure_disagreement — `sound-transit-west-seattle-cost`
**Conflicting case:** `sound-transit-st3-program-reset`  
**Field:** `West Seattle Link 2016 voter-approved baseline cost`  
**Value A:** $2.7B (sound-transit-west-seattle-cost: title, dollars_basis, and body all say "$2.7 billion" as the 2016 ballot figure)  
**Value B:** $4.2B (sound-transit-st3-program-reset dollars_basis and body: "West Seattle Link grew from $4.2B (finance plan)")  
**Fix:** Reconcile the 2016 WSL baseline: $2.7B is the voter-approved ballot estimate; $4.2B is the figure from Sound Transit's internal ST3 finance plan (which adjusts for inflation and scope). Both figures may be internally defensible but they describe different baselines. Add a note in sound-transit-st3-program-reset clarifying that $4.2B is the finance-plan figure (not the ballot estimate), so readers understand why sound-transit-west-seattle-cost says $2.7B and this case says $4.2B.

## 3. Medium-Severity Issues

| # | issue_type | case_slug_a | case_slug_b | field | value_a | value_b | recommended_fix |
|---|---|---|---|---|---|---|---|
| M1 | dollar_figure_disagreement | `kc-inspector-general-proposal` | `dchs-systemic-audit` | `DCHS program size (cross-reference in reform_argument body)` | $1.5B+ (kc-inspector-general-proposal body: "subrecipient mo | $1.8B+ (dchs-systemic-audit title, dollars_at_issue=18000000 | Update kc-inspector-general-proposal body from "$1.5B+" to "$1.8B+" to match the |
| M2 | actor_title_divergence | `dow-soundtransit-ceo` | `constantine-ceo-ethics-complaint` | `actors[Dow Constantine].role_type` | elected (dow-soundtransit-ceo) | bureaucrat (constantine-ceo-ethics-complaint) | Standardize Dow Constantine's role_type. In dow-soundtransit-ceo he is departing |
| M3 | tag_near_duplicate | `constantine-ceo-ethics-complaint` | `kc-dchs-ombuds-investigation` | `tags` | ombuds | ombudsman | Both refer to the King County Office of the Ombuds/Ombudsman. Standardize to "om |
| M4 | tag_near_duplicate | `sound-transit-west-seattle-cost` | `sound-transit-st3-program-reset` | `tags` | mega_project | megaprojects | Singular vs. plural. Standardize to "megaprojects" (or "mega_project") — whichev |
| M5 | tag_near_duplicate | `kc-inspector-general-proposal` | `kc-youth-program-self-dealing` | `tags` | inspector_general | inspector_general_push | Two different tags for inspector general topic. Standardize: use "inspector_gene |

## 4. Low-Severity Issues

| # | issue_type | case_slug_a | case_slug_b | field | value_a | value_b |
|---|---|---|---|---|---|---|
| L1 | actor_title_divergence | `sound-transit-st3-program-reset` | `constantine-ceo-ethics-complaint` | `actors[Dow Constantine].role_type` | bureaucrat (sound-transit-st3-program-reset) | bureaucrat (constantine-ceo-ethics-complaint) |
| L2 | actor_jurisdiction_divergence | `dow-soundtransit-ceo` | `constantine-ceo-ethics-complaint` | `actors[Dow Constantine].jurisdiction` | "King County / Washington State" (dow-soundtransit | "King County" (constantine-ceo-ethics-complaint) |
| L3 | actor_jurisdiction_divergence | `constantine-ceo-ethics-complaint` | `sound-transit-st3-program-reset` | `actors[Dow Constantine].jurisdiction` | "King County" (constantine-ceo-ethics-complaint) | "Washington State" (sound-transit-st3-program-rese |
| L4 | actor_title_divergence | `dow-soundtransit-ceo` | `constantine-ceo-ethics-complaint` | `actors[Dow Constantine].title` | "King County Executive (departing); Sound Transit  | "CEO, Sound Transit (former King County Executive, |
| L5 | actor_title_divergence | `sound-transit-st3-program-reset` | `constantine-ceo-ethics-complaint` | `actors[Dow Constantine].title` | "CEO, Sound Transit" (sound-transit-st3-program-re | "CEO, Sound Transit (former King County Executive, |
| L6 | actor_title_divergence | `ferguson-pdc-surplus-transfer` | `ferguson-pdc-vacancies-recall` | `actors[Bob Ferguson].title` | "Washington State Attorney General (at time of tra | "Washington State Governor" (ferguson-pdc-vacancie |
| L7 | tag_near_duplicate | `sound-transit-st3-program-reset` | `lni-it-modernization` | `tags` | capital_projects | cost_overrun |
| L8 | tag_near_duplicate | `dow-soundtransit-ceo` | `ferguson-pdc-vacancies-recall` | `tags` | governance | governance_failure |
| L9 | tag_near_duplicate | `` | `` | `reforms_implicated` | school_district_financial_controls | school_district_financial_oversight |
| L10 | tag_near_duplicate | `` | `` | `reforms_implicated` | nonprofit_subrecipient_monitoring | subrecipient_monitoring |
| L11 | tag_near_duplicate | `` | `` | `reforms_implicated` | capital_project_oversight | it_project_oversight |

## 5. Reform-Page Gaps

The `/reforms` page is dynamically generated from all `reforms_implicated` arrays across cases. 
There are no "missing" reform IDs on that page — every `reforms_implicated` value automatically appears there. 
The question is instead: are any `[reform: foo]` body-text references orphaned (pointing to a slug not used in any `reforms_implicated`)?

**No orphaned reform references found.** All `[reform: foo]` body references match a known `reforms_implicated` slug.

**Total unique reform IDs defined across all cases:** 35

| reform_id | cases_referencing |
|---|---|
| `appointment_accountability` | `constantine-ceo-ethics-complaint`, `ferguson-pdc-vacancies-recall` |
| `audit_finding_resolution_tracking` | `sps-ecf-unresolved-finding` |
| `board_committee_governance_standards` | `sps-structural-deficit` |
| `board_recusal_rules` | `dow-soundtransit-ceo` |
| `breach_notification_timelines` | `port-seattle-rhysida-breach` |
| `budget_oversight` | `spd-overtime-overspending` |
| `campaign_finance_reform` | `ferguson-pdc-surplus-transfer`, `harrell-tiktok-seec-complaint` |
| `capital_project_oversight` | `sound-transit-st3-program-reset` |
| `conflict_disclosure_grants` | `kc-youth-program-self-dealing` |
| `cost_transparency_reporting` | `kc-health-through-housing`, `sound-transit-st3-program-reset`, `sound-transit-west-seattle-cost`, `kcrha-forensic-audit` |
| `critical_infrastructure_cybersecurity` | `port-seattle-rhysida-breach` |
| `electioneering_definition` | `harrell-tiktok-seec-complaint` |
| `esd_governance_transparency` | `psesd-sao-conflict-letter` |
| `ethics_code_reform` | `constantine-ceo-ethics-complaint` |
| `ethics_enforcement_teeth` | `leb-24-06-mullet-public-resources`, `leb-25-01-hackney-conflict`, `leb-25-02-caldier-special-privileges`, `leb-25-04-zahn-outside-employment`, `leb-25-06-walen-outside-employment`, `leb-25-09-jinkins-public-resources`, `leb-25-10-troyer-wirtz-public-resources`, `leb-25-11-alvarado-outside-employment`, `leb-25-37-parshley-conflict`, `leb-25-38-simmons-special-privileges` |
| `executive_accountability` | `spd-diaz-misconduct`, `gomez-mayors-office-allegation` |
| `federal_grant_compliance` | `sps-ecf-unresolved-finding`, `sps-paid-lunch-equity-finding` |
| `independent_inspector_general` | `kc-health-through-housing`, `spd-diaz-misconduct`, `dchs-systemic-audit`, `dow-soundtransit-ceo`, `kc-dchs-ombuds-investigation`, `kc-youth-program-self-dealing`, `lni-it-modernization`, `dcyf-payment-compliance`, `kc-inspector-general-proposal`, `kcrha-forensic-audit` |
| `it_project_oversight` | `lni-it-modernization`, `sound-transit-west-seattle-cost` |
| `leb_transparency` | `leb-24-06-mullet-public-resources`, `leb-25-01-hackney-conflict`, `leb-25-02-caldier-special-privileges`, `leb-25-03-house-dem-caucus-social-media`, `leb-25-04-zahn-outside-employment`, `leb-25-06-walen-outside-employment`, `leb-25-09-jinkins-public-resources`, `leb-25-10-troyer-wirtz-public-resources`, `leb-25-11-alvarado-outside-employment`, `leb-25-37-parshley-conflict`, `leb-25-38-simmons-special-privileges` |
| `nonprofit_subrecipient_monitoring` | `port-seattle-pie-fraud` |
| `pdc_enforcement` | `ferguson-pdc-surplus-transfer`, `ferguson-pdc-vacancies-recall` |
| `personnel_oversight` | `spd-diaz-misconduct`, `gomez-mayors-office-allegation` |
| `port_internal_audit_authority` | `port-seattle-pie-fraud` |
| `procurement_reform` | `dchs-systemic-audit`, `kc-dchs-ombuds-investigation`, `kc-youth-program-self-dealing`, `lni-it-modernization`, `kc-inspector-general-proposal`, `kcrha-forensic-audit`, `seattle-sao-accountability-audit` |
| `program_outcome_auditing` | `kc-health-through-housing`, `dcyf-payment-compliance` |
| `public_resources_firewall` | `leb-24-06-mullet-public-resources`, `leb-25-03-house-dem-caucus-social-media`, `leb-25-09-jinkins-public-resources`, `leb-25-10-troyer-wirtz-public-resources` |
| `quarterly_reporting` | `spd-overtime-overspending` |
| `ransomware_response_protocols` | `port-seattle-rhysida-breach` |
| `sao_management_letter_disclosure` | `psesd-sao-conflict-letter` |
| `school_district_financial_controls` | `sps-paid-lunch-equity-finding` |
| `school_district_financial_oversight` | `sps-structural-deficit` |
| `subrecipient_monitoring` | `dchs-systemic-audit`, `kc-dchs-ombuds-investigation`, `spd-overtime-overspending`, `dcyf-payment-compliance`, `kc-inspector-general-proposal`, `kcrha-forensic-audit`, `seattle-sao-accountability-audit` |
| `transit_governance_reform` | `dow-soundtransit-ceo`, `sound-transit-st3-program-reset`, `sound-transit-west-seattle-cost` |
| `workforce_program_verification` | `port-seattle-pie-fraud` |

## 6. Tag Duplicates / Typos

| tag_a | tag_b | cases_with_a | cases_with_b | recommended_fix |
|---|---|---|---|---|
| `ombuds` | `ombudsman` | `constantine-ceo-ethics-complaint` | `kc-dchs-ombuds-investigation` | Both refer to the King County Office of the Ombuds/Ombudsman. Standardize to "ombuds" (matching the  |
| `mega_project` | `megaprojects` | `sound-transit-west-seattle-cost` | `sound-transit-st3-program-reset` | Singular vs. plural. Standardize to "megaprojects" (or "mega_project") — whichever is chosen, apply  |
| `inspector_general` | `inspector_general_push` | `kc-inspector-general-proposal` | `kc-youth-program-self-dealing` | Two different tags for inspector general topic. Standardize: use "inspector_general" for all IG-rela |
| `capital_projects` | `cost_overrun` | `sound-transit-st3-program-reset` | `lni-it-modernization`, `sound-transit-st3-program-reset`, `sound-transit-west-seattle-cost` | Not exact duplicates but often co-occur. Low priority — verify intentional distinction. |
| `governance` | `governance_failure` | `dow-soundtransit-ceo` | `ferguson-pdc-vacancies-recall` | Different tags for related concepts. Consider whether "governance" and "governance_failure" are mean |

**Reform ID near-duplicates** (verify intentional distinction):

- `school_district_financial_controls` vs `school_district_financial_oversight` — Reform IDs are near-duplicates. Verify whether both are intentional or one should be consolidated.
- `nonprofit_subrecipient_monitoring` vs `subrecipient_monitoring` — Reform IDs: one is a subset of the other. Confirm intentional distinction or merge into "subrecipient_monitoring".
- `capital_project_oversight` vs `it_project_oversight` — Reform IDs share high similarity (0.89). Both appear intentionally distinct — capital vs IT. Low priority.

## 7. Orphan References

### Broken Case ID references (ID mentioned in body but does not exist in registry)

- **`port-seattle-pie-fraud`** references `KC-2025-007` — Replace KC-2025-007 with KC-2026-001 in port-seattle-pie-fraud body text. The KCRHA forensic audit is KC-2026-001 (kcrha-forensic-audit), not KC-2025-007.
- **`kc-youth-program-self-dealing`** references `KC-2026-002` — Replace KC-2026-002 with KC-2026-007 in kc-youth-program-self-dealing body text. The KC Inspector General proposal is KC-2026-007 (kc-inspector-general-proposal), not KC-2026-002.

### Broken slug references (`/cases/xxx` link where xxx is not a known slug)

None found.

## 8. Cross-Referenced Dollar Agreement Table

### DCHS Cluster

| Case | ID | Dollar Figure | Notes |
|---|---|---|---|
| `dchs-systemic-audit` | `KC-2025-001` | $1.8B+ | DCHS contracting program (2023-24), corrected errata |
| `kc-dchs-ombuds-investigation` | `KC-2025-003` | N/A (process case) | 19 contractors flagged; no dollar figure at issue |
| `kc-youth-program-self-dealing` | `KC-2025-002` | $813K | Grants routed to 5 relatives by McGhee |
| `kc-health-through-housing` | `KC-2021-006` | $297.8M | Capital program (HTH); references KC-2025-001 |
| `kc-inspector-general-proposal` | `KC-2026-007` | N/A | References DCHS as $1.5B+ → INCONSISTENCY (should be $1.8B+) ⚠️ |

> **Issue M1:** `kc-inspector-general-proposal` body cites DCHS program as "$1.5B+" but the audit-confirmed figure is "$1.8B+". Update body text.

### Sound Transit Cluster

| Case | ID | Dollar Figure | Notes |
|---|---|---|---|
| `sound-transit-st3-program-reset` | `WA-2025-ST-PROG` | $34.5B shortfall | Program-wide, 2016 finance plan vs 2026 actuals; WSL baseline cited as $4.2B |
| `sound-transit-west-seattle-cost` | `WA-2025-ST-WSL` | $4.9–5.3B | 2016 ballot estimate cited as $2.7B → INCONSISTENCY with ST3 case ($4.2B) ⚠️ |
| `constantine-ceo-ethics-complaint` | `KC-2025-008` | $450K/yr | CEO salary; consistent with dow-soundtransit-ceo |
| `dow-soundtransit-ceo` | `KC-2025-005` | $450K/yr | CEO base salary; consistent with constantine-ceo-ethics-complaint |

> **Issue H3:** `sound-transit-west-seattle-cost` uses $2.7B as the 2016 voter-approved ballot estimate; `sound-transit-st3-program-reset` uses $4.2B as the ST3 finance-plan figure for the same project. These are different baselines (ballot vs. finance plan); add a clarifying note in `sound-transit-st3-program-reset` to prevent reader confusion.

### KCRHA Cluster

| Case | ID | Dollar Figure | Notes |
|---|---|---|---|
| `kcrha-forensic-audit` | `KC-2026-001` | $13M unaccounted; $44.7M negative cash | Standalone forensic audit |
| `port-seattle-pie-fraud` | `POS-2024-001` | $509K contracts / $250K misappropriated | References KCRHA as KC-2025-007 → BROKEN (should be KC-2026-001) ⚠️ |
| `kc-youth-program-self-dealing` | `KC-2025-002` | $813K | References KCRHA as KC-2026-001 ✓ |

> **Issue H1:** `port-seattle-pie-fraud` references the KCRHA forensic audit as KC-2025-007 (non-existent). The correct ID is KC-2026-001.

### Port of Seattle Cluster

| Case | ID | Dollar Figure | Notes |
|---|---|---|---|
| `port-seattle-pie-fraud` | `POS-2024-001` | $509K contracts, $250K misappropriated | Consistent within case |
| `port-seattle-rhysida-breach` | `POS-2024-002` | $6M ransom refused | Consistent within case |

> No dollar figure disagreements within Port cluster. Cross-reference in `port-seattle-rhysida-breach` to POS-2024-001 is accurate.

### SPS Cluster

| Case | ID | Dollar Figure | Notes |
|---|---|---|---|
| `sps-paid-lunch-equity-finding` | `SPS-2025-001` | $3.1M | SAO Finding 2024-001 |
| `sps-ecf-unresolved-finding` | `SPS-2025-002` | $4.9M questioned costs | Multi-year unresolved; consistent across references |
| `sps-structural-deficit` | `SPS-2025-003` | $100M structural deficit; $27.5M interfund loan | Consistent within case |

> No dollar figure disagreements within SPS cluster. All three SPS cases cross-reference each other accurately.

## 9. Full Case ID Cross-Reference Status

| Referencing Case | Referenced ID | Exists? | Actual Case |
|---|---|---|---|
| `kc-health-through-housing` | `KC-2025-001` | ✓ | dchs-systemic-audit |
| `port-seattle-pie-fraud` | `KC-2025-007` | ✗ BROKEN | (does not exist — should be KC-2026-001) |
| `port-seattle-rhysida-breach` | `POS-2024-001` | ✓ | port-seattle-pie-fraud |
| `spd-diaz-misconduct` | `KC-2026-007` | ✓ | kc-inspector-general-proposal |
| `constantine-ceo-ethics-complaint` | `WA-2025-ST-PROG` | ✓ | sound-transit-st3-program-reset |
| `constantine-ceo-ethics-complaint` | `KC-2025-005` | ✓ | dow-soundtransit-ceo |
| `dchs-systemic-audit` | `KC-2025-003` | ✓ | kc-dchs-ombuds-investigation |
| `gomez-mayors-office-allegation` | `SEA-2024-001` | ✓ | spd-diaz-misconduct |
| `kc-dchs-ombuds-investigation` | `KC-2025-001` | ✓ | dchs-systemic-audit |
| `kc-youth-program-self-dealing` | `KC-2026-001` | ✓ | kcrha-forensic-audit |
| `kc-youth-program-self-dealing` | `KC-2026-002` | ✗ BROKEN | (does not exist — should be KC-2026-007) |
| `kc-youth-program-self-dealing` | `KC-2025-001` | ✓ | dchs-systemic-audit |
| `sound-transit-st3-program-reset` | `WA-2025-ST-WSL` | ✓ | sound-transit-west-seattle-cost |
| `sound-transit-st3-program-reset` | `KC-2025-005` | ✓ | dow-soundtransit-ceo |
| `sps-ecf-unresolved-finding` | `SPS-2025-003` | ✓ | sps-structural-deficit |
| `sps-ecf-unresolved-finding` | `SPS-2025-001` | ✓ | sps-paid-lunch-equity-finding |
| `sps-paid-lunch-equity-finding` | `SPS-2025-003` | ✓ | sps-structural-deficit |
| `sps-paid-lunch-equity-finding` | `SPS-2025-002` | ✓ | sps-ecf-unresolved-finding |
| `sps-structural-deficit` | `SPS-2025-002` | ✓ | sps-ecf-unresolved-finding |
| `sps-structural-deficit` | `SPS-2025-001` | ✓ | sps-paid-lunch-equity-finding |
| `kc-inspector-general-proposal` | `KC-2025-003` | ✓ | kc-dchs-ombuds-investigation |
| `kc-inspector-general-proposal` | `KC-2025-001` | ✓ | dchs-systemic-audit |
| `kcrha-forensic-audit` | `KC-2025-003` | ✓ | kc-dchs-ombuds-investigation |
| `kcrha-forensic-audit` | `KC-2025-001` | ✓ | dchs-systemic-audit |
