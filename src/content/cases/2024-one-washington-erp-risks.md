---
# === IDENTITY ===
id: WA-2024-ONE-WASHINGTON
title: "One Washington ERP — SAO finds $465M+ statewide financial system project lacks contingency plan, schedule risks ahead of July 2025 launch"
slug: one-washington-erp-risks
date_surfaced: 2024-08-01
date_conduct_start: 2018-01-01
last_updated: 2024-08-22
last_verified: 2024-08-22

# === ACTORS ===
actors:
  - name: Washington State Office of Financial Management
    role_type: agency
    title: null
    party: null
    jurisdiction: Washington State
  - name: WaTech (Washington Technology Solutions)
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
  - independent_inspector_general

# === SCALE ===
dollars_at_issue: 465000000
dollars_basis: "$465M is the project cost estimate cited in the SAO performance audit. Project scope: consolidation of Washington State's core financial management, budgeting, and procurement systems into a single ERP platform (Workday) with a target go-live of July 1, 2025. No confirmed loss has been published; the audit identified risk exposure, not realized failure. The audit covered the financial management module only; the full project including HR, payroll, and procurement is part of the larger $465M program."
dollars_confirmed_loss: null

# === STATUS ===
legal_status: audit_finding
outcome_summary: "SAO performance audit published August 2024 found the One Washington ERP project — replacing Washington State's decades-old core financial management system (AFRS) with Workday — lacked a documented contingency plan as of July 2024, with the July 1, 2025 go-live 11 months away. Schedule delays had compressed time for critical testing and end-user training. One Washington disputed the framing, noting contingency planning work was scheduled to begin August 2024 after the audit period. The July 2025 go-live proceeded. Post-launch outcome status is open for follow-up."

# === SOURCES ===
sources:
  - tier: 1
    type: sao_report
    title: "One Washington: Opportunities to Strengthen Plans for Producing Reliable Financial Statements (Performance Audit)"
    publisher: Office of the Washington State Auditor
    date: 2024-08-01
    url: https://portal.sao.wa.gov/ReportSearch/
    archive_url: null
  - tier: 2
    type: news
    title: "Audit — WA State Computer Upgrade Behind Schedule, No Backup Plan"
    publisher: NEWStalk 870 (via The Center Square)
    date: 2024-08-22
    url: https://newstalk870.am/audit-wa-state-computer-upgrade-behind-schedule-no-backup-plan/
    archive_url: null

# === REFORM LINKAGE ===
reform_argument: |
  The One Washington audit is the state-level analog of the L&I workers'
  comp IT modernization case already in this registry. Both reflect the same
  structural pattern: large IT projects with budgets in the hundreds of
  millions, complex multi-agency dependencies, and risk governance that is
  managed internally by the executive branch without independent oversight
  until an audit surfaces the gaps. In the One Washington case, the core
  finding was not that the project was failing — it was that the executive
  branch had not documented what it would do if it failed, and that schedule
  compression had put training and testing at the end of the timeline when
  year-end accounting pressure would be highest. The SAO recommended three
  things: accessible project resources, documented contingency plans, and
  clear go/no-go decision criteria before launch. None of these is a
  technical fix — they are governance fixes. The reform argument is that
  projects of this scale require an independent IT project oversight
  function that is not embedded in the same executive branch that owns the
  project. An independent inspector general or dedicated IT oversight office
  reporting to the Legislature would have surfaced the contingency planning
  gap 18 months before launch rather than 11 months before, and would
  maintain public accountability for post-launch performance — which the
  SAO audit explicitly does not cover.
  See [reform: it_modernization_governance] and
  [reform: independent_inspector_general].

# === GOVERNANCE METADATA ===
review_status: draft
retraction_note: null
contributor: vn
tags:
  - ofm
  - watech
  - erp
  - one_washington
  - it_modernization
  - sao_audit
  - structural_failure
---

**A Washington State Auditor performance audit published August 2024 found that the One Washington ERP project — Washington's largest IT modernization effort, replacing decades-old core financial systems at a projected cost of $465 million — lacked a documented contingency plan as of July 2024, with schedule delays compressing time for testing and training ahead of the planned July 1, 2025 go-live.**

## What happened

Washington State's core financial management system, known as AFRS (Agency Financial Reporting System), was built on 1960s-era technology. Governor Inslee requested funding for replacement in 2013. The state created the One Washington program within the Office of Financial Management to oversee the replacement of AFRS and related administrative services. Washington selected Workday — a cloud-based enterprise resource planning (ERP) system — as the platform.

