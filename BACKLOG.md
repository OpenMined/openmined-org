# Site backlog — features & polish

Remaining work on the **built site** itself: features that aren't finished and polish
that needs a human eye. Not go-live work and not hosting — both live in `LAUNCH.md`.
An item lives in exactly **one** tracker; when a backlog item also gates launch,
`LAUNCH.md` *references* it rather than restating it.

**Status vocabulary** — the useful axis is *what unblocks it*, not how big it is:

| State | Meaning |
|---|---|
| `NEEDS HUMAN CALL` | Blocked on a maintainer's eye or design judgment, not on information. Batch these into one review session. |
| `NEEDS DECISION` | Blocked on a technical approach choice; options should be written up first. |
| `READY` | Understood well enough to build now. |
| `IN PROGRESS` / `DONE` | Self-explanatory; DONE items get deleted once committed, not archived here. |
| `FIXED <date>` | Kept deliberately, against the rule above, in the one case that earns it: the **cause generalises**, so the entry is worth more as a written trap than the space it costs. Always states the mechanism and the guard. |

Re-derive current state against the code before trusting any entry (per AGENTS.md, a
tracker is a cache). Counts below were re-measured 2026-08-06.

Item numbers are **stable, not sequential** — closed items are deleted without renumbering
the rest, so gaps are expected and existing references stay valid.

**Scanning for what's actually open:** every heading carries its state, so `FIXED` entries are
skippable at a glance. As of 2026-08-12 the open ones are **§2, §3, §4, §5(b/d), §7, §7f, §10,
§14, §15** plus the cleanup items **§7d, §7e, §8, §9, §12, §13, §16, §17, §18** — §1, §5(a/c),
§6, §7b, §7c and §7g are records. §12 is deliberately gated on cutover.

---

## 🔴 Launch-blocking

**None open.** Typography tightening (§1 — the design.openmined.org reconciliation,
incl. the bold-weight delta) was reviewed and closed 2026-08-06.

---

## 🟠 Found by sweeping `src/` — gating TBD

Not previously tracked anywhere. Items 2–4 came from a TODO-comment sweep (2026-07-27);
items 5–7 were found by other means and are dated individually. Counts are occurrences in
`src/`. Some entries here are now `FIXED` records rather than open work — see
the note above the section list.

### 2. Blog image alt text — **195 posts** — `NEEDS DECISION`

`TODO(a11y): N localized body image(s) have empty alt text` appears in **195 blog posts** —
by far the largest single cluster of open TODOs. Left behind by the body-image localization
pass, which preserved images but not descriptions.

- Gating question: an a11y gap at this scale is launch-relevant, but 195 posts is not a
  hand-written job. Options: accept `alt=""` where images are genuinely decorative, generate
  descriptions, or fix only high-traffic posts. **Needs a call on approach before effort.**
- Related: an earlier Lighthouse a11y batch ran on a sample, not the full post set.

### 3. Blog content verification — **~74 markers** — `READY` (mechanical)

`TODO(content)` markers in posts, dominated by `giphy embed (verify)` — embeds carried over by
the converter that were never eyeballed. Mechanical to sweep; each is a look-and-confirm.

### 4. Token-mapping decisions — **16 `TODO(decision)`** — `NEEDS HUMAN CALL`

The deliberate "unmappable value" flags the AGENTS.md convention asks for, concentrated in
`components/layout/Footer.astro` (6), `sections/hero/HomeHero.astro` (4),
`sections/features/HomeFederatedNetwork.astro` (2), `sections/hero/SimpleHero.astro`, plus
`pages/pysyft.astro` and `pages/syfthub.astro`.

Mostly "live is 22px, between `--spacing-XL` 20px and `--spacing-2XL` 24px" — each wants a
one-line human ruling. **Good candidate to batch into the same review session as #1**, since
both are design calls about visual values rather than engineering questions.

### 5. Mobile nav drawer — a11y hardening — `READY` — found 2026-07-28

> Retitled 2026-07-29: this began as "mobile horizontal scroll, site-wide", but a second and
> third defect turned out to trace to the same drawer, so they are collected here rather than
> filed as separate items. One rewrite plausibly retires all of them — see the last bullet.
> Retitled again 2026-08-06: (a) is fixed, so what's left here is a11y only.

**(a) Horizontal scroll, site-wide** — **FIXED 2026-08-06.** Kept because the cause is a trap
worth not re-learning, and because it explains the guard that now exists.

