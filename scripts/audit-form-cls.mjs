#!/usr/bin/env node
/**
 * audit-form-cls — assert that a late-arriving HubSpot form shifts nothing.
 *
 * ── THE BUG THIS EXISTS FOR ───────────────────────────────────────────────────
 * `@elements/FormEmbed` renders a zero-height marker; HubSpot's `v2.js` injects
 * the real form into it later, so everything after the marker in document order
 * is pushed down when the form lands — a large, purely cosmetic layout shift
 * that costs real Performance points.
 *
 * ⚠ THE CRITERION IS "IS THE MARKER ABOVE THE FOLD", nothing subtler. A
 * zero-height marker means following content starts at exactly the marker's own
 * top, so a visible marker implies visible content after it. Do NOT reason about
 * whether the form is last in its container — the `<footer>` always follows it.
 * That error produced a wrong scope twice while building this: `/grant/` and
 * `/major-gift/` have the form last in its card and still measured 0.24–0.30,
 * shifting `footer.site-footer`, while `/partner/` is clean only because its form
 * happens to sit below the fold.
 *
 * Baseline before the fix, production 2026-08-21, throttled mobile 390x844
 * (`--measure` reproduces these conditions) — 10 pages, not the 3 first found:
 *
 *   /subscribe/                        0.504      /slack/                  0.294
 *   /contact/                          0.478      /subscribe/educ-res      0.258
 *   /contractor-form/                  0.356      /subscribe/event-inv     0.195
 *   /get-involved/                     0.322      /subscribe/newsletter    0.162
 *   /grant/            0.300 (tall)    /subscribe/product-protocol        0.156
 *   /major-gift/       0.240 (tall)    /subscribe/from-andrew             0.073
 *
 * ── THE FIX, AND WHY IT IS NOT A MEASURED HEIGHT ──────────────────────────────
 * The instinct is to reserve the form's rendered height. Don't: that height is
 * HubSpot's to change (add a field and the number is stale), and it swings wildly
 * with width anyway — /subscribe/ measured 1888px at 320px wide and 1060px at
 * 767px. Reserving its tallest case would leave ~940px of dead space.
 *
 * CLS is computed against THE VIEWPORT, so content that moves while already
 * off-screen contributes nothing. The reservation therefore only has to push what
 * follows the form past the bottom edge — see `global.css → .hs-form-embed`,
 * which reserves `100vh - var(--hs-form-top)` and defaults to zero. Surfaces opt
 * in per AGENTS.md → Forms.
 *
 * The drift direction is the safe one: a HubSpot form gaining fields gets TALLER,
 * so the reservation still clears the fold. Only a layout change moving a marker
 * up the page, or a new forms-first surface shipping without a reservation,
 * reintroduces the shift. That is what this guard watches for.
 *
 * ⚠ Sizing is a trade, not a lookup. Too small brings the shift back; too large
 * leaves dead space between the form and what follows. A tall viewport always
 * shows some gap behind a short form — reaching the fold scales with viewport
 * height and the form's height does not, so CLS 0 at 1200px tall and a tight card
 * cannot both hold. Lighthouse scores at ~412x823; tune there. Post-fix gaps run
 * 0–125px at 390x844 and 0–209px at 1440x900, against ~400px at 390x1200.
 *
 * ── WHY THE DEFAULT MODE ASSERTS THE INVARIANT, NOT THE SYMPTOM ───────────────
 * Measuring CLS needs Lighthouse-grade throttling plus a settle window for a
 * third-party script — irreducibly ~10s per page/viewport, which made the first
 * version of this guard a quarter-hour job and useless as a routine check.
 *
 * But the thing that is actually true or false is an invariant:
 *
 *   marker above the fold  ⟹  reserved ≥ viewportHeight − markerTop
 *
 * Both sides are pure layout and CSS, readable AT FIRST PAINT: the marker's own
 * position does not depend on its min-height, and the computed min-height does
 * not depend on HubSpot having run. So the default pass needs no throttling, no
 * settle, and no form — about 1s per page instead of 10s. That is what makes
 * sweeping every form page affordable, which in turn is what lets this guard
 * catch a page nobody remembered to add to a list.
 *
 * `--measure` keeps the throttled CLS matrix for when the MECHANISM changes (a
 * different reservation expression, a new landing component). Use it to
 * re-establish ground truth, not on every push — the invariant is what regresses
 * day to day.
 *
 * What the invariant cannot see: it proves the reservation clears the fold, not
 * that nothing else on the page shifts. `--measure` covers the rest, and its
 * control pages carry small non-form shifts on purpose so a measured run cannot
 * read as clean when it is only clean about forms.
 *
 * ── DISCOVERY, AND THREE WAYS IT WENT WRONG FIRST ─────────────────────────────
 * The page set comes from the live sitemap, not a hand-kept list, because every
 * hand-built version was wrong:
 *   · grepping page sources for `<FormEmbed` MISSED TEN PAGES — those passing a
 *     `formId` into a section component never name `FormEmbed` themselves.
 *   · grepping rendered HTML for the bare string `hs-form-embed` matched ALL 553
 *     pages, because `Base.astro`'s loader carries that selector in inline JS
 *     everywhere. Match the marker's attributes, not the class name alone.
 *   · a grep match is not a usage — a file naming a symbol may only mention it in
 *     a comment (`HeroSwoop` "uses" `StreamEmbed` exactly that way).
 * Discovery costs ~5s for all 553 pages, so there is no reason to guess.
 *
 * Read-only over HTTP. Safe to loop.
 *
 * Usage:
 *   node scripts/audit-form-cls.mjs                      # invariant sweep, prod
 *   node scripts/audit-form-cls.mjs --base http://localhost:4321
 *   node scripts/audit-form-cls.mjs --all                # every blog post too
 *   node scripts/audit-form-cls.mjs --only subscribe     # narrow by path
 *   node scripts/audit-form-cls.mjs --measure            # throttled CLS matrix
 *   node scripts/audit-form-cls.mjs --json out.json
 * Exits non-zero on any violation.
 */
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const argv = process.argv.slice(2);
const takeFlag = (name, fallback) => {
  const i = argv.indexOf(name);
  if (i === -1) return fallback;
  return argv.splice(i, 2)[1];
};
const takeBool = (name) => {
  const i = argv.indexOf(name);
  if (i === -1) return false;
  argv.splice(i, 1);
  return true;
};

