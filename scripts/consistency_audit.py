#!/usr/bin/env python3
"""Cross-case consistency audit for the Washington Accountability Registry."""

import json
import re
import csv
from pathlib import Path
from collections import defaultdict
from difflib import SequenceMatcher

PARSED_JSON = Path("/home/user/workspace/wa-registry/scripts/parsed-cases.json")
OUTPUT_CSV = Path("/home/user/workspace/wa-registry/validation-consistency.csv")
OUTPUT_MD = Path("/home/user/workspace/wa-registry/validation-consistency-summary.md")
CASES_DIR = Path("/home/user/workspace/wa-registry/src/content/cases")

with open(PARSED_JSON) as f:
    data = json.load(f)

cases = data['cases']
all_slugs = set(data['all_slugs'])
all_ids = set(data['all_ids'])

# Build lookup maps
slug_to_case = {c['slug']: c for c in cases}
id_to_case = {c['id']: c for c in cases if c['id']}

issues = []

def add_issue(issue_type, case_slug_a, case_slug_b, field, value_a, value_b, severity, recommended_fix):
    issues.append({
        'issue_type': issue_type,
        'case_slug_a': case_slug_a,
        'case_slug_b': case_slug_b,
        'field': field,
        'value_a': str(value_a),
        'value_b': str(value_b),
        'severity': severity,
        'recommended_fix': recommended_fix,
    })

# ==================== 1. BUILD ACTOR INDEX ====================
# actor_name -> list of (case_slug, actor_dict)
actor_index = defaultdict(list)

for case in cases:
    for actor in case['actors']:
        name = actor.get('name', '').strip()
        if name:
            actor_index[name].append((case['slug'], actor))

# ==================== 2. ACTOR CONSISTENCY CHECK ====================
print("=== Actor consistency check ===")
for actor_name, appearances in actor_index.items():
    if len(appearances) < 2:
        continue
    
    # Compare all pairs
    for i in range(len(appearances)):
        for j in range(i+1, len(appearances)):
            slug_a, actor_a = appearances[i]
            slug_b, actor_b = appearances[j]
            
            # role_type
            rt_a = actor_a.get('role_type', '')
            rt_b = actor_b.get('role_type', '')
            if rt_a and rt_b and rt_a != rt_b:
                add_issue(
                    'actor_title_divergence',
                    slug_a, slug_b,
                    f'actors[{actor_name}].role_type',
                    rt_a, rt_b,
                    'high',
                    f'Decide canonical role_type for {actor_name}: "{rt_a}" vs "{rt_b}"'
                )
            
            # title
            title_a = (actor_a.get('title') or '').strip()
            title_b = (actor_b.get('title') or '').strip()
            if title_a and title_b and title_a != title_b:
                # Check if substantially different (not just date differences)
                ratio = SequenceMatcher(None, title_a.lower(), title_b.lower()).ratio()
                if ratio < 0.7:
                    severity = 'high'
                elif ratio < 0.85:
                    severity = 'medium'
                else:
                    severity = 'low'
                add_issue(
                    'actor_title_divergence',
                    slug_a, slug_b,
                    f'actors[{actor_name}].title',
                    title_a, title_b,
                    severity,
                    f'Reconcile title for {actor_name} across cases — use the most specific/current phrasing'
                )
            
            # party
            party_a = actor_a.get('party')
            party_b = actor_b.get('party')
            if party_a and party_b and party_a != party_b:
                add_issue(
                    'actor_party_divergence',
                    slug_a, slug_b,
                    f'actors[{actor_name}].party',
                    party_a, party_b,
                    'high',
                    f'Party mismatch for {actor_name}: "{party_a}" vs "{party_b}" — verify correct party affiliation'
                )
            
            # jurisdiction
            juris_a = (actor_a.get('jurisdiction') or '').strip()
            juris_b = (actor_b.get('jurisdiction') or '').strip()
            if juris_a and juris_b and juris_a != juris_b:
                add_issue(
                    'actor_jurisdiction_divergence',
                    slug_a, slug_b,
                    f'actors[{actor_name}].jurisdiction',
                    juris_a, juris_b,
                    'medium',
                    f'Jurisdiction mismatch for {actor_name}: "{juris_a}" vs "{juris_b}" — use the more specific/accurate value'
                )

