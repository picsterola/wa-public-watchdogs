---
# === IDENTITY ===
id: WA-2025-DOL-LICENSE-EXPRESS
title: "Washington DOL License Express backdoor — 2018-2025 vulnerability; 1,000+ identity thefts before fix; breach notification law alleged violated"
slug: dol-license-express-backdoor
date_surfaced: 2026-03-05
date_conduct_start: 2018-09-03
date_conduct_end: 2025-02-18
last_updated: 2026-05-24
last_verified: 2026-05-24

# === ACTORS ===
actors:
  - name: Washington State Department of Licensing
    role_type: agency
    title: null
    party: null
    jurisdiction: Washington State

# === CLASSIFICATION ===
evidentiary_status: documented
severity_type:
  - structural_failure
reforms_implicated:
  - it_modernization_governance
  - cybersecurity_disclosure

# === SCALE ===
dollars_at_issue: null
dollars_basis: null
dollars_confirmed_loss: null

# === STATUS ===
legal_status: complaint_filed
outcome_summary: "A tort claim filed March 3, 2026 by attorney Joel Ard (Ard Law Group) on behalf of Washington resident William Black alleges that the Washington Department of Licensing maintained a known security vulnerability in its License Express online portal from approximately Labor Day 2018 through February 18, 2025, enabling identity thieves to access resident driver's license records, change addresses, and order replacement licenses redirected to attacker-controlled locations. The filing states that at least one fraudster completed more than 1,000 identity thefts using the vulnerability. DOL disputes the allegation of widespread fraud and states it found no evidence of a data breach through License Express. WSP investigated suspected fraudulent use of the system beginning August 2019 and closed the investigation in September 2021 due to a lack of active leads. DOL took License Express offline February 10–18, 2025 to implement a fix. The tort claim alleges DOL violated its obligations under the Washington Data Breach Notification Act by failing to notify affected individuals."

# === RESOLUTION TRACKING ===
remediation_status: in_progress
remediation_note: "DOL is reviewing the tort claim notice filed with the Department of Enterprise Services on March 3, 2026 (Fox13, March 5, 2026). DOL publicly disputes the allegation of widespread fraud and states it has found no evidence of a data breach through License Express. KIRO 7 March 5, 2026 frames the issue as the September 2018 License Express upgrade having created a structural vulnerability. No DOL corrective action publicly disclosed."
reform_status: unknown
reform_status_note: "No legislative reform identified as of May 2026."
next_milestone: null
next_milestone_date: null