const measureMode = takeBool('--measure');
const allPages = takeBool('--all');
const base = takeFlag('--base', 'https://openmined.org').replace(/\/$/, '');
const threshold = Number(takeFlag('--threshold', '0.1'));
const jsonOut = takeFlag('--json', null);
const only = takeFlag('--only', null);
/** Blog posts share one CTA template and sit thousands of px down; sample them
 *  rather than sweeping ~370 near-identical pages. `--all` sweeps the lot. */
const blogSample = Number(takeFlag('--blog-sample', '5'));
/** Settle window for `--measure` only — the invariant pass needs none. */
const settle = Number(takeFlag('--settle', '7000'));

/** Widths where a grid may have collapsed, plus a deliberately TALL viewport:
 *  reaching the fold is the requirement, so a taller viewport is the harder case
 *  and the one a value tuned at 844px silently fails. Do not trim. */
const VIEWPORTS = [
  { label: '360x640 short', width: 360, height: 640 },
  { label: '390x844 typical', width: 390, height: 844 },
  { label: '390x1200 tall', width: 390, height: 1200 },
  { label: '900x1000 stacked-wide', width: 900, height: 1000 },
  { label: '1440x900 desktop', width: 1440, height: 900 },
];

/** Pages measured by `--measure`: the reserving surfaces, plus controls whose
 *  markers sit below the fold and must not regress. The controls are NOT at zero
 *  — `/` carries ~0.044 from the diamond embed (`div.de1`, `canvas.de-webgl`) and
 *  `/careers/` ~0.055 from `.simple-hero__actions`, both unrelated to forms. The
 *  threshold sits above that floor; if you tighten it below ~0.06, fix those
 *  first or the controls go red for reasons that have nothing to do with forms. */
