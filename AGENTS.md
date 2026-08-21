# openmined.org

Contributor guidelines for the openmined.org website — an Astro site with a
custom brand system, hosted on AWS Amplify.

Written for humans and AI tools alike, and kept model-independent on purpose:
this is plain markdown any agent can read. `CLAUDE.md` exists only to point
Claude Code here.

**Read `README.md` first** for what the project is, how to run it, how it
builds, and how it deploys. This file is the other half: the conventions that
keep the codebase coherent as it grows. README = how to operate it, AGENTS.md =
how to build in it.

Two trackers hold open work, and an item lives in exactly one of them:

- **`LAUNCH.md`** — go-live blockers, launch decisions, the cutover checklist,
  and the client-account deploy reference.
- **`BACKLOG.md`** — site features and polish that outlast launch.

Both are **caches**. Re-derive any "current state" against the code before
trusting it.

**Where this site came from.** It is a rebuild of a WordPress site, and many
component headers still carry a `Live → token mapping` table recording what was
measured off production and which token absorbed it. Those tables are the
reason a given value is what it is — read them before "fixing" an odd-looking
number. The raw material behind them (Playwright probe JSON, reference
screenshots, extracted page copy) is **not** in this repo; it lives in the
archived migration repo, which is the build record. Nothing here should point
at it.

## Directory structure

```
src/
  components/
    ui/         ← brand primitives — @ui
                  (Button, Link, Card, Tag, Blockquote, CodeBlock, form controls, toggles)
    elements/   ← website elements (composed, site-specific reusables) — @elements
                  (Icon, IconCard, CardGrid, ComparisonTable, Accordion, Tabs…)
    layout/     ← site chrome (Header, Footer, Logo, DonateModal)
    sections/   ← full-width page bands (hero, features, cta, forms…)
    graphics/   ← WebGL embeds (DiamondEmbed, StreamEmbed)
    media/      ← OrgLogo, etc.
  styles/       ← tokens.css + global.css (a barrel over styles/global/*) — @styles
  assets/       ← IMPORTED assets — icons/ (inlined via @elements/Icon) — @assets
  layouts/      ← page shells (Base.astro, Page.astro, BlogPost.astro…) — @layouts
  content/      ← Astro content collections (blog); schema in src/content.config.ts
  data/         ← shared registries (organizations, donation, people…) — @data
  utils/        ← shared helpers (posts…) — @utils
  pages/        ← routes; style-guide.astro is the canonical review page
public/         ← static assets SERVED as-is (logos, fonts, raster/SVG images)
integrations/   ← build-time Astro integrations (pagefind.mjs)
scripts/        ← verification kit (audits, smoke, donate check) — see README
```

`ui/` holds brand atoms (they originate at design.openmined.org); `elements/`
holds our own composed reusables. Atomic-design terms (atom/molecule/organism)
are a mental model only — the folders group by **function**, per Astro
convention.

**Module aliases** (defined in `astro.config.mjs → vite.resolve.alias`, mirrored
in `tsconfig.json → compilerOptions.paths` — keep the two lists 1:1):
`@ui @elements @components @layouts @styles @assets @data @utils`.

**Never use `../../` paths into another folder — use an alias.** Same-directory
`./` imports are fine. Imported/processed assets go in `src/assets/`;
served-as-is assets go in `public/`.

## Brand

Design tokens and UI primitives are **owned by this project** — tokens and
global CSS in `src/styles/` (`@styles`), primitives in `src/components/ui/`
(`@ui`). They originated from the OpenMined brand system but are not a synced
mirror; they're maintained here.

**Canonical brand source:** https://design.openmined.org/ — the source of truth
for brand *intent* (tokens, primitives, logo assets). We track it **loosely**,
not as an auto-sync.

**Code is canonical for values.** `src/styles/tokens.css` is the authoritative
token implementation and the rendered `/style-guide` page is the canonical
review surface. Where any document disagrees with the code, the code wins.

**Reconciliation audit** (do periodically, not on every change):

1. Compare design.openmined.org against `src/styles/` + `src/components/ui/`.
2. Review new or changed tokens and primitives.
3. Port deliberately — map to existing tokens; flag genuinely new ones.
4. Update the marker below.

> **Last reconciled with design.openmined.org:** 2026-06-22

`Logo.astro` (`src/components/layout/`) renders the logo; the SVG files are in
`public/logos/`. Canonical logo assets live at design.openmined.org — reconcile
against it when logos change.

