#!/usr/bin/env node
/**
 * smoke-deploy.mjs — the deploy before/after assertion table.
 *
 * WHY: every host swap so far (Pages stopgap → Workers, and next Workers → AWS)
 * had to match the previous host on every static/redirect behavior while
 * changing exactly the rows it meant to change. Remembering that table is how a
 * silent regression ships — on Workers the `run_worker_first` footgun would
 * break every `_redirects` 301 while leaving all the pages green; on any new
 * host the security headers can silently vanish in translation.
 *
 * So: run the same assertions against BOTH hosts in one pass and print them side
 * by side. Any difference is visible rather than recalled.
 *
 * HOST-AGNOSTIC by design: every row asserts a REQUIREMENT of the site, not a
 * mechanism of one host. Which mechanism satisfies it (Cloudflare `_redirects`
 * / CloudFront config / meta-refresh fallback pages) is the host's business —
 * see HOSTING.md for the portable requirement set this table mirrors.
 *
 * Read-only over HTTP — no auth, no account access, safe to loop.
 *
 * Run:
 *   node scripts/smoke-deploy.mjs https://<deployed-host>
 *   node scripts/smoke-deploy.mjs https://<current-host> https://<candidate-host>
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
 * Redirects, split by REQUIREMENT CLASS — a break in one class is a different
 * diagnosis than a break in the other. (These map onto emitting layers on any
 * given host — on Cloudflare, `must-301` rows come from public/_redirects and
 * `page` rows from the adapter-appended registry — but the class is the
 * portable fact; the layer is the host's implementation detail.)
 *
 *   must-301 = machine endpoints (feeds, sitemaps) + wildcards. Consumers
 *              follow the HTTP status and ignore HTML, so only a true 301
 *              passes — on every host, no exceptions.
 *   page     = human-navigable page redirects from src/data/redirects.mjs.
 *              A true 301 is preferred; a 200 meta-refresh page carrying a
 *              canonical link to the target (Astro's static fallback) is an
 *              acceptable, deliberately-portable fallback — so both pass,
 *              with the detail column saying which one the host is doing.
 */
const REDIRECTS = [
  { from: '/feed/', to: '/rss.xml', kind: 'must-301' },
  { from: '/wp-sitemap.xml', to: '/sitemap-index.xml', kind: 'must-301' },
  { from: '/author/anything/', to: '/blog/', kind: 'must-301 (splat)' },
  { from: '/resources/', to: '/', kind: 'page' },
  { from: '/blog/author/bennettopenmined-org/', to: '/blog/author/bennett-farkas/', kind: 'page' },
];

/**
 * Security headers every page must carry (names only — public/_headers owns the
 * values, same division of labor as audit:headers). These are net-new vs the
 * WordPress site, so no external check notices if a host swap silently drops
 * them — this row is what notices.
 */
const SECURITY_HEADERS = [
  'x-content-type-options',
  'referrer-policy',
  'content-security-policy',
  'x-frame-options',
  'permissions-policy',
  'cross-origin-opener-policy',
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

  // Soft-404 guard: an unknown path must answer HTTP status 404 (serving the
  // 404 page's content). A 200, or a redirect that lands on the 404 page, is a
  // "soft 404" — crawlers score every vanished URL as alive, poisoning crawl
  // data (HOSTING.md → Routing). `redirect: manual` in get() means a
  // 302 → /404.html surfaces here as the 302 it is, not as the page it lands on.
  const notFound = await get(base + '/smoke-probe-definitely-not-a-page/');
  const nfLoc = notFound.headers.get('location');
  record(base, 'unknown path → true 404', notFound.status === 404, String(notFound.status) + (nfLoc ? ` → ${nfLoc}` : ''));

  for (const { from, to, kind } of REDIRECTS) {
    const res = await get(base + from);
    // Hosts return absolute or relative Location values; compare paths so any
    // two hosts are comparable regardless of origin.
    const loc = res.headers.get('location') || '';
    const locPath = loc.startsWith('http') ? new URL(loc).pathname : loc;
    const is301 = res.status === 301 && locPath === to;
    let ok = is301;
    let detail = `${res.status} → ${locPath || '—'}`;
    if (!is301 && kind === 'page' && res.status === 200) {
      // The portable fallback: a static meta-refresh page pointing at the
      // target, with a canonical link so crawlers consolidate signals.
      const body = await res.text();
      const metaRefresh = new RegExp(`http-equiv=["']refresh["'][^>]*url=${to.replace(/[/.]/g, '\\$&')}`, 'i').test(body);
      const canonical = new RegExp(`rel=["']canonical["'][^>]*href=["'][^"']*${to.replace(/[/.]/g, '\\$&')}["']`, 'i').test(body);
      ok = metaRefresh && canonical;
      detail = ok ? '200 meta-refresh + canonical' : `200 but not a redirect page (refresh:${metaRefresh} canonical:${canonical})`;
    }
    record(base, `redirect ${from} → ${to}  [${kind}]`, ok, detail);
  }

  // The pre-launch guard. Test/preview hostnames (*.workers.dev, CloudFront
  // domains, …) are publicly crawlable, so noindex staying ON is a requirement
  // of the test, not an oversight. After the launch flip this row is EXPECTED
  // to flag on the production host (see README → Launch flip).
  const home = await get(base + '/');
  const html = await home.text();
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)?.[1] ?? '';
  record(base, 'noindex guard still on', /noindex/i.test(robots), robots || 'no robots meta');

  // Security headers on page responses — names only; public/_headers owns the
  // values. Every failure mode here is silent (the page renders identically
  // without them), which is exactly why the row exists.
  const missing = SECURITY_HEADERS.filter((h) => !home.headers.get(h));
  record(
    base,
    'security headers on pages',
    missing.length === 0,
    missing.length ? `missing: ${missing.join(', ')}` : `all ${SECURITY_HEADERS.length} present`,
  );

  // Hashed-asset caching: /_astro/* filenames are content-hashed, so serving
  // them without a long-lived immutable Cache-Control wastes every repeat
  // visit. On Cloudflare the adapter's _headers block provides this; any other
  // host must provide it its own way — the requirement is host-agnostic.
  // Pull a real hashed asset out of the homepage rather than guessing a filename.
  const assetPath = html.match(/\/_astro\/[A-Za-z0-9._-]+\.(?:css|js)/)?.[0];
  if (assetPath) {
    const res = await get(base + assetPath);
    const cc = res.headers.get('cache-control') || '';
    record(base, 'hashed assets (/_astro/*) immutable', cc.includes('immutable'), cc || 'none');
  } else {
    record(base, 'hashed assets (/_astro/*) immutable', false, 'no /_astro asset found in homepage HTML');
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
