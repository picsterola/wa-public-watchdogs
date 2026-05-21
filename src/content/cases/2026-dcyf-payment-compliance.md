---
# === IDENTITY ===
id: WA-2026-DCYF
title: "DCYF child care payment system — SAO flags $37M in questioned payments, cites structural compliance failure"
slug: dcyf-payment-compliance
date_surfaced: 2026-03-30
date_conduct_start: 2021-01-01
date_conduct_end: null
last_updated: 2026-05-28
last_verified: 2026-05-20

# === ACTORS ===
actors:
  - name: Washington State Department of Children, Youth, and Families
    role_type: agency
    title: null
    party: null
    jurisdiction: Washington State

# === CLASSIFICATION ===
evidentiary_status: documented
severity_type:
  - structural_failure
reforms_implicated:
  - subrecipient_monitoring
  - program_outcome_auditing
  - independent_inspector_general

# === SCALE ===
dollars_at_issue: 37000000
dollars_basis: "$37M is a sample-extrapolated questioned-payments figure from the SAO 2025 Single Audit. The figure extrapolates from 14 noncompliant payments out of a 59-payment sample drawn from approximately 400,000 monthly payments. This is not confirmed loss; the SAO explicitly stated it did not conclude that fraud occurred. Confirmed overpayment in the sample: $6,123."
dollars_confirmed_loss: 6123

# === STATUS ===
legal_status: audit_finding
outcome_summary: null

# === SOURCES ===
sources:
  - tier: 1
    type: sao_report
    title: "Washington State Auditor 2025 Single Audit — DCYF child care payment system findings"
    publisher: Washington State Auditor's Office
    date: 2026-03-30
    archive_url: null
    quote: "did not conclude that fraud occurred"
  - tier: 2
    type: news
    title: "Washington audit finds weaknesses in DCYF payment system"
    publisher: The Olympian
    author: null
    date: 2026-03-31
    url: https://www.theolympian.com/news/local/article315250417.html
    archive_url: null
  - tier: 2
    type: news
    title: "Washington spending audit finds improvements, flags weak oversight of child care payments"
    publisher: KOMO News
    author: null
    date: 2026-03-31
    url: https://komonews.com/news/local/washington-spending-audit-finds-improvements-flags-weak-oversight-of-child-care-payments-dcyf-childcare-day-care-daycare-fraud-taxpayer-funding-program-children-waste-watch-investigation-federal-legal-lawsuit-minnesota-social-media
    archive_url: null

# === REFORM LINKAGE ===
reform_argument: |
  The SAO had been unable to conduct a federal audit of DCYF's Child Care
  Development Fund since FY2021 due to DCYF accounting issues; the 2026 audit
  was the first full review in four years. The structural failure is not fraud —
  the SAO explicitly said it did not conclude fraud occurred — but rather a
  monitoring and record-keeping system that could not detect or prevent payment
  irregularities at scale. A provider attendance-record system with automated
  reconciliation, alongside mandatory federal-audit readiness reporting, would
  address the root cause.

# === GOVERNANCE METADATA ===
review_status: published
retraction_note: null
contributor: vn
tags:
  - dcyf
  - child_care
  - audit_finding
  - compliance_failure
  - federal_funds
---

**The Washington State Auditor's Office flagged $37 million in questionable child care payments by the Department of Children, Youth, and Families (DCYF) — but said no fraud was found; rather, the state's system for verifying payments was so weak that it hadn't been fully audited in four years.**

## What happened

The Washington State Auditor's Office (SAO) released its 2025 Single Audit on March 30, 2026, which included a review of the child care payment system at the Washington State Department of Children, Youth, and Families (DCYF). Auditors reviewed a sample of 59 monthly payments out of approximately 400,000 and found 14 with noncompliance issues or overpayments totaling $6,123 in the actual sample.

Extrapolating from that sample to the full payment pool produced the headline figure: **$37 million in "questioned payments."** That number is a statistical projection — not a confirmed loss.

Importantly, the SAO had been unable to conduct a federal audit of DCYF's Child Care Development Fund since FY2021 due to accounting issues at the agency. The 2026 audit was the first full review in four years.

## What the primary source says

The 2025 Single Audit states explicitly that the SAO "did not conclude that fraud occurred." The problems identified were operational: child care providers not responding to attendance-record requests, alleged overbilling for services not reflected in attendance records, and missing parent and guardian signatures on required forms.

DCYF disputed the $37 million characterization, stating that federal audits have not identified misuse of funds. DCYF's position is that the SAO's extrapolation overstates the actual scope of the problem.

## Status

Audit findings are public as of March 30, 2026. No criminal investigation has been opened. DCYF disputes the scope of the finding. This record reflects the audit as published; no enforcement action has been announced.

## Why it's in the registry

This case is not about fraud — the auditor explicitly said fraud was not found. It is about the structural conditions that make fraud undetectable: a payment verification system weak enough that auditors could not fully review it for four consecutive years, and a sampling gap large enough that problems in the remaining 99.9% of payments would not be caught in the ordinary course. That is the accountability failure.

## Reform implication

The four-year gap in federal audit coverage is the central concern. A system requiring real-time matching of provider attendance records against payment records — rather than after-the-fact sampling — combined with mandatory federal-audit readiness certification, would prevent both the payment irregularities and the multi-year oversight gap. See [reform: subrecipient_monitoring] and [reform: program_outcome_auditing].
