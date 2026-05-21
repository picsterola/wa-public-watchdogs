# WA Registry Dollar Validation — Summary

**Validation date:** 2026-05-21  
**Cases reviewed:** 36  
**Cases with non-null dollar claims:** 18 (including 8 null-dollar LEB/other cases)

---

## Count by Verdict

| Verdict | Count |
|---|---|
| match | 22 |
| minor_discrepancy | 7 |
| major_discrepancy | 5 |
| unverifiable | 1 |
| source_dead | 0 |

> **Note:** The `dchs-systemic-audit` case appears twice in the CSV due to having two separate source URLs cited for the same dollar claim. The duplicate row is marked accordingly; counts above treat it as one major_discrepancy.

---

## Major Discrepancy Cases (require urgent correction)

### 1. `2025-dchs-systemic-audit` — $1.87B claim
**Registry claims:** $1,870,000,000  
**What sources actually say:** The corrected audit (September 9, 2025 errata from King County Auditor Kymber Waltmunson) states DCHS awarded **"more than $1.8 billion"** in 2023–2024 combined. No source states exactly $1.87B.  
**More critical error:** The registry's `dollars_basis` still references the **"$22M"** 2019–2020 baseline — this was the figure the errata corrected. The corrected figure is **$922 million** in 2019–2020 (not $22M). The 6,700% growth figure cited in some early media was based on the error.  
**Correct characterization:** DCHS awarded more than $1.8B in 2023–24, up from $922M in 2019–20 (approximately doubled, not a 6,700% increase).  
**Sources:** [King County Auditor errata PDF (Sep 9, 2025)](https://cdn.kingcounty.gov/-/media/king-county/independent/governance-and-leadership/government-oversight/auditors-office/reports/audits/2025/dchs-contracts/dchs-contracts-errata-2025.pdf)

---

### 2. `2025-constantine-ceo-ethics-complaint` — $675K salary claim
**Registry claims:** $675,000 as Constantine's Sound Transit CEO salary  
**What sources actually say:** Constantine was hired at **$450,000** base salary (confirmed by Fox 13 Seattle, Seattle Times). The $675,000 figure appears only on a Krauthamer recruiting firm invoice as the anticipated maximum — it was never the actual salary. Sound Transit's public job listing showed a range of $450K–$650K.  
**Correct figure:** $450,000 base salary at hire (rising to $474,276 by January 2026).  
**Sources:** [Fox 13 Seattle](https://www.fox13seattle.com/news/dow-constantine-ceo-sound-transit), [Seattle Times (Jan 2026)](https://www.seattletimes.com/seattle-news/transportation/why-sound-transits-ceo-is-postponing-part-of-his-pay-raise/)

---

### 3. `2025-dow-soundtransit-ceo` — $675K salary claim
**Registry claims:** $675,000 as the reported annual salary for the Sound Transit CEO  
**What sources actually say:** Same error as above. The Urbanist article cited says "as high as $650,000." Actual hired salary: **$450,000**.  
**Correct figure:** $450,000 base salary (the $675K was a recruiter's invoice estimate, not the actual compensation).  
**Note:** This case and `constantine-ceo-ethics-complaint` contain the same incorrect dollar claim for the same position.

---

### 4. `2021-kc-health-through-housing` — $455M / $333K per unit claim
**Registry claims:** $455,000,000 total program cost; approximately $333,000 per unit  
**What sources actually say:** The cited KNKX article does not mention $455M or $333K per unit. It refers to a $400M bonding package. King County's own annual reports document average capital per-unit costs of $229,300 (2022 report), $273,021 (2023 report), and $285,772 (2024 report) — not $333K. The 2021 Implementation Plan budgeted $297.8M in capital.  
**Correct characterization:** Program capital budget was approximately $297.8M through 2028; per-unit capital cost averaged $273K–$286K (2021–2024). The $455M total is not sourced.  
**Sources:** [King County 2024 HTH Annual Report](https://cdn.kingcounty.gov/-/media/king-county/depts/dchs/housing/health-through-housing/annual-reports/2024-health-through-housing-annual-report.pdf)

---

## Minor Discrepancy Cases

| Case | Claimed | What Source Says | Issue |
|---|---|---|---|
| `2025-kc-youth-program-self-dealing` | $813K | "more than $800,000" | $813K comes from non-public investigation report; article says ">$800K." Sub-figures ($10M program, $9,999 brother payment, $660K ETL, $146K downstream) all confirmed. |
| `2024-port-seattle-rhysida-breach` | $6M ransom | $5.8–6M (100 bitcoin) | Cited Port source doesn't mention the ransom amount; media sources do. The $6M is accurate in round numbers. |
| `2024-spd-diaz-misconduct` | $338K salary | $338K confirmed via public payroll | $338K is accurate (confirmed by PubliCola July 2024, Fox Baltimore) but not stated in the cited Cascade PBS source. |
| `2025-sound-transit-st3-program-reset` | $34.5B | Confirmed only in Lynnwood Times | The $34.5B is confirmed (Lynnwood Times, March 2026 board retreat) but not in the other two cited sources (Seattle Times: $22–30B; Urbanist: $30–40B). |
| `2025-sps-structural-deficit` | $94–104M for FY 2025-26 | $94M+ for 2025-26; $104M for 2024-25 | The $104M figure is for 2024-25, not 2025-26. Minor fiscal year attribution error. |
| `2026-kcrha-forensic-audit` | $13M | Components confirmed; aggregate not stated | $8M + $4.26M = $12.26M; $13M aggregate appears in media not the audit itself. Rounding accounts for remainder. |
| `2025-sps-paid-lunch-equity-finding` | $3,128,043 | Confirmed; second figure ($3,745,346) also in same finding | The $3.128M is the correct PLE tool figure; the $3.745M is the audit-period GL deficiency — both legitimate depending on scope. |

---

## Unverifiable Cases

| Case | Reason |
|---|---|
| `2025-gomez-mayors-office-allegation` | dollars_at_issue is null; the ~$150K salary estimate in dollars_basis has no cited source in the case file. Not a formal dollar claim. |

---

## Additional Observations

**LEB null-dollar cases (11 cases):** All 11 Legislative Ethics Board cases with null dollar figures have been reviewed and confirmed as no-dollar-claim cases. Verdicts: all `match`.

**KCRHA forensic audit — unreported figure:** A $44.7 million negative cash position for KCRHA was referenced in a Seattle City Council briefing (April 2026) but does not appear in the registry's `dollars_at_issue` or `dollars_basis`. This figure represents a broader financial exposure than the $13M cited.

**DCHS cases linkage:** Three cases share the DCHS contracting universe: `dchs-systemic-audit` (macro figure), `kc-dchs-ombuds-investigation` (19 contractor investigation), and `kc-youth-program-self-dealing` (McGhee self-dealing). The Ombuds report documents $690,617 in questioned costs across 16 partners — a much smaller figure than the macro $1.8B DCHS program scope.

**Sound Transit salary duplication:** Both `2025-constantine-ceo-ethics-complaint` and `2025-dow-soundtransit-ceo` cite $675K as Constantine's salary. Both are wrong by the same amount for the same reason ($675K was a recruiter's invoice ceiling; actual hired salary was $450K).
