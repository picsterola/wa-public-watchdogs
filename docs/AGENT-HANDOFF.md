# Washington Accountability Register: Infrastructure and Agent Handoff

Verified September 17, 2026. This is a repository-checked operating guide for agents modifying wacountability.org, not a claim that every editorial safeguard is automated or that every existing case has passed a fresh factual review.

## Start here

The production repository is **`picsterola/wa-public-watchdogs`**, not Firehose, CivicTide, Culliton, or a Perplexity preview artifact. The site is an Astro static build hosted on GitHub Pages at **https://wacountability.org/**; the website and package still use “Washington Accountability Registry,” while this Perplexity Project is named “Washington Accountability Register.” Preserve that distinction unless a rebrand is explicitly requested. ([Repository](https://github.com/picsterola/wa-public-watchdogs), [configuration](https://github.com/picsterola/wa-public-watchdogs/blob/main/astro.config.mjs))

### Agent rules

- **Read the code before trusting old instructions.** Read this handoff, `INTAKE.md`, `SOURCES.md`, `src/content/config.ts`, `package.json`, and `.github/workflows/deploy.yml`; read the affected templates and scripts before editing. `README.md`, `DEPLOY_NOTES.md`, and the original validation reports contain historical information that no longer describes the whole system. ([README](https://github.com/picsterola/wa-public-watchdogs/blob/main/README.md), [historical deployment notes](https://github.com/picsterola/wa-public-watchdogs/blob/main/DEPLOY_NOTES.md))
- **Treat content under `src/content/cases/` as public.** A `draft` or `internal_review` value is not a working publication barrier: the case route builds every collection entry, and multiple distribution surfaces lack an approval allowlist. Do not put unpublished allegations, private research, or unapproved drafts there, including on a public repository branch. ([Repository](https://github.com/picsterola/wa-public-watchdogs))
- **Keep consequential changes approval-gated.** This handoff recommends an explicitly reviewed branch/PR workflow for content, policy, infrastructure, and publication changes. That is an operating recommendation, not a claim that GitHub currently enforces reviews.
- **Do not run `npm run offline` or `npm run online` as a test.** Both scripts modify the checkout, commit, and push to `origin main`; they are production actions, not local preview toggles. ([Repository](https://github.com/picsterola/wa-public-watchdogs))
- **Do not silently fix status metadata to hide a publication bug.** Review the intended editorial status of affected records first; making every draft “published” would erase the distinction rather than repair enforcement.
- **Never equate build success with factual validation.** Astro checks the declared data shape, not whether a quotation, accusation, dollar figure, actor title, archive, or approval is valid. ([Build configuration](https://github.com/picsterola/wa-public-watchdogs/blob/main/package.json))

### Audit snapshot

The inspected default-branch head was `6745b8eea2405f7a64e43d153d80f9270b5f907b`, “Align sitemap URLs with canonical pages,” dated June 1, 2026. The complete reachable history contained **70 commits and no GitHub pull requests**; the PR listing, issue listing, branch listing, and ruleset listing were checked directly. ([Repository](https://github.com/picsterola/wa-public-watchdogs))

| Item | Verified result |
|---|---|
| Default branch | `main`; only remote branch returned at audit time. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| PRs and issues | Zero open or closed PRs returned; zero issues returned. The change ledger below therefore records commits, not invented PR numbers. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Branch enforcement | `main` unprotected; no repository rulesets returned. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Content | 87 Markdown cases: 58 explicitly `published`, 20 explicitly `draft`, 9 missing `review_status` and therefore defaulting to `draft`. All 87 built case pages. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Evidence classifications | 62 `documented`, 4 `adjudicated`, 5 `reported`, 16 `alleged`, counted from current frontmatter. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Source inventory | 267 source entries, including 137 Tier 1 entries; 36 Tier 1 entries lack `archive_url`, and 5 entries are explicitly Tier 3. These are metadata counts, not a new source-quality adjudication. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Validation metadata | Every case has `last_verified`, `remediation_status`, and `reform_status`; every `documented` case has at least one Tier 1 entry. Presence alone does not establish that the underlying checks occurred. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Historical parsed dataset | `scripts/parsed-cases.json` contains 36 cases, not the current 87. Do not use it as the current ID registry. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Build verification | Fresh `npm ci` and `npm run build` passed on Node 20.20.1; 133 HTML pages and an 87-row CSV were produced. ([Build pipeline](https://github.com/picsterola/wa-public-watchdogs/blob/main/package.json)) |
| Structural checks | No duplicate current case IDs or resolved slugs; all 133 canonical URLs matched the 133 sitemap page URLs; no missing locally referenced OG image; zero broken relative/root-local `href`, `src`, `poster`, or `action` targets in generated HTML. Fragment targets, external links, interactive behavior, and form delivery were not covered by that check. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |

## Infrastructure and ownership boundaries

### Production delivery

The actual production path is GitHub source → GitHub Actions build → uploaded Pages artifact → GitHub Pages → custom domain. There is no application server, database, migration system, authentication service, or server-side editorial CMS in this repository. ([Deployment workflow](https://github.com/picsterola/wa-public-watchdogs/blob/main/.github/workflows/deploy.yml), [package manifest](https://github.com/picsterola/wa-public-watchdogs/blob/main/package.json))

| Layer | Configuration and operating implications |
|---|---|
| GitHub source | `picsterola/wa-public-watchdogs`, `main`; production behavior is controlled by tracked source and the Pages workflow. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| GitHub Pages | API returned `build_type: workflow`, custom domain `wacountability.org`, and HTTPS enforcement enabled. `public/CNAME` carries the custom domain in normal builds. ([Pages metadata](https://api.github.com/repos/picsterola/wa-public-watchdogs/pages)) |
| DNS | The committed Astro configuration identifies Cloudflare as DNS provider. DNS records, proxy mode, account ownership, zone ID, and current Cloudflare settings were not independently inspected in this audit. ([Configuration](https://github.com/picsterola/wa-public-watchdogs/blob/main/astro.config.mjs)) |
| Deployment environment | `github-pages`, with a deployment branch policy allowing `main`; no required-reviewer protection was returned. This restriction is not branch protection or editorial approval. ([Deployment environment](https://api.github.com/repos/picsterola/wa-public-watchdogs/environments/github-pages)) |
| Runtime and dependencies | CI uses Node 20 and `npm ci`; Astro 4 is the static generator, with sitemap/RSS integrations, gray-matter for frontmatter, Satori/Resvg for social images, Sharp for portraits, and self-hosted Fontsource typography. Use the lockfile, not an unreviewed dependency upgrade. ([Manifest](https://github.com/picsterola/wa-public-watchdogs/blob/main/package.json), [lockfile](https://github.com/picsterola/wa-public-watchdogs/blob/main/package-lock.json)) |
| Corrections intake | Static HTML posts to Web3Forms; the site supplies a public form access key, name/email, affiliation, case ID, request details, supporting URLs, and a honeypot. No application database or automated correction-application handler was found; submission delivery and provider-side recipient settings were not tested. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Archives | `archive-sources.mjs` submits missing source URLs to Wayback, writes successful archive URLs into Markdown, and logs failures to `ARCHIVE_FAILURES.md`. This is an opt-in maintenance script, not a CI gate. ([Archive failures](https://github.com/picsterola/wa-public-watchdogs/blob/main/ARCHIVE_FAILURES.md)) |
| Secrets/configuration | Repository secret and variable name listings returned no entries. This does not prove there are no provider-side, organization-level, or environment-level settings; do not print credentials when investigating them. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Perplexity preview | `DEPLOY_NOTES.md` records an old preview and an old `/home/user/workspace/wa-registry` path. A preview artifact is not the production deployment authority, and an old local path is not guaranteed to exist in a new session. ([Historical deployment notes](https://github.com/picsterola/wa-public-watchdogs/blob/main/DEPLOY_NOTES.md)) |

### Deployment workflow

The one tracked workflow responds to a push to `main`, a manual dispatch, and a first-of-month schedule at 17:00 UTC. It checks `.OFFLINE`, installs dependencies and builds normally unless offline, adds `.nojekyll`, uploads `dist`, and deploys with `actions/deploy-pages@v4`; its permissions are `contents: read`, `pages: write`, and `id-token: write`, with a shared `pages` concurrency group and `cancel-in-progress: false`. ([Workflow](https://github.com/picsterola/wa-public-watchdogs/blob/main/.github/workflows/deploy.yml))

**Important current state:** GitHub returned workflow state `disabled_inactivity`. The most recent returned successful deployment was August 1, 2026, using the same June 1 head; do not promise that the next push or monthly refresh will deploy until workflow enablement and a new run are verified. ([Workflow metadata](https://api.github.com/repos/picsterola/wa-public-watchdogs/actions/workflows), [last returned successful run](https://github.com/picsterola/wa-public-watchdogs/actions/runs/30710121330))

The monthly build recalculates featured-case scores; it does not research case developments, verify evidence, update case dates, or run the historical consistency audits. An all-session Perplexity scheduled-task inventory returned no matching active maintenance task for this site, despite the workflow comment referring to a matching session schedule; treat that comment as unverified historical context, not evidence of a second running system. ([Workflow](https://github.com/picsterola/wa-public-watchdogs/blob/main/.github/workflows/deploy.yml))

**HTTPS warning:** GitHub's Pages API reported certificate state `bad_authz` and an expiry date of August 20, 2026. That is a control-plane warning, not proof that the browser-facing certificate is currently invalid: this audit's content fetches were cached and no fresh TLS handshake or Cloudflare edge certificate inspection was performed. ([Pages metadata](https://api.github.com/repos/picsterola/wa-public-watchdogs/pages))

## File map: where to make changes

All paths below are relative to the GitHub checkout, not the Perplexity Project Files checkout. The latter stores this handoff; it is not a substitute for the production Git repository. ([Repository](https://github.com/picsterola/wa-public-watchdogs))

| Task | Source files |
|---|---|
| Add or amend a case | `src/content/cases/*.md`; companion correction entry in `src/pages/corrections.astro` for substantive amendments. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Change valid fields or enums | `src/content/config.ts`, then relevant labels in `src/lib/format.ts`, filters, scoring, generators, and documentation. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Change case display, related records, sharing, JSON-LD | `src/pages/cases/[slug].astro`; allegation banner in `src/components/AllegationBanner.astro`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Change index filters/grouping/sorting | `src/pages/cases/index.astro`, `src/lib/format.ts`; resolution UI depends on the two required resolution fields. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Change homepage | `src/pages/index.astro`; ranking in `scripts/compute-featured.mjs`, generated selection in `src/data/featured.json`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Agency and reform navigation | `src/lib/agencies.ts`, `src/lib/reforms.ts`, `src/pages/agencies/index.astro`, `src/pages/agencies/[slug].astro`, `src/pages/reforms.astro`, `src/pages/reforms/[slug].astro`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Shared design and SEO | `src/layouts/Base.astro`, `src/styles/global.css`, `src/components/{Header,Footer,Logo,Breadcrumb}.astro`, `astro.config.mjs`, `public/robots.txt`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Portraits | `src/data/officials.json`, `scripts/download-officials.mjs`, `public/img/officials/`; preserve provenance and license metadata. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Social preview cards | `scripts/bake-og-bg.mjs`, `scripts/generate-og-images.mjs`, plus the specialized `scripts/og-leb-meta.mjs`; verify which generator the build actually invokes. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Machine-readable output | `src/pages/rss.xml.ts`, `public/rss.xsl`, `scripts/export-cases-csv.mjs`; generated CSV is `dist/wa-registry-cases.csv`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Policies and correction form | `INTAKE.md`, `SOURCES.md`, `SCHEMA.md`, `src/pages/{about,methodology,standards,corrections}.astro`, `src/pages/corrections/thanks.astro`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Deployment and site pause | `.github/workflows/deploy.yml`, `.github/offline.html`, `.OFFLINE`, `scripts/toggle-offline.mjs`, `public/CNAME`. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |

### Canonical URLs and slugs

`build.format: 'file'` and `trailingSlash: 'never'` are intentional. Public page routes use explicit files such as `/cases.html`, `/standards.html`, and `/cases/<resolved-slug>.html`; the post-build relativizer rewrites root-relative HTML/CSS paths so the same build can work under a nested preview prefix. Do not switch to directory URLs, remove the relativizer, or introduce Astro `base` changes casually. ([Astro configuration](https://github.com/picsterola/wa-public-watchdogs/blob/main/astro.config.mjs), [deployment rationale](https://github.com/picsterola/wa-public-watchdogs/blob/main/DEPLOY_NOTES.md))

Use a case's frontmatter `slug` when supplied; otherwise use its filename stem, including any year prefix. The OG generator follows that rule, but the featured scorer still strips a leading year from filenames and can disagree with explicit overrides; all five featured entries happened to resolve in this audit, which does not eliminate the latent mismatch. Preserve existing URLs and verify all affected inbound links before any rename. ([Repository](https://github.com/picsterola/wa-public-watchdogs))

## Validation funnel: intended procedure versus real enforcement

The funnel is substantial, but it is primarily an agent-operated editorial procedure supported by schema validation and separate scripts. The repository does not contain a continuously running intake service or a CI workflow that proves all intake checks passed. ([Intake procedure](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md), [workflow](https://github.com/picsterola/wa-public-watchdogs/blob/main/.github/workflows/deploy.yml))

### Intake and amendment sequence

| Stage | Required work | Enforcement today |
|---|---|---|
| Scope triage | Check a material event/development within a rolling two-year window, naming eligibility, reachable qualifying sources, tracked WA jurisdiction, and substantive accountability category rather than mere policy disagreement. The dated May 2024 cutoff in `INTAKE.md` is an example, not a permanent cutoff. ([INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md)) | Agent/human procedure; no automated gate found. |
| Classify | Select a unique case ID, stable slug, actor roles at time of event, evidence status, legal status, severity array, and reform links. Check IDs against current Markdown, not the 36-case snapshot. ([INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md)) | Enum/shape validation only; semantic choices remain editorial. |
| Source review | Read primary documents, verify quotes and event dates, trace each dollar amount to a cited source, check actor identities/titles, distinguish filings from findings, and archive Tier 1 documents. ([SOURCES](https://github.com/picsterola/wa-public-watchdogs/blob/main/SOURCES.md)) | Manual; archive helper exists but is not in CI. |
| Cross-case checks | X1 unique ID; X2 resolving references; X3 comparable dollar baselines; X4 actor consistency accounting for role changes; X5 schema validity; X6 explicit remediation and reform statuses. ([INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md)) | X5 and required resolution field shape are build-enforced; the other checks are not wired into the workflow. |
| Amendment governance | Update `last_updated`/`last_verified` only when appropriate; log substantive changes with date, case, changed fact/field, and prompting source. Exoneration uses the existing URL and a tombstone, not silent deletion. ([INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md)) | Manual correction log plus partial template support. |
| Approval and release | Review rendered pages and generated outputs; obtain approval for consequential publication; deploy only the approved change and verify the resulting run/site. | Recommended explicit release gate; GitHub currently has no required PR reviews. |
| Periodic maintenance | Audit tags, reform links, related-case coverage, metadata consistency, source links, and archives monthly or after ten additions, as prescribed in intake. ([INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md)) | Documented cadence, not an active verified research/audit schedule. |

### Data model agents must preserve

The executable schema has four evidence states (`adjudicated`, `documented`, `reported`, `alleged`), nine severity categories, ten legal states, and five review states (`draft`, `internal_review`, `published`, `retracted`, `updated`). It requires at least one actor and severity value, coerces principal dates, requires both resolution statuses, but permits an empty sources array, Tier 3 sources, optional source URLs/archives, and an optional `last_verified`. Those permissive fields are not editorial permission to omit verification. ([Repository schema](https://github.com/picsterola/wa-public-watchdogs))

- **Severity:** `criminal_fraud`, `conflict_of_interest`, `structural_failure`, `rule_gaming`, `special_privileges`, `misuse_public_resources`, `civil_rights_harm`, `statutory_noncompliance`, `aggregate_liability_pattern`. The old intake text listing six categories is stale. ([Repository](https://github.com/picsterola/wa-public-watchdogs))
- **Remediation:** `unknown`, `not_required`, `not_started`, `in_progress`, `implemented_unverified`, `verified_resolved`, `repeat_finding`, `regressed`. Procedural closure is not proof the underlying problem was fixed. ([Repository](https://github.com/picsterola/wa-public-watchdogs))
- **Reform:** `unknown`, `none_proposed`, `bill_introduced`, `bill_in_committee`, `bill_passed`, `bill_died`, `rulemaking_in_progress`, `structural_change_implemented`, `structural_change_failed`. Keep this distinct from remediation and legal posture. ([Repository](https://github.com/picsterola/wa-public-watchdogs))
- **Dollar fields:** Preserve `dollars_at_issue`, `dollars_basis`, and `dollars_confirmed_loss` as different concepts; do not label combined budgets, disputed amounts, settlements, and estimated costs as proven taxpayer loss. The intake procedure specifically requires baseline reconciliation. ([INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md))
- **Source qualification:** A primary complaint establishes that allegations were filed, not that they are true; an agency statement establishes what the agency says, not independent proof of disputed conduct. `SOURCES.md` makes both distinctions explicit. ([SOURCES](https://github.com/picsterola/wa-public-watchdogs/blob/main/SOURCES.md))

### Editorial-policy conflicts to resolve, not paper over

The About page and `SOURCES.md` specify two independent Tier 2 sources or one naming Tier 1 source for private individuals; the older intake gate uses a different public-story formulation. Until the owner resolves the wording, preserve the stronger independent-confirmation standard and the user's public-coverage constraint rather than lowering the bar based on the easiest sentence. Never de-anonymize protected witnesses, minors, or pseudonymous litigants by inference. ([SOURCES](https://github.com/picsterola/wa-public-watchdogs/blob/main/SOURCES.md), [INTAKE](https://github.com/picsterola/wa-public-watchdogs/blob/main/INTAKE.md), [public standards](https://wacountability.org/standards.html))

The legal-audit and portrait-audit generators contain legal generalizations and role-name heuristics; they are triage tools, not legal opinions or proof of license clearance. Do not expand or rely on their legal assertions without qualified review, and do not change the site's public legal-policy language as part of a routine UI task. ([Repository](https://github.com/picsterola/wa-public-watchdogs))

### Publication and distribution behavior

| Surface | Current behavior and risk |
|---|---|
| Case detail routes | `getStaticPaths()` emits every case, regardless of review status. All 29 draft/default-draft records generated pages in this audit. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Homepage and case index | Both load the full collection; the homepage's hero/stat calculations are not limited to approved cases. A draft flag cannot be relied on to keep a record out of discovery. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Featured Top 5 | Only explicit `published` records qualify, unlike other surfaces; `updated` records are also excluded. Scoring considers legal posture, evidence, dollars, Tier 1 presence, recency, severity, and cross-references, with optional editorial pins. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| RSS, agency/reform detail pages, related cases | Exclude retracted records, but not drafts/default drafts. RSS includes up to 50 records ordered by `date_surfaced`, not a complete amendment feed. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| CSV | Exports every Markdown record; it has no publication allowlist or tombstone-specific suppression. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| OG cards | Generated automatically in the normal build for non-retracted records, including drafts. Cards use the resolved slug and evidence-dependent disclaimer; the generator does not establish approval. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Tombstones | Detail template shows retraction notice and suppresses body, reform argument, sources, and faces, but still renders title and sidebar metadata; JSON-LD retains substantive fields with `creativeWorkStatus: Retracted`. Retraction therefore requires a whole-output review, not just flipping one field. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Portraits | Faces display for `documented` and `reported`, not `alleged`, `adjudicated`, or retracted cases. Treat this as existing implementation, not a fully coherent policy for the newer `adjudicated` state. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |

## Build, verify, and release safely

### Full build

From a fresh checkout, the minimum build commands are below. They install the locked dependencies and generate output without pushing, dispatching a workflow, or publishing a site. ([Package scripts](https://github.com/picsterola/wa-public-watchdogs/blob/main/package.json))

```bash
REPO=/absolute/path/to/wa-public-watchdogs
git -C "$REPO" status --short
git -C "$REPO" rev-parse HEAD
npm --prefix "$REPO" ci
npm --prefix "$REPO" run featured:dry
npm --prefix "$REPO" run build
git -C "$REPO" diff --stat
git -C "$REPO" diff -- src/data/featured.json
```

The exact build sequence is `compute-featured` → `download-officials` → `bake-og-bg` → `generate-og-images` → `astro build` → `export-cases-csv` → `relativize`. It mutates the tracked `src/data/featured.json`, can fetch missing portraits, and regenerates assets; the audit build changed only the tracked featured JSON, with no production push. Some helper scripts require checkout-root working directory, so use `npm` scripts or explicitly enter the checkout when invoking helpers directly. ([Package scripts](https://github.com/picsterola/wa-public-watchdogs/blob/main/package.json))

### Before calling a change ready

- **Editorial:** Record the source evidence, exact changed claims, status decisions, naming basis, cross-case checks, and correction-log entry where required.
- **Data:** Validate unique IDs and resolved slugs against all current Markdown; verify required enums and resolution values, source URLs, archives, dates, and supporting Tier 1 documents.
- **Distribution:** Inspect affected detail pages, case index, homepage, agency/reform pages, related cases, RSS, CSV, sitemap/canonical, OG cards, and retraction behavior.
- **Visual:** Test mobile and desktop navigation, filters, query parameters, long notes/URLs, and sharing; spot-check readability and allegation notices. A build and static-path audit do not substitute for browser checks.
- **Routing:** Test at production root and a strict nested prefix if changing paths; a generic server that auto-resolves directory indexes can conceal failures that explicit-file hosting exposes. ([Historical routing rationale](https://github.com/picsterola/wa-public-watchdogs/blob/main/DEPLOY_NOTES.md))
- **Review:** Show the actual diff and test results, including generated changes. Do not silently run backfills, reset dates, update dependencies, or repair unrelated content.
- **Release:** After publication is approved, verify workflow enablement, the intended commit SHA, successful build and deployment jobs, the live canonical route, OG image, and correction/CSV/RSS outputs affected by the change.

### Recovery and emergency pause

For a bad content or code deployment, prefer a targeted revert on a branch and an approved release, preserving the audit trail; factual corrections may additionally require a public correction entry. Never force-push or rewrite published history to conceal an error.

The `.OFFLINE` branch of the workflow creates placeholder `index.html` and `404.html` instead of the full site. It does not execute a normal build or explicitly copy `public/CNAME`; combined with the currently disabled workflow, this means the kill switch must not be described as an independently tested immediate takedown mechanism. Inspect workflow/domain behavior and verify the live result after any authorized use. ([Workflow](https://github.com/picsterola/wa-public-watchdogs/blob/main/.github/workflows/deploy.yml))

## Validation tools and historical evidence

These assets document real work already performed, but the old reports must retain their dates and limited coverage. An agent should use them to understand past failure modes, not cite their totals as a current clean bill of health. ([Actor audit](https://github.com/picsterola/wa-public-watchdogs/blob/main/validation-actors-summary.md), [consistency audit](https://github.com/picsterola/wa-public-watchdogs/blob/main/validation-consistency-summary.md))

| Asset | Purpose and caveat |
|---|---|
| `validation-actors.csv` and `validation-actors-summary.md` | Historical 36-case actor-fact audit; names, titles, parties, evidence classification, and stale legal posture were reviewed. Not automatically rerun by the build. ([Actor audit](https://github.com/picsterola/wa-public-watchdogs/blob/main/validation-actors-summary.md)) |
| `validation-dollars.csv` and `validation-dollars-summary.md` | Historical 36-case dollar/source reconciliation; documents corrected audit baselines, compensation confusion, and noncomparable dollar figures. Not a current automated assertion suite. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `validation-consistency.csv` and summary | Historical 36-case cross-reference, actor, date, dollar-baseline, and tag audit. Some recommendations predate the explicit role-at-time-of-event rule. ([Consistency audit](https://github.com/picsterola/wa-public-watchdogs/blob/main/validation-consistency-summary.md)) |
| `scripts/parse_cases.py` | Parses cases and constructs indexes, but hardcodes `/home/user/workspace/wa-registry`; its case-ID reference regex is limited to `KC`/`WA`, missing other prefixes. Requires Python/PyYAML outside the npm dependency setup. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `scripts/consistency_audit.py` | Cross-case heuristic audit using the parsed JSON, with hardcoded old paths. Review findings rather than mechanically normalizing historical roles or baselines. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `scripts/generate_outputs.py` | Contains hardcoded historical findings as well as report-generation logic. It must not be presented as a fresh general-purpose validator. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `scripts/extract-urls.mjs` + `scripts/check-urls.mjs` | URL extraction uses a hardcoded old checkout and regex-based YAML parsing; checking expects `/tmp/urls.json`, tries HEAD then GET, and emits results. Not part of the build and not a claim-support check. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `scripts/archive-sources.mjs` | Run with `--dry-run --tier=1` to inspect missing Tier 1 archives; actual runs modify cases and submit URLs to an external archival service. `--max=N` bounds actual attempts; verify returned snapshots, including fallback snapshots that may predate intake. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `scripts/audit-alleged-cases.mjs` | Writes `LEGAL_AUDIT.md`, surfacing named actors in alleged/reported records using heuristics. It does not validate truth, approval, or legal defenses. ([Legal-audit artifact](https://github.com/picsterola/wa-public-watchdogs/blob/main/LEGAL_AUDIT.md)) |
| `scripts/audit-portraits.mjs` | Writes `PORTRAIT_AUDIT.md` from portrait metadata; not independent license verification. ([Portrait-audit artifact](https://github.com/picsterola/wa-public-watchdogs/blob/main/PORTRAIT_AUDIT.md)) |
| Backfill helpers | `backfill-resolution-defaults.mjs`, `backfill-leb-resolution.mjs`, `apply-backfill.mjs`, and `fix-leb-urls.mjs` are maintenance/migration helpers, not routine intake checks. Several depend on obsolete paths or external result files; read each before running. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| `REWRITE_RULES.md` / `REWRITE_SUMMARY.md` | Prior readability work: preserve facts, citations, allegation qualifiers, and lay-reader clarity. The “do not change frontmatter” restriction belongs to that body-rewrite task, not every future authorized content amendment. ([Rewrite rules](https://github.com/picsterola/wa-public-watchdogs/blob/main/REWRITE_RULES.md)) |
| Research/manifests | `case-manifest.md`, `needs-sourcing.md`, `regional-agencies-research.md`, and `sps-batch-intake-research.md` preserve research context; reconcile against current cases before treating any item as open or complete. ([Case manifest](https://github.com/picsterola/wa-public-watchdogs/blob/main/case-manifest.md), [sourcing queue](https://github.com/picsterola/wa-public-watchdogs/blob/main/needs-sourcing.md)) |

## Known gaps and recommended next PRs

These are **proposed work packages**, not existing GitHub PRs. None was implemented or published during this documentation audit.

| Priority | Proposed change | Evidence and acceptance condition |
|---|---|---|
| Critical | Enforce one publication policy across all outputs | 29 draft/default-draft cases build today. Define allowed public states with the owner, review the existing records, and apply a shared selector to HTML, discovery, RSS, CSV, OG, and sitemap, with explicit tombstone behavior. Add negative tests proving a draft cannot leak. Do not automatically unpublish the 29 records without an editorial decision. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| High | Restore and verify deployment health | Workflow is `disabled_inactivity`; Pages reports certificate `bad_authz`. Verify current DNS/TLS, enable only with approval, run an approved deployment, and prove the actual live SHA and monthly scheduling state. ([Workflow API](https://api.github.com/repos/picsterola/wa-public-watchdogs/actions/workflows), [Pages API](https://api.github.com/repos/picsterola/wa-public-watchdogs/pages)) |
| High | Make validation reproducible and enforceable | Replace hardcoded paths, regenerate the 87-case index, cover every ID prefix, and add CI checks for uniqueness, internal references, required verification metadata, source-policy violations, publication state, and artifacts. Human evidence review must remain explicit. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| High | Reconcile sourcing policy and current records | Review 36 Tier 1 entries lacking archive URLs and five explicitly Tier 3 entries; replace, remove, or correctly classify only after source review. The five Tier 3 entries occur in `KC-2023-005`, `WA-2025-DOL-LICENSE-EXPRESS`, `WA-2026-META-LEB`, and twice in `WA-2026-WSP-RECORDS-DESTRUCTION`. ([Repository](https://github.com/picsterola/wa-public-watchdogs), [policy](https://github.com/picsterola/wa-public-watchdogs/blob/main/SOURCES.md)) |
| High | Repair CSV schema and canonical links | Exporter reads absent/obsolete top-level date, jurisdiction, agency, and actor fields, and emits trailing-slash URLs instead of `.html`; none of 87 records has its expected `date_first_reported` field. Map current schema deliberately and add URL/data assertions. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Medium | Verify corrections delivery and redirect | Form redirect is `/corrections/thanks`, but the generated page is `/corrections/thanks.html`; the redirect is an absolute hidden value, not fixed by the relativizer. Provider delivery/redirect behavior needs an explicitly authorized end-to-end test. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Medium | Reconcile `adjudicated` and `updated` handling | Schema accepts both, but portrait/ranking/homepage logic does not treat them consistently. Decide intended semantics, update all surfaces, and cover them with fixtures. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Medium | Harden retraction and kill-switch behavior | Review title/sidebar/JSON-LD, exports, indexes, and old OG assets for a retracted record; test offline deployment/domain preservation. A banner alone does not prove suppression. ([Repository](https://github.com/picsterola/wa-public-watchdogs)) |
| Medium | Add PR checks and required review | Add `pull_request` CI and protections appropriate to the owner's workflow; no such checks/protections exist now. Require green checks before marking a PR ready. ([Workflow](https://github.com/picsterola/wa-public-watchdogs/blob/main/.github/workflows/deploy.yml)) |
| Medium | Replace stale onboarding documentation | Add a root `AGENTS.md` pointing to the adopted handoff, correct README live URL/build sequence, label v0.1 deployment notes historical, and reconcile policy/schema wording. ([README](https://github.com/picsterola/wa-public-watchdogs/blob/main/README.md), [deployment notes](https://github.com/picsterola/wa-public-watchdogs/blob/main/DEPLOY_NOTES.md)) |

## Audit boundaries and maintenance

This audit inspected a fresh GitHub clone, complete commit history, PRs/issues, branch/ruleset metadata, workflow runs and enablement, the Pages configuration, deployment-environment policy, repository secret/variable names, current source/templates/scripts, historical audit reports, and an all-session scheduled-task listing. It ran a locked dependency install, full build, current-content inventory, and generated-output structural checks; it did **not** revalidate every source document, submit a correction, run bulk archiving/backfills, check fresh browser/TLS behavior, change DNS, enable workflows, push commits, or publish a site. ([Repository](https://github.com/picsterola/wa-public-watchdogs), [last returned deployment](https://github.com/picsterola/wa-public-watchdogs/actions/runs/30710121330))

Update this handoff whenever routing, schema, deployment, external services, safety gates, or operating commands change. Refresh the verified date and SHA, distinguish implemented changes from proposed ones, add actual PR links once PRs exist, and record tests with their limits; do not carry forward an old “passed” result as proof of the new revision.

This guide belongs at `docs/AGENT-HANDOFF.md` in the website repository and is linked from the root `AGENTS.md`; a companion copy is retained in Perplexity Project Files. The audit snapshot and 70-commit ledger describe the production repository before the documentation PR that introduces these files, so the historical “no PRs” finding does not include that new PR.

## Complete repository change ledger

This ledger lists all 70 commits reachable from the inspected `main` head, oldest first, with their original commit subjects. Subjects describe historical changes; they are not a substitute for reading the diff or verifying current behavior. ([Repository](https://github.com/picsterola/wa-public-watchdogs))

| Date (UTC) | Commit | Change |
|---|---|---|
| 2026-05-21 | [`4b4ab1b`](https://github.com/picsterola/wa-public-watchdogs/commit/4b4ab1b45c0bfb793e8a2a5ef5b18f838ac347fa) | Initial commit: Washington Accountability Registry |
| 2026-05-21 | [`47846fd`](https://github.com/picsterola/wa-public-watchdogs/commit/47846fd1cec9fd7a58876e5ba7045b29e6def1c2) | reforms: collapse case lists per reform into expandable details |
| 2026-05-21 | [`ee1c425`](https://github.com/picsterola/wa-public-watchdogs/commit/ee1c425494b846be9255099891f7931e4b167c63) | reforms: open top 3 case lists by default and auto-open targeted reform |
| 2026-05-21 | [`a5ea0f3`](https://github.com/picsterola/wa-public-watchdogs/commit/a5ea0f3dc81cf5734522ffc84a4223b452cb444d) | OG redesign: site-matched layout, Public Ledger tag, correct scope |
| 2026-05-21 | [`588d451`](https://github.com/picsterola/wa-public-watchdogs/commit/588d451c87d84db818a281ddcbec89f5b12264f0) | OG cards: strip back to minimum (wordmark, headline, url) |
| 2026-05-21 | [`6fd3be0`](https://github.com/picsterola/wa-public-watchdogs/commit/6fd3be0fc5260131d74a1fb27747f1f48649e181) | OG cards: documents-photo background matching homepage hero motif |
| 2026-05-21 | [`748e705`](https://github.com/picsterola/wa-public-watchdogs/commit/748e7058d3240be39d4f69b1b82f7811f34e9133) | Layman readability pass on all 40 case bodies |
| 2026-05-21 | [`8a909b3`](https://github.com/picsterola/wa-public-watchdogs/commit/8a909b3e027b4bbedcfe6d26f6cd3778327892a3) | Update default meta description to reflect full scope (state, county, city, regional bodies) |
| 2026-05-21 | [`f7108da`](https://github.com/picsterola/wa-public-watchdogs/commit/f7108da0e7f244bd076223dd852bb54b201693bc) | Home OG: add scope line above URL (State · King County · Seattle · Regional bodies) |
| 2026-05-21 | [`95a75dd`](https://github.com/picsterola/wa-public-watchdogs/commit/95a75dd64acebf3c11112faa53e8b8fc13a9f375) | Legal hardening: Allegation banner, OG stripe, audit scripts, methodology right-of-response |
| 2026-05-21 | [`a54f946`](https://github.com/picsterola/wa-public-watchdogs/commit/a54f946f31c67d442881b4a66af318bf18c9c6b7) | Add .OFFLINE kill switch for clean site pause/resume |
| 2026-05-21 | [`565a513`](https://github.com/picsterola/wa-public-watchdogs/commit/565a5139d06600b41cb61f3080fd3c1025d0f8ba) | LEB calibration: rewrite reform brief to target real gaps, add selection rule to methodology, add 4 new cases (Saldaña 24-01, Dhingra 24-09, Trudeau 24-10, Wilson 24-11) for category coverage and partisan balance |
| 2026-05-21 | [`1c92418`](https://github.com/picsterola/wa-public-watchdogs/commit/1c92418c2747b9214c698272e784e6c1a305aa23) | LEB calibration: layman pass on Wilson 24-11 reform argument and analysis |
| 2026-05-21 | [`6aeb432`](https://github.com/picsterola/wa-public-watchdogs/commit/6aeb43217bea3fc42c819790ba4f41ed140965a1) | LEB: point every case at canonical per-opinion URL; correct reform brief |
| 2026-05-21 | [`c13b517`](https://github.com/picsterola/wa-public-watchdogs/commit/c13b5173655b5ccdfd0259c99ab313dbb74d7d8a) | Add SEA-2025-005 Seattle gun violence governance audit case |
| 2026-05-21 | [`3987b2c`](https://github.com/picsterola/wa-public-watchdogs/commit/3987b2c301bd0642eca8ffa142256e5c6721894f) | Add KC-2024-002 Jimerson Freedom Project Ombuds + KC-2026-008 Clark Nuber DCHS forensic |
| 2026-05-21 | [`6336ed5`](https://github.com/picsterola/wa-public-watchdogs/commit/6336ed5ad4ee970f6f9c5f40b35e9e2951ffdd23) | Round 1 triage intake: 9 new cases + DCYF expansion |
| 2026-05-22 | [`e241422`](https://github.com/picsterola/wa-public-watchdogs/commit/e2414224a381db4ab4f71028edf06e264e218a04) | Schema enum expansion + Round 1 backfill + One Washington PDF |
| 2026-05-22 | [`61f37c8`](https://github.com/picsterola/wa-public-watchdogs/commit/61f37c8cb8669355116ff79c877338dedc8d2dea) | Generalize independent_inspector_general reform brief across jurisdictions |
| 2026-05-22 | [`d9bcb6a`](https://github.com/picsterola/wa-public-watchdogs/commit/d9bcb6a2288b16e6e9c47f0dee704d74f1e8cef8) | Homepage hero: tighter lede + new italic 'why' line in terracotta |
| 2026-05-22 | [`f91e338`](https://github.com/picsterola/wa-public-watchdogs/commit/f91e3380c7ca66ed20bd12fefdd5d9fefb666b3a) | Round 2 intake: 12 new cases — OCO/DOC, OFCO/DCYF, DDA, Commerce, DOL, HHS OIG |
| 2026-05-22 | [`7c7977b`](https://github.com/picsterola/wa-public-watchdogs/commit/7c7977b7e5ca129fce5c98894f2690fc446c23f9) | Round 2 cleanup: rename HHS OIG case to 2024 prefix, WCCW UOF direct PDF + DOC response |
| 2026-05-22 | [`d0a4287`](https://github.com/picsterola/wa-public-watchdogs/commit/d0a4287490f5c6a31c4ea45210229fef89180fbf) | Custom domain rebrand → wacountability.org |
| 2026-05-22 | [`1bd9160`](https://github.com/picsterola/wa-public-watchdogs/commit/1bd916015f495b0b5baa06ed0c1ed9f613c68f8d) | Swap corrections form provider Formspree → Web3Forms |
| 2026-05-22 | [`77b5423`](https://github.com/picsterola/wa-public-watchdogs/commit/77b54230309097c68cc0518edaf810f56500bab8) | Wire Web3Forms access key for corrections intake |
| 2026-05-22 | [`540ee96`](https://github.com/picsterola/wa-public-watchdogs/commit/540ee9602df4968a1ec40d0d5575d10baaf936e6) | Domain rebrand: bake wacountability.org into OG images + CSV export |
| 2026-05-22 | [`f4e3604`](https://github.com/picsterola/wa-public-watchdogs/commit/f4e36046f8ef0caf47e52eefb18e72eee19c9640) | Wayback archival pass 1: archive_url backfill on 53 sources across 25 cases |
| 2026-05-23 | [`d609e85`](https://github.com/picsterola/wa-public-watchdogs/commit/d609e85482f703916dedc8999b78db5756e7bbe5) | Schema: add resolution tracking (remediation + reform status) |
| 2026-05-23 | [`f5c799e`](https://github.com/picsterola/wa-public-watchdogs/commit/f5c799e018d19961d7c9dae33b06060f28dd73d0) | Resolution backfill: 15 priority cases |
| 2026-05-23 | [`a33899a`](https://github.com/picsterola/wa-public-watchdogs/commit/a33899aeb0b72561facf1cc0b7d33f287fc06ed3) | Fix: severity tile overflow on /cases (missing labels + word-wrap) |
| 2026-05-23 | [`87d4a54`](https://github.com/picsterola/wa-public-watchdogs/commit/87d4a54759bc1b37aa3dcc0d62b3269fcc1ea221) | About: generalize Tier 3 advocacy exclusion (drop named orgs) |
| 2026-05-23 | [`20619a8`](https://github.com/picsterola/wa-public-watchdogs/commit/20619a888a4007af4056faf53498cfd722ff226f) | DCYF: clarify FY2024 vs four-year disclaimer scope, flag unverified year-by-year breakdown |
| 2026-05-23 | [`8c17937`](https://github.com/picsterola/wa-public-watchdogs/commit/8c179375bc1035f972e47e084be36c4f1f7c4ca4) | Add KCSARC Navigating Justice plea-down pattern case (KC-2024-003) |
| 2026-05-23 | [`c45586d`](https://github.com/picsterola/wa-public-watchdogs/commit/c45586d680219d2ed92b225d92a5667d26d9697f) | Add KC RCP accountability gap case (KC-2023-004) |
| 2026-05-23 | [`76c8ee9`](https://github.com/picsterola/wa-public-watchdogs/commit/76c8ee982e4635fa10d5132d6f42700feebd82c3) | Add Community Passageways embezzlement conviction case (KC-2023-005) |
| 2026-05-23 | [`56f4dd6`](https://github.com/picsterola/wa-public-watchdogs/commit/56f4dd6e8077a0684e665351768f5bc88b3a7860) | RCP case: expand narrative |
| 2026-05-23 | [`e0b0b69`](https://github.com/picsterola/wa-public-watchdogs/commit/e0b0b69edab84af597e4195487be7813e119049a) | Add LEB enforcement-pattern meta-case + backfill 15 LEB individual cases |
| 2026-05-23 | [`ff83989`](https://github.com/picsterola/wa-public-watchdogs/commit/ff83989f40199c8bdefcaea80eb247b70e6c3e64) | Custom OG for LEB meta-case: stat-grid layout |
| 2026-05-23 | [`6003e6b`](https://github.com/picsterola/wa-public-watchdogs/commit/6003e6b19f4a12ce0a1c469cbcefbe8f149efffb) | LEB meta-case: correct legal_status from under_investigation to no_action |
| 2026-05-23 | [`b05f617`](https://github.com/picsterola/wa-public-watchdogs/commit/b05f617e7a20dbdcf1939085fb69f1831c4205a2) | Resolution tracking: schema hardening + intake req + filter UI |
| 2026-05-23 | [`5a413f6`](https://github.com/picsterola/wa-public-watchdogs/commit/5a413f67082a5ac82f725dfa45df96f62dc3ce05) | Add WSP records destruction case (WA-2026-WSP-RECORDS-DESTRUCTION); fix DOL source type enum |
| 2026-05-23 | [`c0cc10b`](https://github.com/picsterola/wa-public-watchdogs/commit/c0cc10b379ce380cc45f771c379ac18a5ca26166) | WSP case: tighten pattern claim — only 1 of 3 matters alleges destruction |
| 2026-05-24 | [`e96ff1d`](https://github.com/picsterola/wa-public-watchdogs/commit/e96ff1dc5c799017aebafb35cfdf25d2421a39d4) | SEO foundations: sitemap, robots.txt, canonical, JSON-LD Report |
| 2026-05-24 | [`b4d70f2`](https://github.com/picsterola/wa-public-watchdogs/commit/b4d70f228f0e94997fec82ccc75be7e87a55cdb5) | SEO buildout: agency + reform landing pages, related cases, RSS, CSV export, Data section |
| 2026-05-24 | [`1d06b01`](https://github.com/picsterola/wa-public-watchdogs/commit/1d06b01b0fc110da5ed2d3e3424f4c71a4147dcb) | Resolution backfill: 27 cases updated with verified remediation and reform status |
| 2026-05-24 | [`0fe488f`](https://github.com/picsterola/wa-public-watchdogs/commit/0fe488f64c8cd6287558d07e62d5775adc130a91) | Add /standards editorial standards page |
| 2026-05-24 | [`d210728`](https://github.com/picsterola/wa-public-watchdogs/commit/d21072898bd2e43d4b17854d8c2e491c8e47191b) | Move Standards link off main nav, surface from About page |
| 2026-05-24 | [`1a81714`](https://github.com/picsterola/wa-public-watchdogs/commit/1a8171451e12336d67069177f3378078b5f55a40) | Remove redundant footer corrections link |
| 2026-05-24 | [`e5de3fc`](https://github.com/picsterola/wa-public-watchdogs/commit/e5de3fc4b2d7912228a652f9d15d0385d48fa1ea) | Add styled RSS feed landing via XSL stylesheet |
| 2026-05-24 | [`e1dcbdc`](https://github.com/picsterola/wa-public-watchdogs/commit/e1dcbdc0021d98a8bd338d78bdf3bde6aa43e17c) | Fix illegible hero links on dark background |
| 2026-05-24 | [`9d48654`](https://github.com/picsterola/wa-public-watchdogs/commit/9d4865413fcf5859f63b4c4eb616717bb75617ed) | Fix sidebar overflow when long URLs appear in resolution notes |
| 2026-05-24 | [`b61a279`](https://github.com/picsterola/wa-public-watchdogs/commit/b61a27984e050bc6f8894a3549a4bfa0e2e25f4f) | cases: strip raw URLs from resolution notes; promote missing URLs to structured sources |
| 2026-05-24 | [`456368a`](https://github.com/picsterola/wa-public-watchdogs/commit/456368ab24f7b9f76ee55f02bb6e4b4e81365c63) | cases: render long-form fields as paragraphs, not single bricks of text |
| 2026-05-24 | [`b39b666`](https://github.com/picsterola/wa-public-watchdogs/commit/b39b66653fb54d25883bbd30bde710134b6ccc5d) | sources: backfill existing Wayback archive_urls for 101 sources across 42 cases |
| 2026-05-24 | [`385ed5a`](https://github.com/picsterola/wa-public-watchdogs/commit/385ed5af71c69376dd44915852936136fcd209ba) | sources: phase 2b+2c Wayback backfill - 53 newly-saved archives applied |
| 2026-05-24 | [`afda0c6`](https://github.com/picsterola/wa-public-watchdogs/commit/afda0c655a8e3518a32a2f8c2bb65c75577e1779) | Add SEA-2026-006: Cal Anderson MayDay USA SER |
| 2026-05-24 | [`03bf2d8`](https://github.com/picsterola/wa-public-watchdogs/commit/03bf2d8f6488b427246f70ddc7967c03f2deaa32) | Add SEA-2025-006: OIG decade-review of SPD claims and lawsuits |
| 2026-05-24 | [`bc248f8`](https://github.com/picsterola/wa-public-watchdogs/commit/bc248f8d9bf8e0791f8133fa4e4e719b6d59e319) | Add SEA-2024-002: OIG Follow-Up Audit of SPD Disciplinary Determinations |
| 2026-05-24 | [`fc7ad45`](https://github.com/picsterola/wa-public-watchdogs/commit/fc7ad45d67b41d56cabdbf6b044c259967e86de3) | Add SEA-2025-007 and SEA-2026-007: City Auditor recommendation status + SPD sick-leave gaming |
| 2026-05-24 | [`94fc59e`](https://github.com/picsterola/wa-public-watchdogs/commit/94fc59e3b17e1423efb647c0d83898e9beadc326) | Re-review bump and schema cleanup |
| 2026-05-24 | [`d29777b`](https://github.com/picsterola/wa-public-watchdogs/commit/d29777b1f1306934f28e832d6d7da9ae3cdb4a77) | Add 3 OLEO/KCSO oversight cases: traffic enforcement non-response, 2024 IIU annual report, OLEO-KCSO disposition disagreements |
| 2026-05-24 | [`0bb1a5f`](https://github.com/picsterola/wa-public-watchdogs/commit/0bb1a5f7673dc942f0c5edcc060820aa7354c43d) | Add 3 KC Auditor cases: IG feasibility study, civil asset forfeiture, jail behavioral health |
| 2026-05-24 | [`639fc26`](https://github.com/picsterola/wa-public-watchdogs/commit/639fc26a877a1f239ba04682ca5dd9491a5312f4) | Add 3 KC Auditor round-2 cases: KCSO 911 BH gaps, Cyber Resilience disclosure-exempt, Permits SB 5290 pre-audit |
| 2026-05-24 | [`d3b669d`](https://github.com/picsterola/wa-public-watchdogs/commit/d3b669d4f158fdcccd1ae623adecca019e28c140) | Fix YAML: quote '911' tag to avoid number parsing |
| 2026-05-24 | [`58e096d`](https://github.com/picsterola/wa-public-watchdogs/commit/58e096d6452a3ecc1933b3ca984f7dc87e5b2bbb) | Cross-link IG proposal and Auditor+Ombuds feasibility study cases |
| 2026-05-24 | [`a6cd4ba`](https://github.com/picsterola/wa-public-watchdogs/commit/a6cd4ba32e2395ddc388d9e0a9e9a4a9c434ab76) | Fix social share: per-case share URL + OG cards for all 87 cases |
| 2026-05-24 | [`a4c852b`](https://github.com/picsterola/wa-public-watchdogs/commit/a4c852b2c81adecfb40c93b714e2c448f800c38f) | Simplify social share text: just the case headline + link |
| 2026-05-27 | [`1b4102b`](https://github.com/picsterola/wa-public-watchdogs/commit/1b4102b9c2c2f11b4e6f2b8fe151e78f19911947) | Rewrite WA-2025-TORT-AGGREGATE with FY25 ~$502M lead, $2.5B pending liability, HB 2706 claims commission |
| 2026-05-27 | [`e9f50f5`](https://github.com/picsterola/wa-public-watchdogs/commit/e9f50f5ba263813ae78544b9b8dad0402a8b3a7c) | Tighten tort case OG headline: lead with FY25>FY23+FY24, stop repeating $502M |
| 2026-06-01 | [`6745b8e`](https://github.com/picsterola/wa-public-watchdogs/commit/6745b8eea2405f7a64e43d153d80f9270b5f907b) | Align sitemap URLs with canonical pages |
