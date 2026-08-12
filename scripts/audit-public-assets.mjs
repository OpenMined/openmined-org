#!/usr/bin/env node
/**
 * audit-public-assets — nothing in public/ may ship oversized or mislabeled.
 *
 * WHY THIS EXISTS
 * Files in public/ are served BYTE-FOR-BYTE. Astro never opens them, never
 * resizes them, and never warns about them — that is the whole point of the
 * directory, and also its hazard. Everything under src/ passes through the
 * image pipeline, so an oversized source there costs build time and nothing
 * else; the same file in public/ is shipped to every visitor exactly as it sits
 * on disk.
 *
 * The case that prompted this: `logos/orgs/us-nsf.svg` was 3.86MB. It was not a
 * vector at all — it declared a 145x146 box and filled it with a <pattern>
 * wrapping a base64-encoded 4096x4096 PNG, roughly 800x more pixels than its
 * display size needs. It sat on the homepage for months. Neither existing image
 * guard could see it: audit-image-shapes reads image *calls* in source, and
 * audit-image-urls checks that built URLs *resolve*. Neither weighs a payload,
 * and nothing in public/ is a "call" at all.
 *
 * WHAT IT CHECKS — two independent failures, reported separately because they
 * mean different things and have different fixes:
 *
 *   1. OVERSAMPLED RASTER IN AN SVG — an .svg whose embedded bitmap is far
 *      larger than the box the SVG declares.
 *
 *      Note what this does NOT flag: the mere presence of a base64 payload.
 *      Embedding a raster in an SVG is legitimate and common — an Illustrator
 *      gradient mesh has no SVG 1.1 equivalent so exporters rasterize it, and
 *      the same goes for noise overlays, feImage filters, baked effects, and
 *      genuinely hybrid vector-plus-photo marks. A correctly prepared asset
 *      embeds at ~2x its display box for retina, and one in this tree does
 *      exactly that. Flagging presence alone would call that a defect.
 *
 *      The real fault is shipping pixels nobody can see. us-nsf.svg embedded a
 *      4096x4096 PNG in a 145x146 box — 28x oversampled, ~800x the pixels any
 *      display needs, 3.86MB on the homepage. So the test is the RATIO, and the
 *      threshold sits above 3x DPR so no honest retina asset trips it.
 *
 *      Only checkable when the SVG declares width/height; viewBox-only files
 *      have no display size to compare against and fall through to the budget
 *      check.
 *
 *   2. OVER BUDGET — a file above the ceiling for its type. Ceilings are
 *      per-extension because the honest size of an asset depends on what it is:
 *      video is legitimately megabytes, a logo is not. They are set above the
 *      largest legitimate file of each type in the tree, so this flags outliers
 *      rather than enforcing a diet.
 *
 * Opt out with an entry in ALLOW below. Unlike the source-scanning guards, a
 * binary can't carry an inline `// allow` comment, so the exemption lives here
 * and a reason is mandatory.
 *
 * Usage:  npm run audit:assets
 * Exit 1 on any failure, so it can gate CI or a deploy.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = 'public';

/**
 * Per-extension ceilings in KB. Set from the real tree: each sits above the
 * largest legitimate file of its type, so a violation means "this is an
 * outlier", not "this is over an arbitrary diet". Raise one deliberately, with
 * the reason in the commit message.
 */
const BUDGET_KB = {
  '.svg': 1024, // complex illustrations run large; abc/ABC-graphic-6.1.svg ~937KB
  '.png': 400,
  '.jpg': 400,
  '.jpeg': 400,
  '.webp': 400,
  '.gif': 1024,
  '.mp4': 5120, // video is legitimately heavy; largest today ~4.1MB
  '.webm': 5120,
  '.woff2': 400,
  '.woff': 400,
};

/**
 * How far an SVG's embedded bitmap may exceed the box the SVG declares.
 *
 * 3x is the honest ceiling — the highest DPR any display uses — so anything
 * above that is waste. The threshold is 5x rather than 4x deliberately: it must
 * clear the honest maximum AND keep distance from real files, and the largest
 * legitimate embed in this tree measures 4.2x. A boundary sitting 0.2 from live
 * data is one a re-export silently flips. This is a catastrophe net (the case
 * that prompted it was 28x), not a byte-level traffic cop.
 */
