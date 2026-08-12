# Launch tracker — pre-launch & cutover work

Everything still standing between this build and it serving `openmined.org`.

Split of responsibilities — an item lives in exactly **one** tracker:

- **This file** — launch blockers, launch decisions, the cutover checklist, and
  the client-account deploy reference.
- **`BACKLOG.md`** — site features and polish that outlast launch.
- **`README.md`** — how the project builds and deploys in the general case. This
  file adds only what is *cutover-specific*; it doesn't restate the mechanics.

Re-derive any "current state" against the code before trusting it — a tracker is
a cache.

---

## 🔴 Blockers — cannot go live without these

### 1. Production deploy pipeline on the client account

The deploy shape is proven end-to-end on a test Worker: manual deploy, then
push-to-deploy via Workers Builds, with donations working against a Stripe test
key. What's missing is the same shape on the **client's** Cloudflare account
against this repo, plus the cutover origin repoint.

Production today is **WordPress on WP Engine**, with Cloudflare in front as
DNS/proxy only. So cutover is a **WP-Engine→Worker origin repoint inside
Cloudflare**, not a nameserver migration and not a Pages→Worker move.

Everything needed to reproduce the proven setup is in
[Client-account deploy reference](#client-account-deploy-reference) below.

### 2. Live `STRIPE_SECRET_KEY` on the production Worker

The donation flow is proven end-to-end with a test key. At cutover, set the live
key as a runtime secret on the client Worker — from a real interactive terminal
or the Cloudflare dashboard, never a non-promptable shell (see
[trap 1](#wrangler-traps)). It's a runtime secret, so no rebuild or redeploy is
needed and it persists across future deploys.

### 3. Flip the site-wide `noindex` guard

`Base.astro` Props → `noindex` default `true → false`. **Two files, not one** —
align the parallel default in `Seo.astro` so a component rendering `Seo` outside
`Base` can't silently ship a `noindex`. Keep the guard **on** for any
`*.workers.dev` test deploy; those hostnames are publicly crawlable.

---

## 🟡 Launch decisions — researched, awaiting the call

Grounding for §4–§6: the 2026-08-11 analytics/privacy/GDPR research, held
outside this repo — ask the previous maintainer for it. Conclusions are
restated below.

### 4. Analytics install — Bennett's call between two coherent options

The build ships **zero analytics**; the WordPress site runs GA4 + Plausible +
the HubSpot tracking code behind HubSpot's geo cookie banner. Install **before**
cutover or the before/after story is unmeasurable — the story can be told
entirely in Plausible, which would then run on both the old and new site.

1. **Banner-free (recommended):** Plausible snippet only — no GA4, no HubSpot
   tracking code. Legally defensible under legitimate interest (cookieless,
   EU-hosted, nothing stored on the device); the paperwork replacing the banner
   is a privacy-policy disclosure plus a written legitimate-interest record.
2. **Parity with the old site:** Plausible + GA4. GA4 sets non-essential
   cookies, so EU visitors legally require a prior-consent banner (a CMP,
   consent-gated tags). Defensible, but ships a banner the org will then want to
   remove.

Either way: enable HubSpot **GDPR form fields** on the portal (notice +
consent-to-communicate checkboxes) so the marketing-contact legal basis is
collected in-form. Longer-term, post-launch: PostHog EU rolled out
product-by-product across the logged-in surfaces, opt-in telemetry for SyftBox —
rings, not one tool; the public site stays storage-free.

### 5. Cookie consent — resolves with §4

The forms embed (`Base.astro` → the HubSpot forms loader) does **not** set
HubSpot's tracking cookies — those come from the tracking code
(`js.hs-scripts.com/…`), which was never ported. **Verified empirically
2026-08-11** by a cold-load probe of `/contact/` on a test deploy with the form
fully rendered: **zero cookies on our domain, zero local/sessionStorage**. The
only cookies anywhere were `__cf_bm` (Cloudflare bot defense, ~30 min) on
HubSpot's *own* domains — third-party, strictly-necessary class; list them in
the privacy policy. The same probe against the WordPress site returned 16
cookies (GA4, a site-wide Stripe id, YouTube embeds).

Submission-side behavior (a contact is created and deduped by email when no
tracking cookie exists) is documented and staff-confirmed, not probe-tested —
testing it would inject junk contacts.

**The site is banner-free by construction today.** A CMP is needed only if §4
option 2 (GA4) is chosen. Never add the HubSpot tracking snippet without one.

- **Known leak, 4 pages:** four blog posts embed `youtube.com/embed` iframes,
  which set YouTube cookies on load. Fix by swapping to
  `youtube-nocookie.com/embed` (privacy-enhanced mode — same player, no cookies
  until the user presses play) or a click-to-load facade. Worth doing under
  either §4 option. Footer and subscribe YouTube references are plain links —
  fine. Find them with a search for `youtube.com/embed` under `src/content/`.
- **Guard idea:** assert that no page sets cookies on a cold load, so
  bannerlessness can't silently break.

### 6. Privacy-policy page rewrite

`src/pages/privacy-policy.astro` still names Google Analytics,
cookies-as-practice, and **WP Engine** as host — all wrong at cutover under
either §4 option. Rewrite to match the shipped stack: hosting (Cloudflare
Workers), analytics per §4 including the legitimate-interest disclosure if
Plausible-only, cookie/storage disclosure (strictly-necessary only), HubSpot
forms and the in-form consent basis. Worth an hour of EU counsel review against
the research report.

---

## 🟠 Cutover checklist — the day-of switches and re-audits

Each line states the assertion that must hold. How you verify it is open — the
repo ships a verification kit in `scripts/` (see README) that covers several of
these; the rest are one-off checks best written fresh against the state of the
day.

- **Origin repoint** — `openmined.org` and `www` serve from the Worker, off WP
  Engine (§1).
- **Live Stripe key** set on the production Worker (§2).
- **`noindex` flipped** in both files (§3) — and every page that opts *itself*
  out still does. Several do (search, the summit event pages, 404, the donation
  thank-you, the blog card feed); search `src/pages/` for `noindex` and confirm
  each survived the flip.
- **Analytics installed** per the §4 decision, before the repoint, so the
  before/after comparison has a baseline.
- **Privacy policy** matches the shipped stack (§6).
- **Route parity** — diff the frozen pre-cutover capture of the WordPress
  `page-sitemap.xml` (in `reference/live-sitemap/`) against this build's routes
  plus its redirects. Every live URL must resolve, directly or via a 301.
- **Blog permalinks** — every migrated post resolves at its WordPress URL. This
  matched 371/371 when last audited (2026-07-22); re-verify only if the live
  post set changed since.
- **Author archives** — same check for author archive URLs, including the
  redirect aliases; re-verify only if the author set changed.
- **Smoke the production Worker** — static pages, feeds, both redirect layers
  (host `_redirects` and the adapter-appended rules), the search index actually
  being served, and `POST /api/create-donation` returning a real
  `checkout_url`.
- **Hold WordPress at a holdback hostname** until confidence is high, then
  retire it and any leftover dev/preview deploys.

> ⏱ **Allow ~1 minute after any deploy or secret change before testing.** New
> versions propagate across the edge progressively, so requests in that window
> can hit either version. This produced two phantom bugs during the test round —
> a batch of donation POSTs that 503'd moments after a secret was saved and then
> worked, and a just-removed route that still answered 200 and then 404'd.
> Re-test before diagnosing.

---

## Client-account deploy reference

The setup proven on the test account, with everything that must be re-done on
the client's. README covers the build and the deploy command themselves; this is
the account-level work around them.

### Standing up the Worker

0. **Set the production Worker name in `wrangler.jsonc`.** It still carries the
   throwaway proving-ground name from the test round (see the ⚠ comment above
   the `name` field). Do this before the first deploy — the name is inert until
   then, and the first deploy claims it for real. Cloudflare has no in-place
   rename: renaming later means creating a new Worker and deleting the old one,
   re-provisioning its KV namespace and re-setting its secret. Once the config
   name is correct, **do not also pass `--name`** on the deploy command — the
   flag only existed to override a deliberately-wrong test name, and keeping it
   preserves two places that can silently disagree (see
   [trap 2](#wrangler-traps)).
1. Authorize the OpenMined Cloudflare account — `wrangler login` and pick it
   explicitly. An OpenMined account exists and the previous maintainer holds
   delegated access, but the token used during testing was deliberately scoped
   to a personal account, so it must be re-authorized.
2. Deploy manually first, from the repo root, using the adapter's augmented
   config (README → Deploy). Manual-first is deliberate: it stands the Worker up
   and provisions its bindings before CI is wired, which is the sequence that
   was proven.
3. On first deploy the adapter's `SESSION` KV namespace is auto-provisioned.
   This worked non-interactively during testing, but a *cold* CI deploy against
   a Worker with no namespace was never exercised — which is why manual comes
   first. If it ever balks, pre-create the namespace and pin its `id` in
   `wrangler.jsonc`, or set the adapter's `sessionKVBindingName`.
4. Smoke the `*.workers.dev` URL before attaching any domain. A Worker answers
   only on its own hostname until a route or custom domain is explicitly
   attached, so blast radius until then is nil.

### Wiring push-to-deploy

Cloudflare **Workers Builds**, connected to this repo on the client account.
Prerequisite: an OpenMined **org owner** installs the Cloudflare GitHub App —
usually the long pole.

- Root directory `/`; production branch `main`; previews on for non-production
  branches (useful for reviewing content changes).
- The build command must be the npm script, so the Pagefind search index is
  built. The deploy command **must** override Cloudflare's default so it points
  at the adapter's augmented config — the default won't find it. Both commands
  are in README.
- `STRIPE_SECRET_KEY` is **not** a build variable — it lives on the Worker.
- Workers Builds *is* managed wrangler-in-CI: it runs the same deploy command on
  every push. The git connection replaces the *manual* CLI, not wrangler.
  Secrets and any KV provisioning stay out-of-band CLI or dashboard steps — the
  git flow deploys code only, never secrets.

*Alternative, if Workers Builds is ever outgrown:* GitHub Actions with
`cloudflare/wrangler-action` and repo secrets for a Workers-deploy-scoped API
token and the account id. More control — easy to add typecheck, link-check, or
Lighthouse gates — but you own token rotation and DIY preview URLs. Start with
Workers Builds; move only if a gate demands it.

*Hardening, optional:* wrangler is an implicit peer dependency, pinned by the
lockfile. CI is reproducible today, but the version can float on an adapter bump
or a lockfile regen. Declaring it an explicit `devDependency` makes the
deploy-tool version an intentional, visible choice.

### wrangler traps

**Wrangler's non-interactive fallback answers `yes`, and it does not fail
loudly.** Any shell that can't prompt — CI, a piped command, an agent's command
runner — hits these. All three were hit during testing and all three recur on
the client account.

1. **`secret put` stores an EMPTY value and prints success.** It can't prompt
   for the value, so it writes a blank. The binding then *exists* — it shows in
   `secret list` — but its value is `""`, which is falsy, so the donation
   endpoint correctly stays dormant. Symptom to recognize: **secret listed,
   endpoint still 503.** Set secrets from the **Cloudflare dashboard** (Worker →
   Settings → Variables and Secrets) or a real interactive terminal. Never pipe
   the key in from `echo` — that puts it in shell history and logs.
2. **A name mismatch silently CREATES a Worker.** A wrangler command whose
   target name doesn't match an existing Worker auto-answers *yes* and creates a
   new one — during testing this produced a stray Worker holding the secret
   while the real one got nothing. Keep `wrangler.jsonc → name` and any `--name`
   override identical. This is also a hazard in CI: a build that loses its
   `--name` quietly stands up a *second* Worker instead of failing.
3. **`wrangler delete` can't remove a secrets-only Worker.** One created by trap
   2 has no deployed script version, so the CLI fails claiming it doesn't exist.
   Delete it from the dashboard.

Related: with several account memberships resolving, non-interactive wrangler
commands need `CLOUDFLARE_ACCOUNT_ID` pinned or they abort with "More than one
account available".

### Two standing footguns

- **Never set `assets.run_worker_first: true`.** It routes traffic through the
  Worker ahead of the asset layer and bypasses `public/_redirects` entirely —
  silently killing every WordPress-infra and editorial 301. This is why the
  smoke assertions include redirect rows from both emitting layers.
- **Never share or archive `dist/`.** The build copies `.dev.vars` into the
  server output. It is gitignored and never uploaded — the Worker declares no
  `vars` binding and only modules ship — but a real key sitting there in plain
  text is worth not handing around.

### Open account questions

1. Which Cloudflare account holds the `openmined.org` **zone**, and who
   administers it? (The zone is Cloudflare-proxied in front of a WP Engine
   origin; whether it lives on the OpenMined account is unconfirmed.)
2. Who owns the **WP Engine** account, does WordPress stay up read-only for a
   grace period, and are any WP-served paths — forms, redirects, uploads — still
   doing real work?
3. Who can install the Cloudflare **GitHub App** on the OpenMined org?
4. Who provisions the **live Stripe key**, and does staging keep the test key?

---

## ⚪ Polish — non-blocking, best before launch

- **JSON-LD structured data** — `Seo.astro` emits OG, Twitter, and canonical
  tags but no `application/ld+json`; the WordPress site has a full Yoast graph.
  Biggest SEO-parity gap.
- **Per-post meta descriptions** — the large majority of posts share one default
  description.
- **`apple-touch-icon`, web manifest, `.ico` fallback** — the SVG favicon, OG
  default image, and `theme-color` are done.
- **Lighthouse and cross-browser QA on the real deployed build** — the earlier
  a11y pass ran on a sample of pages, not the full set on real hosting.
- **Extend CI coverage.** The two deterministic guards (`audit:images`,
  `audit:image-urls`) already gate every push. What's still manual is anything
  needing a browser, the network, or a deployment — the overflow audit, the
  currency check, and the post-deploy smoke suite — plus the cold-load cookie
  assertion from §5, which doesn't exist yet. Running the smoke suite against
  the production Worker on a schedule would also close the monitoring gap noted
  below.
- **No uptime or error monitoring exists.** No health check, no alerting, and
  Workers `observability` is not enabled. Worth deciding before the site is the
  org's front door.

---

## Adding an item

Same shape as `BACKLOG.md`: what it is, current state grounded in code (path +
stable symbol, never line numbers), and what unblocks it. If it isn't
launch-gating, it belongs in `BACKLOG.md` instead.