## Documentation

**Docs reference code, they don't mirror it.** Code is canonical (`tokens.css`,
`src/content.config.ts`, `global.css`, the `/style-guide` page). One fact, one
home: token *values* → `tokens.css`; schemas and collections →
`src/content.config.ts`; CSS rules → `global.css`; file and route structure →
the filesystem; **rationale, decisions and why, sequence, and status → docs**.

A doc may *point* at code by **path + stable symbol** (e.g. `content.config.ts →
blog collection`, `global.css → .prose-article grid`) — never by line number,
and never by restating values, schemas, or CSS that live in code, because those
drift.

Litmus test: *if I change the code, does this doc line go wrong?* If yes, it's a
mirror — replace it with a reference.

- **Spec lifecycle:** a spec may carry a `// PROPOSED` snippet for not-yet-built
  code; the moment it lands, delete the snippet and replace it with a reference.
- **When a quote is unavoidable,** stamp it (`verified against <path>: <date>`),
  like the brand-reconciliation marker above.

## Tokens

- **Use brand tokens for all values.** No hardcoded hex or px where a token
  exists. **Verify a token exists before using it** — an undefined custom
  property fails silently to nothing rather than erroring, so a typo'd
  `var(--spacing-6XL)` produces a broken layout with no warning. Grep
  `tokens.css` first.
- **Snap to the nearest existing token** when a measured value falls between
  scale steps, rather than introducing a raw px value. Small visual deltas are
  accepted to keep the scale pure.
- Reserve `TODO(decision:)` for values that are genuinely unmappable *and* where
  the nearest token is far enough that snapping would distort the layout. Flag
  those for a human call — don't guess.

## CSS architecture

**`global.css` is a barrel**, not a stylesheet: it only `@import`s the concept
files in `src/styles/global/`. Vite inlines them, so the site still ships one
sheet. `Base.astro` imports `tokens.css` + `global.css` and nothing else.

**Import order in the barrel IS the cascade.** Equal-specificity rules are
resolved by source order, so moving a rule between partials can change which one
wins even though nothing was edited. Which file owns what — and the two
order-dependent imports — are documented in the barrel's own header. Read it
before adding a file or moving a rule, and **don't sort that list**.

Which partial a rule lands in follows from its selector: no class on the
selector → `base.css`; otherwise the file named for the class family it belongs
to. Doc pointers stay written as `global.css → .some-class` — the barrel is the
front door and the symbol is what makes them findable.

**Reusable CSS belongs in global CSS.** A component's scoped `<style>` only
reaches that component's own markup — never put a class there if raw markup or
other components also use it.

## Color modes

Three `data-section` values override the page theme at the element level. Apply
to any element, not just `<section>`. Inside these contexts always use semantic
tokens (`--surface-background-default`, `--text-body`, …) — never hardcode
palette values.

| `data-section` value | Effect |
|---|---|
| `always-dark` | Locks surface + text tokens to dark values regardless of page theme. For elements that must always sit on a dark surface (footer, always-dark hero). |
| `always-light` | Locks surface + text tokens to light values regardless of page theme. Ensures legible dark text on light backgrounds even in dark mode (cards with white bg, light panels). |
| `invert` | Remaps `--surface-*` to `--dark-surface-*`, which flips with the page theme: dark surface in light mode, light surface in dark mode. For sections that should always contrast with the page. |

`always-dark` and `always-light` are fixed — they never change with the page
theme. `invert` participates in the theme switch (it uses the `--dark-surface-*`
parallel set).

**Page-normal content inside an inverted band** (e.g. a main-colorway card
sitting in a contrasting band): do NOT put `data-section="invert"` on the band
and try to un-invert a child — nesting `invert` inside `invert` does **not**
revert, it re-applies the same remap. Instead set the **band's background
directly** to `var(--dark-surface-background-default)` (inverse of the page,
still flips with the theme) and apply `data-section="invert"` only on the
*sub-block* that needs light-on-dark text. Any sibling left on the page-normal
tokens then renders in the main colorway — the inverse of the inverse — while
still living inside the contrasting band. Reference `/talk-to-the-world/`.

## Typography and text

