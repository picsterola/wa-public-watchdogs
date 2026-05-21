# Layman Readability Pass — Rewrite Rules

You are rewriting the markdown body of each case file in
`/home/user/workspace/wa-registry/src/content/cases/*.md` (40 files).

## What you are doing

The reader is a concerned member of the public who just clicked a case link
from social media. They are NOT a journalist, lawyer, or policy professional.
They have ~30 seconds of patience before they bounce.

Make the body readable for a smart layman without dumbing down the substance.
Keep details. Decode jargon. Lead with the punchline.

## Hard rules

1. **DO NOT touch the YAML frontmatter.** Everything between the two `---`
   lines stays untouched. That includes `title`, `outcome_summary`,
   `dollars_basis`, `reform_argument`, `actors`, `sources`, etc.

2. **DO NOT add facts that are not already in the case file.** You can
   restructure, clarify, and rephrase, but you cannot invent. If the case
   text says "LEB issued opinion" and nothing more about what was found,
   you cannot say "LEB found a violation" — that's a fact you don't have.

3. **Preserve every primary-source citation.** If the existing body links
   to or cites a source, keep that citation in the rewrite.

4. **Preserve hedging language on `evidentiary_status: alleged` cases.**
   Read the frontmatter `evidentiary_status` field. If `alleged`, the body
   must use words like "alleged", "complaint claims", "reported to".
   If `reported`, "reported by [source]" framing is fine. If `documented`,
   you can state facts directly.

5. **Keep all four standard section headings** in this order, even if you
   move content between them:
   - `## What happened`
   - `## What the primary source says`
   - `## Status`
   - `## Why it's in the registry`
   - `## Reform implication`
   - `## Relationship to other cases` (only if the original had it)

   You may rename `## What the primary source says` to `## The receipts`
   for punchier flow if the section is short.

6. **Add a bold one-sentence lede at the very top of the body**, BEFORE
   `## What happened`. Format: `**One sentence summary in plain English.**`
   This is what someone who just opened the page from a tweet will read.
   Maximum 30 words. State the dollars, the agency, and what went wrong
   in language a 16-year-old would understand. For `alleged` cases, the
   lede must use hedging language.

## Style rules

7. **Decode acronyms on first use.** Spell them out the first time they
   appear in the body, with the acronym in parentheses:
   - LEB → Legislative Ethics Board (LEB)
   - SAO → State Auditor's Office (SAO)
   - DCHS → King County Department of Community and Human Services (DCHS)
   - KCRHA → King County Regional Homelessness Authority (KCRHA)
   - PDC → Public Disclosure Commission (PDC)
   - SPD → Seattle Police Department (SPD)
   - SPS → Seattle Public Schools (SPS)
   - DCYF → Department of Children, Youth, and Families (DCYF)
   - L&I or LNI → Department of Labor and Industries (L&I)
   - ECF → Education Construction Fund (or use what the source says)
   - PIE → Partner in Employment (the specific contractor)
   - ST3 → Sound Transit's third mass-transit package (ST3)

8. **Translate registry/legal jargon.**
   - "closed_no_action" → "no enforcement action was taken" or "the case
     was closed without further action"
   - "documented structural failure" → keep, but explain on first use:
     "a structural failure (meaning the problem is built into how the
     agency operates, not a one-off mistake)"
   - "adjudicated" → "reviewed and decided"
   - "respondent" → "the official named in the complaint"
   - "Tier 1 source" → drop this phrase from prose; it's metadata, not
     reader-facing
   - "evidentiary status" → don't use in prose

9. **Lead with the punchline.** Open `## What happened` with the biggest
   number or sharpest finding. Don't bury the lead under procedural
   throat-clearing.

10. **Short paragraphs.** Two-to-four sentence paragraphs. Break up walls
    of text. Use bullets where there are genuinely listable items
    (multiple findings, multiple reforms).

11. **Preserve neutral voice.** No editorializing. No "shocking",
    "outrageous", "scandal". State what happened and what the source
    said. Let the facts carry the weight.

12. **Keep the `[reform: foo_bar]` link syntax** wherever it appears.
    Those render to reform pages in the site.

13. **`## Why it's in the registry`** — this is where you explain to the
    reader why this case matters beyond the headline. Make it land for a
    layman. Why should they care? What pattern does this fit into?

14. **`## Reform implication`** — explain in plain English what reform
    would have prevented this. Don't just list reform names.

## Process

For each of the 40 files:

1. Read the file with the `read` tool.
2. Identify the body (everything after the closing `---` of frontmatter).
3. Rewrite the body following the rules above.
4. Use the `edit` tool to replace ONLY the body. Do not touch frontmatter.
5. Move to the next file.

After all 40 are done, write a summary to
`/home/user/workspace/wa-registry/REWRITE_SUMMARY.md` listing each case
slug, the lede you wrote for it, and any cases where you had concerns
(thin source material, ambiguous evidentiary status, etc.).

## Files to process

All `.md` files in `/home/user/workspace/wa-registry/src/content/cases/`.
There are 40 of them. Do not skip any unless `review_status` in the
frontmatter is `retracted` (skip those).
