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

## Deploy target decision — AWS Amplify (2026-08-13)

The production host is now **AWS Amplify Hosting** in the OpenMined AWS account
(app `d1otfqlvqd3jby`, us-west-1), chosen because the DNS zone already lives on
Route 53 in that account — which dissolves this file's hardest cutover
prerequisite: **no DNS zone migration to Cloudflare is needed.** The
Cloudflare-specific sections below stay as the record of the proven Workers
setup (and the fallback path); read them as superseded wherever they assume the
zone must move.

**Standing infrastructure (verified 2026-08-13, smoke 15/15):**

- `staging` is the repo **default branch**; PRs target it and get Amplify
  **preview URLs** automatically (via the AWS Amplify GitHub App). Merging to
  `staging` deploys `https://staging.openmined.org`. `main` is production and
  deploys on merge from `staging`.
- Build mechanics live in `amplify.yml` + `customHttp.yml` (see README
  "Deploy"); the donate endpoint runs as a Lambda with its secret in SSM —
  see `aws/create-donation/README.md` for the wiring and key rotation.
- Redirects (including everything `public/_redirects` expresses) are
  **app-level Amplify custom rules** — a Cloudflare-format change there must be
  mirrored into the Amplify rules, they are not read from the repo.

**Cutover day (Amplify path):**

1. Merge `staging` → `main`; wait for the `main` build to go green.
2. Arm the **live** Stripe key in SSM (`aws/create-donation/README.md`).
3. Flip the site-wide `noindex` guard (section 3) and re-assert the SEO parity
   checklist (section 7) — both unchanged by the host choice.
4. Point the domain at `main` by adding root + www to the existing domain
   association (today it maps only `staging`):

   ```sh
   aws amplify update-domain-association --app-id d1otfqlvqd3jby \
     --region us-west-1 --domain-name openmined.org \
     --no-enable-auto-sub-domain \
     --sub-domain-settings prefix=,branchName=main prefix=www,branchName=main prefix=staging,branchName=staging
   ```

   Amplify rewrites the Route 53 records itself (same-account zone). Preserve
   live's www→apex 301 (today emitted by WordPress) with a domain-qualified
   custom rule: source `https://www.openmined.org` → `https://openmined.org`,
   status 301, prepended to the app's custom rules.
5. `npm run smoke -- https://openmined.org` — expect 15/15.
6. **Rollback** is one Route 53 change: restore the root/www `A` records to the
   WP Engine origin `141.193.213.10` / `141.193.213.11` (values re-verified in
   the zone 2026-08-13). WordPress stays up through the window regardless.

---

## 🔴 Blockers — cannot go live without these

Section numbers are **stable, not sequential** — closed sections are removed
without renumbering, so gaps are expected and cross-references stay valid.

### 1. Production deploy pipeline on the client account

**Done on the client account (2026-08-12).** Manual deploy runs on the OpenMined
Cloudflare account (`7c0f9f2c…`) from this repo: Worker `openmined-org` at
`https://openmined-org.openmined.workers.dev`, its `SESSION` KV namespace
auto-provisioned on first deploy, a Stripe **test** key set as a runtime secret,
and the donate flow verified end-to-end — `npm run smoke` 15/15 and
`npm run verify:donate` reaching a real `cs_test_…` Stripe Checkout session. The
`public/_headers` security headers were confirmed arriving on Cloudflare's real
edge at the same time.

**Still missing, in order:**

1. ~~**Push this repo to GitHub.**~~ **Done — corrected 2026-08-13.** The claim
   that `OpenMined/openmined-org` held only the initial commit is stale; it was
   pushed 2026-08-12 and `origin/main` carries the full history. What remains is
   only that local `main` runs ahead of it from time to time — re-check with
   `git log origin/main..main` rather than trusting this line.
