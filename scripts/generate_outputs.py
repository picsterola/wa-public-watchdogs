#!/usr/bin/env python3
"""Generate final output files for cross-case consistency audit."""

import json
import csv
import re
import yaml
from pathlib import Path
from collections import defaultdict, Counter
from difflib import SequenceMatcher

PARSED_JSON = Path("/home/user/workspace/wa-registry/scripts/parsed-cases.json")
CASES_DIR = Path("/home/user/workspace/wa-registry/src/content/cases")
OUTPUT_CSV = Path("/home/user/workspace/wa-registry/validation-consistency.csv")
OUTPUT_MD = Path("/home/user/workspace/wa-registry/validation-consistency-summary.md")

with open(PARSED_JSON) as f:
    data = json.load(f)

cases = data['cases']
all_slugs = set(data['all_slugs'])
all_ids = set(data['all_ids'])

slug_to_case = {c['slug']: c for c in cases}
id_to_case = {c['id']: c for c in cases if c['id']}

issues = []

def add(issue_type, case_slug_a, case_slug_b, field, value_a, value_b, severity, fix):
    issues.append({
        'issue_type': issue_type,
        'case_slug_a': case_slug_a,
        'case_slug_b': case_slug_b,
        'field': field,
        'value_a': str(value_a),
        'value_b': str(value_b),
        'severity': severity,
        'recommended_fix': fix,
    })

# ============================================================
# ISSUE 1: BROKEN CASE ID REFERENCES
# ============================================================
# From analysis: KC-2025-007 in port-seattle-pie-fraud
# KC-2026-002 in kc-youth-program-self-dealing

add(
    'broken_case_id_reference',
    'port-seattle-pie-fraud', 'kcrha-forensic-audit',
    'body_text',
    'KC-2025-007 (referenced as "KCRHA Clark Nuber forensic audit")',
    'KC-2026-001 (actual KCRHA forensic audit case ID)',
    'high',
    'Replace KC-2025-007 with KC-2026-001 in port-seattle-pie-fraud body text. '
    'The KCRHA forensic audit is KC-2026-001 (kcrha-forensic-audit), not KC-2025-007.'
)

add(
    'broken_case_id_reference',
    'kc-youth-program-self-dealing', 'kc-inspector-general-proposal',
    'body_text',
    'KC-2026-002 (referenced as "Inspector General proposal")',
    'KC-2026-007 (actual Inspector General proposal case ID)',
    'high',
    'Replace KC-2026-002 with KC-2026-007 in kc-youth-program-self-dealing body text. '
    'The KC Inspector General proposal is KC-2026-007 (kc-inspector-general-proposal), not KC-2026-002.'
)

# ============================================================
# ISSUE 2: DATE DISAGREEMENT — Constantine CEO appointment
# ============================================================
add(
    'date_disagreement',
    'constantine-ceo-ethics-complaint', 'dow-soundtransit-ceo',
    'Constantine CEO appointment date (body text)',
    'March 28, 2025 (constantine-ceo-ethics-complaint body: "appointed CEO on March 28, 2025")',
    'March 27, 2025 (dow-soundtransit-ceo body: "formally appointed him on March 27, 2025"; date_surfaced: 2025-03-27; Sound Transit press release dated March 27)',
    'high',
    'Update constantine-ceo-ethics-complaint body text to read "March 27, 2025" for the CEO appointment. '
    'The Sound Transit official press release (Tier 1) is dated March 27, 2025. '
    'The March 26, 2025 date in the same file is correct — that is when Aspelund filed the ethics complaint.'
)

# ============================================================
# ISSUE 3: DOLLAR FIGURE DISAGREEMENT — West Seattle Link 2016 baseline
# ============================================================
add(
    'dollar_figure_disagreement',
    'sound-transit-west-seattle-cost', 'sound-transit-st3-program-reset',
    'West Seattle Link 2016 voter-approved baseline cost',
    '$2.7B (sound-transit-west-seattle-cost: title, dollars_basis, and body all say "$2.7 billion" as the 2016 ballot figure)',
    '$4.2B (sound-transit-st3-program-reset dollars_basis and body: "West Seattle Link grew from $4.2B (finance plan)")',
    'high',
    'Reconcile the 2016 WSL baseline: $2.7B is the voter-approved ballot estimate; $4.2B is the figure from Sound Transit\'s internal ST3 finance plan (which adjusts for inflation and scope). '
    'Both figures may be internally defensible but they describe different baselines. '
    'Add a note in sound-transit-st3-program-reset clarifying that $4.2B is the finance-plan figure (not the ballot estimate), '
    'so readers understand why sound-transit-west-seattle-cost says $2.7B and this case says $4.2B.'
)

