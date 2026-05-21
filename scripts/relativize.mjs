/**
 * Post-build path rewriter.
 *
 * Astro emits absolute-rooted URLs (e.g. `href="/_astro/foo.css"`,
 * `href="/cases"`) by default, which breaks any deploy that serves the
 * site from a non-root sub-path. This script walks dist/, computes each
 * HTML/CSS file's depth from the dist root, and rewrites every
 * absolute-rooted reference to the correctly-depth relative path so the
 * site works under any sub-path with no rebuild.
 *
 * This script is paired with `build.format: 'file'` in astro.config.mjs,
 * so internal route links target explicit .html files rather than
 * directory paths. This is required for static hosts that do not resolve
 * directory paths to index.html (Perplexity's pplx.app proxy is one such
 * host — it returns 404 for `/cases/` but serves `/cases.html`).
 *
 * Rules:
 *   - Only values starting with a single `/` are rewritten
 *     (`//host/...` scheme-relative and full URLs are left alone).
 *   - `href="/"` -> relative path to `index.html` at the dist root.
 *   - Internal route links without a file extension (e.g. `/cases`,
 *     `/cases/dchs-systemic-audit`) get `.html` appended before the
 *     query/fragment, then relativized.
 *   - Asset links with an extension (e.g. `/_astro/foo.css`,
 *     `/favicon.svg`) are relativized as-is. No trailing slashes are
 *     ever added.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

// Attributes we touch. Limited list — never rewrite arbitrary string content.
// The value-capturing group accepts either a bare `/` or `/` followed by any
// non-quote character (so `href="/"` is also rewritten to point at the dist root).
const ATTR_RE =
  /\b(href|src|srcset|action|poster|data-src|data-href)\s*=\s*("|')(\/[^"'>]*)("|')/g;

// Return true if the path's last segment has a file extension
// (e.g. /favicon.svg, /_astro/foo.css). Hash and query are stripped first.
function hasFileExtension(pathPart) {
  const lastSeg = pathPart.split('/').pop() ?? '';
  return /\.[a-zA-Z0-9]{1,8}$/.test(lastSeg);
}

function toRelative(absUrl, fromFileRelDir) {
  // absUrl looks like "/foo/bar" or "/foo/bar?x=1#frag" or just "/".
  // Split off query/hash so they are preserved verbatim.
  const hashIdx = absUrl.indexOf('#');
  const qIdx = absUrl.indexOf('?');
  let cut = absUrl.length;
  if (hashIdx >= 0) cut = Math.min(cut, hashIdx);
  if (qIdx >= 0) cut = Math.min(cut, qIdx);
  const pathPart = absUrl.slice(0, cut);
  const suffix = absUrl.slice(cut);

  // Strip leading slash(es) to get a path relative to dist root.
  let targetFromRoot = pathPart.replace(/^\/+/, '');

  // Bare `/` points to the root index.
  if (targetFromRoot === '') {
    targetFromRoot = 'index.html';
  } else if (!hasFileExtension(pathPart)) {
    // Internal route link without an extension — append .html so the
    // static host can serve an explicit file. NEVER append a trailing
    // slash; the deploy host doesn't resolve directory paths.
    targetFromRoot = targetFromRoot.replace(/\/+$/, '') + '.html';
  }

  // Compute relative path from the source file's directory to the target.
  // fromFileRelDir is relative to DIST (e.g. '' for root, 'cases' for
  // dist/cases.html and for any file under dist/cases/).
  const depth = fromFileRelDir === '' ? 0 : fromFileRelDir.split('/').length;
  const upDots = depth === 0 ? './' : '../'.repeat(depth);

  let rel = upDots + targetFromRoot;
  rel = rel.replace(/\/{2,}/g, '/');
  return rel + suffix;
}

async function walkExt(dir, exts) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkExt(full, exts)));
    else if (e.isFile() && exts.some((x) => e.name.endsWith(x))) out.push(full);
  }
  return out;
}

async function rewriteHtml(file) {
  const relFromDist = path.relative(DIST, file);
  const relDir = path.dirname(relFromDist) === '.' ? '' : path.dirname(relFromDist).split(path.sep).join('/');
  const html = await fs.readFile(file, 'utf8');
  let count = 0;

  const next = html.replace(ATTR_RE, (m, attr, q1, val, q2) => {
    if (val.startsWith('//')) return m; // protocol-relative
    const rel = toRelative(val, relDir);
    count++;
    return `${attr}=${q1}${rel}${q2}`;
  });

  const changed = next !== html;
  if (changed) await fs.writeFile(file, next, 'utf8');
  return { file: relFromDist, changed, count };
}

// CSS `url(/path)` references are absolute-rooted too. Rewrite them
// relative to the CSS file's own directory inside dist/.
const CSS_URL_RE = /url\(\s*(['"]?)(\/[^)'"\s][^)'"\s]*)\1\s*\)/g;

async function rewriteCss(file) {
  const relFromDist = path.relative(DIST, file);
  const relDir = path.dirname(relFromDist) === '.' ? '' : path.dirname(relFromDist).split(path.sep).join('/');
  const css = await fs.readFile(file, 'utf8');
  let count = 0;

  const next = css.replace(CSS_URL_RE, (m, quote, val) => {
    if (val.startsWith('//')) return m;
    const rel = toRelative(val, relDir);
    count++;
    return `url(${quote}${rel}${quote})`;
  });

  const changed = next !== css;
  if (changed) await fs.writeFile(file, next, 'utf8');
  return { file: relFromDist, changed, count };
}

async function main() {
  const htmlFiles = await walkExt(DIST, ['.html']);
  let htmlTotal = 0;
  let htmlTouched = 0;
  for (const f of htmlFiles) {
    const r = await rewriteHtml(f);
    htmlTotal += r.count;
    if (r.changed) htmlTouched++;
    console.log(`${r.changed ? '✎' : '·'} ${r.file}  (${r.count} rewrites)`);
  }
  console.log(`\nHTML: rewrote ${htmlTotal} attribute(s) across ${htmlTouched}/${htmlFiles.length} file(s).`);

  const cssFiles = await walkExt(DIST, ['.css']);
  let cssTotal = 0;
  let cssTouched = 0;
  for (const f of cssFiles) {
    const r = await rewriteCss(f);
    cssTotal += r.count;
    if (r.changed) cssTouched++;
    console.log(`${r.changed ? '✎' : '·'} ${r.file}  (${r.count} rewrites)`);
  }
  console.log(`CSS:  rewrote ${cssTotal} url() reference(s) across ${cssTouched}/${cssFiles.length} file(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