const MEASURE_PAGES = [
  '/contact/', '/subscribe/', '/get-involved/',
  '/slack/', '/contractor-form/', '/subscribe/newsletter/',
  '/subscribe/event-invitations/', '/subscribe/educational-resources/',
  '/subscribe/product-protocol-news/', '/subscribe/from-andrew/',
  '/grant/', '/major-gift/', '/launch-subnet/',
  '/', '/careers/', '/partner/', '/syftbox/',
];

const CPU_RATE = 4;
const NET = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};

/** Sitemap → every path carrying a REAL marker (attributes, not the class name). */
async function discover() {
  const idx = await (await fetch(`${base}/sitemap-index.xml`)).text();
  const children = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const child of children) {
    const xml = await (await fetch(child)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  const hits = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 12 }, async () => {
      while (cursor < urls.length) {
        const url = urls[cursor++];
        try {
          const html = await (await fetch(url)).text();
          if (/class="hs-form-embed[^"]*"\s+data-form-id/.test(html)) hits.push(url);
        } catch {
          /* a page that will not fetch is the smoke test's problem, not ours */
        }
      }
    }),
  );
  return hits.map((u) => new URL(u).pathname).sort();
}

/**
 * For each marker: where it sits, how much it reserves, and — the part that
 * matters — whether anything is actually positioned BELOW its reserved box and
 * still inside the viewport. That last test must be GEOMETRIC, not document
 * order: in a side-by-side grid the second column follows the form in the DOM but
 * sits beside it, so the form growing does not move it. An order-based check
 * reported `/contact/` at 1440x900 as unsafe when it measures 0.001.
 *
 * `pushedBy` names the nearest such element, which is what a violation report
 * needs — usually `footer.site-footer` or the fine print under the form.
 */
const readMarkers = () =>
  [...document.querySelectorAll('.hs-form-embed[data-form-id]')].map((el) => {
    const minH = getComputedStyle(el).minHeight;
    const reserved = minH === 'none' ? 0 : Math.round(parseFloat(minH) || 0);
    const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
    const boxBottom = top + reserved;
    const box = el.getBoundingClientRect();
    let pushed = null;
    for (const node of document.body.querySelectorAll('*')) {
      if (el.contains(node) || node.contains(el)) continue;
      const r = node.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const nodeTop = Math.round(r.top + window.scrollY);
      // Below the reserved box, and on screen before the form arrives.
      if (nodeTop < boxBottom || nodeTop >= window.innerHeight) continue;
      // …and HORIZONTALLY OVERLAPPING it. Without this, an element in the
      // adjacent grid column counts merely because it starts a few px lower:
      // `/subscribe/` at 1440x900 flagged `a.subs__link` 26px below the marker
      // in the sibling column, which a growing form never moves.
      if (r.right <= box.left || r.left >= box.right) continue;
      if (!pushed || nodeTop < pushed.top) {
        const cls = node.className ? '.' + String(node.className).split(' ').filter(Boolean)[0] : '';
        pushed = { top: nodeTop, what: node.tagName.toLowerCase() + cls };
      }
    }
    return {
      top,
      reserved,
      pushedBy: pushed,
      formTop: getComputedStyle(el).getPropertyValue('--hs-form-top').trim() || '(unset)',
    };
  });

const collectShifts = () => {
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({
        value: e.value,
        sources: (e.sources || []).map((s) => {
          const n = s.node;
          if (!n || !n.tagName) return '(text/other)';
          const cls = n.className ? '.' + String(n.className).split(' ').filter(Boolean)[0] : '';
          return n.tagName.toLowerCase() + cls;
        }),
      });
    }
  }).observe({ type: 'layout-shift', buffered: true });
};

const browser = await chromium.launch();
const results = [];
let failures = 0;