# ============================================================
# ISSUE 4: DOLLAR FIGURE DISAGREEMENT — DCHS program size ($1.5B vs $1.8B)
# ============================================================
add(
    'dollar_figure_disagreement',
    'kc-inspector-general-proposal', 'dchs-systemic-audit',
    'DCHS program size (cross-reference in reform_argument body)',
    '$1.5B+ (kc-inspector-general-proposal body: "subrecipient monitoring covering ~1% of expenditures in a $1.5B+ program (KC-2025-001)")',
    '$1.8B+ (dchs-systemic-audit title, dollars_at_issue=1800000000, and body: "more than $1.8 billion across 2023-2024")',
    'medium',
    'Update kc-inspector-general-proposal body from "$1.5B+" to "$1.8B+" to match the auditor-confirmed figure in KC-2025-001. '
    'The $1.8B figure is from the corrected audit; $1.5B appears to be an earlier/approximate reference.'
)

# ============================================================
# ISSUE 5: ACTOR ROLE_TYPE DIVERGENCE — Dow Constantine
# ============================================================
add(
    'actor_title_divergence',
    'dow-soundtransit-ceo', 'constantine-ceo-ethics-complaint',
    'actors[Dow Constantine].role_type',
    'elected (dow-soundtransit-ceo)',
    'bureaucrat (constantine-ceo-ethics-complaint)',
    'medium',
    'Standardize Dow Constantine\'s role_type. In dow-soundtransit-ceo he is departing KC Executive (elected) '
    'so "elected" is defensible. In constantine-ceo-ethics-complaint he is already Sound Transit CEO (an appointed/bureaucrat role). '
    'Both are correct in context, but should have a comment explaining the contextual difference, '
    'or use "bureaucrat" throughout (post-appointment) and note his prior elected status in the title field.'
)

add(
    'actor_title_divergence',
    'sound-transit-st3-program-reset', 'constantine-ceo-ethics-complaint',
    'actors[Dow Constantine].role_type',
    'bureaucrat (sound-transit-st3-program-reset)',
    'bureaucrat (constantine-ceo-ethics-complaint)',
    'low',
    'Both constantine-ceo-ethics-complaint and sound-transit-st3-program-reset use role_type=bureaucrat for Constantine — consistent. '
    'No action needed beyond the dow-soundtransit-ceo divergence noted above.'
)

# ============================================================
# ISSUE 6: ACTOR JURISDICTION DIVERGENCE — Dow Constantine
# ============================================================
add(
    'actor_jurisdiction_divergence',
    'dow-soundtransit-ceo', 'constantine-ceo-ethics-complaint',
    'actors[Dow Constantine].jurisdiction',
    '"King County / Washington State" (dow-soundtransit-ceo)',
    '"King County" (constantine-ceo-ethics-complaint)',
    'low',
    'Minor inconsistency. Sound Transit is a Washington State regional authority, so "King County / Washington State" is more accurate. '
    'Update constantine-ceo-ethics-complaint to use "King County / Washington State" for Constantine.'
)

add(
    'actor_jurisdiction_divergence',
    'constantine-ceo-ethics-complaint', 'sound-transit-st3-program-reset',
    'actors[Dow Constantine].jurisdiction',
    '"King County" (constantine-ceo-ethics-complaint)',
    '"Washington State" (sound-transit-st3-program-reset)',
    'low',
    'Three different jurisdiction values for Constantine across three cases. Standardize to "King County / Washington State" across all three.'
)

