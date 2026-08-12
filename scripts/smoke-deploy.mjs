#!/usr/bin/env node
/**
 * smoke-deploy.mjs — the deploy before/after assertion table.
 *
 * WHY: the Workers deploy had to match the earlier Pages stopgap on every
 * static/redirect behavior and fix exactly one row —
 * `POST /api/create-donation`, which 405s on the static-only Pages host because
 * there is no dynamic tier there. Remembering that table is how a silent
 * regression ships; the `run_worker_first` footgun in particular would break
 * every `_redirects` 301 while leaving all the pages green.
 *
 * So: run the same assertions against BOTH hosts in one pass and print them side
 * by side. Any difference is visible rather than recalled.
 *
 * Read-only over HTTP — no auth, no account access, safe to loop.
 *
 * Run:
 *   node scripts/smoke-deploy.mjs https://openmined-astro.pages.dev
 *   node scripts/smoke-deploy.mjs https://openmined-astro.pages.dev https://openmined-astro-test.<sub>.workers.dev
 *
 * Options: --json <path> to dump the full per-check result map.
 *
 * Reading the donation row (the whole experiment):
 *   404/405 → no dynamic tier (static-only host)
 *   503     → PASS pre-secret: the on-demand route EXECUTED and is merely dormant
 *   200     → fully live (secret set, real checkout_url)
 */
import { writeFile } from 'node:fs/promises';

const jsonFlag = process.argv.indexOf('--json');
const jsonOut = jsonFlag !== -1 ? process.argv[jsonFlag + 1] : null;
const bases = process.argv
  .slice(2)
  .filter((a) => a.startsWith('http'))
  .map((b) => b.replace(/\/$/, ''));

if (!bases.length) {
  console.error('usage: node scripts/smoke-deploy.mjs <base-url> [<base-url> …] [--json out.json]');
  process.exit(1);
}

/** Pages that must serve 200 HTML — a spread across route kinds, not a full crawl. */
const PAGES = ['/', '/blog/', '/syftbox/', '/style-guide/'];
/** Machine endpoints — these are what feed readers and crawlers hold on file.
 *  /pagefind/pagefind.js is the search index entry. The index is built by an
 *  integration so every build command produces it, but this row still earns
 *  its place: it catches a host serving a stale or partial upload, which the
 *  build itself cannot see. */
const FEEDS = ['/rss.xml', '/sitemap-index.xml', '/pagefind/pagefind.js'];
/**
 * 301s, split by which layer emits them — a break in one layer is a different
 * diagnosis than a break in the other.
 *   host      = public/_redirects (hand-written, wildcards/machine paths)
 *   adapter   = appended at build from src/data/redirects.mjs (editorial + author parity)
 */
const REDIRECTS = [
  { from: '/feed/', to: '/rss.xml', layer: 'host' },
  { from: '/wp-sitemap.xml', to: '/sitemap-index.xml', layer: 'host' },
  { from: '/author/anything/', to: '/blog/', layer: 'host (splat)' },
  { from: '/resources/', to: '/', layer: 'adapter' },
  { from: '/blog/author/bennettopenmined-org/', to: '/blog/author/bennett-farkas/', layer: 'adapter' },
];

const results = {}; // base → [{ name, ok, detail }]
const record = (base, name, ok, detail = '') => results[base].push({ name, ok, detail });

/** fetch that never throws — a dead host becomes a failed row, not a stack trace. */
async function get(url, init = {}) {
  try {
    return await fetch(url, { redirect: 'manual', ...init });
  } catch (err) {
    return { status: 0, headers: new Headers(), text: async () => '', _err: err.message };
  }
}

async function checkHost(base) {
  results[base] = [];

  for (const path of [...PAGES, ...FEEDS]) {
    const res = await get(base + path);
    record(base, `200 ${path}`, res.status === 200, String(res.status) + (res._err ? ` (${res._err})` : ''));
  }

  for (const { from, to, layer } of REDIRECTS) {
    const res = await get(base + from);
    // Cloudflare returns an absolute Location; compare paths so the two hosts
    // are comparable regardless of origin.
    const loc = res.headers.get('location') || '';
    const locPath = loc.startsWith('http') ? new URL(loc).pathname : loc;
    const ok = res.status === 301 && locPath === to;
    record(base, `301 ${from} → ${to}  [${layer}]`, ok, `${res.status} → ${locPath || '—'}`);
  }

  // The pre-launch guard. *.workers.dev and *.pages.dev are publicly crawlable,
  // so noindex staying ON is a requirement of the test, not an oversight.
  const home = await get(base + '/');
  const html = await home.text();
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] ?? '';
  record(base, 'noindex guard still on', /noindex/i.test(robots), robots || 'no robots meta');

  // _headers spot-check — only _redirects has been verified end-to-end so far.
  // Pull a real hashed asset out of the homepage rather than guessing a filename.
  const assetPath = html.match(/\/_astro\/[A-Za-z0-9._-]+\.(?:css|js)/)?.[0];
  if (assetPath) {
    const res = await get(base + assetPath);
    const cc = res.headers.get('cache-control') || '';
    record(base, '_headers: /_astro/* immutable', cc.includes('immutable'), cc || 'none');
  } else {
    record(base, '_headers: /_astro/* immutable', false, 'no /_astro asset found in homepage HTML');
  }

  // THE row. A real-shaped body so a live endpoint returns a real checkout_url
  // rather than a validation error.
  const res = await get(base + '/api/create-donation', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ amount: 25, is_monthly: false, currency: 'USD' }),
  });
  const body = await res.text();
  let verdict;
  if (res.status === 200 && body.includes('checkout_url')) verdict = 'LIVE (checkout_url)';
  else if (res.status === 503) verdict = 'dynamic tier LIVE, dormant (no secret)';
  else if (res.status === 404 || res.status === 405) verdict = 'NO dynamic tier (static-only host)';
  else verdict = 'unexpected';
  // Pass = the route executed at all. 405 is the documented Pages baseline, so
  // it is reported plainly rather than scored — the comparison is the point.
  record(base, 'POST /api/create-donation', res.status === 200 || res.status === 503, `${res.status} — ${verdict}`);
}

for (const base of bases) {
  console.log(`\nProbing ${base} …`);
  await checkHost(base);
}

// ── Report ────────────────────────────────────────────────────────────────────
const names = results[bases[0]].map((r) => r.name);
const nameW = Math.max(...names.map((n) => n.length));
const colW = 46;

console.log('\n' + 'ASSERTION'.padEnd(nameW) + '  ' + bases.map((b) => b.replace(/^https?:\/\//, '').slice(0, colW).padEnd(colW)).join(''));
console.log('─'.repeat(nameW + 2 + colW * bases.length));

for (let i = 0; i < names.length; i++) {
  const cells = bases.map((b) => {
    const r = results[b][i];
    return `${r.ok ? '✅' : '❌'} ${r.detail}`.slice(0, colW).padEnd(colW);
  });
  console.log(names[i].padEnd(nameW) + '  ' + cells.join(''));
}

console.log();
for (const b of bases) {
  const fails = results[b].filter((r) => !r.ok);
  console.log(`${b}: ${results[b].length - fails.length}/${results[b].length} pass${fails.length ? ` — failing: ${fails.map((f) => f.name).join('; ')}` : ''}`);
}

if (jsonOut) {
  await writeFile(jsonOut, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${jsonOut}`);
}