# ==================== 3. CASE ID REFERENCE VALIDATION ====================
print("=== Case ID reference check ===")

# Map out what case IDs are referenced in each case body/frontmatter
# Also need KC-2025-007 etc cross-check
for case in cases:
    slug = case['slug']
    refs = case.get('body_case_id_refs', [])
    
    # Also scan the full body text
    body = case.get('body', '')
    
    for ref_id in refs:
        if ref_id == case['id']:
            continue  # self-reference OK
        if ref_id not in all_ids:
            add_issue(
                'broken_case_id_reference',
                slug, '',
                'body_text',
                ref_id, '(does not exist)',
                'high',
                f'Case ID {ref_id} referenced in {slug} does not exist in the registry — remove or update the reference'
            )
        else:
            # reference exists — check for described agreement
            pass

# ==================== 4. SLUG REFERENCE VALIDATION ====================
print("=== Slug reference check ===")
for case in cases:
    slug = case['slug']
    for ref_slug in case.get('body_slug_refs', []):
        if ref_slug not in all_slugs:
            add_issue(
                'broken_slug_reference',
                slug, '',
                'body_text',
                f'/cases/{ref_slug}', '(slug does not exist)',
                'high',
                f'Slug "/cases/{ref_slug}" referenced in {slug} does not exist — update or remove'
            )

# ==================== 5. REFORM REFERENCE VALIDATION ====================
print("=== Reform reference check ===")

# The reforms page is DYNAMIC — it builds from reforms_implicated across all cases.
# So "valid" reform IDs = all unique values in reforms_implicated across all cases.
all_reforms_implicated = set()
for case in cases:
    for r in case.get('reforms_implicated', []):
        all_reforms_implicated.add(r)

print(f"All reforms_implicated IDs: {sorted(all_reforms_implicated)}")

# Check [reform: foo] body references against reforms_implicated set
for case in cases:
    slug = case['slug']
    for ref_reform in case.get('body_reform_refs', []):
        if ref_reform not in all_reforms_implicated:
            add_issue(
                'broken_reform_reference',
                slug, '',
                'body_text [reform: ...]',
                ref_reform, '(not in any reforms_implicated)',
                'medium',
                f'Reform "{ref_reform}" referenced in body of {slug} but not found in any reforms_implicated frontmatter — add to reforms_implicated or correct the slug'
            )

# Also flag reforms in reforms_implicated of a case that don't appear in ANY other case's reforms_implicated
# (These are not "broken" per se but may be misspelled orphans)
# Better: check for near-duplicates among reform IDs
reform_list = sorted(all_reforms_implicated)
print(f"Reform IDs found: {reform_list}")

# ==================== 6. TAG NEAR-DUPLICATES ====================
print("=== Tag near-duplicate check ===")
all_tags = set()
for case in cases:
    for tag in case.get('tags', []):
        all_tags.add(tag)

tag_list = sorted(all_tags)
print(f"All unique tags: {tag_list}")

def tags_similar(a, b):
    """Check if two tags are near-duplicates."""
    # Exact case-insensitive match
    if a.lower() == b.lower():
        return True, 'case_difference'
    # One is prefix of the other (e.g., "homeless" vs "homelessness")
    a_lower, b_lower = a.lower(), b.lower()
    if a_lower.startswith(b_lower) or b_lower.startswith(a_lower):
        return True, 'prefix'
    # Underscore/hyphen variant
    if a_lower.replace('_', '-') == b_lower.replace('_', '-'):
        return True, 'separator'
    # High string similarity
    ratio = SequenceMatcher(None, a_lower, b_lower).ratio()
    if ratio >= 0.85:
        return True, f'similar({ratio:.2f})'
    return False, ''

