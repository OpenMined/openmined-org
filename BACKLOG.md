# Site backlog — features & polish

Open work on the **built site**: features that aren't finished and polish that
needs a human eye. Not launch work and not hosting — both live in `LAUNCH.md`.
An item lives in exactly one tracker.

This file is deliberately minimal: **code is the reference.** Each entry says
what the item is, what unblocks it, and where it lives — counts and file lists
are re-derived by running the grep given, never trusted from here. Completed
items are **deleted**, not archived; when a fix carries a generalizable lesson,
that lesson's home is `AGENTS.md` or the relevant guard script's header, not
this file.

States — the axis is *what unblocks it*, not size: `READY` (understood, build
it), `NEEDS DECISION` (technical approach choice first), `NEEDS HUMAN CALL`
(maintainer's eye or design judgment).

Item numbers are **stable, not sequential** — closed items are deleted without
renumbering, so gaps are expected and cross-references from other files
(README, HOSTING.md, `public/_headers`) stay valid.

## Open

### 2. Blog image alt text — `NEEDS DECISION`

`grep -rl "TODO(a11y)" src/content/blog` — posts (~195) whose body images have
no alt text. The source never had any (verified against live + its media
library 2026-08-14), so this is an improvement over live, not a regression.
Too many to hand-write: decide between accepting `alt=""` as decorative,
generating descriptions, or covering high-traffic posts only.

### 3. Blog content verification — `READY` (mechanical)

`grep -rn "TODO(content" src/content` — converter-carried embeds (mostly
giphy) never eyeballed. Each is a look-and-confirm.

### 4. Token-mapping decisions — `NEEDS HUMAN CALL`

`grep -rn "TODO(decision" src/` — the deliberate "unmappable value" flags the
AGENTS.md convention asks for. Each wants a one-line ruling (typically "live
measured Xpx, between two scale steps — pick one"). Batch into a single
design-review session.

### 5. Mobile nav drawer — focus trap — `READY`

The drawer is a full-screen overlay but Tab walks into the page behind it
(`Header.astro`). `Esc`-to-close and focus-return-to-burger are done; the trap
is missing, and whatever adds it should also settle the drawer's role
semantics (`role="dialog"` + `aria-modal="true"`, which the current `<nav>`
doesn't carry). Worth pricing a native `<dialog>`/`[popover]` rewrite at the
same time — top-layer painting and focus containment for free, the same
reasoning that made `SearchModal.astro` cheap. Verify by tabbing past the last
drawer item and asserting focus stays inside.

### 7. Search excerpts pick up post chrome — `READY`

`/search/` result excerpts include the post meta row (relative date ·
categories · read time) as body prose. Fix is `data-pagefind-ignore` on
`BlogPost.astro → .post__meta` — **but there is an ordering trap**: that row
also carries the `data-pagefind-meta` captures (`date[datetime]` on the
`<time>`, `category` on the first category link), and Pagefind does not
collect metadata inside an ignored subtree — ignoring the row as-is silently
blanks date/category on every result. Move the captures out first; they can't
move as-is either, because a `key:value` literal parses on `:` and an ISO
timestamp's colons swallow later pairs — needs a colon-free carrier (e.g.
epoch-ms on the `<article>`) plus client-side formatting in `search.astro`.
Verify with a query whose excerpt currently shows the noise.

### 7f. `--text-subtle` fails WCAG AA at small sizes — `NEEDS HUMAN CALL`

The site's one quiet-text token measures 3.25–4.07:1 on our surfaces, under
the 4.5:1 that WCAG 1.4.3 wants at body sizes — matching the WordPress site by
deliberate call (see the token comment in `tokens.css`). Candidate fix: make
the token **theme** rather than sit static — grayscale-600 in light, 500 in
dark (both measured passing) — including the `[data-section]` blocks in
`global/theming.css`, or locked contexts get the wrong one. **Never spot-fix a
single consumer to a darker literal** — that's what previously produced
~2.1:1 in dark mode. Some ≥18px consumers legitimately pass at 3:1, so audit
by rendered size, not consumer count.

### 10. Archive headers don't match across taxonomy types — `READY`

Live gives every taxonomy archive the same header furniture; our tag and
locations archives are missing pieces, in increasing order of cost: the 8-item
category nav; the archive-type glyph (`BlogToolbar` already takes an optional
`icon` — only the author route passes one); and tag descriptions (`tags.json`
has no `description` field — needs the field plus harvested copy, same shape
the author bios took).

### 14. Donation endpoint hardening — `READY` — **two files**

Every fix must land in **both** implementations:
`src/pages/api/create-donation.ts` (the contract source; serves dev) and
`aws/create-donation/index.mjs` (what production runs). **Two open**, both
abuse-resistance rather than exposure — the secret never leaves the Lambda and
Stripe validates the session. Two others closed at cutover and are kept struck
through, because both were decided rather than merely done:

- ~~**Staging and previews share production's key.**~~ **Closed 2026-08-17 —
  superseded at Stephen's direction** (it had been accepted-not-blocking,
  Kyle's call earlier the same day). Implemented as the host check this item
  itself proposed: two SSM parameters (`…/STRIPE_SECRET_KEY` live,
  `…/STRIPE_SECRET_KEY_TEST` test) and the Lambda selects per request from the
  validated origin — exactly the production origin → live, staging and
  previews → test. `safeOrigin` also now allowlists `staging.openmined.org`,
  so staging checkouts round-trip to staging instead of falling back to
  production. Both files, per this section's rule; parameters and rotation in
  `aws/create-donation/README.md`.

- **No rate limiting.** An unauthenticated POST creates a Stripe Checkout
  Session per request, spending Stripe write-rate and polluting the dashboard.
  On AWS this is infra config (API Gateway throttling or WAF on the one path),
  landable the same day as the live key — cross-ref `LAUNCH.md` §2.
- **No maximum amount.** `< 1` is rejected with no ceiling; very large values
  stringify to exponential notation in `unit_amount` and 502 with Stripe's
  own error text.
- ~~**Stripe error text is forwarded to the browser.**~~ **Closed 2026-08-17**
  by Stephen, ahead of the live-key swap as this item asked. The `!res.ok`
  branch no longer passes Stripe's message through; verified against production
  after cutover — an over-large amount returns the fixed
  `Could not start checkout. Please try again.` with a 502.

### 15. CTA icon squashed out of its aspect ratio — `READY`

`CtaSection.astro → .cta__icon` hardcodes `width="50" height="50"` on a raw
`<img>`, forcing non-square sources square (visible on `/un-isi-25/`), and
inherited by any page slotting a non-square CTA icon. `audit:images` doesn't
catch raw `<img>` with both dimensions set — consider widening that guard
while fixing.

### 16. Outbound `http://` links — `READY`

`grep -rn "http://" src/pages src/content` — cleartext outbound links,
dominated by our own `slack.openmined.org` and `syft.docs.openmined.org`.
They redirect to HTTPS in practice, so this is hygiene — but worth doing
before any HSTS `includeSubDomains` decision, and check each host actually
serves HTTPS before replacing.

### 17. CI actions target a deprecated Node runtime — `READY`

`actions/checkout@v4` and `actions/setup-node@v4` run on a GitHub compatibility
shim that will be dropped — bump both to `@v5`. Now **two** workflows, not one:
`.github/workflows/ci.yml` and `.github/workflows/sync-redirects.yml`. (This is
the actions' own runtime, unrelated to the workflows' `node-version: 22`.)

### 19. Unclosed `<pre>` swallows article content — 2 posts left — `READY`

A blank line inside a converter-emitted raw-HTML `<figure><pre><code>` block
**terminates the HTML block** (CommonMark ends one at a blank line), so the
opening tags ship with no closing tags and the browser nests the rest of the
article inside the `<pre>` — rendering body copy in monospace and turning `#`
code comments into real headings. It is a regression against live, which renders
these posts correctly.

Three severe cases were fixed 2026-08-17 by deleting the blank lines inside
those blocks (which also closed LAUNCH §7's multi-`<h1>` item). Two milder ones
remain — `announcing-proof-of-concept-support-for-tff-in-pysyft-0-7` (~13% of
body, and the source of its 2 spurious `<h1>`s) and `randomized-response-in-privacy`
(~9%) — where the swallow recovers before the end of the article.

Two things worth doing with them:

- **The better fix is converting those raw blocks to fenced code blocks**, which
  both posts already use elsewhere. That preserves the blank lines the minimal
  fix deletes and gains Shiki highlighting; the care needed is re-emitting the
  `<figcaption>` and **decoding the HTML entities** (`&gt;`, `&nbsp;`) that are
  correct inside raw HTML and wrong inside a fence.
- **No guard covers this.** `astro check` and the build don't validate HTML
  nesting, which is how it survived to a deployed site. Note the cheap check is
  *not* counting `<pre>`/`</pre>` in the HTML text — that produces false
  positives and false negatives (it flagged a page the DOM shows as clean).
  Assert it in a real DOM instead: no `<p>` or heading inside an `article` may
  have a `<pre>` ancestor. That form found exactly 5 pages in 645.

### 24. Non-form layout shift on `/` and `/careers/` — `NEEDS DECISION`

Surfaced as the control pages in `audit-form-cls`, so they are measured but
unowned. Re-measured against **production** after the WebGL fix shipped
(2026-08-21, throttled, median of 3):

- `/` at 900x1000 — **0.044**, unchanged, and stable to the third decimal across
  three runs. ⚠ It survived the static-draw fix: the shifting sources are now
  `div.de1` / `div.de-stage` (plus the hero's own text blocks) rather than
  `canvas.de-webgl`, so what moves is the embed's **container sizing itself after
  load**, not the canvas painting. At the default mobile viewport the homepage
  measures CLS 0, which is why this looked fixed at first — it is viewport-
  dependent, so check 900x1000 specifically before believing it closed.
- `/careers/` at 360x640 — **0.055** (runs: 0.06, 0, 0.055) from `p` /
  `div.simple-hero__actions`.

Both sit under the guard's 0.1 threshold, so nothing fails today — but they are
the floor that stops the threshold being tightened. The homepage one is the more
interesting: a container that knows its aspect ratio up front should not need to
resize at all (`AGENTS.md → WebGL embeds` already requires layout to stay eager).

### 25. Anchor landings shift the page — `READY`

Landing mid-page via a fragment produces a large shift, and it is **not** caused
by the form deferral — it is worse without it. Measured 2026-08-21, throttled
mobile, `/careers/#open-positions` (a real in-page anchor, ~930px above the form):
production's eager build **0.604**, the deferred build **0.316**. The shifting
node is `section.cta`, landing right after the form renders.

The reservation in `global.css → .hs-form-embed` cannot express this case: it is
sized from the document top, so it computes to zero at an arbitrary scroll
position. Whatever fixes it has to reason about the viewport at landing time, not
at page load. Reproduce with `audit-form-cls --measure` extended to a fragment
URL, or the one-off in this item's commit.

Worth checking whether browser scroll restoration on back-navigation lands the
same way — it takes the same no-gesture path.

### 26. WebGL context creation costs ~1s on software renderers — `NEEDS DECISION`

The static-draw fix removed the animation loop and took the homepage from PSI 41
to the high 70s, but a residual remains: creating the GL context and drawing one
frame is an **~811ms long task** on a software renderer. Production measures
(2026-08-21, `--use-angle=swiftshader`): mobile 68–85 across runs, desktop median
81, TBT 1,310ms against 4,500ms before the fix. With a GPU the same page is 98–100
and TBT ~0, so this is entirely the no-GPU path — which is also the only path
PageSpeed Insights ever measures. **Expect PSI to read high-70s, not ~98.**

For scale: live WordPress measured desktop **93** with TBT 29–180ms and no WebGL
at all, so on PSI the old site probably beat what we score now.

⚠ **Detection cannot come first.** `AGENTS.md → WebGL embeds` records that even a
*detached* probe canvas pays the same context cost, so "check the renderer, then
decide" is not available. The static frame has to be the **default**, with WebGL
as an upgrade: ship a poster (pre-rendered image, or a 2D-canvas/CSS gradient
approximation) and create the GL context only after load/idle, so no context is
created inside a lab run's measurement window.

The cost is a possible visible pop when the upgrade lands, and a second rendering
path to keep looking identical to the first — which is why this is a decision, not
a task. Verify with the flagged Lighthouse run in `LAUNCH.md`'s Lighthouse QA
line, median of five (single runs of this swing by 15+ points).

### 27. External links don't open in a new tab — `READY`

Site-wide behaviour, requested 2026-08-27. The double-blind post's four partner
links were done by hand as inline `<a target="_blank" rel="noopener noreferrer">`
anchors, because markdown link syntax can't carry `target`. Doing that per link
doesn't scale — three seams need it instead:

1. **Markdown prose** (all of `src/content/blog/` plus `.md` pages) — a rehype
   plugin in `astro.config.mjs → markdown.rehypePlugins`. The repo has **no**
   rehype/remark dependencies today, so either add `rehype-external-links` or
   hand-write a hast walker and keep the dependency count at zero. External =
   `https?://` whose host isn't `SITE_URL`'s, so absolute self-links stay
   in-tab; skip `mailto:`/`tel:` and anchors that already set `target`.
2. **`@ui/Link.astro`** — derive `target`/`rel` from the href, overridable by an
   explicit prop. Covers component call sites from then on.
3. **Raw `<a href="https://…">` in `.astro` pages** — 23 non-OpenMined ones
   across `src/pages/`. Neither seam above reaches these; they're hand edits, or
   convert them to `@ui/Link`.

~30 anchors in migrated WordPress content already set `target="_blank"`, so any
implementation must leave an existing `target` alone rather than doubling it.

**Worth deciding, not just doing:** new-tab links are a WCAG 3.2.5 concern —
opening a window without warning. If we go site-wide, pair it with a visible or
screen-reader affordance rather than shipping the bare attribute.

## Cleanup — not urgent

No user-visible change; do when touching the files anyway, or as one pass.

### 7d. Converge component heading spacing — `READY`

Heading→next spacing is fully tokenized but spans ~10 distinct values; the
standing rule is *shared spacing values, not ad-hoc per-component ones*. Some
spread is legitimate hierarchy — converge the tail, don't flatten.

### 7e. `pub-prose` / `aud-prose` are misnomers — `READY`

Neither carries `.prose` (`for-publishers.astro`, `for-ai-auditors.astro`).
Rename to something layout-descriptive when next touching the files.

### 8. Retrofit the last hand-rolled hover-underline — `READY`

`pages/pysyft.astro` still hand-rolls the `background-size` underline effect
that `global.css → .link-hover-line` owns. Mind the utility's display/padding
assumptions (use the `--link-hover-line-pad` seam) and diff visually in both
themes. Follow-on, same spirit: `.hover-group` has no `/style-guide` specimen,
which is how hand-rolled copies keep appearing.

### 9. Search thumbnails mint a variant that could be shared — `NEEDS DECISION`

`BlogPost.astro → searchThumb` (height 600) emits a per-post file used only by
`/search/` tiles; `PostCard.astro`'s 1280-wide variant of the same cover could
crop instead — zero new image files, at the cost of 1280px bytes for 300px
tiles. Decide off a Lighthouse run of the deployed build. (Possible only
because of the "resize, never reshape" rule — one-dimension variants crop to
any shape.)

### 12. Retire the `Live → token mapping` tables — `READY`, **after cutover**

Component headers record what was measured off the WordPress site, plus Bricks
Builder element IDs. At cutover "live" silently changes meaning and the IDs
stop resolving — ~40 files of false leads for future readers. Not a blanket
delete: **keep, reworded**, the rows recording a judgment (deliberate snap
deviations, intentional absences — invisible in code by definition); **drop**
the rows that restate the code 1:1.

### 13. Content-Security-Policy for scripts and styles — `NEEDS DECISION`, post-launch

The header files (`public/_headers`, mirrored in `customHttp.yml`)
deliberately ship no `script-src`/`style-src`. Why deferred: **Shiki blocks
the clean path** — it emits per-token inline `style` attributes that CSP
hashes cannot cover, and Astro's native CSP doesn't support it
(withastro/astro#14798); **the payoff is small** — no logins, sessions,
cookies, or user-generated content, so the usual XSS entry points and prizes
are absent; and the two third-party scripts running with full page rights
(Ionicons via unpkg — the opt-in `Base.astro → ionicons` prop, no SRI — and
HubSpot on form pages) would have to be allowlisted anyway. Self-hosting the
style-guide icons is the higher-value move and independent of this.

Unblock path: ship `Content-Security-Policy-Report-Only` in both header
files, conceding `style-src 'unsafe-inline'` for Shiki, and collect
violations across the blog, the HubSpot form pages, and a live donate run
before enforcing. Expected origins: `js.hsforms.net` (plus HubSpot's runtime
injections), `www.youtube.com` (`frame-src`), `apply.workable.com`
(`connect-src`, `/careers`), `unpkg.com` (`script-src`, `/style-guide` only).
Fonts are self-hosted, Pagefind is same-origin, and Stripe Checkout is a
top-level redirect — none need entries.

### 18. `public/` media browser caching — `NEEDS DECISION`

Re-measured on the AWS host 2026-08-14: Range requests work (206,
`Accept-Ranges: bytes`), so the old video-seeking concern is gone. What
remains: every `public/` asset serves browsers `max-age=0` (the CDN edge
caches separately), so each view revalidates per asset — most visible on the
blog post carrying 11 MP4s. Raising it is a `customHttp.yml` rule; decide the
value knowing these files are slug-addressed, not content-hashed, so an
aggressive max-age makes replacing one awkward.

### 20. `/pagefind/*` caching doesn't match the contract — `NEEDS DECISION`

`HOSTING.md` → Caching asks for long-lived immutable `Cache-Control` on
`/pagefind/` *except* `pagefind-entry.json`, the index's mutable entrypoint.
Neither header file implements it: `public/_headers` and `customHttp.yml` carry
an `/_astro/*` rule and nothing for `/pagefind/`, so every index chunk serves
`max-age=0` with only a shared (CDN) TTL and browsers revalidate each one on a
repeat search (measured on the AWS host 2026-08-17).

The chunks are content-addressed, so a long browser TTL is safe. Decide between
adding the rule in **both** files (the two are ported by hand — README →
Response headers) and amending the contract line to match what ships. Same shape
as §18, and worth settling with it.

### 21. `amplify.yml`'s header comment describes a stack we don't run — `READY`

The build spec's own header comment still says this deploys "the STATIC half of
the build only", that the on-demand donate route "is a Cloudflare Worker entry
that Amplify cannot run", and that without it "the donate modal degrades to its
built-in error message" — then points at README for "the Cloudflare story".

All of that is false: the route runs as the Lambda twin behind an Amplify proxy
rule, and donations complete end-to-end (re-verified against staging
2026-08-17). Flagged to Stephen 2026-08-13 and still standing. It is only a
comment, which is why it sits here — but it is the *first* thing a reader of the
build spec sees, and it tells them the opposite of the truth. Rewrite it to
describe the Amplify + Lambda arrangement, keeping the two notes below it
(`PRERENDER_ENV=node`, and never attaching a service role) as they are.

## Tracked elsewhere — do not duplicate here

Privacy-policy rewrite, `noindex` flip, live Stripe key, and the remaining
launch polish (Lighthouse / cross-browser QA on the deployed build, touch
icons) → `LAUNCH.md`.

## Adding an item

Same shape as above: **what**, **state grounded in code** (path + stable
symbol, or the grep that re-derives the count — never a number trusted to
age), **what unblocks it**. Launch or hosting work goes to `LAUNCH.md`
instead, with a cross-reference if it started here.
