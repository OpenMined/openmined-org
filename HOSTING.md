# Hosting requirements — the host-portable contract

What any host serving this site must provide. Written during the Cloudflare →
AWS move and deliberately **target-agnostic**: every line here is a requirement
of the *site*, and which mechanism satisfies it is the host's business. The AWS
host is now provisioned (**Amplify Hosting**; LAUNCH.md records the decision
and cutover path), which makes this file the contract the deployed
configuration is held to — Amplify's rules live in the console, out-of-band of
the repo, so this contract plus `npm run smoke` are what catch drift.

Doc rules apply (see `AGENTS.md`): this file references code by path + stable
symbol and does not restate values that live in code. Where a measured fact is
quoted, it is stamped with the date it was verified.

`npm run smoke -- <base-url>` (`scripts/smoke-deploy.mjs`) is the executable
version of this contract — run it against any candidate host, or against the
current and candidate hosts side by side.

## What the site is

An Astro build: static prerendered pages plus exactly **one** on-demand route,
`POST /api/create-donation` (`src/pages/api/create-donation.ts`), which holds
the Stripe secret key and returns a Checkout Session URL. No database, no
sessions, no auth, no other server state. Measured off the build 2026-08-13:
683 static HTML pages plus the one executing route.

## Build contract

- `npm run build` produces everything, including the Pagefind search index —
  it's built by an integration (`integrations/pagefind.mjs`), so no build
  command can skip it. There is no separate index step to wire into CI.