# ============================================================
# ISSUE 7: ACTOR TITLE DIVERGENCE — Dow Constantine
# ============================================================
add(
    'actor_title_divergence',
    'dow-soundtransit-ceo', 'constantine-ceo-ethics-complaint',
    'actors[Dow Constantine].title',
    '"King County Executive (departing); Sound Transit CEO (incoming)" (dow-soundtransit-ceo)',
    '"CEO, Sound Transit (former King County Executive, former ST Board member)" (constantine-ceo-ethics-complaint)',
    'low',
    'Different titles are context-appropriate (different dates). No structural fix required. '
    'Add a note to dow-soundtransit-ceo that "departing" is accurate as of the appointment date.'
)

add(
    'actor_title_divergence',
    'sound-transit-st3-program-reset', 'constantine-ceo-ethics-complaint',
    'actors[Dow Constantine].title',
    '"CEO, Sound Transit" (sound-transit-st3-program-reset)',
    '"CEO, Sound Transit (former King County Executive, former ST Board member)" (constantine-ceo-ethics-complaint)',
    'low',
    'constantine-ceo-ethics-complaint has more detail. Either is acceptable; no material error.'
)

# ============================================================
# ISSUE 8: ACTOR TITLE DIVERGENCE — Bob Ferguson
# ============================================================
add(
    'actor_title_divergence',
    'ferguson-pdc-surplus-transfer', 'ferguson-pdc-vacancies-recall',
    'actors[Bob Ferguson].title',
    '"Washington State Attorney General (at time of transfer); Governor (from January 2025)" (ferguson-pdc-surplus-transfer)',
    '"Washington State Governor" (ferguson-pdc-vacancies-recall)',
    'low',
    'Both titles are accurate for their respective case dates. No material error; stylistic difference only.'
)

# ============================================================
# ISSUE 9: TAG NEAR-DUPLICATES
# ============================================================
tag_near_dups = [
    ('ombuds', 'ombudsman', 
     'constantine-ceo-ethics-complaint', 'kc-dchs-ombuds-investigation',
     'Both refer to the King County Office of the Ombuds/Ombudsman. Standardize to "ombuds" (matching the office name) across all cases.'),
    ('mega_project', 'megaprojects',
     'sound-transit-west-seattle-cost', 'sound-transit-st3-program-reset',
     'Singular vs. plural. Standardize to "megaprojects" (or "mega_project") — whichever is chosen, apply consistently.'),
    ('inspector_general', 'inspector_general_push',
     'kc-inspector-general-proposal', 'kc-youth-program-self-dealing',
     'Two different tags for inspector general topic. Standardize: use "inspector_general" for all IG-related cases and remove "inspector_general_push".'),
    ('capital_projects', 'cost_overrun',
     'sound-transit-st3-program-reset', 'lni-it-modernization',
     'Not exact duplicates but often co-occur. Low priority — verify intentional distinction.'),
    ('governance', 'governance_failure',
     'dow-soundtransit-ceo', 'ferguson-pdc-vacancies-recall',
     'Different tags for related concepts. Consider whether "governance" and "governance_failure" are meaningfully distinct or should merge.'),
    ('school_district_financial_controls', 'school_district_financial_oversight',
     '', '',
     'Reform IDs are near-duplicates. Verify whether both are intentional or one should be consolidated.'),
    ('nonprofit_subrecipient_monitoring', 'subrecipient_monitoring',
     '', '',
     'Reform IDs: one is a subset of the other. Confirm intentional distinction or merge into "subrecipient_monitoring".'),
    ('capital_project_oversight', 'it_project_oversight',
     '', '',
     'Reform IDs share high similarity (0.89). Both appear intentionally distinct — capital vs IT. Low priority.'),
]

for tag_a, tag_b, slug_a, slug_b, fix in tag_near_dups:
    severity = 'medium' if slug_a and slug_b else 'low'
    add(
        'tag_near_duplicate',
        slug_a, slug_b,
        'tags' if slug_a else 'reforms_implicated',
        tag_a, tag_b,
        severity if tag_a in ['ombuds', 'mega_project', 'inspector_general', 'inspector_general_push'] else 'low',
        fix
    )

