# WA Registry v0.1 — Deploy Notes

## Preview URL (deployed)

https://www.perplexity.ai/computer/a/washington-accountability-regi-dzSD465sT4uOmw7dMmWm.w

To update: edit files under `/home/user/workspace/wa-registry/src/`, run `npm run build` from `/home/user/workspace/wa-registry/`, then re-call `deploy_website` with `project_path=/home/user/workspace/wa-registry/dist`.

## Re-deploy arguments

```
project_path: /home/user/workspace/wa-registry/dist
site_name:    Washington Accountability Registry
entry_point:  index.html
```

## Stack

- Astro 4.16 (static, no SSR), no SQL/server.
- Content collection `cases` in `src/content/cases/*.md` with Zod schema in `src/content/config.ts`.
- Self-hosted Source Serif 4 + Inter via Fontsource (no Google Fonts CDN, no analytics, no tracking).
- One inline `<script>` on `/cases` for client-side filter/sort logic, no client frameworks.
- **`astro.config.mjs` uses `build.format: 'file'` and `trailingSlash: 'never'`.** This makes Astro emit `dist/reforms.html`, `dist/cases.html`, `dist/cases/<slug>.html`, etc. instead of `dist/reforms/index.html`. The Perplexity proxy (and most strict static hosts) do NOT resolve directory paths to `index.html`, so `/reforms/` would 404. Emitting explicit `.html` files makes every route reachable by literal file path.
- **Post-build path relativizer** at `scripts/relativize.mjs`. `npm run build` runs `astro build && node scripts/relativize.mjs`, which walks `dist/` and rewrites every absolute-rooted `href="/..."`, `src="/..."`, and CSS `url(/...)` reference to the correctly-depth relative path, appending `.html` to internal route targets and never using trailing slashes. The brand link `/` and other internal route links resolve to `./index.html`, `./reforms.html`, `../cases.html`, etc. depending on depth. This lets the same `dist/` build serve from any sub-path (Perplexity's `/computer/a/<id>/...` proxy, GitHub Pages project subdirectories, `file://`, etc.) with no rebuild. Astro's native `base` option requires an absolute sub-path known at build time and does not emit relative URLs, so the post-build step is the only sub-path-agnostic option.
- **Sub-path testing.** `/tmp/strict_server.py` is a static server that mirrors the Perplexity host: it serves files by exact path, returns 404 for directory paths (including `cases/`, `reforms/`, etc.), and resolves only the sub-path apex to the deployed `entry_point`. Playwright was run against this server at a deeply nested sub-path (`/some/nested/prefix/site/`) against all 8 pages and every nav link: zero failed requests, zero ≥400 responses, every link resolves. `python3 -m http.server` is NOT suitable for this test because it auto-resolves directory paths and gives a false pass.

## What ships

- `/`               — Mission, stat tiles (counts by status + total dollars), recent updates list.
- `/cases`          — Filterable case index. Three-axis chip filters (status, severity, reform) + jurisdiction/year/party selects + sort. URL query params reflect active filters.
- `/cases/[slug]`   — Detail page with sidebar metadata, sources section with tier badges + archive links, reform callout, and retraction tombstone when `review_status: retracted`.
- `/about`          — Mission, source tier table, naming policy, partisan asymmetry disclosure, time horizon, retraction policy, maintainer placeholder.
- `/methodology`    — Three-axis taxonomy, tier definitions, entry/update/retraction workflow, exclusions.
- `/reforms`        — Auto-generated index of every unique `reforms_implicated` slug with the cases that implicate it. Stub per-reform write-ups.

## Three sample cases render

- `dchs-systemic-audit` (documented, structural_failure + misuse_public_resources, $1.87B)
- `kc-youth-program-self-dealing` (alleged, criminal_fraud + conflict_of_interest + special_privileges, $813K)
- `leb-25-09-jinkins-public-resources` (alleged, misuse_public_resources + rule_gaming, party: D)

## Schema notes

The Astro content collection schema in `src/content/config.ts` mirrors SCHEMA.md exactly:

- enums for `evidentiary_status`, `role_type`, `legal_status`, `source.tier` (1/2/3 literal union), `source.type`, `review_status`, `severity_type`.
- `reforms_implicated` is open-ended string array (slugs are free-form; the reforms page auto-discovers them).
- `actors` is a non-empty array of typed actor objects.
- `sources` is a typed array; `source.date` accepts a real Date, a string year, or a number year — the sample case has `date: 2025` (a number) which would otherwise be misinterpreted as epoch ms.
- All canonical date fields coerce from YAML strings to JS `Date`.

**Note on `slug`:** Astro reserves the top-level `slug` field on content entries for the URL slug derived from the filename. The schema's `slug:` frontmatter field is therefore not declared in Zod, but Astro picks it up natively and uses it as the entry slug, so URLs come out as `/cases/dchs-systemic-audit/` (matching the frontmatter), not `/cases/2025-dchs-systemic-audit/` (the filename stem). This is the documented Astro behavior and required no special handling beyond removing `slug` from the Zod schema.

## Build status

`npm run build` is clean (8 pages, ~2 s).

## What is stubbed

- Per-reform write-ups on `/reforms` show only auto-generated case lists with placeholder italic text; full reform briefs are out of scope for v0.1.
- "Who runs this" on `/about` is the placeholder line specified in the task (Viet Nguyen / former King County Council staff). User is expected to edit.
- No archive_url fields are populated on the three sample cases (the cases themselves have `# TODO: archive` comments). The detail page surfaces "No archive copy yet" alongside any tier-1 source lacking an archive.
- The retraction tombstone is implemented but no sample case uses `review_status: retracted` — verified by code path, not visual.
- No sitemap.xml integration enabled (the dep is installed but the integration is not wired into `astro.config.mjs` to keep the v0.1 surface minimal).
- No GitHub Pages config — `astro.config.mjs` has a placeholder `site:` value. User will need to set `site` and `base` when wiring to a real domain or `username.github.io` repo.

## What is intentionally absent (per task)

No analytics, no Google Fonts, no newsletter, no donation button, no contact form, no social share, no comments, no dark mode toggle, no tip submission form, no React/Express/SQLite.
