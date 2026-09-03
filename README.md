# openmined.org on Astro

The openmined.org website: Astro, static output plus one on-demand API route,
hosted on AWS Amplify. Built on the OpenMined Design System — the brand tokens
and UI primitives live in this repo (`src/styles/`, `src/components/ui/`) and
track design.openmined.org.

This file is how to run, build, deploy, and verify the site. `AGENTS.md` holds
the contributor conventions; `HOSTING.md` holds the hosting requirements.

## Quickstart

```sh
npm install
npm run dev      # astro dev; SSR runs under workerd via platformProxy
npm run check    # astro check, the type gate CI runs on every push
```

Two flags to note:

- **Deploys are git-driven.** Nobody runs a deploy command — merging is the
  deploy (see "Deploy").
- **No `node:fs` at render time.** In dev, pages render under workerd, which
  has no filesystem (see "Rendering under workerd").

**`astro dev` backgrounds itself for AI agents** — Astro detects an agent
session and adds `--background` automatically, so `npm run dev` returns
immediately and prints the pid; manage the daemon with
`npx astro dev status|logs|stop`. In a human terminal it runs in the foreground
as usual. (The binary is a local devDependency, so bare `astro` is not on
`PATH` — hence `npx`.)

⚠ **Don't run `npm run build` while a dev server is alive.** They share
`node_modules/.vite`, and the build regenerates it — the running server then
serves **500s** on every request, complaining that a file in `deps_ssr/` "does
not exist … which is in the optimize deps directory". Nothing is wrong with your
code. Fix: `npx astro dev stop && rm -rf node_modules/.vite`, then start it
again.

## Rendering under workerd

The `@astrojs/cloudflare` adapter runs the dev server's SSR and the build-time
prerender under **workerd**, Cloudflare's runtime. The adapter is part of the
build toolchain here, not a hosting choice — `HOSTING.md` records what removing
it would change.

workerd has no filesystem, so `node:fs` and the other Node fs APIs must never
run at render time. Build-time file reads go through Vite instead
(`import.meta.glob`; see `src/components/media/OrgLogo.astro` and
`src/components/elements/Icon.astro`). A violation fails fast on `npm run dev`.

One seam: Amplify's build containers can't boot workerd, so hosted builds
prerender in plain Node — `amplify.yml` sets `PRERENDER_ENV=node`, read by
`astro.config.mjs → prerenderEnvironment`. Local dev and CI leave it unset and
keep the workerd default, which is why render-time code must stay workerd-clean
even though the hosted build runs Node.

## Build

`npm run build` produces everything, including the Pagefind search index — it's
built by an integration (`integrations/pagefind.mjs`), so no build command can
skip it, and if indexing fails the build fails with it.

`dist/client` is the deployable site: pages as `<route>/index.html`, hashed
assets under `/_astro/`, the search index under `/pagefind/`, `public/` copied
through as-is. The build also emits `dist/server` (an artifact of the adapter);
it is not deployed — the API route production serves is the Lambda in
`aws/create-donation/`.

Builds are cached: `.astro-cache/` (`astro.config.mjs → cacheDir`) holds the
optimized image variants, content-layer store, and self-hosted fonts, so only
the first build after cloning (or after deleting the dir) pays the full
image-optimization cost. Amplify persists the same dir between hosted builds
(`amplify.yml → cache.paths` — the rationale for its location lives on those
two config comments). Deleting `.astro-cache/` is always safe — the next build
is just cold.

## Deploy

Hosting is **AWS Amplify** (app `d1otfqlvqd3jby`, us-west-1). Deploys are
git-driven; no contributor runs a build or holds cloud credentials to publish:

- **Every pull request** gets its own preview URL, posted on the PR by the
  Amplify bot — a full build of exactly that change.
- **Merging to `staging`** deploys <https://staging.openmined.org>.
- **Merging to `main`** deploys production, <https://openmined.org>.

**Two routes, chosen by the PR's base branch.** Both branches require the CI
gate (`check-and-build`) to pass before a merge; neither requires a review.

- **Quick road — PR into `main`.** For content-only changes: blog posts and
  frontmatter, page copy, links, images, the `src/data/` registries, `public/`,
  and the root docs. The preview URL is the visual check; merge when CI is
  green and production builds. Two waits, roughly four minutes. Afterwards,
  open the catch-up PR `main → staging` so staging never lags production:
  `gh pr create --base staging --head main`. Merge it with a **merge commit**,
  never a squash, or the two histories diverge and every later catch-up
  conflicts. The `Route check` workflow flags a PR into `main` that touches
  code; the `hotfix` label overrides it for an urgent production fix.
- **Normal road — PR into `staging`.** Everything else: components, styles,
  layouts, config, scripts, workflows. Review it on the staging site with the
  rest of what is queued, then promote with a `staging → main` PR (also a
  merge commit). `staging` is the default branch, so a bare `gh pr create`
  takes this road.

The build spec is `amplify.yml`: Node 22 (matching CI), `npm ci`,
`PRERENDER_ENV=node npm run build`, publish `dist/client`. Response headers are
served from `customHttp.yml` (see "Response headers"), and redirect rules are
synced to the app by the build itself (see "Redirects").

