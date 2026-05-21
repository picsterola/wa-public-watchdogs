// HEAD/GET each URL, record status. Parallel with limited concurrency.
import fs from 'node:fs';

const urls = JSON.parse(fs.readFileSync('/tmp/urls.json', 'utf8'));
const CONCURRENCY = 10;
const TIMEOUT_MS = 15000;

async function check(rec) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Try HEAD first; some servers reject HEAD so fall back to GET.
    let res = await fetch(rec.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (WA-Registry-LinkChecker/1.0)' }
    }).catch(() => null);
    if (!res || res.status >= 400) {
      res = await fetch(rec.url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (WA-Registry-LinkChecker/1.0)' }
      });
    }
    clearTimeout(t);
    return {
      ...rec,
      status: res.status,
      final_url: res.url,
      redirected: res.url !== rec.url,
      ok: res.ok
    };
  } catch (err) {
    clearTimeout(t);
    return { ...rec, status: 0, error: String(err.message || err), ok: false };
  }
}

// Simple concurrency pool
const results = [];
let idx = 0;
async function worker() {
  while (idx < urls.length) {
    const i = idx++;
    const r = await check(urls[i]);
    results[i] = r;
    process.stderr.write(r.ok ? '.' : 'X');
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
process.stderr.write('\n');
console.log(JSON.stringify(results, null, 2));
