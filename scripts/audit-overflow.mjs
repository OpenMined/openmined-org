import { chromium, firefox, webkit } from 'playwright';

// ---------------------------------------------------------------------------
// audit-overflow — assert no page scrolls sideways, at every width that matters.
//
// Two horizontal-overflow bugs shipped before this existed, and each one hid
// from the obvious check:
//
//   • The mobile nav drawer only overflowed AFTER the page was scrolled. The
//     drawer is `position: fixed`, so it contributes nothing to the document's
//     scrollable area — until the header's scroll handler puts a `transform` on
//     the header, which makes the header the containing block for its own fixed
//     child. The drawer then stops being viewport-fixed and starts counting.
//     A load-time measurement is therefore blind to it: hence `afterScroll`.
//
//   • The desktop nav overflowed only in a narrow band just above the mobile
//     breakpoint (992–~1080px), where the full inline nav is shown but no
//     longer fits. Testing 390 / 768 / 1440 steps straight over it: hence
//     measuring the boundary itself, +1px above the breakpoint.
//
// So: for each width, measure scrollWidth vs clientWidth on load, again after a
// scroll, and again with the nav menu open — the `simple` header variant reveals
// its nav inline on DESKTOP, so an open menu is a third layout that has to fit —
// and when it overflows, walk the DOM for the elements whose right edge is past
// the viewport, innermost first, so the report names the offender instead of just
// the symptom.
//
// Pseudo-elements are a blind spot in that walk (they aren't in the DOM), so a
// bisect fallback hides subtrees to find which one carries the overflow. A
// 4px-too-wide `.blog-sticky::before` bleed was found exactly that way.
//
// Usage:
//   node scripts/audit-overflow.mjs                   # default pages, all widths
//   node scripts/audit-overflow.mjs <url> [<url> ...]
//   node scripts/audit-overflow.mjs --widths 390,1024
//   node scripts/audit-overflow.mjs --base https://openmined.org   # compare live
//   node scripts/audit-overflow.mjs --engine webkit  # chromium|firefox|webkit
// Exits non-zero if any page/width overflows.
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const takeFlag = (name, fallback) => {
  const i = argv.indexOf(name);
  if (i === -1) return fallback;
  const value = argv[i + 1];
  argv.splice(i, 2);
  return value;
};

// Every flag must be consumed BEFORE argv is read as a path list, or the flag's
// own tokens end up treated as URLs.
const engines = { chromium, firefox, webkit };
const engineName = takeFlag('--engine', 'chromium');
if (!engines[engineName]) {
  console.error(`Unknown --engine "${engineName}" (chromium|firefox|webkit)`);
  process.exit(2);
}

const base = takeFlag('--base', 'http://localhost:4321').replace(/\/$/, '');
const widths = takeFlag('--widths', '390,768,991,992,1024,1080,1200,1440')
  .split(',')
  .map((w) => Number(w.trim()))
  .filter(Boolean);

// A page from each shell: the homepage (sections), a listing (its own pinned
// chrome + unpinned header), a post (TOC), and a campaign page (minimal header).
const paths = argv.length
  ? argv
  : ['/', '/blog/', '/careers/', '/get-involved/', '/talk-to-the-world/'];

const urls = paths.map((p) => (/^https?:/.test(p) ? p : `${base}${p}`));

/** Runs in-page: name every element whose box extends past the viewport.
 *  A hint, not a verdict — `scrollWidth` is the source of truth. Rects ignore
 *  clipping, so a box an ancestor already clips (`overflow-x: clip`) still shows
 *  up here while contributing nothing to the page's scroll width. */
