# Launch tracker — pre-launch & cutover work

Everything still standing between this build and it serving `openmined.org`.

Split of responsibilities — an item lives in exactly **one** tracker:

- **This file** — launch blockers, launch decisions, and the cutover checklist.
- **`BACKLOG.md`** — site features and polish that outlast launch.
- **`README.md`** — how the project builds and deploys in the general case. This
  file adds only what is *cutover-specific*; it doesn't restate the mechanics.
- **`HOSTING.md`** — the host-portable contract the deployed config is held to.

Re-derive any "current state" against the code before trusting it — a tracker is
a cache.

---

## Deploy target — AWS Amplify (decided 2026-08-13)

The production host is **AWS Amplify Hosting** in the OpenMined AWS account (app
`d1otfqlvqd3jby`, us-west-1). The DNS zone already lives on Route 53 in that
account, so **no DNS zone migration is needed** — that dissolves what used to be
this file's hardest cutover prerequisite. The Cloudflare Workers path this site
was originally built for is **abandoned**, and its setup record is deleted from
this file; git history and the palace hold it if it is ever wanted.

**Standing infrastructure:**

- `staging` is the repo **default branch**; PRs target it and get Amplify
  **preview URLs** automatically (via the AWS Amplify GitHub App). Merging to
  `staging` deploys `https://staging.openmined.org`. `main` is production and
  deploys on merge from `staging`.
- Build mechanics live in `amplify.yml` + `customHttp.yml` (see README
  "Deploy"); the donate endpoint runs as a Lambda with its secret in SSM —
  see `aws/create-donation/README.md` for the wiring and key rotation.
- Redirects (including everything `public/_redirects` expresses) are
  **app-level Amplify custom rules**, kept in sync by CI:
  `scripts/sync-amplify-redirects.mjs` runs from
  `.github/workflows/sync-redirects.yml` on pushes to **staging** (OIDC role
  `openmined-org-redirect-sync`, pre-trusted for both staging and main) and
  rebuilds the full rule set from the built `dist/client/_redirects`.
  `redirects.mjs` and `public/_redirects` stay the only places a redirect is
  authored. ⚠ Never attach an IAM service role to the Amplify app — its
  presence silently disables PR preview creation (verified 2026-08-14).

### Staging verification — 2026-08-17

A full pre-launch audit of `https://staging.openmined.org`, at commit `0344167`.
Everything below was measured, not assumed; re-run rather than trust it.

| Check | Result |
|---|---|
| `npm run smoke` | 17/17 |
| Every page in the build, swept individually | 683/683 → 200 |
| Every authored redirect (13 `_redirects` + 21 registry) | 34/34 true 301s, landing on target |
| Route parity vs `reference/live-sitemap/` | 452/453 (447 direct, 5 via 301) |
| Live HTML vs a local build of the same commit | identical — no CDN staleness, no deploy drift |
| Security headers | all 6 on pages **and** on `/_astro/` assets |
| `audit:headers` / `image-urls` / `images` / `assets` | clean |
| `audit:overflow`, 8 widths | clean |
| `verify:donate` | all pass → real `cs_test_…` checkout, thank-you 200 |
| Routing detail | nested dir URLs 200; bare path 301→slash; http→https 301; true in-place 404 with the branded body; Brotli on HTML; Range 206 on `public/` media |
| Analytics gate | correct — `Analytics.astro` injects Plausible only for `ANALYTICS_HOSTS`, so staging reports nothing |

Two live-vs-build diffs turned up and are both benign: one post's date renders a
day earlier when the build machine is in CDT rather than UTC, and
`/style-guide/` mints random tab ids per build.