- **The Cloudflare adapter stays in place** on the AWS deployment (the shipped
  state, 2026-08-13): Amplify builds run `PRERENDER_ENV=node npm run build`
  (`astro.config.mjs → prerenderEnvironment`; Amplify's containers can't boot
  workerd, so prerendering runs in plain Node) and publish `dist/client` —
  pages as `<route>/index.html`, hashed assets under `/_astro/`, the search
  index under `/pagefind/`, `404.html` at the root, `public/` copied through
  as-is. The on-demand route is NOT in that artifact; on AWS it runs as the
  Lambda twin (`aws/create-donation/`). An adapter-less build also works and
  was verified 2026-08-13 — Pagefind, the 404, the sitemap, and all image
  variants build identically; zero runtime `/_image?` URLs are emitted (images
  pre-generate at build via sharp, Astro's default) — but it changes the
  page-redirect mechanism; see Redirects.
- The repo builds on Node; the only secret (`STRIPE_SECRET_KEY`) is **not** a
  build input. A build with no secrets present is a complete, correct build.

## Routing

- **Directory URLs must resolve to their `index.html`**: every page is
  `/<route>/index.html` and is linked as `/<route>/`. On an S3 REST origin
  behind CloudFront this needs index-document resolution (e.g. a small
  viewer-request function); an S3 website endpoint does it natively. Either is
  fine — it just must hold for *nested* paths, not only the root.
- **404**: unknown paths serve `404.html` with status **404** (on CloudFront a
  custom error response; on Amplify a **`404-200`** rule to `/404.html` — that
  status string is Amplify's in-place variant; a plain `404` rule is a
  *redirect* that lands on the 404 page answering 200, verified 2026-08-14).
  Not 200-with-error-page, and not a redirect that lands on the 404 page —
  soft-404s poison crawl data. Asserted by the smoke
  `unknown path → true 404` row.
- **No host-added redirects** beyond the set below, with one exception: the
  `www` → apex 301 must exist at the host/DNS layer (the static file set can't
  match on hostname). On Amplify it comes from `sync-amplify-redirects.mjs`'s
  domain-qualified splat rule — **verified live at cutover 2026-08-17**: root
  and deep paths both 301 to the apex, path preserved. ⚠ Propagation trap
  worth knowing: domain-qualified rules take up to ~an hour to reach the edge
  (a CloudFront distribution cycle), while path rules apply in seconds — a
  same-update path probe firing while a domain rule still 200s means *wait*,
  not *broken*. Measured: the rules were live ~an hour after the first
  main-push sync applied them.

## Redirects — two classes, verified 2026-08-13

Two classes:

1. **Must-301 (host config): the rules in `public/_redirects`.** Machine
   endpoints (WP feed URLs, Yoast sitemap URLs) plus one wildcard
   (`/author/*`). Consumers — feed readers, Googlebot — follow the HTTP status
   and ignore HTML, so only true 301s work. This is a **small, hand-written
   list** (13 rules as of 2026-08-13; the file is the source of truth) in
   Cloudflare's `_redirects` format: `from  to  status`, first match wins,
   one splat. Translate into whatever mechanism fits (CloudFront function,
   edge rules); the format is trivial to parse.
2. **Page redirects: the registry in `src/data/redirects.mjs`.**
   Human-navigable moved/retired pages. The mechanism depends on the build:
   with the Cloudflare adapter in place (the shipped state) the adapter claims
   them as 301 lines in the merged `_redirects` file — which Amplify does not
   read, so on Amplify they are mirrored as **app-level custom rules** along
   with class 1. An adapter-less build would instead emit each as a static
   meta-refresh page carrying `noindex` and a `rel=canonical` to the target —
   zero host config, verified 2026-08-13 (all 21 emit; none leak into the
   sitemap or the Pagefind index). Either satisfies the contract; a true 301
   is the preferred form and is what ships.

**Host rules are synced from the build.** On Amplify the entire redirect set
lives as app-level custom rules, and the repo pushes them itself:
`scripts/sync-amplify-redirects.mjs` (run by
`.github/workflows/sync-redirects.yml` on pushes to staging, AWS access via
OIDC — the branch filter flips to `main` at cutover, see LAUNCH.md; never via
the Amplify build, because the service role a build would need silently
disables PR preview creation)
rebuilds the complete rule set from the built `dist/client/_redirects`, so
`src/data/redirects.mjs` and `public/_redirects` stay the only authoring
surfaces. The script is also the home of the three host-level rules with no
repo source: the www→apex 301, the donate-Lambda 200-proxy, and the
true-404 catch-all.
`npm run smoke` asserts the behavior. Verified on staging 2026-08-13: all 21
registry entries and all 13 `_redirects` rules answer as true 301s.

## Response headers

- Every header in `public/_headers` must arrive on **page and asset
  responses**. That file is the source of truth for names and values; its
  format is `path-pattern` + indented `name: value` lines. These headers are
  net-new versus the WordPress site — no external monitor notices if a host
  swap silently drops them, so `smoke` asserts them (`security headers on
  pages` row) and `audit:headers` validates the file itself.
- The API route sets its own headers in its `json` helper
  (`create-donation.ts`) — hosts don't need to cover it, and header changes
  meant to cover the API must be made there too.
- **HSTS** is deliberately absent from the file and was blocked only by the
  old Cloudflare-zone plan; on the new host it can be set at the edge.
  `includeSubDomains` needs an audit of every `*.openmined.org` subdomain
  first, and `preload` is effectively irreversible — treat both as separate
  decisions.
- A full `script-src`/`style-src` CSP stays deliberately absent
  (`BACKLOG.md` §13).

## Caching

- **`/_astro/*` is content-hashed — serve it with long-lived immutable
  `Cache-Control`** (a year, `immutable`). Under Cloudflare the adapter
  injected this into `_headers`; with the adapter gone **the host must supply
  it** (CloudFront cache policy / response-headers policy, or S3 object
  metadata set at upload). `smoke` asserts it.
- Same for `/pagefind/` except `pagefind-entry.json`, which is the index's
  mutable entrypoint.
- **HTML must not be cached past a deploy**: short/no edge TTL, or
  invalidation on deploy. Deploys change page content under stable URLs.

## The donation endpoint

- Contract: `POST /api/create-donation`, JSON body, returns
  `{ checkout_url }`; the client caller is the donate modal
  (`src/components/layout/DonateModal.astro`). **The path is part of the
  contract** — if the endpoint lands elsewhere (API Gateway stage, Lambda
  URL), either route it under the site origin at that path or update the
  modal.
- The code is host-neutral: Web-standard `fetch`/`Request`/`Response`,
  form-encoded Stripe REST, no SDK. The single host-specific seam is
  `create-donation.ts → readRuntimeEnv()`, which already falls back to
  `process.env` — a Node Lambda needs no change beyond having
  `STRIPE_SECRET_KEY` in its environment. On AWS the route in fact runs as a
  purpose-built Lambda twin (`aws/create-donation/index.mjs`) with the secret
  in SSM Parameter Store; the Astro route stays the contract source and the
  two must not drift.
- `success_url`/`cancel_url` derive from the browser's Origin header,
  **validated** against `@data/site.mjs → SITE_URL` and the deploy's preview
  domain (`APP_DOMAIN` env), falling back to `SITE_URL` (2026-08-13) — staging
  and preview checkouts round-trip to the host they started on, and an
  untrusted Origin can never become the post-payment redirect target. Both
  implementations carry this as `safeOrigin` — keep them in step.
- Until the secret is set the endpoint answers 503 and the modal shows a
  friendly message — a staging deploy with no secret is a valid state, and
  `smoke` scores it as "live but dormant".
- Hardening that should ride along at the infra layer: rate limiting on this
  one path (`BACKLOG.md` §14).

## Deploy workflow — requirements, not implementation

These are load-bearing (the site exists so a non-developer can edit it with
AI against the repo):

1. **Push-to-deploy from `main`** — committing must be sufficient; no
   contributor runs a local build or holds cloud credentials to publish.
2. **Branch preview deploys** — previews are how a non-developer checks work
   before it's public. Preview hostnames get no analytics by design
   (`@data/analytics.mjs → ANALYTICS_HOSTS` gates on hostname) and must stay
   `noindex` (the pre-launch default already is; after the launch flip,
   previews on public hostnames need their own guard — e.g. `X-Robots-Tag`
   at the host).
3. **Cache invalidation on deploy** for HTML (see Caching).
4. CI (`.github/workflows/ci.yml`) already runs the type gate, the build, and
   four deterministic audits on every push — a deploy pipeline should not
   race ahead of a red CI.

## Acceptance

Run `npm run smoke -- https://<candidate-host>` — every row except the
donation row (dormant without the secret) and, pre-launch, the noindex row
should pass. Then `npm run verify:donate -- https://<candidate-host>` for the
full modal → Stripe flow once a test key is in place.
