#!/usr/bin/env node
/**
 * audit-image-urls — every local asset URL in the build must resolve to a file.
 *
 * WHY THIS EXISTS
 * The Cloudflare adapter's `imageService` defaults to 'cloudflare-binding',
 * which transforms images at RUNTIME through Cloudflare Images (a paid product,
 * unbound here). Under that default Astro stops pre-generating variants and
 * writes `/_image?…` endpoint URLs into the HTML instead. That shipped silently:
 * 522 of 679 pages, ~10.7k image URLs, none of which resolve — and nothing
 * caught it, because the build succeeds, the dev server renders fine (dev runs
 * on Node, where the endpoint works), and the deploy smoke test only covered
 * donations. The fix is `imageService: 'compile'` in `astro.config.mjs`; this
 * guard is what makes a regression loud instead of silent.
 *
 * WHAT IT CHECKS
 * Every root-relative URL in the built HTML — `src`, `srcset` (each candidate),
 * and CSS `url(…)` — resolves to a real file under dist/client. Three failure
 * classes, reported separately because they mean different things:
 *   • `/_image?…`  → an unresolvable endpoint URL (the regression above)
 *   • missing file → a broken asset reference of any other kind
 *   • WP hotlink   → an asset still loaded from the live WordPress host
 * Other remote URLs, `data:` URIs, and anchors are skipped.
 *
 * The hotlink class is the cutover trap: `https://openmined.org/wp-content/…`
 * resolves today only because live is still WordPress. At cutover that host
 * becomes this site, `public/_redirects` deliberately 404s `/wp-content/uploads/*`
 * (redirecting an asset URL to an HTML page is worse than a 404), and every one
 * of those references breaks at once. It is matched against the raw HTML rather
 * than the parsed URL set so it catches any attribute — `src`, `poster`, an
 * `<a href>` to a PDF — not just the image ones.
 *
 * Complements `audit-image-shapes.mjs`, which guards the SOURCE calls (no forced
 * aspect ratios); this one guards the BUILD OUTPUT.
 *
 * Usage:  npm run audit:image-urls [-- dist-dir]
 * Exit 1 on any failure, so it can gate CI or a deploy. Runs against the build
 * output, so `npm run build` must have run first.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] || 'dist/client');

if (!existsSync(ROOT)) {
  console.error(`✗ build directory not found: ${ROOT}\n  Run \`npm run build\` first, or pass the dist path as an argument.`);
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const pages = walk(ROOT).filter((f) => f.endsWith('.html'));
// Entity-decode (`&amp;` is how srcset/src land in HTML) and drop any fragment.
const decode = (u) => u.replace(/&amp;/g, '&').split('#')[0].trim();

const endpointURLs = new Map(); // unresolvable /_image?… → count
const missingFiles = new Map(); // referenced-but-absent file → count
const wpHotlinks = new Map();   // still-on-WordPress asset URL → count
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');

  for (const m of html.matchAll(/https?:\/\/(?:www\.)?openmined\.org\/wp-content\/[^"'\s)<>]+/g)) {
    const u = decode(m[0]);
    wpHotlinks.set(u, (wpHotlinks.get(u) || 0) + 1);
  }

  const urls = new Set();
  for (const m of html.matchAll(/\ssrc="([^"]+)"/g)) urls.add(m[1]);
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g))
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u) urls.add(u);
    }
  for (const m of html.matchAll(/url\((['"]?)(\/[^)'"]+)\1\)/g)) urls.add(m[2]);

  for (const raw of urls) {
    const u = decode(raw);
    // Only root-relative local assets. `//host/…` is protocol-relative = remote.
    if (!u.startsWith('/') || u.startsWith('//')) continue;
    checked++;
    if (u.startsWith('/_image')) {
      const key = u.slice(0, 100);
      endpointURLs.set(key, (endpointURLs.get(key) || 0) + 1);
      continue;
    }
    if (!existsSync(join(ROOT, u.split('?')[0]))) {
      missingFiles.set(u, (missingFiles.get(u) || 0) + 1);
    }
  }
}

const total = (m) => [...m.values()].reduce((a, b) => a + b, 0);
const endpointCount = total(endpointURLs);
const missingCount = total(missingFiles);
const hotlinkCount = total(wpHotlinks);

if (!endpointCount && !missingCount && !hotlinkCount) {
  console.log(`✓ image URLs clean — ${checked} local asset URLs across ${pages.length} pages all resolve, no WordPress hotlinks`);
  process.exit(0);
}

if (endpointCount) {
  console.error(`\n✗ ${endpointCount} unresolvable /_image endpoint URL(s) across ${endpointURLs.size} distinct references.`);
  console.error(`  A static build must not emit these. Check \`astro.config.mjs\` → adapter`);
  console.error(`  \`imageService\` is still 'compile' (the adapter default, 'cloudflare-binding',`);
  console.error(`  defers every image to a runtime endpoint that nothing serves).`);
  for (const [u, n] of [...endpointURLs].slice(0, 5)) console.error(`    ${n}×  ${u}`);
}

if (missingCount) {
  console.error(`\n✗ ${missingCount} reference(s) to ${missingFiles.size} missing file(s):`);
  for (const [u, n] of [...missingFiles].slice(0, 15)) console.error(`    ${n}×  ${u}`);
}

if (hotlinkCount) {
  console.error(`\n✗ ${hotlinkCount} reference(s) to ${wpHotlinks.size} asset(s) still hotlinked from the live WordPress host.`);
  console.error(`  These resolve only while openmined.org is still WordPress; they all break at cutover.`);
  console.error(`  Localize each one — page assets to src/assets/, blog media to public/blog/<slug>/.`);
  for (const [u, n] of [...wpHotlinks].slice(0, 15)) console.error(`    ${n}×  ${u}`);
}

console.error('');
process.exit(1);