- **Component `<style>` blocks only declare type properties that differ from
  global element defaults** (`global.css` `h1`–`h6`, `body`). Never re-declare
  `font-family`, `font-size`, `font-weight`, or `line-height` where the element
  default already covers it. Only spacing, intentional scale deviations, and
  color overrides for non-default surfaces belong in component styles.
- **Custom heading sizes** — headings scale responsively via `clamp()` reading
  `--hN-min`/`--hN-max` tokens. To use a smaller desktop size (e.g. a long page
  title), override `--hN-max` on a parent: `.page-hero { --h1-max: 48px; }`. The
  mobile floor and fluid rate are automatic. **Never set `font-size` directly on
  a heading element for a custom size** — that strips the mobile scaling.
- **`.measure` — text readability max-widths.** Add `class="measure"` to any
  text element and set `--measure` to constrain its line length; any length unit
  works (`em`, `ch`, `px`, `var(--col-N)`). The strip to no constraint at ≤767px
  is automatic. Set `--measure` only (never `max-width`) on `.measure` elements
  so the mobile reset always wins. For a constraint that must persist at mobile,
  skip the class and write `max-width` directly in scoped CSS.
- **`@ui/Text` + the text-width invariant.** `Text.astro` is the canonical text
  primitive: polymorphic (`as`) with `.measure` built in (`<Text as="h4"
  measure="40em">`). **Author text through `<Text>`** so any text node is
  measure-ready without retrofitting per-component props.
  **Invariant: a TEXT element never carries a scoped `max-width` — its width
  comes from `.measure`.** Scoped `max-width` is only for *layout* boxes
  (columns, containers, cards, media). A `max-width` on a text leaf silently
  beats `.measure` and blocks the mobile strip. Two caveats: `em` resolves
  against the element's *own* font-size (heading `20em` ≠ body `20em`), and
  `<Text>` can't forward `set:html`, so `set:html` text stays a bare element —
  just keep it max-width-free so it's measure-ready. Astro propagates a
  component's scoped-style id onto `<Text>` roots, so scoped `.foo` rules still
  apply through it.

## Prose

**`.prose` is the article-style typographic scope, applied to a *region*, never
to a leaf element.** It styles the bare elements of flowing content (headings,
paragraphs, lists, links, tables, media, rhythm) and nothing that carries a
class. Put it on the container that wraps prose (a `<div>`/`<article>` holding
block-level children), **never on a single `<p>`/`<h2>`/`<li>`** — a lone styled
paragraph in a section is not prose; style it locally. `.prose` carries **no
layout opinion**.

**`.prose-article` is the article-body *layout*** — the named-column breakout
grid (col-6 reading column, col-8 `wide`/`full` breakout zones). It composes
with `.prose` on genuine long-form bodies only: `<article class="prose
prose-article">` (blog posts, whitepapers). It is a separate class from `.prose`
precisely because `.prose` also scopes small prose regions that must not become
breakout grids. See `global.css → .prose` and `→ .prose-article`.

**The page gutter has exactly one owner: the shell** (`.container`, a section,
`.post-layout`). `.prose-article` deliberately carries no horizontal padding,
and neither may a block that already sits in a container — a layout class cannot
know whether a gutter is already there, so a second one silently stacks. A
`.prose-article` that IS its own shell composes `.container` for the gutter
(reference `attribution-based-control.astro`).

Symptom to recognise: article content **narrower than a normal page's** at small
widths, and breakout zones short of their intended width. Measure the body's
rendered width against a non-article page before reaching for the breakout grid
itself.

## Components

- **Sections use type subfolders with page-prefixed filenames**:
  `sections/[type]/[PageName].astro` — e.g. `hero/HomeHero.astro`,
  `features/HomeFederatedNetwork.astro`. The folder is the pattern type; a
  `[Page]` prefix marks it page-specific; no prefix means generic/reusable. A
  section that genuinely doesn't fit a type can sit flat until a second sibling
  gives it a folder.
- **Primitives** (`components/ui/`) each get a labeled specimen on the
  `/style-guide` page and are verified in light/dark and desktop/mobile there
  before use. **Full-bleed sections** (`components/sections/`, plus site chrome)
  are reviewed in place on their actual page — they don't need a `/style-guide`
  specimen.