if (measureMode) {
  const pages = MEASURE_PAGES.filter((p) => !only || p.includes(only));
  console.log(`Throttled CLS — ${pages.length} pages x ${VIEWPORTS.length} viewports (slow by design).\n`);
  for (const path of pages) {
    console.log(`${base}${path}`);
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.width < 768,
        hasTouch: vp.width < 768,
      });
      const page = await ctx.newPage();
      await page.addInitScript(collectShifts);
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_RATE });
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', NET);
      try {
        await page.goto(base + path, { waitUntil: 'load', timeout: 90000 });
      } catch {
        /* a timeout still leaves whatever shifted measurable */
      }
      await page.waitForTimeout(settle);
      const out = await page.evaluate(() => {
        const shifts = window.__shifts || [];
        const worst = shifts.filter((s) => s.value > 0.01).sort((a, b) => b.value - a.value)[0];
        return {
          cls: Math.round(shifts.reduce((a, s) => a + s.value, 0) * 1000) / 1000,
          worst: worst ? { value: worst.value, sources: [...new Set(worst.sources)] } : null,
        };
      });
      const over = out.cls > threshold;
      if (over) failures++;
      console.log(
        `  ${over ? '❌' : '✅'} ${vp.label.padEnd(22)} CLS ${String(out.cls).padEnd(7)}` +
          (out.worst ? `worst ${out.worst.value.toFixed(3)} ← ${out.worst.sources.join(', ')}` : ''),
      );
      results.push({ mode: 'measure', path, viewport: vp.label, ...out, over });
      await ctx.close();
    }
  }
} else {
  const discovered = await discover();
  const blog = discovered.filter((p) => p.startsWith('/blog/'));
  const rest = discovered.filter((p) => !p.startsWith('/blog/'));
  const chosen = allPages ? discovered : [...rest, ...blog.slice(0, blogSample)];
  const paths = chosen.filter((p) => !only || p.includes(only));
  console.log(
    `Discovered ${rest.length} non-blog + ${blog.length} blog pages with a form marker; checking ${paths.length}` +
      `${allPages ? '' : ` (blog sampled to ${Math.min(blogSample, blog.length)} — --all for every post)`}.\n` +
      `Invariant: marker above the fold => reserved >= viewportHeight - markerTop\n`,
  );
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const path of paths) {
    const bad = [];
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      try {
        await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      } catch {
        bad.push(`${vp.label}: load failed`);
        continue;
      }
      const markers = await page.evaluate(readMarkers);
      for (const [i, m] of markers.entries()) {
        // Safe when nothing sits below the reserved box while still on screen:
        // either the box already clears the fold, or the layout puts the
        // following content beside rather than under the form.
        if (!m.pushedBy) continue;
        const need = vp.height - m.top;
        bad.push(
          `${vp.label}: marker${markers.length > 1 ? ` #${i + 1}` : ''} at ${m.top}px reserves ` +
            `${m.reserved}px, needs ${need}px — ${m.pushedBy.what} at ${m.pushedBy.top}px would be ` +
            `pushed (--hs-form-top: ${m.formTop})`,
        );
      }
      results.push({ mode: 'invariant', path, viewport: vp.label, markers });
    }
    if (bad.length) {
      failures += bad.length;
      console.log(`❌ ${path}`);
      for (const b of bad) console.log(`     ${b}`);
    } else {
      console.log(`✅ ${path}`);
    }
  }
  await ctx.close();
}

await browser.close();
if (jsonOut) {
  await writeFile(jsonOut, JSON.stringify({ base, mode: measureMode ? 'measure' : 'invariant', threshold, results }, null, 2));
}

if (failures) {
  console.log(
    `\n${failures} violation(s).` +
      (measureMode
        ? `\nA form got shorter, or a marker moved up the page — see the header.`
        : `\nSet --hs-form-top on the surface that owns the layout (AGENTS.md -> Forms),` +
          `\nor check with --measure if you believe the invariant is over-strict here.`),
  );
} else {
  console.log(
    measureMode
      ? `\nNo form-induced layout shift. (threshold ${threshold})`
      : `\nEvery above-the-fold marker reserves enough to clear the fold.`,
  );
}
process.exit(failures ? 1 : 0);
