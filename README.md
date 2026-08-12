# openmined.org on Astro

The openmined.org website: Astro, static output plus one on-demand API route,
deployed to Cloudflare Workers. Built on the OpenMined Design System — the
brand tokens and UI primitives live in this repo (`src/styles/`,
`src/components/ui/`) and track design.openmined.org.

## Quickstart

```sh
npm install
npm run dev      # astro dev; SSR runs under workerd via platformProxy
npm run check    # astro check, the type gate CI runs on every push
```

Two flags to note:

- **Workers, not Pages.** Use `wrangler …` instead of `wrangler pages …` (see "Deploy").
- **No `node:fs` at render time.** Site pages render under workerd, which
  has no filesystem (see "Rendering under workerd").

## Rendering under workerd

The `@astrojs/cloudflare` adapter (v14) runs the dev server's SSR and the
build-time prerender under workerd, Cloudflare's runtime, which is the same
engine that serves the on-demand route in production. The upside is
fidelity: a page that renders in dev renders identically in production, and
Cloudflare bindings (secrets, `env`) work locally.

The constraint: workerd has no filesystem, so `node:fs` and the other Node
fs APIs must never run at render time. Build-time file reads go through Vite
instead (`import.meta.glob`; see `src/components/media/OrgLogo.astro` and
`src/components/elements/Icon.astro`). `wrangler.jsonc` enables
`nodejs_compat`, which provides `process` and other Node globals, but still
no filesystem. A violation fails fast on `npm run dev`; when you hit it,
it's this platform boundary, not your code.

## Build

`npm run build` is plain `astro build`. The Pagefind search index is built by
an integration (`integrations/pagefind.mjs`), so **any** build command produces
it — `astro build`, `npm run build`, or whatever a CI or hosting dashboard is
configured to run. If indexing fails the build fails with it; there is no way
to ship a site whose search silently returns nothing.

It was a chained npm script until 2026-08-11, and a deploy that ran bare
`astro build` shipped exactly that broken state — search returning nothing on
every query, with no error anywhere. That's why it moved into the build.

Output lands in two places: `dist/client` holds the static assets and
`dist/server` holds the Worker entry. At build, the adapter generates
`dist/server/wrangler.json` from the source `wrangler.jsonc`.

## Deploy

This is a Workers build: `@astrojs/cloudflare` v14 deploys to Cloudflare
Workers only, with no Pages support. Cloudflare's Pages product has
near-identical tooling and most older Astro-on-Cloudflare guides assume it,
so treat any `wrangler pages …` command you find as wrong for this repo. It
is plain `wrangler deploy`, `wrangler secret put`, and so on.

```sh
npm run build
wrangler deploy
```

The Worker-name drift trap: keep `wrangler.jsonc → name` identical to any
`--name` override in deploy commands. On a mismatch, wrangler's
non-interactive fallback answers "yes" and creates a second Worker instead of
failing. The current name is a pre-handoff staging value; read the warning
comment in `wrangler.jsonc` before renaming.

After every deploy, run the smoke check (see "Verification kit"):

```sh
npm run smoke -- https://<the-deployed-host>
```

## Secrets

The one secret is `STRIPE_SECRET_KEY`. It powers
`src/pages/api/create-donation.ts`, the only on-demand route, which creates a
Stripe Checkout Session for the donate modal.

In production, set it with `wrangler secret put STRIPE_SECRET_KEY`. That is
the Workers command; `wrangler pages secret put` targets a product this site
doesn't use. For local dev, copy `.dev.vars.example` to `.dev.vars`
(gitignored) and fill it in.

Until the secret exists, the endpoint stays deliberately dormant: it returns
503 and the donate modal shows a friendly "not available" message. The rest
of the site is unaffected.

Secrets are read at request time through `create-donation.ts → getStripeKey`
(the `cloudflare:workers` env). Never read them via `import.meta.env`, which
bakes the value into the bundle at build.

## Redirects

`public/_redirects` is the single source of host-level 301s. At build, the
adapter appends the page-redirect entries derived from
`src/data/redirects.mjs`, so the two are one merged list; which class of
redirect belongs where is documented in the `_redirects` header.

One footgun, quoting that header: never set `assets.run_worker_first: true`
in wrangler config. It routes all traffic through the Worker before the
asset layer and bypasses `_redirects` entirely.

## Launch flip

The site ships `noindex` by default: `src/layouts/Base.astro → noindex` prop
(default `true`, forwarded to `src/components/Seo.astro`, which writes the
robots meta). At cutover, flip that default, then verify that `/search/` and
the unlisted event pages still set their own per-page `noindex`. The smoke
script's "noindex guard" row asserts the pre-launch state, so after the flip
it is expected to flag on the production host.