After a deploy, smoke-check it (see "Verification kit"):

```sh
npm run smoke -- https://staging.openmined.org
```

`HOSTING.md` is the host-portable contract — what any host serving this site
must provide, with `npm run smoke` as its executable form.

## Secrets

The one secret is `STRIPE_SECRET_KEY`. It powers the donation endpoint,
`POST /api/create-donation`, which creates a Stripe Checkout Session for the
donate modal.

The endpoint has two implementations that must not drift:
`src/pages/api/create-donation.ts` is the contract source and serves local dev;
its Lambda twin (`aws/create-donation/index.mjs`) is what production serves,
reached through an Amplify rewrite so the browser stays same-origin.

In production the key lives in SSM Parameter Store, read by the Lambda at
request time — set or rotate it with `aws ssm put-parameter`; exact commands
and the wiring record are in `aws/create-donation/README.md`. The key is never
a build input and never lands in an artifact. For local dev, copy
`.dev.vars.example` to `.dev.vars` (gitignored) and fill it in. Never read a
secret via `import.meta.env`, which bakes the value into the bundle at build.

Until the key is set, the endpoint stays deliberately dormant: it returns 503
and the donate modal shows a friendly "not available" message. The rest of the
site is unaffected.

## Redirects

Redirects are authored in exactly two places: `public/_redirects` holds the
hand-written host-level 301s (machine endpoints — feeds, sitemap URLs — plus
the `/author/*` wildcard), and `src/data/redirects.mjs` holds the page-redirect
registry (moved or retired pages). Which class belongs where is documented in
the `_redirects` header. At build, the adapter merges both into
`dist/client/_redirects`.

Amplify doesn't read that file — on the host, a redirect exists only as an
app-level custom rule. `scripts/sync-amplify-redirects.mjs` closes that gap: a
GitHub Actions job (`.github/workflows/sync-redirects.yml`, pushes to the
deploying branch only, AWS access via OIDC) rebuilds the complete rule set
from the built `_redirects`, plus the three rules with no repo source: the
www→apex 301 (inert until cutover), the donation-endpoint 200-proxy, and the
404 catch-all. Merging a redirect is enough; nothing is ported by hand.

The sync deliberately does not run inside the Amplify build: builds only get
AWS credentials from an app service role, and a service role's presence
silently disables PR preview creation — never attach one to this app.

## Response headers

`public/_headers` is the source of truth for the site's response headers,
including the security baseline. Amplify doesn't read it — the serving copy is
`customHttp.yml`, ported by hand — so **a change in `public/_headers` must be
mirrored into `customHttp.yml`**. `npm run audit:headers` validates the source
file; the smoke check's security-headers row catches the two drifting on a
live host.

The API route sets its own headers (`create-donation.ts → json`); a header that
should also cover the API is added there and in the Lambda twin.

A full `script-src`/`style-src` Content-Security-Policy is deliberately not
shipped — Shiki emits per-token inline `style` attributes that CSP hashes
cannot cover. See `BACKLOG.md` §13.

## Verification kit

Post-change and post-deploy guards. Each script's header comment carries its
full rationale; this is the map. Browser-driven scripts use Playwright (a
devDependency) — on a fresh machine, run `npx playwright install chromium`
once.

- **`npm run smoke -- <base-url> [<base-url>]`** — post-deploy assertion table
  over HTTP: key pages and feeds respond, the Pagefind index exists, both
  redirect classes fire, unknown paths return a true 404, security headers
  arrive on pages, `/_astro/*` is cached immutable, and the donation endpoint
  answers (200 live, 503 live-but-dormant, 404/405 no dynamic tier). With two
  URLs it prints the hosts side by side.
- **`npm run verify:donate -- [<base-url>]`** — drives the real donate modal in
  a headless browser through to the endpoint: Stripe Checkout when live, the
  friendly error when dormant. Defaults to `http://localhost:4321`.
- **`npm run audit:images`** — no image call may constrain both dimensions or
  pass `fit` (AGENTS.md → "Images: resize, never reshape"). Static scan, run
  any time.
- **`npm run audit:image-urls -- [<dist-dir>]`** — every root-relative asset
  URL in the built HTML resolves to a real file under `dist/client`. Needs a
  build first.
- **`npm run audit:assets`** — size and oversampling budgets for `public/`,
  which ships byte-for-byte and is invisible to the other image guards.
- **`npm run audit:headers -- [<dist-dir>]`** — the built `_headers` parses
  cleanly, keeps its `/_astro/*` immutable block, and covers the
  security-header floor. Needs a build first.
- **`npm run audit:overflow -- [--base <url>] [--widths 390,1024]`** — no page
  scrolls sideways at a ladder of widths, on load, after scrolling, and with
  the nav open. Needs a running dev server, or `--base` a deployed host.
- **`npm run audit:currencies`** — the donation currency list
  (`@data/donation.mjs`) matches Stripe's country spec. Calls Stripe's API.

### CI

`.github/workflows/ci.yml` runs `npm run check`, `npm run build`, and the four
deterministic guards — `audit:images`, `audit:image-urls`, `audit:assets`,
`audit:headers`. The rest need a browser, the network, or a live deployment;
run those locally or against a deploy.
