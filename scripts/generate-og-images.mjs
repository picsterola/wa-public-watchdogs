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
const BG_PATH = join(ROOT, 'public', 'img', 'og-bg.jpg');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Load baked background (documents photo + scrim) as a data URL satori can use.
const BG_DATA_URL = `data:image/jpeg;base64,${readFileSync(BG_PATH).toString('base64')}`;

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

// Ledger mark (matches src/components/Logo.astro) as a satori-friendly
// SVG tree. Two horizontal bars + vertical axis inside a square.
function ledgerMark(size = 44, color = CREAM) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 32 32',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      children: [
        { type: 'rect', props: { x: 3, y: 3, width: 26, height: 26, stroke: color, strokeWidth: 1.5, fill: 'none' } },
        { type: 'line', props: { x1: 3, y1: 12, x2: 29, y2: 12, stroke: color, strokeWidth: 1.5 } },
        { type: 'line', props: { x1: 3, y1: 20, x2: 29, y2: 20, stroke: color, strokeWidth: 1.5 } },
        { type: 'line', props: { x1: 16, y1: 3, x2: 16, y2: 29, stroke: color, strokeWidth: 1.5 } },
      ],
    },
  };
}

// Headline composer: render a plain headline div, optionally followed by an
// italic terracotta accent line. Satori doesn't reliably wrap inline spans
// across lines (spans collide visually), so we put the accent on its own
// line below, which also matches the site h1 pattern where the italic
// keyword usually sits at the end.
function headlineBlock(head, fontSize, accentWord) {
  // Strip the accent word from the end of `head` if present, so we can
  // render it as its own line below. If not present at end, leave `head`
  // intact and skip the accent line.
  let mainText = head;
  let accentText = null;
  if (accentWord) {
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('\\s*' + escaped + '\\s*\\.?\\s*$', 'i');
    const m = head.match(re);
    if (m) {
      mainText = head.slice(0, head.length - m[0].length).replace(/[\s,;:]+$/, '');
      accentText = m[0].trim().replace(/\.$/, '');
    }
  }
  const children = [
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          color: CREAM,
          lineHeight: 1.12,
          letterSpacing: '-0.01em',
          maxWidth: '1020px',
        },
        children: mainText + (accentText ? '' : ''),
      },
    },
  ];
  if (accentText) {
    children.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          fontStyle: 'italic',
          color: TERRACOTTA,
          lineHeight: 1.12,
          letterSpacing: '-0.01em',
          maxWidth: '1020px',
        },
        children: accentText,
      },
    });
  }
  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', gap: '4px' },
      children,
    },
  };
}

