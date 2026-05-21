#!/usr/bin/env python3
"""Parse all 36 case files and build cross-reference indexes."""

import os
import re
import json
import yaml
from pathlib import Path
from collections import defaultdict

CASES_DIR = Path("/home/user/workspace/wa-registry/src/content/cases")
OUTPUT_PATH = Path("/home/user/workspace/wa-registry/scripts/parsed-cases.json")

def parse_frontmatter(content):
    """Extract YAML frontmatter from markdown file."""
    # Match content between first --- and second ---
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return None, content
    fm_text = match.group(1)
    body = match.group(2)
    
    # Remove YAML comment lines before parsing
    fm_lines = []
    for line in fm_text.split('\n'):
        stripped = line.strip()
        if stripped.startswith('#'):
            continue
        fm_lines.append(line)
    fm_clean = '\n'.join(fm_lines)
    
    try:
        fm = yaml.safe_load(fm_clean)
    except yaml.YAMLError as e:
        print(f"YAML error: {e}")
        fm = {}
    return fm, body

def extract_case_id_refs(text):
    """Find all KC-2025-XXX, WA-2025-XXX, WA-2025-ST-XXX style references."""
    pattern = r'\b(KC|WA)-\d{4}-[A-Z0-9-]+\b'
    return re.findall(pattern, text)

def extract_case_id_refs_full(text):
    """Find full case ID references."""
    pattern = r'\b(?:KC|WA)-\d{4}-[A-Z0-9]+(?:-[A-Z0-9]+)*\b'
    return list(set(re.findall(pattern, text)))

def extract_slug_refs(text):
    """Find /cases/some-slug references."""
    pattern = r'/cases/([a-z0-9-]+)'
    return list(set(re.findall(pattern, text)))

def extract_reform_refs(text):
    """Find [reform: some_id] references in body text."""
    pattern = r'\[reform:\s*([a-z_]+)\]'
    return list(set(re.findall(pattern, text)))

def extract_dollars(text):
    """Find dollar figures mentioned in text."""
    pattern = r'\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|M|B))?'
    return re.findall(pattern, text, re.IGNORECASE)

def extract_dates(text):
    """Find date references in text (various formats)."""
    patterns = [
        r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b',
        r'\b\d{4}-\d{2}-\d{2}\b',
    ]
    dates = []
    for p in patterns:
        dates.extend(re.findall(p, text))
    return dates

def main():
    cases = []
    all_slugs = set()
    all_ids = set()
    
    for filepath in sorted(CASES_DIR.glob("*.md")):
        content = filepath.read_text()
        fm, body = parse_frontmatter(content)
        if fm is None:
            print(f"WARNING: Could not parse frontmatter for {filepath.name}")
            continue
        
        slug = fm.get('slug', filepath.stem)
        case_id = fm.get('id', '')
        
        all_slugs.add(slug)
        if case_id:
            all_ids.add(case_id)
        
        # Extract references from body
        body_case_id_refs = extract_case_id_refs_full(body)
        body_slug_refs = extract_slug_refs(body)
        body_reform_refs = extract_reform_refs(body)
        
        # Also check reform refs in frontmatter (reform_argument field)
        reform_arg = fm.get('reform_argument', '') or ''
        fm_reform_refs = extract_reform_refs(reform_arg)
        all_reform_refs = list(set(body_reform_refs + fm_reform_refs))
        
        # Extract from full content (frontmatter + body) for case ID refs
        full_case_id_refs = extract_case_id_refs_full(content)
        
        case_data = {
            'filename': filepath.name,
            'slug': slug,
            'id': case_id,
            'title': fm.get('title', ''),
            'date_surfaced': str(fm.get('date_surfaced', '')),
            'date_conduct_start': str(fm.get('date_conduct_start', '')),
            'date_conduct_end': str(fm.get('date_conduct_end', '')),
            'last_updated': str(fm.get('last_updated', '')),
            'actors': fm.get('actors', []) or [],
            'evidentiary_status': fm.get('evidentiary_status', ''),
            'severity_type': fm.get('severity_type', []) or [],
            'reforms_implicated': fm.get('reforms_implicated', []) or [],
            'dollars_at_issue': fm.get('dollars_at_issue'),
            'dollars_basis': fm.get('dollars_basis', ''),
            'dollars_confirmed_loss': fm.get('dollars_confirmed_loss'),
            'legal_status': fm.get('legal_status', ''),
            'outcome_summary': fm.get('outcome_summary', ''),
            'review_status': fm.get('review_status', ''),
            'tags': fm.get('tags', []) or [],
            'contributor': fm.get('contributor', ''),
            # Cross-reference data
            'body_case_id_refs': full_case_id_refs,
            'body_slug_refs': body_slug_refs,
            'body_reform_refs': all_reform_refs,
            # Raw body for further analysis
            'body': body,
        }
        cases.append(case_data)
    
    print(f"Parsed {len(cases)} cases")
    print(f"All slugs: {sorted(all_slugs)}")
    print(f"All IDs: {sorted(all_ids)}")
    
    output = {
        'cases': cases,
        'all_slugs': sorted(all_slugs),
        'all_ids': sorted(all_ids),
    }
    
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w') as f:
        json.dump(output, f, indent=2, default=str)
    
    print(f"\nSaved to {OUTPUT_PATH}")
    return output

if __name__ == '__main__':
    main()
