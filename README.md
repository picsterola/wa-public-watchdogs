# Washington Accountability Registry

Open accountability cases across Washington State, King County, and Seattle government — fraud, conflicts of interest, structural oversight failures — sourced from public records.

**Live site:** https://picsterola.github.io/wa-public-watchdogs/

## Stack

- [Astro](https://astro.build/) static site
- Markdown case files in `src/content/cases/`
- Satori + Resvg for per-case OpenGraph cards
- Sharp for portrait normalization (256×256 grayscale JPEG)
- Deployed via GitHub Pages from `dist/`

## Build

```bash
npm install
npm run build           # full build pipeline (see scripts in package.json)
npm run dev             # local dev server
npm run featured:dry    # preview the homepage Top 5 ranking
```

The `npm run build` step runs, in order:

1. `compute-featured.mjs` — recompute homepage Top 5 from case scores
2. `download-officials.mjs` — fetch and grayscale portraits listed in `src/data/officials.json`
3. `generate-og-images.mjs` — render per-case OG cards
4. `astro build` — emit static HTML
5. `relativize.mjs` — rewrite absolute asset paths to relative so the site works at any subpath

## Data model

Cases live in `src/content/cases/<slug>.md` as Markdown with YAML frontmatter. Schema is enforced by `src/content/config.ts`. See `docs/schema.md` (if present) and existing case files for the shape.

Officials portraits and titles are registered in `src/data/officials.json`. Only cases with `evidentiary_status: documented` or `reported` render portrait cards; `alleged` and `retracted` always render plain text.

## Editorial policy

- Tier 1 source citation required for every claim.
- Documented + Reported only for portrait surfacing.
- Corrections logged in `src/pages/corrections.astro`.
- See `src/pages/methodology.astro` for full editorial criteria.

## License

Code: MIT. Case text and source citations: facts are not copyrightable; any original analysis is released CC BY 4.0. Portraits remain under their respective source licenses (see `src/data/officials.json`).