Re-verified after `b2f7602` merged (the audit's own fixes plus the indexing gate):
smoke still 17/17, and the three repaired posts serve with no article content left
inside a `<pre>`.

**The one gap: `/blog/resource_type/video-on-demand/` 404s** — see §7.

**⚠ Everything above is HTTP-level.** There are no AWS credentials and no `aws`
CLI on the maintainer's machine, so the Amplify app's own configuration — branch
list, domain association, custom-rule set, Lambda env — **cannot be read or
changed from here**. Every cutover step that touches AWS is Stephen's to run.

**Cutover day:**

1. Merge `staging` → `main`; wait for the `main` build to go green. The cutover
   PR must also flip the branch filter in
   `.github/workflows/sync-redirects.yml` from `staging` to `main`, so
   post-cutover redirect changes keep flowing from the production branch (the
   OIDC role already trusts both branches; no IAM change). After the flip,
   pushes to `staging` no longer sync rules — intended, since the rules are
   app-wide and production owns them.
   ⚠ **`main` is connected in Amplify but has never deployed this site.**
   Measured 2026-08-17: `https://main.d1otfqlvqd3jby.amplifyapp.com/` answers 200
   with a 1.4 KB page titled "Welcome" — Amplify's placeholder — and **every real
   route 404s**, including `/blog/`, `/syftbox/`, `/sitemap-index.xml`,
   `/pagefind/pagefind.js` and `robots.txt`, all of which exist in `main`'s tree.
   The cause is visible in the tree: `amplify.yml` and `customHttp.yml` landed in
   `21ad75e` (2026-08-13), which is on `staging` only, so the branch has been
   building with Amplify's auto-detected settings and publishing the wrong
   directory.

   **This makes step 1 the single most dangerous step of the cutover**: if the
   domain is pointed at `main` before a green build of the merged tree,
   `openmined.org` serves an Amplify placeholder. Do not treat "the branch
   exists" as "the branch works" — require a successful build **and** a
   `npm run smoke` pass against `main.d1otfqlvqd3jby.amplifyapp.com` before
   touching the domain association. The merge brings `amplify.yml` across, so the
   build is expected to start working at that point; verify, don't assume. The
   merge itself is a clean fast-forward (`main` has no divergent commits).

   **Headers and redirect rules are NOT waiting on the merge** — they already
   behave app-wide. Measured 2026-08-17: `main`'s branch domain serves all 6
   security headers and fires both `/feed/ → 301` and `unknown → 404` despite
   having no `customHttp.yml` in its tree. So the merge's job is the build spec
   alone.

   **Two console checks the merge cannot substitute for.** Both need AWS access,
   so both are Stephen's, and both are quick:

   - **Is auto-build enabled on the `main` branch?** `main` has never produced a
     successful deploy, and from outside there is no distinguishing "builds ran
     and failed" from "no build ever ran". If it is the latter, pushing the merge
     triggers nothing and the placeholder simply stays up.
   - **Is there a branch-level build-spec override?** A repo-root `amplify.yml`
     should take precedence; confirm nothing in the console competes with it.
2. Arm the **live** Stripe key in SSM (`aws/create-donation/README.md`), and see
   §2 for the one hardening fix that should ride along with it.
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

   Amplify rewrites the Route 53 records itself (same-account zone). Live's
   www→apex 301 (today emitted by WordPress) needs no cutover step: the sync
   script already emits it as a domain-qualified, path-preserving rule that
   activates the moment `www` maps to the app.
   ⚠ **That rule has never been observed working** — being domain-qualified, it
   is inert until `www` resolves to the app, so it cannot be tested in advance.
   Test the **bare root** (`https://www.openmined.org/`, empty splat) as well as
   a deep path: the rule's source is a splat pattern, and if it doesn't match the
   empty path then the commonest inbound www URL of all falls through it.
5. `npm run smoke -- https://openmined.org` — expect 17/17.
6. **Rollback** is one Route 53 change: restore the root/www `A` records to the
   WP Engine origin `141.193.213.10` / `141.193.213.11` (values re-verified in
   the zone 2026-08-13). WordPress stays up through the window regardless.

---

## 🔴 Blockers — cannot go live without these

Section numbers are **stable, not sequential** — closed sections are removed
without renumbering, so gaps are expected and cross-references stay valid.

### 1. Production deploy pipeline — DONE

**Push-to-deploy is live on the client's AWS account.** Merging to `staging`
builds and deploys `https://staging.openmined.org`; PRs get Amplify preview
URLs; CI runs the type gate, the build, and the four deterministic audits on
pushes to both deploying branches. Nobody runs a build or holds cloud
credentials to publish, which is the load-bearing requirement (HOSTING.md →
Deploy workflow).

Production today is still **WordPress on WP Engine**; §1's remaining work is the
origin repoint, which is the cutover-day sequence above.

**Questions still open, all needing someone with AWS or account access:**

1. Who owns the **WP Engine** account, does WordPress stay up read-only for a
   grace period, and are any WP-served paths — forms, redirects, uploads — still
   doing real work?
2. ~~Who provisions the **live Stripe key**?~~ **Answered 2026-08-17: shared with
   Stephen**, who arms it in SSM. The live half of the question stands and is
   now architectural, not administrative: **staging cannot keep the test key**
   while one Lambda and one SSM parameter serve every host — see §2.
3. **Where do the served response headers actually come from — `customHttp.yml`,
   or a console setting?** `main`'s branch domain serves all 6 security headers
   while having no `customHttp.yml` in its tree (measured 2026-08-17), so the
   config is held app-wide; what can't be seen from outside is whether the repo
   file is its source or whether someone entered the headers in the console.
   **This matters beyond curiosity:** if the console is the real source, then
   edits to `customHttp.yml` silently do nothing, and the file is decorative.
   `public/_headers` → `customHttp.yml` is already a hand-porting step (README →
   Response headers); a third, invisible copy in the console would make header
   changes untrustworthy — including BACKLOG §20's pagefind rule. Confirm by
   changing one header value in the repo and checking whether the deployed
   response follows.

### 2. Live `STRIPE_SECRET_KEY` in SSM

The donation flow is proven end-to-end on staging with a **test** key
(re-verified 2026-08-17): `verify:donate` drives the real modal to a live
`cs_test_…` Stripe Checkout session and the thank-you page answers 200. What
remains is putting the **live** key in SSM Parameter Store, read by the Lambda
at request time — commands in `aws/create-donation/README.md`. It is a runtime
read, so no rebuild or redeploy is needed.

**The live key is with Stephen as of 2026-08-17.** Arming it in SSM is his step,
since it needs AWS access. Two things to settle *before* it is armed rather than
after:

- **There is one SSM parameter and one Lambda, reached through an app-wide
  Amplify proxy rule — so staging and every PR preview share whichever key is in
  it.** Measured 2026-08-17: `POST /api/create-donation` answers 200 with a real
  checkout URL on `staging.openmined.org` *and* on a `pr-N` preview host. Arming
  the live key therefore points those public, unauthenticated hosts at the live
  Stripe account; the question "does staging keep the test key?" cannot be
  answered yes without a second Lambda + parameter, or a host check inside the
  existing one. Decide which, or accept it knowingly.
- **The error-text fix should land in the same change** (BACKLOG §14): the route
  forwards Stripe's own error text, and the auth-failure variant carries a
  partially-redacted key — the failure most likely at exactly the moment a key
  changes.

**Land one hardening fix with the key swap, not after it.** The route forwards
Stripe's own error text to the browser (`!res.ok` branch; confirmed live on the
deployed Lambda 2026-08-17 — an over-large amount returns 502 carrying Stripe's
message). Stripe's *auth-failure* messages include a partially-redacted key, and
the moment the key changes is the moment an auth failure is most likely. Return
a fixed message and log server-side. Both implementations
(`src/pages/api/create-donation.ts` and `aws/create-donation/index.mjs`) —
BACKLOG §14 holds the full item.

