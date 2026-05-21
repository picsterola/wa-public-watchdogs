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

## What happened

The Washington State Auditor's Office released its 2025 Single Audit on March 30, 2026, which included a review of DCYF's child care payment system. The audit identified $37 million in "questioned payments" extrapolated from a sample: auditors reviewed 59 monthly payments out of approximately 400,000 and found 14 with noncompliance or overpayment totaling $6,123 in the sample. The $37 million figure is a statistical extrapolation from that sample to the full payment population — it is not a confirmed loss total.

## What the primary source says

The State Auditor's Office explicitly stated in the 2025 Single Audit that it "did not conclude that fraud occurred." The causes identified were operational: providers not responding to attendance-record requests, alleged overbilling for services not reflected in attendance records, and missing parent and guardian signatures. DCYF responded that federal audits have not identified misuse of funds and that the $37 million is the SAO's extrapolation, not confirmed fraud. The SAO had been unable to audit the Child Care Development Fund since FY2021 due to DCYF accounting issues; this was the first full audit in four years.

## Status

Audit findings are public as of March 30, 2026. DCYF has disputed the characterization of the $37 million figure as confirmed misuse. No criminal investigation has been opened.

## Why it's in the registry

This is a documented SAO audit finding of structural compliance failure in DCYF's child care payment system. It is included not as a fraud allegation — the SAO explicitly found none — but because the failure to maintain auditable records, the four-year gap in federal audit coverage, and the structural inadequacy of the payment verification system constitute a documented accountability failure in a program handling federal child care funds.

## Reform implication

The SAO's inability to audit the Child Care Development Fund for four years is the central structural concern. A system requiring real-time reconciliation of provider attendance records against payment records, combined with mandatory federal-audit readiness certification, would prevent the conditions that generated both the payment irregularities and the four-year audit gap. See [reform: subrecipient_monitoring] and [reform: program_outcome_auditing].