The total projected cost for the full program (covering financial management, procurement, HR, payroll, and other functions) is $465 million. The SAO audit focused specifically on the financial management module, which was scheduled to go live July 1, 2025. The audit covered the period November 2023 through July 2024 — approximately 11 to 20 months before the planned launch.

The SAO published the performance audit in August 2024 with the title "One Washington: Opportunities to Strengthen Plans for Producing Reliable Financial Statements." Key findings:

**No documented contingency plan.** As of July 2024, One Washington did not have a documented contingency plan for what would happen if the July 2025 launch encountered significant problems. Program leadership described two options under consideration — reverting to AFRS or launching Workday despite problems and fixing them post-launch — but neither had been formalized into a documented plan with defined trigger criteria. The SAO identified this as a material risk to the state's ability to produce accurate financial statements.

**Schedule delays and training compression.** Delays in system design compressed the schedule for critical testing and end-user training. Training was scheduled at year-end, when state accounting staff are busiest with reconciliation and close activities. The quality assurance contractor identified that important activities were not being completed by their deadlines. One Washington's own QA contractor flagged turnover in the change management director position as a risk to agency readiness.

**Agency communication restricted.** State agencies told the SAO that access to key project information had been restricted or not provided in a timely manner, limiting their ability to prepare for the transition.

**OFM financial statement risk.** The audit was framed around a specific risk: if the Workday implementation produced errors or failed to generate reliable financial data, OFM — which is responsible for Washington's Annual Comprehensive Financial Report (ACFR) — would be unable to produce accurate financial statements. Credit rating agencies and state decision-makers depend on these statements.

The SAO recommended One Washington: (1) ensure project resources are accessible to state agencies; (2) produce actionable contingency plans; and (3) establish clear go/no-go decision criteria before the launch date.

One Washington disputed portions of the framing in public JLARC testimony, stating that contingency planning work was scheduled to begin in August 2024 (after the audit period) and that the audit did not engage with their ERP experts or oversight bodies. One Washington noted the launch date remained July 1, 2025.

## What the primary source says

The SAO presentation to JLARC (September 2024) stated: "Success of the project to replace the core financial system is threatened by schedule delays and a lack of documented contingency plans should significant issues arise." The auditors stated directly: "As of July 2024, one Washington did not have a documented contingency plan."

[NEWStalk 870 / Center Square coverage](https://newstalk870.am/audit-wa-state-computer-upgrade-behind-schedule-no-backup-plan/) reported: "The report found: One Washington and OFM have not yet finalized contingency plans for project failure or severe complications. Until One Washington finalizes its contingency plans and its criteria for making a go/no-go decision, this area remains a project risk that could affect the state's financial reporting accuracy."

## Status

The July 2025 go-live proceeded. This case documents the pre-launch SAO risk findings. The post-launch outcome — whether Workday produced reliable financial statements for fiscal year 2025, whether contingency plans were invoked, and whether the ACFR was issued on time — is open for follow-up and is not covered by this audit. No loss or failure has been confirmed; the audit identified risk exposure, not realized harm.

## Why it's in the registry

This case is the WA state-level analog to the L&I workers' comp IT modernization case already in the registry. Both are large executive-branch IT projects where the SAO identified governance risks before launch: insufficient contingency planning, schedule compression, and inadequate readiness documentation. The structural pattern is consistent: Washington undertakes IT projects in the hundreds of millions of dollars, manages risk internally within the executive branch, and receives independent audit scrutiny only through SAO performance audits that are inherently retrospective or, in this case, prospective but outside the executive's control. The case is in the registry as a documented instance of the state pattern — not as a confirmed failure.

## Reform implication

The SAO's Three recommendations are governance recommendations, not technical ones: document your contingency plan, set go/no-go criteria, make information accessible to agencies. That these were not in place 11 months before a $465 million system go-live illustrates the structural gap: the executive branch manages IT project risk internally, without an independent oversight function reporting to the Legislature. An independent IT project inspector general — or a dedicated JLARC IT oversight function with standing authority to review major projects quarterly — would have surfaced the contingency planning gap earlier and maintained public accountability for post-launch performance. See [reform: it_modernization_governance] and [reform: independent_inspector_general].