### 3. Flip the site-wide `noindex` guard — one constant

**Set `@data/indexing.mjs → INDEXING_ENABLED` to `true`.** That is the whole
flip: one line, one file. It used to be a hand-edit of the `noindex` prop
default in both `Base.astro` and `Seo.astro`; both now derive from that module,
so they need no edit and cannot drift apart.

Indexability requires **two** conditions, which is the point of the indirection:
`INDEXING_ENABLED` *and* the build being the production branch. So flipping the
constant makes `main` indexable and leaves `staging`, every PR preview, and local
dev permanently noindex — the exposure below is closed by construction rather
than by remembering. The gate **fails closed**: an unset or unrecognised branch
resolves to noindex, verified across the branch matrix 2026-08-17, including a
wrong-case `Main`.

Verified by simulating both builds (2026-08-17): pre-launch, all 683 pages
noindex; post-launch on `main`, 677 indexable with all seven self-excluding
routes still `noindex, nofollow`.

**`AWS_BRANCH` is populated — confirmed on real Amplify infrastructure
2026-08-17.** PR #8's preview shipped `<meta name="x-build-branch"
content="pr-8">`, so the gate reads a real value rather than falling through to
its fail-closed path. Note what that value *is*: on a preview, `AWS_BRANCH` is the
**preview slug** (`pr-8`), not the source branch — which is the safer of the two,
since a preview can never coincidentally equal `PRODUCTION_BRANCH`.

Non-indexable builds emit that meta and indexable ones never do, so it stays the
cheap way to check the gate from outside: a staging or preview page carrying **no**
such tag means the variable went missing and the gate is fail-closed — which would
leave production noindex after the flip.

**Branch builds report their branch name — confirmed 2026-08-17.** The staging
deploy of `b2f7602` came back with `x-build-branch: staging`, so the two build
kinds differ as hoped: a *branch* build reports its branch, a *preview* reports a
slug. Verified across all three cases the app produces:

| Build | `AWS_BRANCH` | Indexable once `INDEXING_ENABLED` is true |
|---|---|---|
| PR preview | `pr-8` — a slug | no; can never equal `main` |
| `staging` branch | `staging` | no |
| `main` branch | `main` — inferred from the two above | yes |

Only the last row is inference rather than measurement, and it cannot be measured
until `main` builds at all (cutover step 1). The failure direction is the safe
one: if `main` reported something unexpected, production would come up `noindex`
rather than a non-production host coming up indexable — caught by the smoke
`noindex guard` row against the production origin, which the checklist already
requires.

**Seven pages opt themselves out and must survive the flip** (verified
2026-08-17): `404`, `blog/cards`, `donate/thank-you`, both
`events/india-ai-impact-summit-2026/` registration pages, `search`, and
`style-guide`. Every page in the build carries `noindex` today, so the flip is
also the moment that count becomes meaningful — re-derive it with a grep of
`src/pages/`, don't trust this list to age.

**Why the branch condition exists — the measured exposure it closes.** Before
the gate, the `noindex` on staging was **not** a staging rule; it was the same
build-time default that ships to production, byte-identical to a local build of
the same commit. Measured 2026-08-17, across every host:

| Host | Reachable | `X-Robots-Tag` | `robots.txt` | Access control |
|---|---|---|---|---|
| `staging.openmined.org` | 200 | none | 200, `Allow: /` | none |
| `staging.<app>.amplifyapp.com` | 200 | none | 200 | none |
| `main.<app>.amplifyapp.com` | 200 | none | 404 | none |
| `pr-N.<app>.amplifyapp.com` | per PR | none | — | none |

**Amplify does not add its own `noindex` to `*.amplifyapp.com`** — checked on
both branch domains, no such header. So without the branch condition, flip day
would turn all of these into fully indexable duplicates of the whole site.

Two partial mitigations exist and neither would have been sufficient alone: every
non-production page carries a `rel=canonical` and `og:url` pointing at
`https://openmined.org/…` (a hint, not a directive — it does not stop crawling),
and the sitemap lists production URLs only (`astro.config.mjs → site`), so
staging never volunteers its own URLs.