At 390px every page became horizontally scrollable once you scrolled down — `scrollWidth`
doubled to exactly 780px. The recorded diagnosis (the drawer being parked off-screen with
`transform: translateX(100%)`) was the *symptom*; the actual mechanism is why it appeared only
after a scroll. A `position: fixed` box contributes nothing to the document's scroll area, so
the parked drawer was free — until the header's scroll-hide put a `transform` on the header,
which makes the header the **containing block for its own fixed child**. The drawer then stops
being viewport-fixed and its 100%-to-the-right offset starts counting as page width. Measured
directly: the drawer's height reads 900px (the viewport) on load and 156px (the header box)
after scrolling.

- Fixed by making the closed state a **clip** (`clip-path: inset(0 0 0 100%)` → `inset(0)`)
  instead of an off-screen translate, so the box never leaves its containing block in any
  state — transformed ancestor or not. `visibility: hidden` stays, since it does the part a
  clip doesn't: keeping closed-drawer links out of the tab order and the a11y tree.
  See `Header.astro → .site-header__nav`.
- **Visible change:** the drawer now wipes in from the right edge rather than sliding in, so
  its content is uncovered in place instead of travelling. Same direction, same duration.
  Verified interpolating (not snapping) in Chromium and WebKit.
- Guard: `npm run audit:overflow` — asserts `scrollWidth === clientWidth` on load,
  **after scrolling**, and with the menu open, across a width ladder. The after-scroll
  measurement is the one that would have caught this.

**(b) No focus trap** — `READY`, found 2026-07-29. The drawer is a full-screen overlay, but
Tab keeps walking into the page behind it, so keyboard and screen-reader users can focus links
they cannot see. `Esc`-to-close and focus-return-to-burger **are done**
(`Header.astro → setNav`, plus the `dialog[open]` guard so the search modal keeps its own
`Esc`); the trap is what's still missing.

- Whatever implements it must also decide the drawer's role semantics — a full-screen menu
  wants `role="dialog"` + `aria-modal="true"`, which the current `<nav>` doesn't carry.
- Verify by tabbing past the last drawer item and asserting focus stays inside.

**(c) Bar controls were buried under the drawer** — **FIXED 2026-07-29**, recorded because the
cause generalises. The drawer is `position: fixed; inset: 0` with an opaque fill and sits
*after* the bar controls in DOM; the controls were `position: static`, so it painted over them.
The burger's X rendered at a real 28×28 and was invisible, **and the drawer swallowed the tap**
— an open menu could not be closed at all except by following a link. Fix was to drop the
drawer's `z-index: var(--z-dropdown)` (it bought nothing — the whole header is already a
stacking context at `--z-sticky`, so every child outranks the page regardless) and lift the
logo / search / burger onto `--z-content`.

- The lesson worth keeping: **z-index is inert on `position: static`**, already documented on
  `.site-header--unpinned`, and this was the same trap one layer down.

**(d) Consider replacing the whole mechanism.** (a), (b) and (c) were all consequences of
hand-rolling a modal overlay: an off-screen `transform` box (a), no built-in focus containment
(b), and manual stacking against sibling chrome (c). A native `<dialog>` or `[popover]` gives
top-layer painting, focus containment and `Esc` for free — the same reasoning that made
`SearchModal.astro` cheap.

- Still worth pricing, but the case is now narrower: (a) and (c) are fixed and (b) is the only
  remaining symptom, so the rewrite has to justify itself on focus containment alone. Its other
  argument is that top-layer painting would make the containing-block trap in (a) structurally
  impossible rather than merely fixed.

### 6. Assets still hotlinked from live WordPress — **18 refs in 2 files** — **FIXED 2026-08-12** — found 2026-07-29

Two files loaded assets straight off `https://openmined.org/wp-content/uploads/…` instead of a
local copy. They rendered only because live was still WordPress: at cutover that host stops being
WordPress, `/wp-content/uploads/*` disappears, and `public/_redirects` deliberately does *not*
redirect that path (redirecting an asset URL to an HTML page is worse than a 404). All 18 would
have broken the moment the origin repointed.

Two things about its shape are worth keeping:

- **11 of the 18 were videos, not images** — `.mov` screen recordings in one blog post, embedded
  as raw `<video src>` in the markdown. The 2026-07-15 body-image pass swept `src/content/` for
  *images* and walked straight past them, and never covered `src/pages/` at all. Two blind spots,
  one symptom.