## Verification kit

Browser-driven scripts use Playwright (a devDependency). On a fresh machine,
run `npx playwright install chromium` once.

### `npm run smoke -- <base-url> [<base-url>]`

Post-deploy assertion table, read-only over HTTP: key pages and feeds return
200, the Pagefind index exists (catches a deploy serving a stale or
index-less build), redirects fire (split by which layer emits them), the noindex guard,
`/_astro/*` cache headers, and the donation endpoint. With two URLs it prints
the hosts side by side. Reading the donation row: 503 means the dynamic tier
is live but dormant (no secret), 200 means fully live, and 404/405 means the
host has no dynamic tier at all.

### `npm run verify:donate -- [<base-url>]`

Drives the real donate modal in a headless browser (defaults to
`http://localhost:4321`): open, tabs, currency sync, and submit to the
endpoint, adapting to a dormant endpoint (friendly error) or a live one
(lands on Stripe Checkout). Screenshots go to `scripts/screenshots/`
(gitignored).

### `npm run audit:images`

Static scan enforcing "Images: resize, never reshape" (below). No build or
server needed; run it any time, and in review whenever image code changes.

### `npm run audit:image-urls -- [<dist-dir>]`

The build-output counterpart to `audit:images`: every root-relative URL in the
built HTML — `src`, each `srcset` candidate, and CSS `url(…)` — must resolve to
a real file under `dist/client`. Needs a build first. It exists because the
Cloudflare adapter's `imageService` default writes runtime `/_image?…` endpoint
URLs instead of pre-generating variants; that shipped once across most of the
site with the build green, the dev server fine, and nothing failing. The two
failure classes report separately, since an unresolvable endpoint URL and an
ordinary missing file mean different things.

### `npm run audit:assets`

Guards `public/`, which is served byte-for-byte — Astro never opens, resizes, or
warns about anything in it, so neither image guard above can see a problem
there. Two checks: an SVG whose embedded bitmap is far larger than the box it
declares, and any file over the size budget for its type (budgets are
per-extension, since video is honestly megabytes and a logo is not).

Embedding a raster in an SVG is legitimate — a gradient mesh has no SVG 1.1
equivalent, and 2× embeds are correct for retina — so the test is the
oversampling *ratio*, not the presence of a payload. The threshold clears 3×
DPR with room to spare; the case that prompted the guard was a 4096px raster in
a 145px box, 28× oversampled and 3.86MB on the homepage. Exemptions go in the
script's `ALLOW` map with a mandatory reason, since a binary can't carry an
inline opt-out comment.

### `npm run audit:overflow -- [--base <url>] [--widths 390,1024] [--engine webkit]`

Asserts that no page scrolls sideways at a ladder of viewport widths,
measured on load, after scrolling, and with the nav menu open; each of those
states has caught a real bug the others missed. Defaults to
`http://localhost:4321`, so have a dev server running or point `--base` at a
deployed host. Run it as a regression gate after layout or chrome changes.

### `npm run audit:currencies`

Checks the donation currency list (`@data/donation.mjs → CURRENCIES`) against
Stripe's own country spec, including the zero-decimal currencies whose amounts
are encoded differently. Calls Stripe's API, so it needs network.

### CI

`.github/workflows/ci.yml` runs `npm run check`, `npm run build`, and the three
guards that are deterministic and need neither a browser nor the network —
`audit:images`, `audit:image-urls`, and `audit:assets`. The rest of the kit is
deliberately left out so CI cannot flake: `audit:overflow` needs a browser and a
running server,
`audit:currencies` calls an external API, and `smoke` / `verify:donate` need a
live deployment. Run those locally, or against a deploy.

The workflow is staged: GitHub only reads workflows from the repository root's
`.github/`, so it activates automatically when this folder becomes a repo root.

## Images: resize, never reshape

The rule `audit:images` enforces: an image call (`<Image>`, `<Picture>`,
`getImage`) must never constrain both width and height, and must never pass
`fit`. Astro's image service pads the source into the requested box instead
of cropping (`fit: 'cover'` is not honored), producing a file with exactly
the requested dimensions and an opaque letterbox baked in. Nothing errors and
every dimension check passes, which is why this is an audit and not a review
habit. Constrain one dimension and do any shaping in CSS (`object-fit:
cover`, `aspect-ratio` on the box). Legitimate exceptions opt out with a
comment on the preceding line: `// audit-image-shapes: allow — <reason>`.
