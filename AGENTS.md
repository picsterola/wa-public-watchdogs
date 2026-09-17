# Agent instructions

This repository runs the Washington Accountability Registry at **https://wacountability.org/**. It is a separate Astro static site on GitHub Pages, not Firehose, CivicTide, or Culliton.

## Read before making changes

Start with [Infrastructure and Agent Handoff](docs/AGENT-HANDOFF.md). It maps the infrastructure, validation funnel, source files, historical commits, known gaps, and verification procedures, with a dated repository audit.

Then read the materials relevant to the task:

- [INTAKE.md](INTAKE.md): intake and amendment procedure.
- [SOURCES.md](SOURCES.md): source qualification, archival requirements, and naming rules.
- [src/content/config.ts](src/content/config.ts): executable schema.
- [package.json](package.json): actual build commands.
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml): deployment and emergency-pause behavior.
- The affected templates and scripts, plus the public policy pages under `src/pages/`.

The handoff is a dated snapshot, not a live status service. Recheck the current branch, workflow state, and relevant code; older README/deployment notes and validation reports contain stale instructions and limited historical coverage.

## Safety boundaries

- Keep changes within the user's authorized scope. Do not merge, publish, alter DNS, enable workflows, change repository protections, or modify public case claims without appropriate approval.
- Treat `src/content/cases/` as public content. The audited implementation generates case pages even for `draft` or missing review status; a draft flag is not a privacy or publication barrier. Public branches also expose their source.
- Never mark drafts published merely to eliminate a metadata discrepancy. Review editorial intent first.
- A successful build is not factual verification or editorial approval. Perform the applicable source, naming, dollar, status, cross-reference, and correction-log checks.
- Preserve stable case URLs. Substantive corrections need the public corrections log; exoneration/retraction requires reviewing every distribution surface, not silently deleting a record.
- Do not run `npm run offline` or `npm run online` as local tests. They commit and push to `origin main`.
- Do not run historical backfills or archive submissions casually. Read their implementation, dependencies, write effects, and external effects first.
- Legal-audit and portrait-audit scripts are review aids, not legal opinions or proof of image licensing.
- Never print or commit credentials. Use the available authenticated tooling and preserve the repository's configured author identity.

## Build and verification

Use Node 20 and the committed npm lockfile. From the checkout root:

```bash
npm ci
npm run featured:dry
npm run build
git diff --stat
git diff -- src/data/featured.json
```

The build can change tracked `src/data/featured.json`; inspect generated changes and do not accidentally include unrelated build churn. Preserve explicit `.html` routes, resolved slugs, canonical URLs, and the post-build path relativizer.

For code or content changes, follow the handoff's pre-release checklist. Report exactly what was tested and what was not; no configured PR checks is not the same as green CI.

For documentation-only changes, verify local document links, whitespace, accuracy against source, and the exact changed-file scope. Do not alter runtime files or invoke production actions merely to update documentation.

## Handoff maintenance

Update `docs/AGENT-HANDOFF.md` when infrastructure, schema, routing, safeguards, or operating procedures change. Keep historical findings dated, distinguish implemented fixes from recommendations, and add actual PR references without rewriting the pre-handoff commit history.
