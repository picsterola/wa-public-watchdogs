import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public canonical URL for the site (used in OG meta tags and sitemap).
// Custom domain: https://wacountability.org (Cloudflare DNS, GitHub Pages host).
// Note: build paths are made relative by scripts/relativize.mjs, so the
// site works at any subpath without setting Astro's `base` option.
export default defineConfig({
  site: 'https://wacountability.org',
  // 'never' to match `build.format: 'file'` semantics — links target
  // explicit .html files (e.g. /reforms.html), not directory paths.
  trailingSlash: 'never',
  build: {
    // Emit one .html file per route instead of nested directories with
    // index.html. Required for static hosts that do not resolve
    // directory paths to index.html.
    format: 'file',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
