// Extract every source URL from every case file, with case slug + tier.
import fs from 'node:fs';
import path from 'node:path';

const dir = '/home/user/workspace/wa-registry/src/content/cases';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

const out = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const slugMatch = text.match(/^slug:\s*(.+)$/m);
  const slug = slugMatch ? slugMatch[1].trim() : f.replace('.md', '');

  // Parse frontmatter sources block (between `sources:` and the next top-level key)
  const fmEnd = text.indexOf('\n---', 4);
  const fm = text.slice(0, fmEnd);
  const srcStart = fm.indexOf('\nsources:');
  if (srcStart === -1) continue;
  const after = fm.slice(srcStart + 1);
  // sources block ends at next top-level `# ===` comment or `key:` not indented
  const blockEnd = after.search(/\n[a-z_]+:/m);
  const block = blockEnd === -1 ? after : after.slice(0, blockEnd);

  // Each entry has `tier:` and `url:`
  const entries = block.split(/\n  - /).slice(1);
  for (const e of entries) {
    const tierM = e.match(/tier:\s*(\d)/);
    const urlM = e.match(/url:\s*(\S+)/);
    if (urlM && urlM[1] !== 'null') {
      out.push({ slug, tier: tierM ? tierM[1] : '?', url: urlM[1] });
    }
  }
}

console.log(JSON.stringify(out, null, 2));
console.error(`Extracted ${out.length} URLs from ${files.length} case files`);