**What does NOT work, so nobody re-proposes it:**

- **`X-Robots-Tag` in `customHttp.yml`** — that file is app-wide, so it cannot
  distinguish branches; it would noindex production too.
- **`Disallow: /` in `robots.txt` for the non-production hosts.** A disallowed
  URL is never fetched, so the `noindex` is never read — and such a URL can still
  be indexed, without a snippet, on inbound links alone. Allowing the crawl is
  precisely what makes the `noindex` effective; `public/robots.txt` says so in
  its own header. This is a trap, not an oversight.

**A stronger guarantee, if wanted:** Amplify **branch access control** (basic
auth) on `staging` and previews stops crawlers fetching at all. Per-branch console
toggle, so it needs AWS access, and it puts a password in front of the preview
flow that exists for a non-developer to review work. The build-time gate is the
cheaper 95%; this is the belt to its braces, not a replacement.

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
- **Multi-`<h1>` posts** (closed 2026-08-17). The one post carrying ~12 extra
  `<h1>`s now carries exactly one. The cause was never a stray heading: it was
  an unclosed `<pre>` swallowing the article (see below), and fixing that fixed
  the headings. ⚠ The 2026-08-10 research's claim that
  `announcing-proof-of-concept-support-for-tff-in-pysyft-0-7` was already clean
  is **wrong** — re-measured 2026-08-17, it still emits 2 spurious `<h1>`s from
  the same cause. BACKLOG holds the remainder.

