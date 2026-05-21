import { defineConfig } from 'astro/config';

// Public canonical URL for the site (used in OG meta tags and sitemap).
// GitHub Pages project site lives at https://picsterola.github.io/wa-public-watchdogs/.
// Note: build paths are made relative by scripts/relativize.mjs, so the
// site works at any subpath without setting Astro's `base` option.
export default defineConfig({
  site: 'https://picsterola.github.io/wa-public-watchdogs',
  // 'never' to match `build.format: 'file'` semantics — links target
  // explicit .html files (e.g. /reforms.html), not directory paths.
  trailingSlash: 'never',
  build: {
    // Emit one .html file per route instead of nested directories with
    // index.html. Required for static hosts that do not resolve
    // directory paths to index.html.
    format: 'file',
  },
});