for i, tag_a in enumerate(tag_list):
    for tag_b in tag_list[i+1:]:
        is_dup, reason = tags_similar(tag_a, tag_b)
        if is_dup:
            # Find which cases use each tag
            cases_a = [c['slug'] for c in cases if tag_a in c.get('tags', [])]
            cases_b = [c['slug'] for c in cases if tag_b in c.get('tags', [])]
            add_issue(
                'tag_near_duplicate',
                cases_a[0] if cases_a else '',
                cases_b[0] if cases_b else '',
                'tags',
                tag_a,
                tag_b,
                'low',
                f'Tags "{tag_a}" and "{tag_b}" appear to be near-duplicates ({reason}) — standardize to one form'
            )

# ==================== 7. DATE CONSISTENCY ====================
print("=== Date consistency check ===")

# Key events to verify across cases
# Constantine appointed CEO: check all mentions of the appointment date
constantine_appointment_cases = []
for case in cases:
    body = case.get('body', '')
    # Look for "March 27", "March 28", "2025-03-27", "2025-03-28" near "Constantine" and "CEO"
    if 'Constantine' in body and ('CEO' in body or 'Sound Transit' in body):
        # Extract dates near "Constantine"
        march_27_count = len(re.findall(r'March\s+27,?\s+2025|2025-03-27', body))
        march_28_count = len(re.findall(r'March\s+28,?\s+2025|2025-03-28', body))
        if march_27_count or march_28_count:
            constantine_appointment_cases.append({
                'slug': case['slug'],
                'march_27_refs': march_27_count,
                'march_28_refs': march_28_count,
            })

print(f"Constantine CEO appointment date references: {constantine_appointment_cases}")

# Check: constantine-ceo-ethics-complaint says "appointed on March 28" but dow-soundtransit-ceo says March 27
# Let's check the actual text
for case in cases:
    if case['slug'] in ('constantine-ceo-ethics-complaint', 'dow-soundtransit-ceo'):
        body = case['body']
        date_mentions = re.findall(r'March\s+\d+,?\s+2025|2025-03-\d+', body)
        print(f"  {case['slug']}: {date_mentions}")

# More systematic: find specific date mentions for known events
# Event 1: Constantine CEO appointment
# - dow-soundtransit-ceo: date_surfaced: 2025-03-27, outcome says "March 27, 2025"
# - constantine-ceo-ethics-complaint: says "appointed CEO on March 28, 2025"
# Let's check explicitly
for case in cases:
    slug = case['slug']
    body = case.get('body', '')
    fm_date_surfaced = case.get('date_surfaced', '')
    
    # Check for "Constantine" + "CEO" + date combination
    if 'constantine' in slug or 'dow-sound' in slug or 'sound-transit-st3' in slug:
        appt_dates = re.findall(r'(?:appointed|confirmed|hired|took office).*?(?:March|2025-03)[\s\d,]+\d{4}', body, re.IGNORECASE)
        print(f"  {slug}: appt date mentions: {appt_dates[:3]}")

# ==================== 8. DOLLAR FIGURE CROSS-CLUSTER CHECKS ====================
print("=== Dollar figure checks ===")

# DCHS cluster
dchs_cluster = {
    'dchs-systemic-audit': None,
    'kc-dchs-ombuds-investigation': None,
    'kc-youth-program-self-dealing': None,
    'kc-health-through-housing': None,
}
for case in cases:
    if case['slug'] in dchs_cluster:
        dchs_cluster[case['slug']] = case.get('dollars_at_issue')

print(f"DCHS cluster dollars: {dchs_cluster}")

# Sound Transit cluster
st_cluster = {
    'sound-transit-st3-program-reset': None,
    'sound-transit-west-seattle-cost': None,
    'constantine-ceo-ethics-complaint': None,
    'dow-soundtransit-ceo': None,
}
for case in cases:
    if case['slug'] in st_cluster:
        st_cluster[case['slug']] = case.get('dollars_at_issue')

