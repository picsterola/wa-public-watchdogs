#!/usr/bin/env node
// One-off OG card for the LEB enforcement-pattern meta-case.
// Uses the same fonts, palette, and ledger mark as the standard OG pipeline,
// but lays out a 2x3 stat grid showing the actual structural-pattern numbers.
// Output: public/og/leb-enforcement-pattern-meta.png (overwrites the auto-gen).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(ROOT, 'public', 'og');
const FM = join(ROOT, 'node_modules', '@fontsource');
const BG_PATH = join(ROOT, 'public', 'img', 'og-bg.jpg');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const BG_DATA_URL = `data:image/jpeg;base64,${readFileSync(BG_PATH).toString('base64')}`;

const FONTS = [
  { name: 'SourceSerif4', data: readFileSync(join(FM, 'source-serif-4', 'files', 'source-serif-4-latin-700-normal.woff')), weight: 700, style: 'normal' },
  { name: 'SourceSerif4', data: readFileSync(join(FM, 'source-serif-4', 'files', 'source-serif-4-latin-400-normal.woff')), weight: 400, style: 'normal' },
  { name: 'SourceSerif4', data: readFileSync(join(FM, 'source-serif-4', 'files', 'source-serif-4-latin-400-italic.woff')), weight: 400, style: 'italic' },
  { name: 'JetBrainsMono', data: readFileSync(join(FM, 'jetbrains-mono', 'files', 'jetbrains-mono-latin-600-normal.woff')), weight: 600, style: 'normal' },
];

const NIGHT = '#0f0e0b';
const CREAM = '#f6f2e9';
const ACCENT = '#7a1f1f';
const TERRACOTTA = '#d68b7d';
const MUTED = 'rgba(246, 242, 233, 0.6)';
const RULE = 'rgba(246, 242, 233, 0.18)';

// Inline ledger-mark SVG (matches site brand mark)
function ledgerMark(size, color) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: 2.2,
      children: [
        { type: 'rect', props: { x: 3, y: 3, width: 18, height: 18, rx: 2 } },
        { type: 'line', props: { x1: 3, y1: 9, x2: 21, y2: 9 } },
        { type: 'line', props: { x1: 3, y1: 15, x2: 21, y2: 15 } },
        { type: 'line', props: { x1: 9, y1: 3, x2: 9, y2: 21 } },
      ].map((el) => ({ type: el.type, props: el.props })),
    },
  };
}

// Stat tile component
function statTile({ figure, label, accent = CREAM }) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: '64px',
              fontWeight: 700,
              color: accent,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            },
            children: figure,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'JetBrainsMono',
              fontSize: '15px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: MUTED,
              fontWeight: 600,
              lineHeight: 1.3,
              maxWidth: '320px',
            },
            children: label,
          },
        },
      ],
    },
  };
}

function statRow(children) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', gap: '64px', width: '100%' },
      children,
    },
  };
}

function build() {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        position: 'relative',
        fontFamily: 'SourceSerif4',
        background: NIGHT,
      },
      children: [
        // Background image (documents pile, scrim baked in)
        {
          type: 'img',
          props: {
            src: BG_DATA_URL,
            style: {
              position: 'absolute',
              top: 0, left: 0, width: '1200px', height: '630px',
              objectFit: 'cover',
            },
          },
        },
        // Heavy left scrim so the stat block reads cleanly
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0, left: 0, width: '1200px', height: '630px',
              background: 'linear-gradient(90deg, rgba(15,14,11,0.96) 0%, rgba(15,14,11,0.86) 55%, rgba(15,14,11,0.62) 100%)',
            },
          },
        },
        // Left accent rule
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0, left: 0, width: '8px', height: '630px',
              background: ACCENT,
            },
          },
        },
        // Inner column
        {
          type: 'div',
          props: {
            style: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '52px 72px 48px',
              width: '1200px',
              height: '630px',
            },
            children: [
              // Top: wordmark
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '16px' },
                  children: [
                    ledgerMark(36, CREAM),
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'JetBrainsMono',
                          fontSize: '18px',
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
              // Middle: scope eyebrow + headline + stat grid
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '24px' },
                  children: [
                    // Scope eyebrow
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontFamily: 'JetBrainsMono',
                          fontSize: '15px',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: TERRACOTTA,
                          fontWeight: 600,
                        },
                        children: 'Meta-case · Enforcement-pattern assessment',
                      },
                    },
                    // Headline (two lines)
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '46px',
                          fontWeight: 700,
                          color: CREAM,
                          lineHeight: 1.1,
                          letterSpacing: '-0.01em',
                          maxWidth: '1060px',
                        },
                        children: 'Washington State Legislative Ethics Board',
                      },
                    },
                    // Stat grid: two rows of three
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '28px',
                          marginTop: '8px',
                          paddingTop: '24px',
                          borderTop: `1px solid ${RULE}`,
                        },
                        children: [
                          statRow([
                            statTile({ figure: '$5,000', label: 'Max penalty · unchanged since 1994', accent: TERRACOTTA }),
                            statTile({ figure: '~14%', label: 'Sanction rate · 2015–2026' }),
                            statTile({ figure: '2', label: 'Public hearings in 32 years' }),
                          ]),
                          statRow([
                            statTile({ figure: '$250–500', label: 'Modal fine · often partly suspended' }),
                            statTile({ figure: '0', label: 'Prosecution referrals on record', accent: TERRACOTTA }),
                            statTile({ figure: '1', label: 'Staff attorney · 500+ inquiries/yr' }),
                          ]),
                        ],
                      },
                    },
                  ],
                },
              },
              // Bottom: URL
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontFamily: 'JetBrainsMono',
                    fontSize: '16px',
                    letterSpacing: '0.06em',
                    color: MUTED,
                    fontWeight: 600,
                  },
                  children: 'wacountability.org / leb-enforcement-pattern-meta',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

const svg = await satori(build(), { width: 1200, height: 630, fonts: FONTS });
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
const out = join(OUT_DIR, 'leb-enforcement-pattern-meta.png');
writeFileSync(out, png);
console.log(`Wrote ${out} (${(png.length / 1024).toFixed(1)} KB)`);