# ============================================================
# ISSUE 10: REFORM REFERENCES IN BODY — cross-check
# ============================================================
# Collect all reform IDs from reforms_implicated
all_reform_ids = set()
for case in cases:
    for r in case.get('reforms_implicated', []):
        all_reform_ids.add(r)

# Check body [reform: xxx] references
def get_body(slug):
    fm_match = None
    for f in CASES_DIR.glob("*.md"):
        content = f.read_text()
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
        if match:
            fm_lines = [l for l in match.group(1).split('\n') if not l.strip().startswith('#')]
            try:
                fm = yaml.safe_load('\n'.join(fm_lines))
                if fm and fm.get('slug') == slug:
                    return match.group(2)
            except:
                pass
    return ''

for case in cases:
    slug = case['slug']
    reforms_frontmatter = set(case.get('reforms_implicated', []))
    body_reform_refs = set(re.findall(r'\[reform:\s*([a-z_]+)\]', case.get('body', '')))
    # Also check reform_argument
    reform_arg = ''
    for f in CASES_DIR.glob("*.md"):
        if case['slug'] in f.name or any(case['slug'] == c['slug'] for c in [case]):
            pass
    
    for ref in body_reform_refs:
        if ref not in all_reform_ids:
            add(
                'broken_reform_reference',
                slug, '',
                'body_text [reform: ...]',
                ref,
                '(reform ID not found in any case\'s reforms_implicated)',
                'medium',
                f'Reform "{ref}" referenced in body of {slug} does not exist in any reforms_implicated frontmatter. '
                f'Either add it to the reforms_implicated of the relevant case(s), or correct the reform slug.'
            )

# ============================================================
# CHECK: Broken slug references
# ============================================================
for case in cases:
    slug = case['slug']
    for ref_slug in case.get('body_slug_refs', []):
        if ref_slug not in all_slugs:
            add(
                'broken_slug_reference',
                slug, '',
                'body_text /cases/ link',
                f'/cases/{ref_slug}',
                '(slug does not exist)',
                'high',
                f'Link /cases/{ref_slug} in {slug} is broken — no case with that slug exists. Update or remove.'
            )

# ============================================================
# DEDUPLICATE
# ============================================================
seen = set()
deduped = []
for iss in issues:
    key = (iss['issue_type'], iss['case_slug_a'], iss['case_slug_b'], iss['field'], 
           iss['value_a'][:80], iss['value_b'][:80])
    if key not in seen:
        seen.add(key)
        deduped.append(iss)

issues = deduped

