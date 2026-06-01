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
      // The deploy host (and scripts/relativize.mjs) serve explicit `.html`
      // files — directory paths 404. Every page's <link rel="canonical">,
      // og:url, and internal links resolve to the `.html` URL, so the sitemap
      // must list that exact same URL. Without this, Astro emits extensionless
      // locs (e.g. /about) that don't match the canonical (/about.html),
      // which Search Console flags as "Duplicate without user-selected
      // canonical" / "Alternate page with proper canonical tag".
      serialize(item) {
        const u = new URL(item.url);
        // Root stays the bare origin (https://wacountability.org) to match
        // index.html's self-canonical; `trailingSlash: 'never'` normalizes it.
        if (u.pathname === '/' || u.pathname === '') return item;
        // Any other extensionless route -> append `.html`. Skip paths that
        // already have a file extension (none currently, but future-proof).
        const lastSeg = u.pathname.split('/').pop() ?? '';
        if (!/\.[a-zA-Z0-9]{1,8}$/.test(lastSeg)) {
          u.pathname = u.pathname.replace(/\/+$/, '') + '.html';
          item.url = u.toString();
        }
        return item;
      },
    }),
  ],
});