const findOffenders = () => {
  const limit = document.documentElement.clientWidth;
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    // `right` is viewport-relative, so this reads "sticks out past the right
    // edge right now" — which is what a sideways scrollbar is made of.
    if (r.right <= limit + 0.5) continue;
    const id = [
      el.tagName.toLowerCase(),
      el.id ? `#${el.id}` : '',
      typeof el.className === 'string' && el.className
        ? `.${el.className.trim().split(/\s+/).join('.')}`
        : '',
    ].join('');
    out.push({
      el: id.length > 120 ? `${id.slice(0, 120)}…` : id,
      right: Math.round(r.right),
      width: Math.round(r.width),
      position: getComputedStyle(el).position,
      depth: (() => {
        let d = 0;
        for (let n = el; n; n = n.parentElement) d++;
        return d;
      })(),
    });
  }
  // Innermost first — the deepest box that sticks out is the likeliest cause;
  // its ancestors are usually just being stretched by it.
  return out.sort((a, b) => b.depth - a.depth || b.right - a.right).slice(0, 6);
};

/** Runs in-page. Hides subtrees to locate overflow no element's box explains —
 *  i.e. a pseudo-element. Returns the ancestor path down to the culprit. */
const bisectOverflow = () => {
  const over = () => document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const base = over();
  if (base <= 0) return null;
  const name = (el) =>
    el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '');
  const hunt = (el) => {
    for (const child of el.children) {
      const prev = child.style.display;
      child.style.display = 'none';
      const dropped = over() < base;
      child.style.display = prev;
      if (dropped) {
        const deeper = hunt(child);
        return deeper ? `${name(child)} > ${deeper}` : name(child);
      }
    }
    return null;
  };
  return hunt(document.body);
};

const measure = () => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
});

const browser = await engines[engineName].launch();
let failures = 0;

for (const url of urls) {
  console.log(`\n${url}`);
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      // domcontentloaded, not networkidle — localhost never reaches idle.
      await page.waitForTimeout(400);

      const onLoad = await page.evaluate(measure);

      // Scroll down far enough to trigger the header's hide/reveal handler, then
      // settle — this is the state the drawer bug needed.
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(500);
      const afterScroll = await page.evaluate(measure);

      // Menu open, back at the top of the page. The burger is absent on the
      // `minimal` variant and hidden on `default` above the mobile breakpoint.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      const burger = page.locator('.js-nav-toggle');
      let menuOpen = null;
      if ((await burger.count()) && (await burger.first().isVisible())) {
        await burger.first().click();
        await page.waitForTimeout(600); // clear the drawer transition
        menuOpen = await page.evaluate(measure);
      }

      const states = [
        ['load', onLoad],
        ['scrolled', afterScroll],
        ['menu open', menuOpen],
      ].filter(([, m]) => m);
      const bad = states.some(([, m]) => m.scrollWidth > m.clientWidth);
      const fmt = (m) => (m.scrollWidth > m.clientWidth ? `${m.scrollWidth} (+${m.scrollWidth - m.clientWidth})` : 'ok');
      console.log(
        `  ${String(width).padStart(5)}px  ${states.map(([n, m]) => `${n}: ${fmt(m).padEnd(12)}`).join(' ')} ${bad ? 'FAIL' : 'pass'}`,
      );

      if (bad) {
        failures++;
        const offenders = await page.evaluate(findOffenders);
        for (const o of offenders) {
          console.log(`           ↳ ${o.el}  right=${o.right} w=${o.width} (${o.position})`);
        }
        // Only as a fallback: when no element's box explains the overflow it's a
        // pseudo-element, and bisecting finds the subtree that owns it. Skipped
        // when the walk already named boxes, because hiding a *sibling* also
        // relieves overflow (a stacked layout narrows), so the bisect path is a
        // misleading answer whenever a real offender is already visible.
        if (!offenders.length) {
          const path = await page.evaluate(bisectOverflow);
          if (path) console.log(`           ↳ bisect: ${path}  (check its ::before/::after)`);
        }
      }
    } finally {
      await page.close();
    }
  }
}

await browser.close();
console.log(failures ? `\n${failures} overflowing width(s).` : '\nNo horizontal overflow.');
process.exit(failures ? 1 : 0);