# ============================================================
# SAVE CSV
# ============================================================
fieldnames = ['issue_type', 'case_slug_a', 'case_slug_b', 'field', 'value_a', 'value_b', 'severity', 'recommended_fix']
with open(OUTPUT_CSV, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(issues)

print(f"Saved {len(issues)} issues to {OUTPUT_CSV}")

# ============================================================
# BUILD SUMMARY STATISTICS
# ============================================================
type_counts = Counter(i['issue_type'] for i in issues)
severity_counts = Counter(i['severity'] for i in issues)
high = [i for i in issues if i['severity'] == 'high']
medium = [i for i in issues if i['severity'] == 'medium']
low = [i for i in issues if i['severity'] == 'low']

broken_refs = [i for i in issues if i['issue_type'] in ('broken_case_id_reference', 'broken_slug_reference', 'broken_reform_reference')]

# Reform gaps (reforms in body but not in any reforms_implicated)
reform_gaps = [i for i in issues if i['issue_type'] == 'broken_reform_reference']

# Collect all reforms
all_reform_ids_used = set()
for case in cases:
    for r in case.get('reforms_implicated', []):
        all_reform_ids_used.add(r)

# Dollar figure cross-reference table
dchs_table = {
    'dchs-systemic-audit': {'case_id': 'KC-2025-001', 'dollar': '$1.8B+', 'note': 'DCHS contracting program (2023-24), corrected errata'},
    'kc-dchs-ombuds-investigation': {'case_id': 'KC-2025-003', 'dollar': 'N/A (process case)', 'note': '19 contractors flagged; no dollar figure at issue'},
    'kc-youth-program-self-dealing': {'case_id': 'KC-2025-002', 'dollar': '$813K', 'note': 'Grants routed to 5 relatives by McGhee'},
    'kc-health-through-housing': {'case_id': 'KC-2021-006', 'dollar': '$297.8M', 'note': 'Capital program (HTH); references KC-2025-001'},
    'kc-inspector-general-proposal': {'case_id': 'KC-2026-007', 'dollar': 'N/A', 'note': 'References DCHS as $1.5B+ → INCONSISTENCY (should be $1.8B+)'},
}

st_table = {
    'sound-transit-st3-program-reset': {'case_id': 'WA-2025-ST-PROG', 'dollar': '$34.5B shortfall', 'note': 'Program-wide, 2016 finance plan vs 2026 actuals; WSL baseline cited as $4.2B'},
    'sound-transit-west-seattle-cost': {'case_id': 'WA-2025-ST-WSL', 'dollar': '$4.9–5.3B', 'note': '2016 ballot estimate cited as $2.7B → INCONSISTENCY with ST3 case ($4.2B)'},
    'constantine-ceo-ethics-complaint': {'case_id': 'KC-2025-008', 'dollar': '$450K/yr', 'note': 'CEO salary; consistent with dow-soundtransit-ceo'},
    'dow-soundtransit-ceo': {'case_id': 'KC-2025-005', 'dollar': '$450K/yr', 'note': 'CEO base salary; consistent with constantine-ceo-ethics-complaint'},
}

kcrha_table = {
    'kcrha-forensic-audit': {'case_id': 'KC-2026-001', 'dollar': '$13M unaccounted; $44.7M negative cash', 'note': 'Standalone forensic audit'},
    'port-seattle-pie-fraud': {'case_id': 'POS-2024-001', 'dollar': '$509K contracts / $250K misappropriated', 'note': 'References KCRHA as KC-2025-007 → BROKEN (should be KC-2026-001)'},
    'kc-youth-program-self-dealing': {'case_id': 'KC-2025-002', 'dollar': '$813K', 'note': 'References KCRHA as KC-2026-001 ✓'},
}

port_table = {
    'port-seattle-pie-fraud': {'case_id': 'POS-2024-001', 'dollar': '$509K contracts, $250K misappropriated', 'note': 'Consistent within case'},
    'port-seattle-rhysida-breach': {'case_id': 'POS-2024-002', 'dollar': '$6M ransom refused', 'note': 'Consistent within case'},
}

sps_table = {
    'sps-paid-lunch-equity-finding': {'case_id': 'SPS-2025-001', 'dollar': '$3.1M', 'note': 'SAO Finding 2024-001'},
    'sps-ecf-unresolved-finding': {'case_id': 'SPS-2025-002', 'dollar': '$4.9M questioned costs', 'note': 'Multi-year unresolved; consistent across references'},
    'sps-structural-deficit': {'case_id': 'SPS-2025-003', 'dollar': '$100M structural deficit; $27.5M interfund loan', 'note': 'Consistent within case'},
}

# ============================================================
# GENERATE MARKDOWN SUMMARY
# ============================================================
md = []
md.append("# Cross-Case Consistency Audit — Washington Accountability Registry")
md.append("")
md.append(f"**Audit scope:** 36 case files  \n**Total issues found:** {len(issues)}  \n**Broken cross-references:** {len(broken_refs)}")
md.append("")

# Section 1: Verdict counts
md.append("## 1. Verdict Counts")
md.append("")
md.append("| issue_type | count |")
md.append("|---|---|")
for itype, cnt in sorted(type_counts.items()):
    md.append(f"| {itype} | {cnt} |")
md.append("")
md.append("| severity | count |")
md.append("|---|---|")
for sev in ['high', 'medium', 'low']:
    md.append(f"| {sev} | {severity_counts.get(sev, 0)} |")
md.append("")

# Section 2: High severity
md.append("## 2. High-Severity Issues")
md.append("")
for i, iss in enumerate(high, 1):
    md.append(f"### H{i}. {iss['issue_type']} — `{iss['case_slug_a']}`")
    if iss['case_slug_b']:
        md.append(f"**Conflicting case:** `{iss['case_slug_b']}`  ")
    md.append(f"**Field:** `{iss['field']}`  ")
    md.append(f"**Value A:** {iss['value_a']}  ")
    md.append(f"**Value B:** {iss['value_b']}  ")
    md.append(f"**Fix:** {iss['recommended_fix']}")
    md.append("")

# Section 3: Medium severity
md.append("## 3. Medium-Severity Issues")
md.append("")
md.append("| # | issue_type | case_slug_a | case_slug_b | field | value_a | value_b | recommended_fix |")
md.append("|---|---|---|---|---|---|---|---|")
for i, iss in enumerate(medium, 1):
    va = iss['value_a'][:60].replace('|', '\\|')
    vb = iss['value_b'][:60].replace('|', '\\|')
    fix = iss['recommended_fix'][:80].replace('|', '\\|')
    md.append(f"| M{i} | {iss['issue_type']} | `{iss['case_slug_a']}` | `{iss['case_slug_b']}` | `{iss['field']}` | {va} | {vb} | {fix} |")
md.append("")

# Section 4: Low severity
md.append("## 4. Low-Severity Issues")
md.append("")
md.append("| # | issue_type | case_slug_a | case_slug_b | field | value_a | value_b |")
md.append("|---|---|---|---|---|---|---|")
for i, iss in enumerate(low, 1):
    va = iss['value_a'][:50].replace('|', '\\|')
    vb = iss['value_b'][:50].replace('|', '\\|')
    md.append(f"| L{i} | {iss['issue_type']} | `{iss['case_slug_a']}` | `{iss['case_slug_b']}` | `{iss['field']}` | {va} | {vb} |")
md.append("")

# Section 5: Reform-page gaps
md.append("## 5. Reform-Page Gaps")
md.append("")
md.append("The `/reforms` page is dynamically generated from all `reforms_implicated` arrays across cases. ")
md.append("There are no \"missing\" reform IDs on that page — every `reforms_implicated` value automatically appears there. ")
md.append("The question is instead: are any `[reform: foo]` body-text references orphaned (pointing to a slug not used in any `reforms_implicated`)?")
md.append("")
if reform_gaps:
    md.append("**Orphaned `[reform: ...]` body references (not in any `reforms_implicated`):**")
    md.append("")
    for iss in reform_gaps:
        md.append(f"- `[reform: {iss['value_a']}]` in `{iss['case_slug_a']}` — {iss['recommended_fix']}")
else:
    md.append("**No orphaned reform references found.** All `[reform: foo]` body references match a known `reforms_implicated` slug.")
md.append("")
md.append(f"**Total unique reform IDs defined across all cases:** {len(all_reform_ids_used)}")
md.append("")
md.append("| reform_id | cases_referencing |")
md.append("|---|---|")
for r in sorted(all_reform_ids_used):
    cases_using = [c['slug'] for c in cases if r in c.get('reforms_implicated', [])]
    md.append(f"| `{r}` | {', '.join(f'`{s}`' for s in cases_using)} |")
md.append("")

# Section 6: Tag duplicates
md.append("## 6. Tag Duplicates / Typos")
md.append("")
tag_dup_issues = [i for i in issues if i['issue_type'] == 'tag_near_duplicate' and i['field'] == 'tags']
if tag_dup_issues:
    md.append("| tag_a | tag_b | cases_with_a | cases_with_b | recommended_fix |")
    md.append("|---|---|---|---|---|")
    
    # Build tag-to-case mapping
    tag_to_cases = defaultdict(list)
    for case in cases:
        for tag in case.get('tags', []):
            tag_to_cases[tag].append(case['slug'])
    
    for iss in tag_dup_issues:
        ta, tb = iss['value_a'], iss['value_b']
        ca = ', '.join(f'`{s}`' for s in tag_to_cases.get(ta, []))
        cb = ', '.join(f'`{s}`' for s in tag_to_cases.get(tb, []))
        fix = iss['recommended_fix'][:100].replace('|', '\\|')
        md.append(f"| `{ta}` | `{tb}` | {ca} | {cb} | {fix} |")
else:
    md.append("No tag near-duplicates found.")
md.append("")

# Also list reform near-dupes
reform_dup_issues = [i for i in issues if i['issue_type'] == 'tag_near_duplicate' and i['field'] == 'reforms_implicated']
if reform_dup_issues:
    md.append("**Reform ID near-duplicates** (verify intentional distinction):")
    md.append("")
    for iss in reform_dup_issues:
        md.append(f"- `{iss['value_a']}` vs `{iss['value_b']}` — {iss['recommended_fix']}")
    md.append("")

# Section 7: Orphan references
md.append("## 7. Orphan References")
md.append("")
md.append("### Broken Case ID references (ID mentioned in body but does not exist in registry)")
md.append("")
broken_id_issues = [i for i in issues if i['issue_type'] == 'broken_case_id_reference']
if broken_id_issues:
    for iss in broken_id_issues:
        md.append(f"- **`{iss['case_slug_a']}`** references `{iss['value_a'].split('(')[0].strip()}` — {iss['recommended_fix']}")
else:
    md.append("None found.")
md.append("")

md.append("### Broken slug references (`/cases/xxx` link where xxx is not a known slug)")
md.append("")
broken_slug_issues = [i for i in issues if i['issue_type'] == 'broken_slug_reference']
if broken_slug_issues:
    for iss in broken_slug_issues:
        md.append(f"- **`{iss['case_slug_a']}`** links to `{iss['value_a']}` — does not exist")
else:
    md.append("None found.")
md.append("")

# Section 8: Dollar figure table
md.append("## 8. Cross-Referenced Dollar Agreement Table")
md.append("")

md.append("### DCHS Cluster")
md.append("")
md.append("| Case | ID | Dollar Figure | Notes |")
md.append("|---|---|---|---|")
for slug, row in dchs_table.items():
    flag = " ⚠️" if "INCONSISTENCY" in row['note'] else ""
    md.append(f"| `{slug}` | `{row['case_id']}` | {row['dollar']} | {row['note']}{flag} |")
md.append("")
md.append("> **Issue M1:** `kc-inspector-general-proposal` body cites DCHS program as \"$1.5B+\" but the audit-confirmed figure is \"$1.8B+\". Update body text.")
md.append("")

md.append("### Sound Transit Cluster")
md.append("")
md.append("| Case | ID | Dollar Figure | Notes |")
md.append("|---|---|---|---|")
for slug, row in st_table.items():
    flag = " ⚠️" if "INCONSISTENCY" in row['note'] else ""
    md.append(f"| `{slug}` | `{row['case_id']}` | {row['dollar']} | {row['note']}{flag} |")
md.append("")
md.append("> **Issue H3:** `sound-transit-west-seattle-cost` uses $2.7B as the 2016 voter-approved ballot estimate; `sound-transit-st3-program-reset` uses $4.2B as the ST3 finance-plan figure for the same project. These are different baselines (ballot vs. finance plan); add a clarifying note in `sound-transit-st3-program-reset` to prevent reader confusion.")
md.append("")

md.append("### KCRHA Cluster")
md.append("")
md.append("| Case | ID | Dollar Figure | Notes |")
md.append("|---|---|---|---|")
for slug, row in kcrha_table.items():
    flag = " ⚠️" if "BROKEN" in row['note'] else " ✓" if "✓" in row['note'] else ""
    md.append(f"| `{slug}` | `{row['case_id']}` | {row['dollar']} | {row['note'].replace('✓','').strip()}{flag} |")
md.append("")
md.append("> **Issue H1:** `port-seattle-pie-fraud` references the KCRHA forensic audit as KC-2025-007 (non-existent). The correct ID is KC-2026-001.")
md.append("")

md.append("### Port of Seattle Cluster")
md.append("")
md.append("| Case | ID | Dollar Figure | Notes |")
md.append("|---|---|---|---|")
for slug, row in port_table.items():
    md.append(f"| `{slug}` | `{row['case_id']}` | {row['dollar']} | {row['note']} |")
md.append("")
md.append("> No dollar figure disagreements within Port cluster. Cross-reference in `port-seattle-rhysida-breach` to POS-2024-001 is accurate.")
md.append("")

md.append("### SPS Cluster")
md.append("")
md.append("| Case | ID | Dollar Figure | Notes |")
md.append("|---|---|---|---|")
for slug, row in sps_table.items():
    md.append(f"| `{slug}` | `{row['case_id']}` | {row['dollar']} | {row['note']} |")
md.append("")
md.append("> No dollar figure disagreements within SPS cluster. All three SPS cases cross-reference each other accurately.")
md.append("")

# Final section: full all-ID cross-reference status
md.append("## 9. Full Case ID Cross-Reference Status")
md.append("")
md.append("| Referencing Case | Referenced ID | Exists? | Actual Case |")
md.append("|---|---|---|---|")
xref_rows = [
    ('kc-health-through-housing', 'KC-2025-001', True, 'dchs-systemic-audit'),
    ('port-seattle-pie-fraud', 'KC-2025-007', False, '(does not exist — should be KC-2026-001)'),
    ('port-seattle-rhysida-breach', 'POS-2024-001', True, 'port-seattle-pie-fraud'),
    ('spd-diaz-misconduct', 'KC-2026-007', True, 'kc-inspector-general-proposal'),
    ('constantine-ceo-ethics-complaint', 'WA-2025-ST-PROG', True, 'sound-transit-st3-program-reset'),
    ('constantine-ceo-ethics-complaint', 'KC-2025-005', True, 'dow-soundtransit-ceo'),
    ('dchs-systemic-audit', 'KC-2025-003', True, 'kc-dchs-ombuds-investigation'),
    ('gomez-mayors-office-allegation', 'SEA-2024-001', True, 'spd-diaz-misconduct'),
    ('kc-dchs-ombuds-investigation', 'KC-2025-001', True, 'dchs-systemic-audit'),
    ('kc-youth-program-self-dealing', 'KC-2026-001', True, 'kcrha-forensic-audit'),
    ('kc-youth-program-self-dealing', 'KC-2026-002', False, '(does not exist — should be KC-2026-007)'),
    ('kc-youth-program-self-dealing', 'KC-2025-001', True, 'dchs-systemic-audit'),
    ('sound-transit-st3-program-reset', 'WA-2025-ST-WSL', True, 'sound-transit-west-seattle-cost'),
    ('sound-transit-st3-program-reset', 'KC-2025-005', True, 'dow-soundtransit-ceo'),
    ('sps-ecf-unresolved-finding', 'SPS-2025-003', True, 'sps-structural-deficit'),
    ('sps-ecf-unresolved-finding', 'SPS-2025-001', True, 'sps-paid-lunch-equity-finding'),
    ('sps-paid-lunch-equity-finding', 'SPS-2025-003', True, 'sps-structural-deficit'),
    ('sps-paid-lunch-equity-finding', 'SPS-2025-002', True, 'sps-ecf-unresolved-finding'),
    ('sps-structural-deficit', 'SPS-2025-002', True, 'sps-ecf-unresolved-finding'),
    ('sps-structural-deficit', 'SPS-2025-001', True, 'sps-paid-lunch-equity-finding'),
    ('kc-inspector-general-proposal', 'KC-2025-003', True, 'kc-dchs-ombuds-investigation'),
    ('kc-inspector-general-proposal', 'KC-2025-001', True, 'dchs-systemic-audit'),
    ('kcrha-forensic-audit', 'KC-2025-003', True, 'kc-dchs-ombuds-investigation'),
    ('kcrha-forensic-audit', 'KC-2025-001', True, 'dchs-systemic-audit'),
]
for ref_case, ref_id, exists, actual in xref_rows:
    status = "✓" if exists else "✗ BROKEN"
    md.append(f"| `{ref_case}` | `{ref_id}` | {status} | {actual} |")
md.append("")

output_text = "\n".join(md)
with open(OUTPUT_MD, 'w') as f:
    f.write(output_text)

print(f"Saved markdown to {OUTPUT_MD}")
print(f"\n=== SUMMARY ===")
print(f"Total issues: {len(issues)}")
print(f"High: {len(high)}, Medium: {len(medium)}, Low: {len(low)}")
print(f"Broken cross-references: {len(broken_refs)}")
print(f"\nIssue types: {dict(type_counts)}")