print(f"Sound Transit cluster dollars: {st_cluster}")

# Cross-reference dollar mentions in body text
# For Constantine CEO salary: two cases both mention $450K and $474,276 — check for consistency
for case in cases:
    slug = case['slug']
    body = case.get('body', '')
    
    # Check for any mention of the Krauthamer $675K figure being presented as real
    if '$675' in body and 'Krauthamer' not in body and 'ceiling' not in body.lower() and 'invoice' not in body.lower():
        add_issue(
            'dollar_figure_disagreement',
            slug, 'constantine-ceo-ethics-complaint',
            'CEO salary figure',
            '$675K (in body without context)',
            '$450K (confirmed salary)',
            'high',
            f'The $675K figure is a Krauthamer invoice ceiling, not the actual salary. Body text in {slug} mentions $675K without clarification.'
        )

# Check McGhee self-dealing: $813K
mcghee_bodies = []
for case in cases:
    body = case.get('body', '')
    if 'McGhee' in body or 'youth-program' in case['slug'] or 'dchs-systemic' in case['slug']:
        amounts = re.findall(r'\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|M|B|K))?', body, re.IGNORECASE)
        print(f"  {case['slug']} dollar mentions: {amounts[:10]}")

# KCRHA figures
for case in cases:
    if 'kcrha' in case['slug'] or 'KCRHA' in (case.get('body', '')):
        body = case.get('body', '')
        amounts = re.findall(r'\$[\d,.]+(?:\s*(?:million|billion|M|B|K))?', body, re.IGNORECASE)
        print(f"  {case['slug']} (KCRHA ref) dollar mentions: {amounts[:8]}")

# ==================== 9. KC-2025-007 REFERENCE CHECK ====================
# KC-2025-007 is mentioned in port-seattle-pie-fraud but does it exist?
print("\n=== KC-2025-007 existence check ===")
for case in cases:
    body = case.get('body', '')
    raw_fm = case.get('id', '')
    all_text = body
    refs_007 = re.findall(r'KC-2025-007', all_text)
    if refs_007:
        print(f"  {case['slug']} references KC-2025-007: {len(refs_007)} times")

# Check if KC-2025-007 exists
if 'KC-2025-007' in all_ids:
    print("  KC-2025-007 EXISTS in registry")
else:
    print("  KC-2025-007 DOES NOT EXIST in registry")

# ==================== 10. SPECIFIC CROSS-REFERENCE DESCRIPTION CHECKS ====================
print("\n=== Cross-reference description checks ===")
# kc-health-through-housing references KC-2025-001 as DCHS audit — check description accuracy
# port-seattle-pie-fraud references KC-2025-007 as "KCRHA Clark Nuber forensic audit"

for case in cases:
    body = case.get('body', '')
    slug = case['slug']
    
    # Check all KC-XXX references and their descriptions
    # Pattern: KC-2025-001 (description)
    ref_with_desc = re.findall(r'((?:KC|WA|SEA|SPS|POS|PSESD)-\d{4}-[A-Z0-9-]+)\s*\(([^)]{5,80})\)', body)
    for ref_id, desc in ref_with_desc:
        if ref_id in id_to_case:
            target = id_to_case[ref_id]
            target_title = target.get('title', '')
            # Check if description roughly matches
            desc_words = set(desc.lower().split())
            title_words = set(target_title.lower().split())
            overlap = desc_words & title_words
            overlap_ratio = len(overlap) / max(len(desc_words), 1)
            print(f"  {slug} -> {ref_id}: '{desc}' vs actual title: '{target_title[:60]}' (overlap: {overlap_ratio:.2f})")
            if overlap_ratio < 0.1 and len(desc_words) > 2:
                add_issue(
                    'undescribed_cross_reference',
                    slug, id_to_case[ref_id]['slug'],
                    f'cross-reference to {ref_id}',
                    desc,
                    target_title[:100],
                    'medium',
                    f'Description of {ref_id} in {slug} may not match what that case is actually about — verify'
                )