const MAX_OVERSAMPLE = 5;

/** path (relative to public/) → reason. Both checks honor this. */
const ALLOW = {
  // 'images/example.jpg': 'why this one is genuinely exempt',
};

/** Read an embedded bitmap's pixel dimensions, if the SVG has one. */
const embeddedRasterSize = (svg) => {
  const m = svg.match(/base64,\s*([A-Za-z0-9+/=\s]+)/);
  if (!m) return null;
  const buf = Buffer.from(m[1].replace(/\s+/g, ''), 'base64');
  // PNG: IHDR width/height at fixed offsets. JPEG: walk segments for SOFn.
  if (buf.slice(1, 4).toString() === 'PNG')
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    for (let i = 2; i + 9 < buf.length; ) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null; // unknown format — the budget check still applies
};

/** The display box an SVG declares, if any. viewBox alone gives no real size. */
const declaredBox = (svg) => {
  const w = svg.match(/\bwidth="(\d+(?:\.\d+)?)"/);
  const h = svg.match(/\bheight="(\d+(?:\.\d+)?)"/);
  return w && h ? { w: parseFloat(w[1]), h: parseFloat(h[1]) } : null;
};

if (!existsSync(ROOT)) {
  console.error(`✗ ${ROOT}/ not found — run this from the project root.`);
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const files = walk(ROOT);
const oversampled = [];
const overBudget = [];
let checked = 0;
let embedded = 0;

for (const file of files) {
  const rel = relative(ROOT, file);
  if (ALLOW[rel]) continue;

  const ext = extname(file).toLowerCase();
  const bytes = statSync(file).size;
  checked++;

  if (ext === '.svg') {
    const svg = readFileSync(file, 'utf8');
    const raster = embeddedRasterSize(svg);
    const box = declaredBox(svg);
    if (raster && box) {
      embedded++;
      const ratio = Math.max(raster.w / box.w, raster.h / box.h);
      if (ratio > MAX_OVERSAMPLE) {
        oversampled.push({ rel, bytes, ratio, raster, box });
        continue; // one finding per file; this is the more specific diagnosis
      }
    }
  }

  const budget = BUDGET_KB[ext];
  if (budget && bytes > budget * 1024) {
    overBudget.push({ rel, bytes, budget });
  }
}

const kb = (b) => `${(b / 1024).toFixed(0)}KB`;

if (oversampled.length) {
  console.error(`\n✗ ${oversampled.length} SVG(s) embed a raster far larger than they display:\n`);
  for (const o of oversampled.sort((a, b) => b.ratio - a.ratio))
    console.error(
      `    ${kb(o.bytes).padStart(8)}  ${o.ratio.toFixed(1)}x oversampled` +
        `  (${o.raster.w}x${o.raster.h} raster in a ${o.box.w}x${o.box.h} box)  ${o.rel}`
    );
  console.error(`\n  Embedding a raster is fine — 2x for retina is correct. These ship pixels`);
  console.error(`  no display can resolve. Re-embed at ~2x the declared box, or source a`);
  console.error(`  genuine vector. See this file's header.`);
}

if (overBudget.length) {
  console.error(`\n✗ ${overBudget.length} file(s) over the size budget for their type:\n`);
  for (const { rel, bytes, budget } of overBudget.sort((a, b) => b.bytes - a.bytes))
    console.error(`    ${kb(bytes).padStart(8)}  (budget ${budget}KB)  ${rel}`);
  console.error(`\n  public/ is served as-is — Astro never resizes these. Shrink the file, move`);
  console.error(`  it under src/ so the image pipeline handles it, or add an ALLOW entry.`);
}

if (oversampled.length || overBudget.length) {
  console.error('');
  process.exit(1);
}

console.log(
  `✓ public assets clean — ${checked} files checked (${embedded} SVG(s) embed a raster ` +
    `within ${MAX_OVERSAMPLE}x of display size), none over budget`
);