2. **Push-to-deploy via Workers Builds** — see
   [Wiring push-to-deploy](#wiring-push-to-deploy). Prerequisite is an OpenMined
   GitHub **org owner** installing the Cloudflare GitHub App.
3. **The cutover origin repoint**, which now also depends on the DNS zone
   migration below.

Production today is **WordPress on WP Engine**. An earlier version of this
section assumed Cloudflare was already in front as DNS/proxy — **wrong**
(verified against live DNS: 2026-08-12). The Cloudflare response headers on the
live site come from *WP Engine's* Cloudflare-for-SaaS edge, not an OpenMined
zone. Actual state: **DNS is hosted on AWS Route 53; the registrar is GoDaddy;
no OpenMined-controlled Cloudflare zone exists.**

Cutover therefore has a hard prerequisite: **migrate the DNS zone to the
OpenMined Cloudflare account** (nameserver change at GoDaddy; registrar and
domain ownership unchanged). This is unavoidable, not a preference — Workers
Custom Domains require a zone on the same Cloudflare account; the partial
(CNAME) zone setup is Business-plan-only and still can't reach Cloudflare from
a Route 53 apex; and external DNS cannot point at a Worker (no stable IPs, and
`*.workers.dev` can't be CNAMEd from a foreign hostname). A Free-plan zone
suffices.

Migration cautions, learned from live probes (2026-08-12): copy the zone from a
real Route 53 export (`aws route53 list-resource-record-sets`), never a blind
probe or Cloudflare's auto-scan — the zone carries MX/SPF for company email and
~a dozen live subdomains, and Route 53 **ALIAS** records answer as bare A
records whose real targets are only visible in the export. Import everything
DNS-only (grey cloud) so the move is byte-identical, and leave the Route 53
zone untouched as rollback.

**One exception to the grey-cloud rule, found 2026-08-13 — check it before the
bulk import.** Nine `openmined.org` subdomains (brand, design, internal, share,
admin, cards, cv, go, tools) are Cloudflare **Pages** custom domains, and their
Pages projects live on `7c0f9f2c…` — the same account the zone moves to. They
work today as grey CNAMEs to `*.pages.dev` *because DNS is external*. Once the
zone is same-account they become same-account records, and Pages normally
manages those as **proxied** records it creates itself. Whether a hand-imported
DNS-only CNAME still resolves is unverified. Test one subdomain before importing
all nine; the blast radius includes the auth-gated `internal` and `share`
surfaces. Route 53's 48-hour NS TTL means resolvers can hold
the old delegation up to ~2 days after the flip, so WordPress must stay up
through that window. The www→apex 301 is currently emitted by WordPress itself
(`x-redirect-by: WordPress` — and `public/_redirects` can't match on host), so
www needs a Cloudflare Redirect Rule at cutover.

Everything needed to reproduce the proven setup is in
[Client-account deploy reference](#client-account-deploy-reference) below.

### 2. Live `STRIPE_SECRET_KEY` on the production Worker

The donation flow is proven end-to-end on the client Worker with a **test** key
(2026-08-12): `verify:donate` drives the real modal to a live `cs_test_…` Stripe
Checkout session. What remains is swapping in the **live** key at cutover — as a
runtime secret on the same Worker, set from a real interactive terminal or the
Cloudflare dashboard, never a non-promptable shell (see
[trap 1](#wrangler-traps)). It's a runtime secret, so no rebuild or redeploy is
needed and it persists across future deploys.

### 3. Flip the site-wide `noindex` guard

`Base.astro` Props → `noindex` default `true → false`. **Two files, not one** —
align the parallel default in `Seo.astro` so a component rendering `Seo` outside
`Base` can't silently ship a `noindex`. Keep the guard **on** for any
`*.workers.dev` test deploy; those hostnames are publicly crawlable.

### 7. SEO surface parity — no downgrade at cutover

Promoted out of Polish 2026-08-12: these are the places the rebuild would have
read as an SEO *downgrade* against WordPress, which is a different class of risk
from "nice to have before launch". Grounding is the 2026-08-10 SEO cutover
readiness research (held outside this repo), **re-probed against live and
against the built output on 2026-08-12** — several of its lines had already been
closed by other work, and one of its premises about tracking was wrong (§4).

**Closed 2026-08-12 — re-assert at cutover, don't re-open:**

- **JSON-LD structured data.** The build shipped zero `application/ld+json`
  while live emits a full Yoast graph — the one genuine rich-results regression.
  Now emitted on every page from `@components/JsonLd.astro` (mounted in
  `Base.astro` beside `Seo`), with the graph built in `@utils/schema.ts`. Node
  set and `@id` idiom mirror live's Yoast output deliberately — see that file's
  header for the conventions and the three places we improve on live
  (`sameAs`, a real `/search/` SearchAction, no phantom comment nodes).
  Verified against the built site: 681/682 pages carry exactly one graph, 373
  Articles, 0 malformed, 0 dangling `@id` references. The one page without a
  graph is `/blog/cards/`, the internal card-source route — correct.
- **The identical default meta description on ~340 posts.** Live posts ship
  **no** `<meta name="description">` at all and let Google compose the snippet;
  ours shipped one boilerplate string on every post that set none, which is
  worse than absent (duplicates are ignored *and* they suppress the
  query-relevant snippet). Posts now emit none — the rule lives in `Seo.astro`
  and keys off `type="article"` so a future post-like route can't forget it.
  Built output: exactly 32 posts carry a description, matching the 32 with an
  authored `seo.description`.
  **og:description is deliberately NOT dropped with it** — live does emit one,
  built from the post's first paragraph, and an empty social card is a real
  regression where an absent meta description is not. `@utils/posts.ts →
  postExcerpt` derives it from the raw body.
- **The 7 Yoast child sitemaps.** Google fetches these directly and keeps
  requesting them after the index moves, so the `/sitemap_index.xml` redirect
  never covered them; all 7 404'd. Now 301 → `/sitemap-index.xml` in
  `public/_redirects`. The list is exactly what live's index enumerates
  (verified 2026-08-12), not a guess.
- **Author archives out of the sitemap** (decided 2026-08-13). Live serves
  author pages but excludes them from its Yoast sitemap; we were sitemapping
  all 124 (114 authors + pagination), 59 of them single-post. Now excluded via
  the `astro.config.mjs` sitemap filter (`/blog/author/`, which also catches
  `/page/N/`) — matching live, and not volunteering thin archives as canonical
  the moment the site goes indexable. The pages themselves stay crawlable and
  linked from every post byline; reversing is deleting one filter line.

**Still open:**

- **One post ships ~12 `<h1>`s** — `encrypted-training-medical-text-syfertext`,
  a markdown-converter artifact. (The research also named
  `announcing-proof-of-concept-support-for-tff-in-pysyft-0-7`; re-checked
  2026-08-12 and its only `# ` line is a Python comment inside a code fence, so
  that half is already clean.)
- **Article images on coverless posts.** A post with no cover emits no
  `ImageObject`, matching live. Google's Article guidance *recommends* an image,
  so those posts are less rich-result eligible. Falling back to the generic
  social card was rejected: it would claim a generic image as the page's
  primary image on every coverless page. Worth revisiting only with real GSC
  rich-result data after cutover.

---

## 🟡 Launch decisions — §4/§5 settled, §6 outstanding

Grounding for §4–§6: the 2026-08-11 analytics/privacy/GDPR research, in the
palace at `clients/omd/research/2026-08-11-web-analytics-privacy-tracking.md`
(**read its 2026-08-13 correction header** — its description of live's banner was
wrong), alongside the 2026-08-13 HubSpot diagnosis. Conclusions restated below.

### 4. Analytics — DONE (Plausible only, 2026-08-13)

**Shipped.** `@components/Analytics.astro` (mounted in `Base.astro`), ids and
rationale in `@data/analytics.mjs`. Plausible's outbound-links build, loaded
once, on production hostnames only.

**The decision, Bennett's (2026-08-13):** *"lets go no cookies necessary for this
update"* — plus confirmation that nothing depends on HubSpot web analytics today.
So: **no GA4, no HubSpot tracking code.** This is option 1 of the 2026-08-11
analytics/privacy research.

Why those two are out, in one line each:

- **GA4** sets non-essential cookies, so for EU visitors it requires prior
  opt-in — keeping it means keeping a banner.
- **HubSpot tracking** can't be consent-cured after the fact (CJEU *Planet49*),
  so banner-free means it simply never loads. The **forms** embed is unaffected
  and stays — it sets no cookies of its own.

**The site therefore sets zero cookies** (Plausible stores nothing on the
device). That is what makes it lawfully banner-free, and it is a property to
protect: anything added here that writes to the device drags a banner back in.

**Implementation notes worth not re-deriving:** analytics loads only on
`openmined.org` / `www` — the workers.dev URL is the *same Worker* as production,
so a build-time flag can't separate them and the gate has to be a runtime
hostname test. `?analytics=force` overrides it for deliberate testing (a forced
hit is a real hit). Live also double-loads Plausible and runs two redundant
Google tags; we ship one of each.

**What live actually runs** — messier than any tracker previously claimed, and
the record is in the palace note below, not here: GA4 ungated, Plausible twice,
a legacy HubSpot embed whose banner never loads, and a dead "Cookie Settings"
button. None of it is a pattern to port.

**Still to do, and neither is code:**

1. **Privacy policy** rewritten to match the shipped stack (§6).
2. **HubSpot GDPR form fields** — portal-level enable, then a consent type chosen
   **per form** (32 form ids are embedded here). Only forms that feed marketing
   need an opt-in checkbox; inquiry forms need a notice. ⚠ Portal 6487402 is
   **shared with live WordPress**, so enabling this changes live's forms the same
   moment — timing is the client's call, and the rendered form markup grows
   (consent notice / checkbox groups), which the `.hs-form` skin does not yet
   style.

Full diagnosis of live's HubSpot state, the portal config, and the measurement
traps: palace → `clients/omd/research/2026-08-13-web-hubspot-consent-diagnosis.md`.

### 5. Cookie consent — resolved, no banner needed

**No CMP, no banner.** Consent is triggered by device storage, and this site
stores nothing non-essential, so there is nothing to consent to. This holds only
while §4 holds.

**Verified empirically (2026-08-11)** by a cold-load probe of `/contact/` on a
test deploy with the form fully rendered: **zero cookies on our domain, zero
local/sessionStorage**. The only cookies anywhere were `__cf_bm` (Cloudflare bot
defense, ~30 min) on HubSpot's *own* domains — third-party, strictly-necessary
class; list them in the privacy policy. Submission-side behaviour (a contact is
created and deduped by email when no tracking cookie exists) is documented and
staff-confirmed, not probe-tested — testing it would inject junk contacts.

- **Known leak, 4 pages:** four blog posts embed `youtube.com/embed` iframes,
  which set YouTube cookies on load. Fix by swapping to
  `youtube-nocookie.com/embed` (same player, no cookies until play) or a
  click-to-load facade. Find them with a search for `youtube.com/embed` under
  `src/content/`. **This is now the only thing standing between the site and
  genuinely zero cookies**, so it is worth doing before launch rather than after.
- **Guard worth building:** assert that no page sets cookies on a cold load, so
  bannerlessness can't silently break. Nothing checks this today.
### 6. Privacy-policy page rewrite

`src/pages/privacy-policy.astro` still names Google Analytics,
cookies-as-practice, and **WP Engine** as host — all wrong at cutover. Rewrite to
match what actually ships (§4 is now settled, so this is no longer conditional):
hosting on Cloudflare Workers, **Plausible as the sole analytics** plus the
written legitimate-interest record that replaces a consent banner, a
cookie/storage disclosure stating the site sets **no cookies of its own** (only
third-party strictly-necessary `__cf_bm` on HubSpot's domains — and the YouTube
embeds in §5 until those are fixed), HubSpot forms and the in-form consent basis.
Worth an hour of EU counsel review against the research.

**Also missing entirely, not just wrong: Stripe.** The site takes donations
through Stripe Checkout (`src/pages/api/create-donation.ts`) and the policy names
no payment processor at all. Add Stripe, plus Cloudflare as host/CDN and Workable
for job applications, and the YouTube third-party cookies noted in §5. The policy
currently *over*claims analytics (it lists GA and Plausible, neither of which
ships) and *under*claims payments — the second is the one that matters legally.

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
- **Analytics reporting from the real origin** — Plausible ships (§4) but is
  gated to `openmined.org`/`www`, so it has NEVER sent a hit from any test host by
  design. First confirmation that it works in production can only happen once the
  domain resolves to the Worker: check Plausible's realtime view immediately after
  the repoint. The reason it had to ship before cutover still stands: Plausible
  runs on the WordPress site too, so it is the one tool that can tell the
  before/after story across the switch.
- **Privacy policy** matches the shipped stack (§6).
- **No WordPress hotlinks** — nothing loads an asset from
  `https://openmined.org/wp-content/…`. These resolve only while that host is
  still WordPress and break the instant the origin repoints, and
  `public/_redirects` deliberately 404s `/wp-content/uploads/*` rather than
  redirect an asset URL to an HTML page. The 18 that existed (a page's step
  images, a post's screen recordings) were localized 2026-08-12 and
  `npm run audit:image-urls` now fails on any that return — so this is a
  re-assert against the deployed build, not an open task.
- **GSC baseline exported BEFORE the repoint** — the one item here with an
  unrecoverable deadline. Confirm a **domain property** for openmined.org exists
  (it survives the platform swap; a URL-prefix property is weaker), then export
  16 months of Performance data (top queries and pages) while WordPress is still
  serving. After the repoint that history can't be re-created, and it is the
  only baseline the "SEO didn't dip" claim can be measured against. Account-side
  — Kyle/OpenMined, not code.
- **Structured data still emitting** — spot-check a page and a post through
  Google's Rich Results Test on the live origin, not just the built HTML (§7).
  Then submit `/sitemap-index.xml` in GSC and watch Coverage for 404 spikes for
  the first two weeks.
- **The `*.workers.dev` test host is guarded** — once `noindex` flips in code,
  any deploy to a workers.dev hostname becomes a fully indexable duplicate of
  the whole site. Retire it, gate it, or serve `X-Robots-Tag: noindex` for that
  host. Pairs with the "retire leftover dev/preview deploys" line below.
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

The account-level setup on the OpenMined account: what is standing, and what is
still to wire. README covers the build and deploy commands themselves; this is
the work around them.

### Standing up the Worker

0. **Worker name — settled, do not change it.** `wrangler.jsonc → name` is
   `openmined-org`, and that is the intended production name (confirmed
   2026-08-12; earlier revisions of this step wrongly called it a throwaway from
   the test round). The first deploy claims it for real and Cloudflare has no
   in-place rename — renaming later means creating a new Worker and deleting the
   old one, re-provisioning its KV namespace and re-setting its secret. **Do not
   pass `--name`** on any deploy command: the config is the single place the name
   lives, and a second place can only silently disagree (see
   [trap 2](#wrangler-traps)).
Steps 1–4 are **done as of 2026-08-12** — kept as the record of how, and what to
repeat if the Worker is ever rebuilt.

1. ✅ Authorize the OpenMined Cloudflare account — `wrangler login`, picking it
   explicitly. `wrangler whoami` must list `OpenMined` (`7c0f9f2c…`); the token
   used during earlier testing was scoped to a personal account, and a deploy
   under it silently creates the Worker in the wrong place. Verify before every
   first-time-in-a-while deploy, not just once.
2. ✅ Deploy manually first, from the repo root, using the adapter's augmented
   config (README → Deploy). Manual-first is deliberate: it stands the Worker up
   and provisions its bindings before CI is wired.
3. ✅ The adapter's `SESSION` KV namespace auto-provisions on first deploy. This
   had never been exercised against a *cold* account; it worked, creating
   `openmined-org-session` (`37e4541656df48d2…`) without prompting. The namespace
   now exists, so a CI deploy no longer hits this path at all. If it ever balks
   on a rebuild, pre-create the namespace and pin its `id` in `wrangler.jsonc`,
   or set the adapter's `sessionKVBindingName`.
4. ✅ Smoke the `*.workers.dev` URL before attaching any domain — 15/15 against
   `https://openmined-org.openmined.workers.dev`. A Worker answers only on its
   own hostname until a route or custom domain is attached, so blast radius until
   then is nil. Keep the site-wide `noindex` on while it is reachable there
   (§3): `workers.dev` hostnames are publicly crawlable.

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

1. ~~Which Cloudflare account holds the `openmined.org` zone?~~ **Answered
   2026-08-12: none.** DNS is on AWS Route 53, registrar GoDaddy (see §1).
   ~~Which Cloudflare account owns the `*.pages.dev` projects?~~ **Answered
   2026-08-13: `7c0f9f2c…` — the same OpenMined account this Worker deploys
   to**, so the zone should land there. It is **eight** Pages projects, not
   five, serving **nine** `openmined.org` hostnames: brand, design, internal,
   share, admin, **cards**, **cv**, **go**, **tools** (the last four were in no
   inventory). They resolve today as grey-cloud CNAMEs to `*.pages.dev` *from
   external DNS*; once the zone is same-account that changes, and Pages
   normally manages same-account custom domains as proxied records it creates
   itself — **verify one subdomain before bulk-importing them DNS-only.**
   The one still-live question here: **who holds the AWS account with the
   Route 53 zone.** No AWS credentials exist on the maintainer's machine, so
   the zone export is entirely people-blocked.
2. Who owns the **WP Engine** account, does WordPress stay up read-only for a
   grace period, and are any WP-served paths — forms, redirects, uploads — still
   doing real work?
3. Who can install the Cloudflare **GitHub App** on the OpenMined org?
4. Who provisions the **live Stripe key**, and does staging keep the test key?

---

## ⚪ Polish — non-blocking, best before launch

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