# ==================== 11. SPECIFIC DATE CHECKS ====================
print("\n=== Specific known date checks ===")

# Constantine appointed: Check frontmatter dates and body text
case_dow = slug_to_case.get('dow-soundtransit-ceo', {})
case_ethics = slug_to_case.get('constantine-ceo-ethics-complaint', {})

print(f"dow-soundtransit-ceo: date_surfaced={case_dow.get('date_surfaced')}, date_conduct_end={case_dow.get('date_conduct_end')}")
print(f"constantine-ceo-ethics-complaint: date_surfaced={case_ethics.get('date_surfaced')}")

# Body text date mentions
for case in [case_dow, case_ethics]:
    body = case.get('body', '')
    slug = case['slug']
    all_march_dates = re.findall(r'March\s+\d+(?:,\s*2025)?', body)
    print(f"  {slug}: March dates in body: {all_march_dates}")

# The ethics complaint says filed March 26 and Constantine "appointed CEO on March 28, 2025"
# dow-soundtransit-ceo says date_surfaced: 2025-03-27 and body says "formally appointed him on March 27, 2025"
# This is a date disagreement for the appointment itself
body_ethics = case_ethics.get('body', '')
body_dow = case_dow.get('body', '')

march_28_in_ethics = bool(re.search(r'March\s+28', body_ethics))
march_27_in_dow = bool(re.search(r'March\s+27', body_dow))

if march_28_in_ethics and march_27_in_dow:
    print("DATE DISAGREEMENT: ethics complaint says March 28, dow-soundtransit-ceo says March 27")
    add_issue(
        'date_disagreement',
        'constantine-ceo-ethics-complaint',
        'dow-soundtransit-ceo',
        'Constantine CEO appointment date',
        'March 28, 2025 (constantine-ceo-ethics-complaint body)',
        'March 27, 2025 (dow-soundtransit-ceo body and date_surfaced)',
        'high',
        'Confirm the correct date: Sound Transit press release (the primary source) is dated March 27, 2025; update constantine-ceo-ethics-complaint body to say "March 27, 2025" if that is the appointment date'
    )

# Check ST3 cost shortfall consistency
# sound-transit-st3-program-reset title says "$22-34.5B"
# sound-transit-west-seattle-cost mentions the ST3 program
case_st3 = slug_to_case.get('sound-transit-st3-program-reset', {})
case_wsl = slug_to_case.get('sound-transit-west-seattle-cost', {})
body_st3 = case_st3.get('body', '')
body_wsl = case_wsl.get('body', '')
print(f"\nST3 dollars_at_issue: {case_st3.get('dollars_at_issue')} (= {34500000000})")
# WSL body mentions of the program shortfall
wsl_shortfall_refs = re.findall(r'\$[\d,.]+\s*(?:billion|B)', body_wsl, re.IGNORECASE)
print(f"WSL body mentions of billion figures: {wsl_shortfall_refs}")

# ==================== 12. REFORM ID NEAR-DUPLICATES ====================
print("\n=== Reform ID near-duplicates ===")
reform_list = sorted(all_reforms_implicated)
for i, r_a in enumerate(reform_list):
    for r_b in reform_list[i+1:]:
        ratio = SequenceMatcher(None, r_a, r_b).ratio()
        if ratio >= 0.75:
            print(f"  Near-duplicate reforms: '{r_a}' vs '{r_b}' ({ratio:.2f})")
            # Find cases using each
            cases_a = [c['slug'] for c in cases if r_a in c.get('reforms_implicated', [])]
            cases_b = [c['slug'] for c in cases if r_b in c.get('reforms_implicated', [])]
            add_issue(
                'tag_near_duplicate',  # reusing for reform near-dupes
                cases_a[0] if cases_a else '',
                cases_b[0] if cases_b else '',
                'reforms_implicated',
                r_a,
                r_b,
                'low',
                f'Reform IDs "{r_a}" and "{r_b}" may be near-duplicates — verify they are intentionally distinct'
            )