- **Component-spacing override seams.** Where a component exposes a *scale* of
  spacing (named presets, not one fixed value), read that spacing from a CSS
  custom property whose **fallback is the preset**, e.g. `padding-top:
  var(--hero-pad-top, var(--spacing-2XL))`. A page then dials an exact value by
  setting the var on a parent (`.un-isi-hero { --hero-pad-top:
  var(--spacing-4XL); }`) — same pattern as the `--hN-max` heading override, and
  it inherits into the nested component. **Prefer this seam over adding another
  named variant** (a 4th `padTop` enum, etc.): one seam serves every page, always
  set the value to a spacing token, and pages that don't set the var keep their
  preset unchanged. Reference `SimpleHero.astro → .simple-hero padding-top`.
- **Multi-CTA button rows.** Whenever a section slots more than one button or
  CTA (`ButtonCta`, hero `actions`, …), lay them out with the **one shared
  pattern**: centered flex, `flex-wrap: wrap`, `gap: 10px var(--spacing-XL)`
  (`--spacing-XL` between buttons, 10px row-gap when they wrap). Reference
  `SimpleHero__actions`. All multi-CTA areas get the **same** spacing — never
  invent a per-section gap.

## Forms

Embed the live HubSpot form via `@elements/FormEmbed` (a
`.hs-form-embed[data-form-id]` marker; the loader in `Base.astro` runs v2.js and
`hbspt.forms.create`s it). All forms share one portal and region; only `formId`
differs — **probe it off the source form, never guess**. Section and CTA embeds
are full-width (`fullWidth` prop defaults true); in-body content forms are
auto-width (raw `.md` markers, no class). The `.hs-form` skin lives in
`global.css → .hs-form` and is reviewed on the `/style-guide` Sections specimen.

**Never hand-rebuild a HubSpot form from `@ui` primitives** — a placeholder
rebuild drifts from the real schema.

**A marker above the fold must reserve space.** The marker renders at zero height
and HubSpot fills it later, so everything after it in document order is pushed
down when the form lands. The criterion is simply **is the marker above the fold**
— because a zero-height marker means following content starts exactly at the
marker's own top, so if the marker is visible, what follows it is visible and
therefore shifts.

Do **not** reason about whether the form is "last in its container": the
`<footer>` always follows it. That mistake cost a wrong scope here — `/grant/` and
`/major-gift/` have the form last in its card and still measured 0.24–0.30,
shifting `footer.site-footer`. Conversely `/partner/` is clean only because its
form happens to sit *below* the fold.

Because most markers sit far down a long page, this is **opt-in, never a default**:
a `min-height` taller than the rendered form is dead space, so defaulting it on
would trade whitespace across most of the site to fix a minority of layouts.

**Reserve to reach the fold, not the form's height.** CLS is computed against the
viewport, so content that moves while already off-screen costs nothing: the
reservation only has to push what follows the form past the bottom edge. This
matters because the form's height is HubSpot's to change and swings with width —
matching it would be both brittle and wasteful.

The mechanism is one declaration in `global.css → .hs-form-embed`, which reserves
`100vh - var(--hs-form-top)`. A surface opts in by setting `--hs-form-top` to the
form's own distance from the top of the viewport; the default computes to zero
reservation, so surfaces needing nothing pay nothing. The `calc` lives in the
global rule on purpose, so no call site can reach for `dvh` — a unit that changes
as mobile toolbars hide would move the box itself.

Set it on whatever owns the layout — a **component** where the layout is shared
(`OptInLanding`, `InquiryLanding`, `EventRegLanding`), the page where it isn't
(`contact.astro`, `get-involved.astro`, `subscribe/index.astro`). Only put it
inside a media query when the shift is stacking-dependent: the three grid pages
shift solely when collapsed, while the landing components are single-column at
every width and shift on desktop too.

**Sizing it is a real trade, not a lookup.** Too small brings the shift back; too
large leaves visible dead space between the form and whatever follows. Measure the
marker's `top` at 390px wide and round down slightly. Where one component serves
pages whose headings differ in length, take a per-page value —
`OptInLanding`'s `formTop` prop exists because its pages vary by ~170px, and a
single value left 200px+ gaps on the shortest forms. Accept that a tall viewport
still shows a gap behind a short form: reaching the fold scales with viewport
height and the form's height does not, so CLS 0 at 1200px tall and a tight card
cannot both hold. Lighthouse scores at ~412x823, so tune there.

**Never gate the page's own content reveal on `v2.js`.** Hiding content until the
form loads also removes the shift, and is not worth considering — HubSpot's
domains are widely blocked, so a blocked script would leave real content
permanently hidden. That trades an availability failure for a cosmetic metric.