// Card builder. Documents photo background + scrim, three text zones.
function buildCard({ dollars, head, italicAccent, scopeLine, disclaimer }) {
  // Truncate headline aggressively. If it's long, take first ~60 chars
  // and cut at the nearest word boundary.
  let trimmedHead = head;
  if (head.length > 90) {
    const cut = head.slice(0, 90);
    const sp = cut.lastIndexOf(' ');
    trimmedHead = (sp > 50 ? cut.slice(0, sp) : cut) + '…';
  }
  // Optional italic terracotta accent on a separate line below the headline.
  // Used on the homepage to echo the site h1 pattern.
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: '1200px',
        height: '630px',
        backgroundColor: NIGHT,
        backgroundImage: `url("${BG_DATA_URL}")`,
        backgroundSize: '1200px 630px',
        backgroundRepeat: 'no-repeat',
        color: CREAM,
        fontFamily: 'SourceSerif4',
      },
      children: [
        // Left accent rail - oxblood vertical mark
        {
          type: 'div',
          props: {
            style: { display: 'flex', width: '10px', height: '100%', background: ACCENT },
          },
        },
        // Main content column
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            },
            children: [
              // Top disclaimer stripe (alleged/reported only). Sits at the
              // very top so screenshots and link previews carry the legal
              // posture even when cropped.
              disclaimer && {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: '100%',
                    height: '46px',
                    background: disclaimer.bg,
                    color: disclaimer.fg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JetBrainsMono',
                    fontSize: '16px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    flexShrink: 0,
                  },
                  children: disclaimer.text,
                },
              },
              // Padded inner column: wordmark, headline, footer
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                    padding: disclaimer ? '40px 80px 64px' : '64px 80px',
                  },
                  children: [
              // Top: ledger mark + wordmark only
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '18px' },
                  children: [
                    ledgerMark(40, CREAM),
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
                          fontWeight: 600,
                        },
                        children: 'Washington Accountability Registry',
                      },
                    },
                  ],
                },
              },
              // Middle: dollars (if any) + headline
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '16px' },
                  children: [
                    dollars && {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '160px',
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
                          fontSize: dollars ? '44px' : '60px',
                          fontWeight: 700,
                          color: CREAM,
                          lineHeight: 1.15,
                          letterSpacing: '-0.01em',
                          maxWidth: dollars ? '720px' : '780px',
                        },
                        children: trimmedHead,
                      },
                    },
                    italicAccent && {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '60px',
                          fontWeight: 400,
                          fontStyle: 'italic',
                          color: TERRACOTTA,
                          lineHeight: 1.15,
                          letterSpacing: '-0.01em',
                          maxWidth: '780px',
                        },
                        children: italicAccent,
                      },
                    },
                  ].filter(Boolean),
                },
              },
              // Bottom: optional scope line + URL
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                  children: [
                    scopeLine && {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'JetBrainsMono',
                          fontSize: '17px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: CREAM,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        },
                        children: scopeLine,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'JetBrainsMono',
                          fontSize: '18px',
                          letterSpacing: '0.06em',
                          color: MUTED,
                          fontWeight: 600,
                        },
                        children: 'wacountability.org',
                      },
                    },
                  ].filter(Boolean),
                },
              },
                  ],
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

// Map evidentiary status to a top-of-card legal posture stripe.
// Documented gets no stripe. Reported gets amber. Alleged gets loud oxblood.
function disclaimerFor(status) {
  if (status === 'alleged') {
    return { text: 'Allegation · Not yet adjudicated', bg: ACCENT, fg: CREAM };
  }
  if (status === 'reported') {
    return { text: 'Reported · No government finding yet', bg: '#b8860b', fg: NIGHT };
  }
  return null;
}

// Pick a keyword in a case headline to italicize. We try a short list of
// thematic words that show up in case titles; first hit wins. Order matters:
// stronger words first.
const ACCENT_CANDIDATES = [
  'failure', 'overrun', 'cover-up', 'coverup', 'scandal', 'fraud',
  'misconduct', 'breach', 'collapse', 'mismanagement', 'oversight',
  'audit', 'investigation', 'settlement', 'lawsuit', 'violation',
  'irregularities', 'review', 'reset', 'crisis', 'shortfall',
];
function pickAccent(head) {
  const lower = head.toLowerCase();
  for (const w of ACCENT_CANDIDATES) {
    if (lower.includes(w)) return w;
  }
  return null;
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
    // Match Astro's resolved slug: prefer manual `slug:` field in
    // frontmatter, otherwise use the raw filename (no year stripping).
    // Older cases set `slug:` manually to drop the year prefix; newer
    // cases default to the full filename.
    const rawSlug = basename(file, '.md');
    const raw = readFileSync(join(CASES_DIR, file), 'utf-8');
    const { data } = matter(raw);
    const slug = data.slug || rawSlug;
    if (data.review_status === 'retracted') continue;

    const dollars = formatDollars(data.dollars_at_issue);
    const { head, sub } = splitTitle(data.title || '');

    const card = buildCard({ dollars, head, disclaimer: disclaimerFor(data.evidentiary_status) });

    await renderToPng(card, join(OUT_DIR, `${slug}.png`));
    count++;
  }

  // Homepage card
  const home = buildCard({
    dollars: null,
    head: "Watchdogs are only as good as the public's",
    italicAccent: 'attention span.',
    scopeLine: 'State · King County · Seattle · Regional bodies',
  });
  await renderToPng(home, join(OUT_DIR, 'home.png'));

  console.log(`[og] Wrote ${count} case cards + home.png to public/og/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