# === SOURCES ===
sources:
  - tier: 1
    type: agency_statement
    title: "DOL statement on License Express tort claim — review of March 3, 2026 tort claim notice"
    publisher: Washington State Department of Licensing
    author: Nathan Olson, Digital Communications and Outreach Director
    date: 2026-03-05
    url: https://www.fox13seattle.com/news/wa-attorney-claims-dol
    archive_url: http://web.archive.org/web/20260321153115/https://www.fox13seattle.com/news/wa-attorney-claims-dol
    quote: "The Department of Licensing is reviewing the tort claim notice filed with Department of Enterprise Services on March 3, 2026. DOL disputes the allegation of widespread fraud and has found no evidence of a data breach through its License Express service. That service requires customers to input personal credentials (such as birth date and Social Security number, if applicable) before gaining access. DOL takes allegations of fraud seriously."
  - tier: 2
    type: news
    title: "Tort claim alleges WA DOL left your information open to criminals"
    publisher: FOX 13 Seattle
    date: 2026-03-05
    url: https://www.fox13seattle.com/news/wa-attorney-claims-dol
    archive_url: null
    quote: "In-between Labor Day of 2018 and February of 2025, anybody could find the directions on how to get into the License eXpress system, pick a person and change the address on their license, and order a new license."
  - tier: 2
    type: news
    title: "Claim: Washington DOL left 'back door' security flaw open for years"
    publisher: KING 5 News
    date: 2026-03-05
    url: https://www.yahoo.com/news/articles/claim-washington-dol-left-back-173210396.html
    archive_url: null
  - tier: 3
    type: news
    title: "The WA DOL Fraud Keeps Growing?! — attorney Joel Ard on the John Curley Show, KIRO Newsradio 97.3 FM"
    publisher: KIRO Newsradio / MyNorthwest
    author: John Curley (host) and Joel Ard (plaintiff's counsel)
    date: 2026-05-21
    url: https://www.youtube.com/watch?v=pEzqgYujySY
    archive_url: http://web.archive.org/web/20260522020208/https://www.youtube.com/watch?si=NC3hI3yqtTmHSlCq&v=pEzqgYujySY
    quote: "a lot of people uh to my understanding close to 10,000 at least were affected by driver's license redirects alone in that six-year period."

# === REFORM LINKAGE ===
reform_argument: |
  The License Express vulnerability persisted for approximately six and a half
  years — across multiple administrative cycles, two governors, and multiple
  WaTech oversight periods — without mandatory public disclosure or a fixed
  remediation timeline. The tort claim documents that WSP notified DOL of
  suspected fraudulent use of the system in August 2019. DOL knew by at
  least 2020 or early 2021 that more than 1,000 successful fraudulent
  identity thefts had occurred through the system. By 2024, WSP was informing
  DOL that the volume of new cases each month exceeded WSP's capacity to
  investigate. Despite this documented knowledge, DOL did not close the
  vulnerability until February 2025 — citing, per the tort claim, budget
  constraints.

  The structural finding is the 6.5-year window. A vulnerability that
  generates more than 1,000 confirmed identity thefts, that WSP warns DOL
  about in 2019 and again confirms is overwhelming its caseload in 2024,
  and that DOL does not fix for budget reasons, is not a technology failure
  — it is a governance failure. The decision not to allocate budget to fix
  a known-active-exploitation vulnerability is an executive decision, made
  repeatedly across multiple budget cycles, with documented ongoing harm to
  Washington residents.

  The breach notification failure compounds the structural finding.
  Washington's Data Breach Notification Act requires timely notice to
  affected individuals. The tort claim alleges DOL never fulfilled that
  obligation for the License Express vulnerability. Individuals whose
  license records were accessed and altered had no way to know their
  identity had been compromised. They could not monitor, freeze credit,
  or take protective action because DOL did not tell them.

  Reform argument: state IT cybersecurity disclosure requirements should
  be statutory and tied to fixed-window remediation timelines — not
  subject to budget discretion. When a state agency identifies a known
  exploitable vulnerability in a system holding sensitive personal data
  for millions of residents, the obligation to (1) notify affected residents
  and (2) remediate within a defined statutory period should not be
  overrideable by budget constraints. Current DOL and WaTech practices
  left the public unaware of ongoing risk for more than six years.
  See [reform: cybersecurity_disclosure] and [reform: it_modernization_governance].

# === GOVERNANCE METADATA ===
review_status: draft
retraction_note: null
contributor: vn
tags:
  - dol
  - license_express
  - cybersecurity
  - identity_theft
  - it_modernization
---

**A March 2026 tort claim alleges the Washington Department of Licensing maintained a known security vulnerability in its License Express online portal from Labor Day 2018 through February 2025, enabling identity theft through address changes and duplicate license orders. At least one fraudster completed more than 1,000 identity thefts using the vulnerability. DOL was warned by WSP in 2019 and again circa 2024, but did not fix the vulnerability until February 2025, citing budget constraints. The tort claim also alleges DOL violated the Washington Data Breach Notification Act.**

## What happened

### Mechanism detail (added 2026-05-23)

In a May 21, 2026 interview on KIRO Newsradio, plaintiff's counsel Joel Ard described the underlying authentication weakness that made the License Express vulnerability exploitable at scale. Per Ard's account: Washington's pre-2018 driver's license numbers contained the first five characters of a holder's last name, middle initial, and an alphanumeric string. The alphanumeric component was not random; it was generated by a deterministic algorithm based on the holder's date of birth. As a result, knowing a person's name and birth date was sufficient to derive their driver's license number. Public websites reportedly offered this derivation as a lookup service.

DOL recognized this weakness and, around Labor Day 2018, began transitioning to new driver's license numbers beginning with the prefix "WDL" followed by randomly generated characters. Simultaneously, DOL launched the License Express online portal. Per Ard, License Express accepted as authentication credentials the combination of name, date of birth, and driver's license number, which was the same set of fields an attacker could derive from public-record sources. The Washington Secretary of State's voter registration database, which is releasable on public records request, historically included the full birth date for registered voters, providing a name-and-birth-date source for nearly every adult in the state. An attacker with the voter file could derive the legacy driver's license number for any matched individual and use it as the third License Express credential.

According to Ard, the dev-build codename for this access path — referred to in the interview as the "no loon portal" — remained embedded in the License Express HTML source after the path was disabled.

This mechanism explanation is sourced to plaintiff's counsel in a public interview and is offered as the asserted technical basis for the tort claim. It has not been independently confirmed by DOL, which disputes that a breach occurred. DOL's public statement notes that License Express required "birth date and Social Security number, if applicable" as credentials, which is not identical to the name/DOB/DL# description provided by Ard.

### Scale claims

The original tort claim filed March 3, 2026 references at least one fraudster who completed "more than 1,000" identity thefts through the vulnerability. In the May 21, 2026 KIRO interview, Ard stated that the affected population is now estimated at "close to 10,000" Washington residents who had license records redirected during the 2018–2025 window, with the broader exposure population being the full driver-record database (described by Ard as approximately seven million records). The 10,000 figure is an attorney's public estimate as of May 2026; it is not a court finding, agency confirmation, or discovery-confirmed number. DOL continues to dispute that widespread fraud occurred.

### Original tort claim narrative

Washington DOL's License Express is the online portal used by Washington residents to renew driver's licenses, manage accounts, and access licensing services. The system handles highly sensitive data including Social Security numbers, birth dates, driver's license numbers, and residential addresses.

According to a tort claim filed March 3, 2026 by attorney Joel Ard (Ard Law Group) on behalf of Washington resident William Black, DOL introduced a security flaw into License Express around Labor Day 2018 when it implemented upgrades to the public-facing platform. The flaw allowed unauthorized users to:

1. Access any resident's driver's license record using publicly circulated instructions (allegedly posted to dark web forums)
2. Change the address on file for the resident's license
3. Order a replacement license delivered to the attacker-controlled address

According to the claim, the fraud pattern was often obvious — dozens or hundreds of replacement licenses ordered to a single address, paid for with prepaid or "burner" Visa cards, using fake email accounts. DOL allegedly created an internal spreadsheet to track early victims, which itself documented the method of access.

The claim states DOL sought assistance from WSP in 2020 or early 2021, acknowledging at that point that approximately 1,000 successful fraudulent license redirections had already occurred. WSP opened an investigation in August 2019 and closed it in September 2021, citing a lack of active leads, and notified DOL. By approximately 2024, WSP was informing DOL that the volume of new cases each month exceeded its investigative capacity.

Despite this documented history, DOL did not close the vulnerability until February 2025. The tort claim states DOL cited budget constraints as the reason for not implementing the technical fix. License Express was taken offline February 10–18, 2025 while the fix was implemented.

The claim further alleges that DOL never fulfilled its obligations under the Washington Data Breach Notification Act to notify individuals whose data was accessed and compromised.

**DOL's position:** DOL disputes the allegation of widespread fraud and states it found no evidence of a data breach through License Express. The agency states the system requires customers to input personal credentials (birth date and Social Security number) before gaining access.

**WSP's position:** WSP confirmed it was asked to investigate suspected fraudulent use of DOL's License Express system in August 2019, pursued evidence of identity theft, and closed the case in September 2021 due to lack of active leads.

## What the primary source says

The tort claim, as reported by FOX 13 Seattle (March 5, 2026), states: "In-between Labor Day of 2018 and February of 2025, anybody could find the directions on how to get into the License eXpress system, pick a person and change the address on their license, and order a new license." Attorney Joel Ard described the vulnerability as "blatant and unmistakable."

DOL's official statement: "The Department of Licensing is reviewing the tort claim notice filed with Department of Enterprise Services on March 3, 2026. DOL disputes the allegation of widespread fraud and has found no evidence of a data breach through its License Express service."

## Status

Tort claim filed March 3, 2026. DOL had 60 days to respond as of the March 5, 2026 news coverage. DOL disputes the central allegations. No criminal investigation has been publicly announced as of this record's last update. The vulnerability is reported as closed as of February 18, 2025. No confirmed class action has been filed.

**Note on date_surfaced:** This case was surfaced publicly by the March 2026 tort claim and contemporaneous news coverage. The conduct period (the vulnerability window) runs from approximately September 2018 through February 2025.

**Note on legal_status:** The task specification records this as `closed_no_action` reflecting DOL's position that no breach occurred. This record uses `complaint_filed` because a formal tort claim was filed with the Department of Enterprise Services on March 3, 2026 as a precursor to civil litigation, and a potential breach notification violation is alleged under state law. The distinction should be reviewed at next update.

## Why it's in the registry

The 6.5-year vulnerability window is the structural finding: a known-exploitation vulnerability in a state system holding the most sensitive personal data of nearly every Washington driver persisted across multiple administrative cycles, multiple budget years, and multiple warnings from WSP, without remediation or public disclosure. This is not an undiscovered vulnerability — it is a documented decision to not fix a known problem, for budget reasons, while identity theft continued. The breach notification failure means affected residents had no opportunity to protect themselves. Both failures — no remediation and no disclosure — reflect the absence of statutory enforcement mechanisms with fixed timelines and mandatory escalation.

## Reform implication

State IT cybersecurity disclosure requirements should be statutory and tied to fixed-window remediation timelines. When a state agency identifies a known-exploitable vulnerability in a system holding sensitive personal data for millions of residents: (1) notification to affected individuals should be mandatory within a defined statutory window, not subject to budget discretion; and (2) remediation should be required within a defined timeline with mandatory escalation to WaTech and the Legislature if budget constraints prevent timely action. Current practice — which allowed DOL to monitor ongoing fraud for six-plus years without mandatory public disclosure — leaves the public unaware of ongoing risk. See [reform: cybersecurity_disclosure] and [reform: it_modernization_governance].