Guarded by `npm run audit:form-cls`, which measures CLS under Lighthouse's own
throttled-mobile conditions; its header carries the measurements and the
reasoning. It **discovers** its own page set rather than trusting a list, and that
is deliberate: a hand-assembled list missed ten forms-first pages, because a page
passing a `formId` into a section component never mentions `FormEmbed` itself.
The general lesson, learned three times in one session: **a grep match is not a
usage** — a filename matching a symbol may only mention it in a comment, and the
`.hs-form-embed` selector appears in `Base.astro`'s loader on every page. Confirm
what a match means before building a scope on it.

## Donate modal

The "Secure Donation" dialog is `@components/layout/DonateModal.astro`, rendered
once in `Base.astro` and therefore present on every page. Open it from anywhere
with a `[data-donate-open]` attribute on a button or link — one delegated
listener drives them all (header nav, hero, foundation, footer, get-involved
card); no per-trigger JS. It's a native `<dialog>` (top-layer, `::backdrop`,
Esc and backdrop close), colormode-aware, and reviewed on `/style-guide`
(`#donate`). Presets, currency list, and Stripe amount encoding live in
`@data/donation.mjs → PRESETS / CURRENCIES / toStripeAmount`.

## Server endpoints and the workerd constraint

`output` stays `static` (every page prerenders) and only routes that set
`export const prerender = false` run on-demand. In production the one on-demand
route is served by its Lambda twin (`aws/create-donation/`);
`src/pages/api/create-donation.ts` stays the contract source and serves dev —
the two must not drift. See README for the deploy and secrets story.

- Read runtime secrets through the endpoint's own accessor seam
  (`create-donation.ts → readRuntimeEnv`, which falls back to `process.env`),
  **not** `import.meta.env` — which bakes values into the bundle at build —
  and not `Astro.locals.runtime.env`, removed in Astro 7.
- Use direct `fetch` to third parties, not their Node SDK, so routes stay
  portable across runtimes (workerd in dev, Node on the Lambda).

**workerd render constraint:** dev and (by default) prerender run under
**workerd**, Cloudflare's runtime — the `@astrojs/cloudflare` adapter is the
build toolchain here, not a hosting choice. Amplify builds prerender in plain
Node (`PRERENDER_ENV=node`), but dev always renders under workerd, so at render
time **never use Node filesystem APIs or Node-only globals**. Read files
through Vite (`import.meta.glob('…', {query:'?raw'})`) as
`@components/media/OrgLogo.astro` and `@elements/Icon` do — never `node:fs`.
`wrangler.jsonc` sets `nodejs_compat` (which provides `process`); `node:fs` is
still unavailable, because workerd has no filesystem.

## Images: resize, never reshape

When generating image variants (`<Image>`, `getImage`, any future CDN
transform), **only resize the source — never force it into a non-native aspect
ratio.** Constrain **one** dimension (`widths={[…]}`, or a lone `width`/`height`)
and let the other follow the source. Any letterboxing or pillarboxing a design
calls for is done in **CSS** (`object-fit: cover`, `background-size: cover`,
`aspect-ratio` on the box) — never baked into the file.

**Why:** passing both `width` and `height` makes the service *pad* the image to
fit, permanently. It is a **silent** failure — the file has exactly the
dimensions requested, so every dimension check passes and only sampling pixels
reveals it. Astro's `getImage` pads even when told `fit: 'cover'` (the option is
not honoured), and sharp's default pad colour is opaque black, which on dark
artwork reads as a deliberate treatment rather than a bug. CSS crops correctly,
costs nothing, and stays adjustable afterwards.

It also keeps variant count down: a one-dimension variant is shareable across
surfaces — a square tile and a 16:9 hero can crop from the same file — whereas a
per-surface baked shape can never be reused.

Reference `BlogPost.astro → searchThumb` (height-only, cropped by `search.astro
→ .search-result__tile`) and `PostCard.astro` (`widths` only, cropped by
`object-fit: cover`). Guarded by `npm run audit:images`.

## WebGL embeds

Two components ship WebGL — `components/graphics/DiamondEmbed.astro` and
`StreamEmbed.astro`, both only on `/` (via `HomeHero.astro`) and `/style-guide/`.
Their scripts are `is:inline` and cannot import, so the guards below exist as two
hand-synced copies; DiamondEmbed's comments carry the measurements.

