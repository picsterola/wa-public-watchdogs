#!/usr/bin/env node
// Generate OG share-card images for every case + the homepage.
// Output: public/og/<slug>.png and public/og/home.png
// Engine: satori (HTML/JSX -> SVG) + @resvg/resvg-js (SVG -> PNG)

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url))); // wa-registry/
const CASES_DIR = join(ROOT, 'src', 'content', 'cases');
const OUT_DIR = join(ROOT, 'public', 'og');
const FM = join(ROOT, 'node_modules', '@fontsource');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Load fonts as Buffers
const FONTS = [
  {
    name: 'SourceSerif4',
    data: readFileSync(join(FM, 'source-serif-4', 'files', 'source-serif-4-latin-700-normal.woff')),
    weight: 700, style: 'normal',
  },
  {
    name: 'SourceSerif4',
    data: readFileSync(join(FM, 'source-serif-4', 'files', 'source-serif-4-latin-400-normal.woff')),
    weight: 400, style: 'normal',
  },
  {
    name: 'SourceSerif4',
    data: readFileSync(join(FM, 'source-serif-4', 'files', 'source-serif-4-latin-400-italic.woff')),
    weight: 400, style: 'italic',
  },
  {
    name: 'JetBrainsMono',
    data: readFileSync(join(FM, 'jetbrains-mono', 'files', 'jetbrains-mono-latin-600-normal.woff')),
    weight: 600, style: 'normal',
  },
];

// Palette - matches site
const NIGHT = '#0f0e0b';
const CREAM = '#f6f2e9';
const ACCENT = '#7a1f1f';
const TERRACOTTA = '#d68b7d';
const MUTED = 'rgba(246, 242, 233, 0.6)';

function formatDollars(n) {
  if (!n) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${Math.round(n / 1e6)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${n}`;
}

// Take a case title like "DCHS contract oversight failure — $1.8B+ program, ~1% of spending reviewed"
// and split into headline (before em-dash) + sub (after)
function splitTitle(t) {
  const idx = t.indexOf('—');
  if (idx < 0) return { head: t.trim(), sub: '' };
  return { head: t.slice(0, idx).trim(), sub: t.slice(idx + 1).trim() };
}

// Card builder - returns a satori-compatible element tree
function buildCard({ dollars, head, sub, eyebrow }) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1200px',
        height: '630px',
        padding: '64px 72px',
        background: NIGHT,
        color: CREAM,
        fontFamily: 'SourceSerif4',
      },
      children: [
        // Top eyebrow
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'JetBrainsMono',
              fontSize: '20px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: TERRACOTTA,
            },
            children: eyebrow,
          },
        },
        // Middle - dollars + title stacked
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '20px' },
            children: [
              dollars && {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: '128px',
                    fontWeight: 700,
                    color: ACCENT,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  },
                  children: dollars,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: dollars ? '52px' : '76px',
                    fontWeight: 700,
                    color: CREAM,
                    lineHeight: 1.15,
                    letterSpacing: '-0.01em',
                    maxWidth: '1050px',
                  },
                  children: head,
                },
              },
              sub && {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: '30px',
                    fontStyle: 'italic',
                    color: MUTED,
                    lineHeight: 1.3,
                    maxWidth: '1050px',
                  },
                  children: sub,
                },
              },
            ].filter(Boolean),
          },
        },
        // Bottom - registry mark + tagline
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: `1px solid rgba(246, 242, 233, 0.18)`,
              paddingTop: '28px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'JetBrainsMono',
                          fontSize: '20px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: CREAM,
                        },
                        children: 'Washington Accountability Registry',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '22px',
                          color: MUTED,
                        },
                        children: 'Tracking scandals, audits, and accountability failures across WA government.',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderToPng(element, outPath) {
  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: FONTS,
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(outPath, png);
}

async function main() {
  const files = readdirSync(CASES_DIR).filter((f) => f.endsWith('.md'));
  console.log(`[og] Generating ${files.length} case OG images + homepage...`);

  // Per-case cards
  let count = 0;
  for (const file of files) {
    // File names look like 2025-sound-transit-st3-program-reset.md.
    // Astro content-collection slug strips the leading YYYY- prefix.
    const rawSlug = basename(file, '.md');
    const slug = rawSlug.replace(/^\d{4}-/, '');
    const raw = readFileSync(join(CASES_DIR, file), 'utf-8');
    const { data } = matter(raw);
    if (data.review_status === 'retracted') continue;

    const dollars = formatDollars(data.dollars_at_issue);
    const { head, sub } = splitTitle(data.title || '');

    const card = buildCard({
      dollars,
      head,
      sub,
      eyebrow: `Case ${data.id ?? slug}`,
    });

    await renderToPng(card, join(OUT_DIR, `${slug}.png`));
    count++;
  }

  // Homepage card
  const home = buildCard({
    dollars: null,
    head: "Watchdogs are only as good as the public's attention span.",
    sub: 'Every open accountability case across WA state, county, and Seattle government, in one place.',
    eyebrow: '40 cases on file · refreshed monthly',
  });
  await renderToPng(home, join(OUT_DIR, 'home.png'));

  console.log(`[og] Wrote ${count} case cards + home.png to public/og/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