# ==================== 13. KCRHA / DCHS CROSS-MENTION DOLLAR CHECKS ====================
print("\n=== KCRHA forensic audit dollar checks ===")
case_kcrha = slug_to_case.get('kcrha-forensic-audit', {})
body_kcrha = case_kcrha.get('body', '')
kcrha_dollars = re.findall(r'\$[\d,.]+(?:\s*(?:million|billion|M|B|K))?', body_kcrha)
print(f"KCRHA case dollar mentions: {kcrha_dollars}")
print(f"KCRHA dollars_at_issue: {case_kcrha.get('dollars_at_issue')}")

# port-seattle-pie-fraud references KC-2025-007 as KCRHA Clark Nuber forensic audit
# but KC-2026-001 is the actual KCRHA case
case_port_fraud = slug_to_case.get('port-seattle-pie-fraud', {})
body_port = case_port_fraud.get('body', '')
print(f"\nPort PIE fraud references KC-2025-007: {'KC-2025-007' in body_port}")
print(f"Actual KCRHA case ID: {case_kcrha.get('id')}")

if 'KC-2025-007' in body_port:
    actual_kcrha_id = case_kcrha.get('id', 'KC-2026-001')
    add_issue(
        'broken_case_id_reference',
        'port-seattle-pie-fraud',
        'kcrha-forensic-audit',
        'body_text cross-reference',
        'KC-2025-007 (does not exist)',
        f'{actual_kcrha_id} (actual KCRHA forensic audit ID)',
        'high',
        f'port-seattle-pie-fraud references "KC-2025-007" as the KCRHA forensic audit, but that ID does not exist — the actual KCRHA forensic audit is {actual_kcrha_id}. Update the reference.'
    )

# Also check: Does dow-soundtransit-ceo reference "WA-2025-ST-PROG" correctly?
body_dow = case_dow.get('body', '')
if 'WA-2025-ST-PROG' in body_dow:
    print("dow-soundtransit-ceo references WA-2025-ST-PROG: OK")
    
# Check if constantine-ceo-ethics-complaint references WA-2025-ST-PROG correctly  
body_ethics = case_ethics.get('body', '')
wst_refs_in_ethics = re.findall(r'WA-2025-ST-[A-Z]+', body_ethics)
print(f"Ethics complaint ST references: {wst_refs_in_ethics}")

# ==================== 14. CHECK KC-2025-003 REFERENCE ====================
# dchs-systemic-audit (KC-2025-001) says "tracked separately as KC-2025-003"
# but also says "KC-2025-003" — verify this exists
print("\n=== KC-2025-003 reference check ===")
print(f"KC-2025-003 in all_ids: {'KC-2025-003' in all_ids}")
if 'KC-2025-003' in id_to_case:
    print(f"  => {id_to_case['KC-2025-003']['slug']}: {id_to_case['KC-2025-003']['title']}")

# ==================== 15. SPD DIAZ: $338K vs $10M claim ====================
# spd-diaz-misconduct: dollars_at_issue = 338000 (salary?)
# But Diaz filed a $10M claim against the city
print("\n=== SPD Diaz dollar check ===")
case_diaz = slug_to_case.get('spd-diaz-misconduct', {})
print(f"Diaz dollars_at_issue: {case_diaz.get('dollars_at_issue')}")
print(f"Diaz dollars_basis: {case_diaz.get('dollars_basis', '')[:200]}")
body_diaz = case_diaz.get('body', '')
diaz_10m = re.findall(r'\$10\s*(?:million|M|m)', body_diaz, re.IGNORECASE)
print(f"Diaz body $10M mentions: {diaz_10m}")

