/**
 * redirects.mjs — the site's redirect registry.
 *
 * Wired into `astro.config.mjs` as the `redirects` map. Two things emit from it
 * at build: (1) a tiny meta-refresh + `<link rel="canonical">` HTML page at each
 * OLD path — portable to any static host; (2) a true HTTP 301 line in the
 * Cloudflare `_redirects` file, which the @astrojs/cloudflare adapter generates
 * natively from this same map (no separate codegen script needed — the adapter
 * appends these onto `public/_redirects`; that file is the merged source).
 *
 * This registry is for HUMAN-NAVIGABLE PAGE redirects only. Two other classes
 * live in `public/_redirects` because they can't/shouldn't be expressed here:
 * wildcards/splats (no static page can be generated per unknown path, e.g.
 * `/author/*`) and machine resource endpoints (feeds, sitemaps — consumers
 * follow the 301 but ignore the HTML meta-refresh, so a meta-refresh `.xml` file
 * would be broken for them). See `public/_redirects`.
 *
 * TWO registries, one merged export — keep them separate so intent stays legible:
 *
 *  - `migrationRedirects` — old WordPress/Ghost URLs → new Astro URLs. Added
 *    once, during the content migration, to preserve inbound links + SEO for
 *    paths whose structure CHANGED. A post whose live URL is already
 *    `/blog/<slug>/` needs NO entry (the slug is preserved verbatim); only add
 *    one when the old path differs (moved out of a dated permalink, renamed
 *    slug, retired taxonomy path, etc.).
 *
 *  - `editorialRedirects` — intentional, ongoing redirects added BY CHOICE over
 *    the site's life: a renamed slug, a retired page folded into another, a
 *    vanity/short URL. These accrue after launch.
 *
 * Convention: keys and values are absolute, root-relative, and (for directory
 * URLs) trailing-slashed to match Astro's output — `/old/`, not `/old`.
 */

/** @type {Record<string, string>} */
export const migrationRedirects = {
  // ── Author archives (audited 2026-07-27 against all 122 live terms; re-run
  // `scripts/audit-author-archives.mjs` if the author set changes).
  //
  // Our archive slug is the `people` id, which is name-derived; PublishPress
  // sometimes derived live's slug from an email or a nickname instead. Where the
  // two differ, the indexed live URL 301s to our canonical one. (`osam` and
  // `openmined-community` also exist as stale duplicate `people` records with
  // zero posts — they generate no archive, so redirecting those paths is safe.)
  '/blog/author/bennettopenmined-org/': '/blog/author/bennett-farkas/',
  '/blog/author/elisepi/': '/blog/author/elise-pi/',
  '/blog/author/khoaopenmined-org/': '/blog/author/khoa-nguyen/',
  '/blog/author/openmined-community/': '/blog/author/openmined-team/',
  '/blog/author/osam/': '/blog/author/osam-kyemenu-sarsah/',
  '/blog/author/subha/': '/blog/author/subha-ramkumar/',

  // Live serves these 9 author archives at 200 but with ZERO posts (accounts
  // that never published, plus one test account). We generate archives only for
  // authors credited on a post, so these paths have no destination — fold them
  // into the blog index rather than 404.
  '/blog/author/annie-krall/': '/blog/',
  '/blog/author/dhruv-aggarwal/': '/blog/',
  '/blog/author/ionesio-junior/': '/blog/',
  '/blog/author/kyle-numann/': '/blog/',
  '/blog/author/kylentest/': '/blog/',
  '/blog/author/ronnie-falcon/': '/blog/',
  '/blog/author/sameer-wagh/': '/blog/',
  '/blog/author/shubham-gupta/': '/blog/',
  '/blog/author/tauquir-ahmed/': '/blog/',
};

/** @type {Record<string, string>} */
export const editorialRedirects = {
  // Retired program/FL landing pages — mirrors the 301s live already serves
  // (verified against production 2026-07-21). The programs + FL hubs were folded
  // into the homepage; the weekly meetup into the co-design recruitment page.
  '/programs/': '/',
  '/federated-learning/': '/',
  '/federated-learning/weekly-support-meetup/': '/federated-learning/co-design/',

  // Events index — folded into the homepage (mirrors the 301 live already
  // serves; verified against production 2026-07-22, same pattern as the
  // programs/FL hubs above). The India-summit-2026 child reg pages are handled
  // separately (past-event triage).
  '/events/': '/',

  // Resources CPT sunset (2026-07-22). The archive index already 301s to home
  // on live; the sole surviving entry (a Privacy Tech Talk Series page) is
  // retired with it.
  '/resources/': '/',
  '/resources/privacy-tech-talk-programming-and-verification-frameworks-differential-privacy/': '/',
};

/**
 * Merged map consumed by astro.config. Editorial wins on key collision (a
 * deliberate later redirect can override a migration default).
 */
export const redirects = { ...migrationRedirects, ...editorialRedirects };
