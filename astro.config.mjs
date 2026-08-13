import { defineConfig, fontProviders } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import pagefind from './integrations/pagefind.mjs';
import { redirects } from './src/data/redirects.mjs';
import { SITE_URL } from './src/data/site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// `astro dev` vs `astro build` — only used to pick the adapter's image service
// (see the adapter config below). Deliberately narrow: nothing else should
// branch on this, or dev and prod stop being comparable.
const isDev = process.argv.includes('dev');

export default defineConfig({
  // Canonical production origin — required for correct canonical URLs, the
  // sitemap, and the RSS feed. Single source of truth in src/data/site.mjs.
  site: SITE_URL,
  // Output stays 'static' (the default): every page is prerendered to HTML as
  // before. The Cloudflare adapter only exists to run the handful of routes that
  // opt OUT of prerender (`export const prerender = false`) as on-demand Worker
  // invocations — currently just src/pages/api/create-donation.ts (the Stripe
  // Checkout Session creator, which needs the secret key server-side). Deploy
  // target: Cloudflare Workers (@astrojs/cloudflare v14 is Workers-only — it
  // emits a Worker entry + static-asset binding, NOT Pages Functions). To move
  // hosts, swap this one adapter import; the endpoint itself uses only
  // Web-standard fetch/Request/Response.
  // platformProxy exposes Cloudflare runtime bindings (incl. secrets from a
  // local .dev.vars) to `astro dev`, so the endpoint is testable locally.
  // `imageService: 'compile'` is NOT optional here. The adapter's default is
  // 'cloudflare-binding', which transforms images at RUNTIME through the
  // Cloudflare Images binding — a paid product we don't have bound. Under that
  // default Astro stops pre-generating variants and emits `/_image?…` URLs into
  // the HTML instead: 522 of 679 built pages, ~10.7k image URLs, none of which
  // resolve. 'compile' generates every variant at BUILD time (sharp, on Node)
  // and serves them as plain static assets, which is what the pre-adapter
  // static build did. Verified by A/B build: adapter off → 0 `/_image` URLs.
  // …and dev uses 'passthrough' instead, because under 'compile' Astro still
  // routes DEV images through Cloudflare's workerd transform endpoint, which
  // rejects the `/@fs/…` paths Vite serves locally — SVGs in post bodies render
  // broken in `astro dev` while being perfectly fine in the build. Passthrough
  // serves each original file untouched, so every image renders locally.
  // Tradeoff: dev images are unoptimized and carry no srcset, so judge image
  // *sizing/cropping* against a real build, not the dev server.
  adapter: cloudflare({
    imageService: isDev ? 'passthrough' : 'compile',
    platformProxy: { enabled: true },
    // Prerender normally runs under workerd (prod fidelity — see README
    // "Rendering under workerd"). AWS Amplify's build containers can't boot
    // workerd (miniflare dies with EPIPE at "prerendering static routes"), so
    // amplify.yml builds with PRERENDER_ENV=node: prerender runs in plain Node
    // there, as pre-adapter static builds did. Anywhere the var is unset
    // (local, CI, Cloudflare) keeps the workerd default.
    prerenderEnvironment: process.env.PRERENDER_ENV === 'node' ? 'node' : 'workerd',
  }),
  integrations: [
    mdx(),
    // Emits /sitemap-index.xml + /sitemap-0.xml at build. Excludes the internal
    // /style-guide review surface and the 404. NOTE: pages are still marked
    // noindex pre-launch (Base.astro → noindex default); the sitemap is wired
    // now so it's correct the moment the site goes indexable at launch.
    // Also excludes the past-event India AI Impact Summit 2026 pages — kept as
    // archival/template routes (noindex on the page too), never surfaced.
    // Also excludes /blog/cards/ — the chrome-less card source the blog listing
    // controls fetch (src/pages/blog/cards.astro), never a destination.
    sitemap({
      filter: (page) =>
        !page.includes('/style-guide') &&
        !page.includes('/404') &&
        !page.includes('/blog/cards') &&
        // Search results are thin and duplicative of the pages they link to —
        // live noindexes its own results page for the same reason. /search/ also
        // sets noindex explicitly, since the site-wide noindex default flips at
        // launch and would otherwise make this route indexable at cutover.
        !page.includes('/search') &&
        !page.includes('/events/india-ai-impact-summit-2026'),
    }),
    // Builds the Pagefind search index into the build output. Deliberately an
    // integration, not a chained npm script, so no build command can skip it
    // and ship a site with silently-empty search — see integrations/pagefind.mjs.
    pagefind(),
  ],
  // Self-hosted fonts (Astro Fonts API) — replaces the Google Fonts CDN <link>.
  // At build time Astro downloads, subsets (latin + latin-ext), and self-hosts
  // each face, and (optimizedFallbacks, default on) emits a metric-matched
  // `size-adjust` fallback @font-face so non-preloaded weights shift zero on swap.
  // Consumed via CSS vars — `<Font>` in Base.astro emits the @font-face + the
  // :root var and the preload links; `tokens.css` aliases these to the semantic
  // --font-primary / --font-secondary that the rest of the CSS actually uses.
  // The cssVariable value carries the family + baked-in fallback stack, so
  // component CSS never repeats the fallbacks.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [300, 400, 500, 600, 700],
      // Cartesian with weights, but the browser only fetches a face a rule
      // actually matches — only Inter italic 400 is used, so the other italics
      // are generated (build-time) yet never downloaded.
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Rubik',
      cssVariable: '--font-rubik',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['serif'],
    },
  ],
  // Redirect registry (migration + editorial) — see src/data/redirects.mjs.
  // Static build emits a meta-refresh + canonical page per entry.
  redirects,
  // Code highlighting: Astro's built-in Shiki tokenizes fenced code blocks at
  // BUILD time (no client JS — replaces the live site's Prism.js runtime). The
  // language comes from the fence (```python), which the blog converter now
  // preserves from live's `.language-*` class. @astrojs/mdx inherits this.
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
  vite: {
    resolve: {
      alias: {
        '@ui':         path.resolve(__dirname, 'src/components/ui'),
        '@elements':   path.resolve(__dirname, 'src/components/elements'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@layouts':    path.resolve(__dirname, 'src/layouts'),
        '@styles':     path.resolve(__dirname, 'src/styles'),
        '@assets':     path.resolve(__dirname, 'src/assets'),
        '@data':       path.resolve(__dirname, 'src/data'),
        '@utils':      path.resolve(__dirname, 'src/utils'),
      },
    },
  },
});
