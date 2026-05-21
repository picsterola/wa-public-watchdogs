// Downloads official portraits listed in src/data/officials.json,
// normalizes each to a 256x256 grayscale JPEG, writes to public/img/officials/<slug>.jpg.
// Idempotent: skips entries whose output already exists (rerun with FORCE=1 to redownload).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'img', 'officials');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'officials.json');

const FORCE = process.env.FORCE === '1';

await fs.mkdir(OUT_DIR, { recursive: true });

const raw = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
const officials = raw.officials;

const UA = 'wa-accountability-registry/1.0 (https://github.com/) portrait-fetch';

let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const [slug, o] of Object.entries(officials)) {
  if (!o.download_url || !o.photo) {
    skipped++;
    continue;
  }
  const outPath = path.join(ROOT, 'public', o.photo.replace(/^\//, ''));
  try {
    await fs.access(outPath);
    if (!FORCE) {
      console.log(`✓ ${slug} (exists)`);
      skipped++;
      continue;
    }
  } catch {}

  try {
    const res = await fetch(o.download_url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .resize(256, 256, { fit: 'cover', position: 'top' })
      .grayscale()
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath);
    console.log(`↓ ${slug}`);
    downloaded++;
  } catch (err) {
    console.warn(`✗ ${slug}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone. downloaded=${downloaded} skipped=${skipped} failed=${failed}`);
