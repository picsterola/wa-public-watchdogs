#!/usr/bin/env node
// Pre-bake the OG background: the hero documents photo, cropped to 1200x630,
// with the same left-heavy dark scrim used on the homepage hero.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, 'public', 'img', 'hero-documents.png');
const OUT = join(ROOT, 'public', 'img', 'og-bg.jpg');

const W = 1200;
const H = 630;
const NIGHT = '#0f0e0b';

// Two scrims, matching .cover-hero CSS:
//   linear-gradient(100deg, rgba(15,14,11,0.93) 0%, 0.78 32%, 0.42 55%, 0.25 78%, 0.55 100%)
//   linear-gradient(to bottom, rgba(15,14,11,0.10) 0%, 0.70 100%)
// Approximate the 100deg gradient with a slightly-rotated horizontal stop ladder.
const scrimSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g1" gradientUnits="userSpaceOnUse"
      x1="0" y1="0" x2="${W}" y2="${H * 0.12}">
      <stop offset="0%"   stop-color="${NIGHT}" stop-opacity="0.98" />
      <stop offset="40%"  stop-color="${NIGHT}" stop-opacity="0.88" />
      <stop offset="62%"  stop-color="${NIGHT}" stop-opacity="0.55" />
      <stop offset="85%"  stop-color="${NIGHT}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${NIGHT}" stop-opacity="0.30" />
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${NIGHT}" stop-opacity="0.10" />
      <stop offset="100%" stop-color="${NIGHT}" stop-opacity="0.75" />
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g1)" />
  <rect width="${W}" height="${H}" fill="url(#g2)" />
</svg>`;

// Crop the source to a right-weighted slice so the stack of documents sits
// in the right ~60% of the OG card. The source is 1672x941. We want the
// documents (right half of source) anchored to the right of the output.
const META = await sharp(SRC).metadata();
const SRC_W = META.width;
const SRC_H = META.height;
// Target aspect 1200/630 = 1.905
const targetAspect = W / H;
const srcAspect = SRC_W / SRC_H;
let cropW = SRC_W;
let cropH = SRC_H;
if (srcAspect > targetAspect) {
  // source is wider - crop width
  cropW = Math.round(SRC_H * targetAspect);
} else {
  cropH = Math.round(SRC_W / targetAspect);
}
// Anchor the crop to the right side of the source (so documents stay visible).
const cropLeft = SRC_W - cropW;
const cropTop = Math.round((SRC_H - cropH) / 2);

const photo = await sharp(SRC)
  .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
  .resize(W, H, { fit: 'cover' })
  .toBuffer();

const composed = await sharp(photo)
  .composite([{ input: Buffer.from(scrimSvg), top: 0, left: 0 }])
  .jpeg({ quality: 86 })
  .toBuffer();

writeFileSync(OUT, composed);
console.log(`[og-bg] Wrote ${OUT} (${Math.round(composed.length / 1024)} KB)`);