**Still open:**

- **One live URL does not resolve: `/blog/resource_type/video-on-demand/`.**
  The only gap in a 453-URL parity sweep of `reference/live-sitemap/`
  (2026-08-17). Live serves it 200 ("Video – On-Demand Archives") and it sits in
  Yoast's sitemap, so Google has it on file and will keep requesting it. Fix is
  one `editorialRedirects` entry in `src/data/redirects.mjs` → `/`, matching how
  the two existing `/resources/…` entries were handled. Cheap, and it wants
  doing before the origin repoints rather than after.
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

**Implementation notes worth not re-deriving:** the gate is a **runtime hostname
test**, not a build-time flag — staging and preview hosts serve the same build as
production, so nothing at build time can tell them apart. Verified against the
deployed staging host 2026-08-17: the script tag is injected only for
`ANALYTICS_HOSTS`, so staging reports nothing. `?analytics=force` overrides it
for deliberate testing (a forced hit is a real hit). Live also double-loads
Plausible and runs two redundant Google tags; we ship one of each.

**What live actually runs** — messier than any tracker previously claimed, and
the record is in the palace note, not here: GA4 ungated, Plausible twice, a
legacy HubSpot embed whose banner never loads, and a dead "Cookie Settings"
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
local/sessionStorage**. The only cookies anywhere were `__cf_bm` (bot defense,
~30 min) on HubSpot's *own* domains — third-party, strictly-necessary class;
list them in the privacy policy. Submission-side behaviour (a contact is created
and deduped by email when no tracking cookie exists) is documented and
staff-confirmed, not probe-tested — testing it would inject junk contacts.

- **Known leak, 4 posts** (re-confirmed 2026-08-17: 4 posts embed
  `youtube.com/embed`, none on `youtube-nocookie`). Those iframes set YouTube
  cookies on load. Fix by swapping to `youtube-nocookie.com/embed` (same player,
  no cookies until play) or a click-to-load facade. Find them with a search for
  `youtube.com/embed` under `src/content/`. **This is the only thing standing
  between the site and genuinely zero cookies** — and while it stands, the
  zero-cookie sentence above is not literally true, which matters because it is
  the basis for shipping without a banner. Worth doing before launch.