- The count looks larger from outside than it is: `src/` still holds ~13 other `wp-content` URLs
  across 8 domains, but they point at *other* organizations' WordPress sites (whitehouse.gov,
  thedatasphere.org, creativecommons.org, ipc.on.ca…). Only `openmined.org/wp-content` was ours.

How it was fixed — verify against the code, not this list:

- `src/pages/pysyft.astro` — the 6 step images import from `src/assets/` and render through
  `<Image>` (`widths` + `sizes`, one dimension constrained, so "resize never reshape" holds); the
  Syft icon moved to `public/logos/`, closing the `TODO(asset:)` above it. Its `:global(img)`
  rule and explicit `height: auto` are load-bearing — see the comments there.
- The post's 11 recordings were transcoded to MP4 and put in `public/blog/<slug>/`, matching the
  convention `ai-audit-part-1` already set. 11 files, 13.3MB measured.
- **Guard, so it can't return silently:** `audit-image-urls.mjs` fails on any
  `openmined.org/wp-content` URL in the built HTML, and it matches raw HTML rather than the
  parsed image URLs — so it also catches a `poster`, an `<a href>` to a PDF, or whatever next
  isn't an `<img>`. It is scoped to our host only, which is why the other 13 URLs above don't
  trip it. Verified by reintroducing a hotlink into built HTML and watching it fail.
- Surfaced incidentally by the global-search work: a page's Pagefind-autodetected `image` meta
  came back as a live WordPress URL, which is what exposed it.