Two rules, both learned from PageSpeed Insights scoring the homepage **41** while
local Lighthouse scored 98 (measured 2026-08-21, `--use-angle=swiftshader` at 4×
CPU throttling):

- **Never create a GL context before the page has painted.** On a software
  renderer — no GPU, which is PSI's headless Chromium, plus blocklisted drivers
  and VMs — `getContext('webgl')` on an in-document canvas is a synchronous wait
  on a compositor busy rasterizing the page in software: **1,972ms inside the
  first-paint phase against 6ms after it.** A *detached* probe canvas pays it too,
  so there is no cheap way to check the renderer up front and no timing shortcut:
  `load` fires before first paint on a fast connection, and FCP alone still lands
  in the raster tail. Both embeds gate init on FCP **plus** two on-time animation
  frames (`afterPagePainted`), and each canvas fades in on its first drawn frame.
  Layout stays eager — the container's aspect-ratio and sizing must never wait on
  a context, or the page shifts when the graphic arrives.
- **Never animate on a software renderer.** A per-pixel shader rasterizes on the
  CPU and blocks the main thread every frame. Read `WEBGL_debug_renderer_info`
  once the context exists and draw **one** static frame instead of starting the
  rAF loop — the same treatment `prefers-reduced-motion` gets.

Verify with the flagged Lighthouse run in `LAUNCH.md`'s Lighthouse QA line, and
the mechanism under that flag with Playwright: count rAF callbacks (0 on the
static path, ~360 in 3s animating) and time `getContext`. Measure a median of
five runs — single runs of this swing by seconds.

## Layering and overflow

**Site chrome always beats page chrome.** The header owns `--z-sticky`; anything
a *page* pins or elevates sits on `--z-base` beneath it (see the token comments
in `tokens.css`). Sharing one layer means DOM order decides, and page chrome —
being later in the document — silently paints over the header's nav dropdown.
Related trap: `z-index` is **inert on `position: static`**, so a header that
isn't pinned still needs `relative` to hold its layer (`Header.astro →
.site-header--unpinned`).

**A pinned bar needs two sticky layers to agree, not compete.** Where a page
pins its own chrome at the top of the scroll area, the site header must not also
be pinned there — pass `sticky={false}` (blog listings do it through
`@layouts/BlogListing.astro`, which exists so the rule has one home instead of a
prop repeated across routes). Give a pinned bar its background bleed with an
absolutely-positioned pseudo-element, **never a `box-shadow` spread**: a shadow
is paint-only, so it hides what scrolls beneath while still letting clicks
through to it. Both keep the in-flow box — and therefore the page's spacing —
untouched. Reference `global.css → .blog-sticky`. A bleed's two axes are
**different quantities** — vertically the gap it covers, horizontally the page
gutter `.container` reserves — so never drive both from one value; 4px of extra
horizontal bleed is 4px of sideways scroll on every page using it.

**No page may scroll sideways — and never park a box off-screen to hide it.**
Guarded by `npm run audit:overflow`. Three traps it exists for:

- **A `fixed` box hidden off-screen is only free until an ancestor gets a
  `transform`.** A transform (also `filter`, `will-change`) makes that ancestor
  the containing block for its fixed descendants, so the box stops being
  viewport-fixed and its offset starts counting as page width. This one needs a
  *scroll* to reproduce — the header's scroll-hide transform is what triggers it.
  Hide by **clipping** (`clip-path`), keeping the box on its containing block,
  and keep `visibility: hidden` for the non-visual half (tab order, a11y tree).
  Reference `Header.astro → .site-header__nav`.
- **Test the breakpoint boundary, not round numbers.** A 390/768/1440 ladder
  steps straight over a nav that fits at 1440 and overflows from 992 to ~1100.
  Prefer a fluid `clamp()` over a media-query step so there is no boundary to
  land wrong on — reference `Header.astro → --nav-gap`.
- **A bare `1fr` track is `minmax(auto, 1fr)`** and cannot shrink below its
  content's min-content width. Use `minmax(0, 1fr)` for any grid that must
  survive a narrow column.

## Gates

- `npm run check` — `astro check`, the type gate. CI runs it on every push.
- `npm run build` — must stay green; it also builds the Pagefind search index.
- The audit guards in `scripts/` are regression gates, not one-off tools. Run the
  one that covers what you touched; see README for the full kit.