- **⚠ The homepage loads a Google-hosted webfont** (found 2026-08-17). Not a
  cookie — so the "zero cookies" sentence above survives literally — but a
  request to `fonts.googleapis.com` / `fonts.gstatic.com` hands the visitor's IP
  address to Google on every load, with no consent, which is the exposure a
  German court found actionable (LG München I, Jan 2022) and is squarely against
  the stance the rest of this section takes.

  It is **our code, not HubSpot's**: `@components/graphics/DiamondEmbed.astro →
  ensureFont()` injects two preconnects and a Google Fonts stylesheet for
  **Sometype Mono**, the embed's own label font. It fires on exactly the two
  pages carrying the embed — `/` (via `HomeHero.astro`) and `/style-guide/` —
  and Sometype Mono is referenced nowhere else in the codebase. Verified by
  request-level capture: blog posts and `/contact/` request no Google origin
  despite loading the same HubSpot form, so the form is not the source.

  This also makes two docs wrong: `public/_headers` states "Fonts are
  self-hosted", and BACKLOG §13's CSP origin inventory omits the Google origins.

  **Fix:** self-host Sometype Mono through the pipeline the other families
  already use (`astro.config.mjs → fonts` + the hand-authored `@font-face` rules
  in `global.css → typography`), then delete `ensureFont()`. Small, and it
  removes a third-party render-blocking stylesheet from the homepage as a bonus.
  If it is *not* fixed before launch, §6 must name Google as a recipient of
  visitor IP addresses.
- **Guard worth building:** assert that no page sets cookies on a cold load, so
  bannerlessness can't silently break. Nothing checks this today. Worth widening
  to third-party *requests* rather than cookies alone — a cookie-only assertion
  would not have caught the Google Fonts call above.

### 6. Privacy-policy page rewrite

`src/pages/privacy-policy.astro` still names **Google Analytics** and **WP
Engine** as host, and treats cookies as current practice — all wrong at cutover
(re-confirmed 2026-08-17). Rewrite to match what actually ships (§4 is settled,
so this is no longer conditional):

- **hosting on AWS** — Amplify Hosting fronted by CloudFront, in the OpenMined
  AWS account;
- **Plausible as the sole analytics**, plus the written legitimate-interest
  record that replaces a consent banner;
- a **cookie/storage disclosure** stating the site sets no cookies of its own —
  only third-party strictly-necessary `__cf_bm` on HubSpot's domains, and the
  YouTube embeds in §5 until those are fixed;
- **Google**, as a recipient of visitor IP addresses, *if* the homepage's
  Google-hosted webfont (§5) is still shipping at launch — the cleaner outcome is
  to self-host it and have nothing to disclose;
- **HubSpot forms** and the in-form consent basis;
- **Workable** for job applications.

Worth an hour of EU counsel review against the research.

**Also missing entirely, not just wrong: Stripe.** The site takes donations
through Stripe Checkout and the policy names no payment processor at all. The
policy currently *over*claims analytics (it lists Google Analytics and Plausible,
and only one ships) and *under*claims payments — **the second is the one that
matters legally**, so if only one thing gets fixed, fix that.

---

## 🟠 Cutover checklist — the day-of switches and re-audits

Each line states the assertion that must hold. How you verify it is open — the
repo ships a verification kit in `scripts/` (see README) that covers several of
these; the rest are one-off checks best written fresh against the state of the
day.

- **Origin repoint** — `openmined.org` and `www` serve from the production
  deploy, off WP Engine (the domain-association change in the cutover sequence).
- **Live Stripe key** in the SSM parameter
  (`aws/create-donation/README.md`), with §2's error-text fix alongside it.
- **`www` → apex 301 preserved** — pre-wired in the sync script and inert until
  `www` maps to the app, so cutover is the **first** time it can be observed.
  Test the bare root as well as a deep path (see cutover step 4).
- **True 404 on the production origin** — unknown paths answer HTTP 404, not
  a redirect onto the 404 page (the smoke `unknown path → true 404` row).
  Soft-404s poison exactly the GSC Coverage data §7 says to watch.
- **Host redirect rules syncing from `main`** — the branch filter in
  `.github/workflows/sync-redirects.yml` is flipped from `staging` to `main`
  (`scripts/sync-amplify-redirects.mjs`; HOSTING.md → Redirects), and the
  first post-flip push to `main` has run the sync once.
- **HTML cache invalidated by the deploy.** HTML serves `max-age=0` with a
  one-year **shared** TTL, so correctness depends entirely on the deploy
  invalidating the edge. It is working today (live HTML matched a local build of
  the same commit, 2026-08-17), but a silent invalidation failure post-cutover
  would serve stale pages for a year. One cache-busted spot check right after
  the repoint is enough to know.
- **`noindex` flipped** — `@data/indexing.mjs → INDEXING_ENABLED` is `true` (§3),
  the production origin answers `index, follow`, and each of the seven
  self-excluding pages still opts out. **Then check the inverse on every
  non-production host**: `staging.openmined.org` and the `*.amplifyapp.com`
  branch/preview domains must still answer `noindex`. The branch condition should
  make that automatic — this line is to confirm it did, since the failure is
  invisible from the production side and slow to undo.
- **Analytics reporting from the real origin** — Plausible ships (§4) but is
  gated to `openmined.org`/`www`, so it has NEVER sent a hit from any test host by
  design. First confirmation can only happen once the domain resolves to the new
  host: check Plausible's realtime view immediately after the repoint. The reason
  it had to ship before cutover still stands — Plausible runs on the WordPress
  site too, so it is the one tool that can tell the before/after story across the
  switch.
- **Privacy policy** matches the shipped stack (§6).
- **No WordPress hotlinks** — nothing loads an asset from
  `https://openmined.org/wp-content/…`. These resolve only while that host is
  still WordPress and break the instant the origin repoints, and
  `public/_redirects` deliberately 404s `/wp-content/uploads/*` rather than
  redirect an asset URL to an HTML page. The 18 that existed were localized
  2026-08-12 and `npm run audit:image-urls` now fails on any that return — so
  this is a re-assert against the deployed build, not an open task (clean
  2026-08-17).
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
- **Route parity** — every URL in `reference/live-sitemap/` resolves, directly or
  via a 301. Swept 2026-08-17 against staging: **452/453**, the one gap being the
  `resource_type` archive in §7. Re-run against the production origin after the
  repoint; delete the reference directory once it passes.