- The standing cutover assertion is in `LAUNCH.md` → Cutover checklist ("No WordPress
  hotlinks"); this entry is only the record of the fix.

### 7. Search excerpts pick up post chrome — `READY` — found 2026-07-29

`/search/` result excerpts contain text from the post's own meta row. A real example, for
`?q=network+sourced`:

> …Is "Network **Sourced**" AI? Or how the future will emerge from private repositories.
> **4 months ago. Research. Policy. 8 min.** How will AI systems obtain and share information in the…

The bolded run is `BlogPost.astro → .post__meta` (relative date · categories · read time) being
indexed as body prose, so Pagefind can pull it into an excerpt. Live has the same class of
problem — one of its excerpts contains "Privacy Policy © 2026 OpenMined Foundation" — so it is
not a regression, but our excerpts can be cleaner than live's rather than matching the flaw.

- **Fix is `data-pagefind-ignore` on the meta row — but there is an ordering trap.** That row is
  also where the result-row metadata comes from (`data-pagefind-meta="date[datetime]"` on the
  `<time>`, and `category` on the first category link). Pagefind does **not** collect metadata
  from inside an ignored subtree, so ignoring the row as-is would silently blank the date and
  category on every post result. **Move the captures out first, then ignore the row.**
  - Moving them is not free: the whole reason they live on those elements is that a
    `key:value` literal is parsed on `:` and `,`, so an ISO timestamp's colons swallow every
    later pair. A colon-free carrier is needed — e.g. epoch-ms on the `<article>` — plus
    client-side formatting in `search.astro`.
- Worth a sweep for the same shape elsewhere while in there: any block that is chrome-like prose
  inside an indexed region (post foot, "Continued Reading" is already ignored, author bylines).
- Verify by re-running a query whose excerpt currently shows the noise, not just by reading CSS.

### 7b. Horizontal scroll at exactly 1024px — site-wide — **FIXED 2026-08-06** — found 2026-08-03

Every page overflowed by 30px at 1024px. Kept for the measurement, which is the part worth
having written down.

The band was wider than recorded: not just 1024 but **every width from the 992px breakpoint to
~1100**, and worst at 992 (+62). At the design's 32px gaps the nav row's intrinsic width is
851px, so it needs a 1102px viewport (logo 189 + 20 + nav 851 + 40 gutters). At 1024 the row was
already being flex-shrunk to 825 — it had hit min-content and stopped, which is why it overflowed
rather than compressing further.

- Fixed by making the nav gap **fluid** — `Header.astro → .site-header --nav-gap`, read by both
  `.site-header__nav` and `.site-nav` (the row is gap-inside-gap, so tightening one alone doesn't
  buy enough). Interpolates 12px at 992 → the design's 32px at 1200. Slack is now monotonic and
  never under 49px.
- **Why fluid rather than a breakpoint step:** live keeps its full nav across this whole band and
  compresses to fit (nav 686px at 992 → 901 by 1200, verified on prod 2026-08-06), so dropping a
  1024 laptop to a burger would have been the bigger regression. And a step has to put its
  boundary somewhere — the first cut of this fix stepped back to 32px gaps at 1100px and landed
  exactly on the knife edge, fitting with **0px** to spare. A clamp has no boundary to get wrong.
- Guard: `npm run audit:overflow` covers the 992/1024/1100 widths that a
  390/768/1440 ladder steps straight over.

### 7g. Two more horizontal overflows, found by the new guard — **FIXED 2026-08-06**

Recorded because both were live defects nobody had filed, and each is a distinct mechanism from
§5a/§7b. Found by running `npm run audit:overflow` past the two known bugs.

**(a) Blog listings scrolled sideways by 4px** — at every width below the container cap, on every
listing and archive. `global.css → .blog-sticky::before` (the pinned bar's background bleed) used
one value for both axes: correct vertically (`--blog-sticky-gap`, the gap it covers) but 4px too
wide horizontally, where the right quantity is the page gutter `.container` reserves
(`--spacing-XL`). Now split into `inset-block` / `inset-inline`. No element's box explained this
one — it took bisecting subtrees to find a pseudo-element, which is now a fallback mode in the
audit script.

**(b) `/style-guide/` scrolled sideways at nearly every width** — up to +318px at 390 and +164 at
992–1199. Three independent causes, all local to the specimen page:
- `.sg-layout` kept `align-items: flex-start` when it switched to `flex-direction: column` at
  ≤991px. On the column axis that sizes each child to its own content, so `.sg-main` became as
  wide as its widest specimen — 708px at a 390px viewport — and took the page with it.
  (`min-width: 0` can't help; that governs shrinking below min-content.)
- `.sg-logo-grid` used bare `1fr` tracks, i.e. `minmax(auto, 1fr)`, which can't shrink below
  min-content — 284px per cell held the grid at 900px. Now `minmax(0, 1fr)`.
- The `.breakout--full` specimen sizes itself to the **viewport**, which only lands symmetrically
  when its track is centred in the page; in the narrower specimen column it ran 132px past the
  right edge. `.sg-prose-frame` now carries the same `overflow-x: clip` backstop `article.post`
  has for exactly this.

### 7c. Prose `wide` breakout is 80px narrower than live — **FIXED 2026-08-06** — found 2026-08-03

Live's article shell (`.article-single__content`) is 860px; ours was 820, so the `wide` breakout
zone landed at 780. The recorded cause was right but undercounted: there were **three** stacked
gutters, not two — `.post` (which is itself a `.container`), then `.post-layout`, then
`.prose-article`. The hero, foot and related blocks each carried the same redundant second one.

Mobile is where it actually hurt, and it is what surfaced the item: 56px of gutter per side at
390px left **278px of body text against live's 350** — a post was visibly more constrained than
an ordinary page, which uses one 20px gutter like everything else.

- Fixed by making the page gutter belong to the shell alone. `.prose-article` now owns no
  horizontal padding and caps at `--col-8` (`global.css → .prose-article`); `.post__hero`,
  `.post-layout`, `.post-foot` and `.post-related` dropped their second gutter, and the four
  `≤991px` overrides that only re-stated it went with them.
- **Every zone now matches live at every width**: body 350 at 390 (was 278), shell 728 at 768,
  `wide` 860 at desktop (was 780), `full` still 1300. Reading column unchanged at 640 — the
  measurement §7c said mattered most was never the one at risk.
- The alignment worry that deferred this **did not materialise**. PostToc is absolutely
  positioned against `.post-layout`'s *padding* box, which `padding-inline` never moved, and its
  `left` only assumes the col-6 column is centred inside col-8 — still true, because removing
  padding from a centred stack doesn't move the centre. Hero/foot/related now align with the body
  at 860 instead of sitting 40px narrower.
- Consumers that are their own shell compose `.container` for the gutter — that is why
  `attribution-based-control.astro` (a standalone `.prose-article`, no section band) now carries
  it, and why the `/style-guide/` prose specimen frame does.
- Checked while here: live's `.article-single__head` is **not** a 720px cap — it is shrink-to-fit
  and measures 720/770/770 across three posts, i.e. sized by the title text. So the hero widening
  to the 860 shell moves *toward* live's wrap width, not away from it. Nothing to file.

### 7f. `--text-subtle` fails WCAG AA at small sizes — site-wide — `NEEDS HUMAN CALL` — found 2026-08-05

`--text-subtle` (grayscale-550) is the site's one quiet-text token — **66 consumers** across
20+ files (placeholders, figcaptions, form field descriptions, CTA fineprint, blog meta,
eyebrows). It is static, and measures **3.25–4.07:1** on every surface we paint, under the
4.5:1 that 1.4.3 wants at 14px.

- **The WordPress site has the identical failure** — it paints 550 for these in both light and
  dark. Matching it was a deliberate call (2026-08-05) so the rebuild could be reviewed against
  production first; the contrast pass comes after. See the token comment in `tokens.css`.
- Candidate fix when it opens: make `--text-subtle` **theme** rather than sit static —
  grayscale-600 in light contexts, 500 in dark (measured 5.8–6.6:1 and 4.6–8.5:1, and 500
  stays one step quieter than dark-mode `--text-body` at 400). Needs the three `[data-section]`
  blocks in `global/theming.css` too, or locked contexts get the wrong one.
- **Do not spot-fix single consumers to a darker literal.** That is what produced the divergence
  this item replaced: two elements were pinned to a bare grayscale-600 for light-mode contrast,
  which then rendered ~2.1:1 in dark mode — worse than the 550 it was fixing.
- Some consumers are ≥18px where 550 legitimately passes at 3:1, so a blanket change slightly
  overshoots; worth auditing by rendered size, not by consumer count.

---

### 14. Donation endpoint hardening — **4 items, one file** — `READY` — found 2026-08-12

`src/pages/api/create-donation.ts` is the only server-side code the site ships, so it is the
whole server attack surface. It works and is verified end-to-end, but four things are missing.
None is exploitable for theft — the secret key never leaves the Worker and Stripe validates the
session — so this is abuse-resistance and hygiene, not a vulnerability:

- **No rate limiting.** An unauthenticated POST creates a Stripe Checkout Session per request,
  spending Worker invocations and Stripe write-rate (100/s on live) and polluting the dashboard.
  Cheapest fix is a Cloudflare rate-limiting rule scoped to `/api/create-donation` — config, not
  code, so it can land the same day as cutover. Turnstile is the heavier option.
- **No maximum amount.** The handler rejects `< 1` with no ceiling. Above Stripe's 8-digit
  smallest-unit limit the request 502s carrying Stripe's own error text, and very large values
  stringify to exponential notation (`String(1e302)` → `"1e+302"`) in the `unit_amount` param.
- **Stripe error text is forwarded to the browser** (the `!res.ok` branch). Stripe's
  authentication-failure messages include a partially-redacted key — an unnecessary information
  channel out of the one route holding the secret. Log server-side, return a fixed message.
- **`success_url` / `cancel_url` are built from the request's own origin**, i.e. the Host header,
  rather than `@data/site.mjs → SITE_URL`, which already exists. Workers constrains the reachable
  hostnames so severity is low, but pinning removes a Host-dependent redirect target and the
  `session_id` leak path via `*.workers.dev`.

**Gating:** rate limiting is the one that bites hardest once the **live** key is in — cross-ref
`LAUNCH.md` §2. The other three are code-quality and can follow.

### 15. `/un-isi-25/` CTA icon is squashed out of its aspect ratio — `READY` — found 2026-08-12

`CtaSection.astro → .cta__icon` hardcodes `width="50" height="50"` on the icon `<img>`, forcing a
non-square source into a square box. Same "resize, never reshape" class that `audit:images`
exists to catch (AGENTS.md), but on a shared **component** rather than one page, so any page
slotting a non-square CTA icon inherits it. `audit:images` doesn't catch it because it guards
`<Image>`/`getImage` calls, not raw `<img>` with both dimensions set — worth considering whether
that guard should widen.

Carried over from the migration repo's own backlog, where it was filed as §15 and never ported.

## 🟢 Cleanup — explicitly NOT launch-blocking

Consolidation work with no user-visible change. Safe to defer indefinitely; do it when
touching the files anyway, or as one deliberate pass.

### 12. Retire the `Live → token mapping` tables — `READY`, but **after cutover** — found 2026-08-11

Component headers carry tables recording what was measured off the WordPress site and
which token absorbed each value, plus `#brxe-…` / `#brx-…` Bricks Builder element IDs
naming the exact live element each was rebuilt from.

**Do not do this before cutover.** Until the origin repoints, that site still exists and
is still an active comparison target — the route-parity and permalink checks in
`LAUNCH.md` compare against it. The tables are ammunition until then.

**Why they must be revisited after.** The word "live" silently changes meaning at
cutover: today it means WordPress, afterwards it means *this site*. A comment reading
"live is 72px" then reads as a discrepancy against production, sending someone hunting a
bug that doesn't exist — a false lead planted in ~40 files. The Bricks IDs are in the
same bucket; they stop resolving to anything the day WordPress goes away.

Not a blanket delete — the rows sort into two kinds:

- **Keep, reworded:** rows recording a *judgment*. `51px → --spacing-5XL (48, snap)`
  documents a deliberate 3px deviation, and without it a tidy-minded contributor
  "corrects" it back to a raw `51px` against the token rule. `eyebrow → body defaults (no
  override)` documents an intentional *absence*, which is invisible in code by
  definition. Reword so the durable fact survives without the dead referent.
- **Drop:** rows that are pure 1:1 restatement (`header height 128px → 128px`) say
  nothing the code doesn't.

The dead `migration/…` file paths that used to sit beside these tables were already
stripped (2026-08-11); this item is only about the tables and the Bricks IDs.

### 7d. Converge component heading spacing — `READY` — found 2026-08-01

Heading→next spacing is fully token-compliant (zero raw px across 42 components) but spans
**10 distinct values**. 16 and 24 dominate (25 of 42 between them); the tail is a 20px cluster
(syfthub components + footer + faq) and singletons at 40 and 48 that read as drift rather than
hierarchy. Some spread is legitimate — a card title→body gap *should* be tighter than a
section heading→body gap — so this is a converge-the-tail pass, not a flatten-everything one.

The standing rule (2026-08-01): components may own their heading margins **so long as they
use shared spacing rather than ad-hoc per-component values**. Today they satisfy the letter
of that (all tokens) but not quite the spirit.

### 7e. `pub-prose` / `aud-prose` are misnomers — `READY` — found 2026-08-01

Neither carries `.prose` any more (`for-publishers.astro`, `for-ai-auditors.astro`). Rename to
something layout-descriptive when next touching those files. Purely cosmetic; the selectors
work fine.

### 8. Retrofit hand-rolled hover-underlines onto the shared utility — `READY` — found 2026-07-29

`global.css` already owns the hover-underline: `.link-hover-line` (transition-based, resting
underline hidden, `currentColor` line wiping in from the left) plus the `.hover-group` container
variant that lets a composite's hover drive it. One file still hand-rolls the same
`background-size: 0% → 100%` effect in scoped CSS instead:

- `pages/pysyft.astro` — **1**

It predates the utility, and it's a few lines that could become one class.

> Narrowed 2026-08-06: the site-chrome instances are **done** — `Header.astro` (nav link,
> sublink, minimal-variant exit link) and `Footer.astro` now compose `.link-hover-line`, using
> the `--link-hover-line-pad` seam to hold the shared line position against their tap-target
> padding. That was the risky half (see the *Care needed* bullet).
>
> Narrowed again 2026-08-11: `ui/Tag.astro` was the other remaining instance and has been
> **deleted** as an orphan (zero importers), so one isolated case is left.

- **Why it's worth doing:** it's the AGENTS.md reusable-CSS rule (a shared effect belongs in
  `global.css`, not copied per component), and the duplication actively misleads — while
  building `/search/` the effect got hand-rolled a *seventh* time precisely because the existing
  utility wasn't discoverable from the component files. (That one has since been consolidated
  onto the utility.)
- **Why it isn't urgent:** every instance currently works and looks right. This is a
  same-output refactor.
- **Care needed:** the utility rests at `--text-body` and sets `display: inline` +
  `padding-bottom: 2px`, so a blind swap changes layout wherever the local rule set its own
  colour or a different display mode. Convert one, diff it visually in both themes, then
  proceed. (The chrome conversions hit exactly this — `inline-flex` links with a caret, and
  rows whose tap-target padding moved the line — which is what the `--link-hover-line-pad`
  seam exists for.)
- Was gated on the card-hover work in case it defined a broader hover language. It didn't
  overlap — that landed as `global.css → .card-float`, a card lift + tilt; this is a text
  underline. No longer blocked.
- Discoverability follow-on, same spirit: `.hover-group` has no `/style-guide` specimen, so it
  stays easy to miss. Adding one is the cheapest guard against an eighth hand-rolled copy.

### 10. Archive headers don't match across taxonomy types — `READY` — found 2026-07-27

The WordPress site gives **every** taxonomy archive (tag, category, locations, author) the
same header furniture. Our tag and locations archives are missing pieces of it. Left alone
deliberately at the time: those pages were signed off, and changing them wants its own
review pass. Three distinct gaps, in increasing order of cost:

- **Category nav** — live renders its 8-item nav (`all news product …`) on all four archive
  types; we render it on `/blog`, the category archives, and the author archives, but not on
  tag or locations archives.
- **Archive-type glyph** — live puts a 16px glyph naming the archive type before every
  archive heading. `BlogToolbar` already takes an optional `icon`; only the author route
  passes one today.
- **Tag descriptions** — live's tag headers read "PySyft · 47 articles · <description>". Our
  `tags.json` has no `description` field, so we render name + count only. This one needs a
  schema field plus harvested copy, the same shape the author bios took.

### 9. Search thumbnails mint a variant that could be shared — `NEEDS DECISION` — found 2026-07-29

`BlogPost.astro → searchThumb` asks for `height: 600`, which emits a ~`1067×600` file per post
purely for `/search/` result tiles. `PostCard.astro` already emits a `1280`-wide variant of the
same cover for every post (its `widths` set), and a 300px square tile could crop from that
instead — **zero** new image files site-wide.

- The trade-off is real, which is why it wasn't just done: reusing `1280` means shipping
  1280px-wide bytes for a 300px tile, ten tiles per results page. Fewer build artifacts and less
  disk, against a heavier search page.
- Only worth deciding once there's a Lighthouse run on the deployed build to say whether the
  search page's image weight actually matters (→ `LAUNCH.md` Polish).
- This is possible **only** because of the "resize, never reshape" rule (AGENTS.md): one-dimension
  variants crop to any shape, so they're shareable across surfaces. A baked square never could be.

---

### 13. Content-Security-Policy for scripts and styles — `NEEDS DECISION`, post-launch — found 2026-08-12

`public/_headers` ships the cheap security headers (nosniff, `Referrer-Policy`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`, and a `frame-ancestors 'none'` CSP). What
it deliberately does **not** ship is a real CSP — a `script-src` / `style-src` allowlist, the
half that would contain an injected `<script>`.

**Why it was deferred rather than done.** Three findings, in the order they bite:

- **Shiki blocks the clean path.** Astro has native CSP (`security.csp`, stable), which
  auto-hashes its own scripts and styles — but its docs state Shiki isn't supported, and this
  site highlights every code fence with it (`astro.config.mjs → markdown.shikiConfig`). Shiki
  emits per-token inline `style` **attributes**, which CSP hashes cannot cover at all; only
  `'unsafe-inline'` admits them. And per spec `'unsafe-inline'` is *ignored* when a hash is
  present in the same directive, so "hashes for scripts, unsafe-inline for styles" is not
  cleanly expressible today (withastro/astro#14798; opt-out requested in
  withastro/roadmap#1325). Enabling it risks unstyled code blocks across the blog.
- **The payoff here is small.** CSP mainly contains XSS, and the usual entry points are absent:
  no logins, no sessions, no cookies at all (verified empirically — see `LAUNCH.md` §5), no
  comments or user-generated content, no input echoed back into a page. Every word of content
  is markdown in this repo. There is no session to steal and no privileged action to forge.
- **The residual risk it wouldn't fix.** The two third-party scripts that *do* run with full
  page rights are the Ionicons CDN on `/style-guide` (`unpkg.com`, no SRI) and HubSpot on form
  pages. A CSP has to allowlist both to keep them working, so it doesn't constrain either.
  Self-hosting the two style-guide icons is the higher-value move and is independent of this.

**What unblocks it:** ship `Content-Security-Policy-Report-Only` via `public/_headers` first,
conceding `style-src 'unsafe-inline'` for Shiki, and collect violations across the blog, the
HubSpot form pages, and a live donate run before enforcing anything. Origins to expect:
`js.hsforms.net` (plus HubSpot's runtime injections), `www.youtube.com` (`frame-src`, 4 posts),
`apply.workable.com` (`connect-src`, `/careers`), `unpkg.com` (`script-src`, `/style-guide`
only). Fonts are self-hosted and Pagefind is same-origin, so neither needs an entry. Stripe
needs none — Checkout is a top-level redirect.

**Guard coverage — what is and isn't checked.** Both halves of the `_headers` footgun are now
covered at build time by `npm run audit:headers` (in CI): the adapter's `/_astro/*`
`Cache-Control` block surviving, nothing else setting `Cache-Control` on an `/_astro/*` path,
comments at column 0, the security-header name floor, and Cloudflare's rule/line limits.
`scripts/smoke-deploy.mjs` independently asserts the immutable asset rule post-deploy.

The one gap left is deliberate and belongs to **cutover, not this item**: nothing asserts that
Cloudflare *applies* the file at runtime on the production account. `audit:headers` reads the
built file, and smoke's `_headers` row checks cache-control only — not the six security headers.
Since production will be a different Worker on a different Cloudflare account, "does this account
apply `_headers`?" is worth one smoke row at cutover. Cheap: assert the header names are present
on a page response, not their values.

---

### 16. Outbound `http://` links — **8 in `src/pages/`, ~90 in post bodies** — `READY` — found 2026-08-12

Cleartext scheme on outbound links. In `src/pages/`: 5× `syft.docs.openmined.org`, 2×
`flower.ai`, 1× `biovault.net`. Post bodies carry ~90 more, dominated by 43×
`http://slack.openmined.org` and 7× `http://github.com`. They redirect to HTTPS in practice, so
this is hygiene rather than breakage — but linking our *own* docs and Slack over cleartext is a
poor look on a privacy project's site. Mechanical find-and-replace; check each host actually
serves HTTPS first.

Related: HSTS with `includeSubDomains` (see `public/_headers`) would force-upgrade the
`*.openmined.org` ones, which is a reason to fix these before that lands rather than after.

### 17. CI actions target a deprecated Node runtime — `READY` — found 2026-08-12

The first CI run (2026-08-12) annotated: `actions/checkout@v4` and `actions/setup-node@v4` target
Node.js 20 and are being force-run on Node.js 24. It passes today via that shim and breaks when
GitHub drops it. One-line fix — bump both to `@v5` in `.github/workflows/ci.yml`. Note this is the
*actions'* own runtime, unrelated to the workflow's `node-version: 22`, which is fine.

### 18. `public/` media is served uncached, and Range is unsupported — `NEEDS DECISION` — found 2026-08-12

Measured against the deployed Worker (2026-08-12). Two separate facts about how Cloudflare's
static-asset layer serves `public/`:

- **No caching.** Only `/_astro/*` gets the immutable rule (injected by the adapter into
  `_headers`); everything in `public/` returns `cache-control: public, max-age=0,
  must-revalidate`. Etags make revalidation a 0-byte 304, so the cost is a round-trip per asset
  per view, not bandwidth — most visible on the RAG tutorial post, which now carries 11 MP4s.
  A `/blog/*` Cache-Control rule in `public/_headers` would remove it, and that pattern cannot
  match `/_astro/*` so it does not trip the injection-suppression footgun (`audit:headers` covers
  that). Decide the max-age: these files are content-addressed by slug, not hashed, so an
  aggressive value makes replacing a video awkward.
- **Range requests are ignored.** `Range: bytes=0-1023` returns `200` with the full body, no
  `Accept-Ranges`, no `Content-Range`. Browsers seek video via range requests, so seeking in
  those clips is degraded. Platform behavior, not something `_headers` can change. Low impact —
  they are short, muted, autoplay screen recordings — but it is the reason to keep them small and
  an argument against ever serving a long video from `public/`.

## Tracked elsewhere — do not duplicate here

Pointers only, so this file doesn't become a second source of truth:

- **Analytics not ported** (§4), **no cookie-consent gate** (§5), and
  **privacy-policy page still describes the WP-era stack** (§6) → `LAUNCH.md`
  (all three re-grounded 2026-08-11 in the analytics/privacy research)
- **JSON-LD structured data** and the rest of the SEO-parity work → `LAUNCH.md`
  §7 (promoted out of Polish 2026-08-12; the graph itself shipped that day)
- **apple-touch-icon / manifest / .ico** → `LAUNCH.md` (Polish)
- **Lighthouse + cross-browser QA on the real deployed build** →
  `LAUNCH.md` (Polish). Note this became *possible* on 2026-07-27: there is now a
  real deployed Worker to run it against.
- **`noindex` flip** and **live Stripe key** → `LAUNCH.md` §2–3, the last
  switches at cutover.

---

## Adding an item

Append with the same shape: **what**, **current state grounded in code** (path + stable
symbol, never line numbers), **what unblocks it**, and whether it gates launch. If it turns
out to be a page-parity gap, a launch blocker, or hosting work, put it in the tracker that
owns that instead and cross-reference.