# ==================== 16. LNI IT MODERNIZATION DOLLAR CHECK ====================
# Title says "$31M spent over 10 years, $292M current estimate"
# dollars_at_issue = 31000000 (just the spent portion)
case_lni = slug_to_case.get('lni-it-modernization', {})
print(f"\nLNI dollars_at_issue: {case_lni.get('dollars_at_issue')} (title mentions $292M)")
body_lni = case_lni.get('body', '')
lni_dollars = re.findall(r'\$[\d,.]+(?:\s*(?:million|billion|M|B|K))?', body_lni)
print(f"LNI body dollar mentions: {lni_dollars[:10]}")

# ==================== 17. BRUCE HARRELL ROLE_TYPE CHECK ====================
# Bruce Harrell appears in spd-diaz-misconduct (elected), gomez-mayors-office-allegation (elected), harrell-tiktok-seec-complaint (elected)
# All should be consistent
harrell_appearances = actor_index.get('Bruce Harrell', [])
print(f"\nBruce Harrell appearances: {[(s, a.get('role_type'), a.get('title')) for s,a in harrell_appearances]}")

# ==================== 18. BOB FERGUSON CONSISTENCY ====================
ferguson_appearances = actor_index.get('Bob Ferguson', [])
print(f"\nBob Ferguson appearances: {[(s, a.get('role_type'), a.get('title')) for s,a in ferguson_appearances]}")

# ==================== 19. SOUND TRANSIT JURISDICTION CHECK ====================
# dow-soundtransit-ceo: Dow Constantine jurisdiction = "King County / Washington State"
# constantine-ceo-ethics-complaint: Dow Constantine jurisdiction = "King County"
# sound-transit-st3-program-reset: Dow Constantine jurisdiction = "Washington State"
print("\n=== Dow Constantine jurisdiction check ===")
constantine_appearances = actor_index.get('Dow Constantine', [])
print(f"Dow Constantine appearances: {[(s, a.get('jurisdiction'), a.get('role_type')) for s,a in constantine_appearances]}")

# ==================== 20. CHECK KCRHA body refs ====================
print("\n=== Checking all cases for KCRHA cross-references ===")
for case in cases:
    body = case.get('body', '')
    if 'KCRHA' in body or 'kcrha' in body.lower():
        kcrha_refs = re.findall(r'(?:KC|kc)-\d{4}-\d+', body)
        print(f"  {case['slug']}: KCRHA body refs: {kcrha_refs}")

# ==================== SAVE ISSUES ====================
print(f"\n=== Total issues found: {len(issues)} ===")

# Deduplicate issues
seen = set()
deduped = []
for iss in issues:
    key = (iss['issue_type'], iss['case_slug_a'], iss['case_slug_b'], iss['field'], iss['value_a'], iss['value_b'])
    if key not in seen:
        seen.add(key)
        deduped.append(iss)

issues = deduped
print(f"After deduplication: {len(issues)} issues")

# Save CSV
fieldnames = ['issue_type', 'case_slug_a', 'case_slug_b', 'field', 'value_a', 'value_b', 'severity', 'recommended_fix']
with open(OUTPUT_CSV, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(issues)

print(f"Saved CSV to {OUTPUT_CSV}")

# Print summary for markdown
from collections import Counter
type_counts = Counter(i['issue_type'] for i in issues)
severity_counts = Counter(i['severity'] for i in issues)
print(f"\nIssue type counts: {dict(type_counts)}")
print(f"Severity counts: {dict(severity_counts)}")

# Output for next step
with open('/home/user/workspace/wa-registry/scripts/audit_results.json', 'w') as f:
    json.dump({
        'issues': issues,
        'type_counts': dict(type_counts),
        'severity_counts': dict(severity_counts),
        'all_reforms': sorted(all_reforms_implicated),
        'all_tags': sorted(all_tags),
        'all_slugs': sorted(all_slugs),
        'all_ids': sorted(all_ids),
    }, f, indent=2)