- **Blog permalinks** — every migrated post resolves at its WordPress URL. This
  matched 371/371 when last audited (2026-07-22), and the 2026-08-17 parity
  sweep re-confirmed all 368 sitemapped posts; re-verify only if the live post
  set changed since.
- **Author archives** — same check for author archive URLs, including the
  redirect aliases; re-verify only if the author set changed.
- **Smoke the production origin** — `npm run smoke -- https://openmined.org`,
  expecting 17/17.
- **Hold WordPress at a holdback hostname** until confidence is high, then
  retire it and any leftover preview deploys.

> ⏱ **Allow ~1 minute after any deploy or secret change before testing.** New
> versions propagate across the edge progressively, so requests in that window
> can hit either version. This produced two phantom bugs during the test round —
> a batch of donation POSTs that 503'd moments after a secret was saved and then
> worked, and a just-removed route that still answered 200 and then 404'd.
> Re-test before diagnosing.

**PR previews — verified working 2026-08-17.** They had been dead from PR #2
through #3 (the IAM service role), and the 08-14 fix rested on a single
unreproducible observation. PR #8 built and served a preview twice, smoke 17/17
against the preview host. Latency is worth knowing for the review flow it exists
to serve: the first build took **~39 minutes** during GitHub's webhook
degradation, the second **~160 seconds** once that recovered. Treat minutes as
normal and tens of minutes as a symptom of something upstream, not of Amplify.

**Closed 2026-08-17 — the retired Cloudflare Worker.** This checklist used to
carry a line about gating the `*.workers.dev` host, which would have become a
fully indexable duplicate of the whole site the moment `noindex` flipped.
`https://openmined-org.openmined.workers.dev/` now answers Cloudflare error 1042
and serves nothing. Not verified as *deleted* (no Cloudflare access in that
session) — but it is no longer serving the site, which is what the line was for.

---

## Standing footgun

- **Never share or archive `dist/`.** The build copies `.dev.vars` into the
  server output. It is gitignored and never uploaded, but a real key sitting
  there in plain text is worth not handing around.

---

## ⚪ Polish — non-blocking, best before launch

- **`apple-touch-icon`, web manifest, `.ico` fallback** — the SVG favicon, OG
  default image, and `theme-color` are done.
- **Lighthouse and cross-browser QA on the real deployed build** — the earlier
  a11y pass ran on a sample of pages, not the full set on real hosting.
- **Extend CI coverage.** The four deterministic guards already gate every push
  to both deploying branches. What's still manual is anything needing a browser,
  the network, or a deployment — the overflow audit, the currency check, and the
  post-deploy smoke suite — plus the cold-load cookie assertion from §5, which
  doesn't exist yet. Running the smoke suite against production on a schedule
  would also close the monitoring gap below.
- **No uptime or error monitoring exists.** No health check and no alerting.
  Worth deciding before the site is the org's front door.

---

## Adding an item

Same shape as `BACKLOG.md`: what it is, current state grounded in code (path +
stable symbol, never line numbers), and what unblocks it. If it isn't
launch-gating, it belongs in `BACKLOG.md` instead.
