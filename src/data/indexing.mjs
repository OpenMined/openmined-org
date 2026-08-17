/**
 * indexing.mjs — whether THIS build may be indexed by search engines.
 *
 * One switch, one home. Consumed by @components/Seo.astro (which emits the
 * robots meta) and @layouts/Base.astro (whose `noindex` prop default forwards
 * into it). Individual routes still override per page — several do, and they
 * pass `noindex={true}` explicitly precisely so this default can move beneath
 * them without silently opting them back in.
 *
 * ── Two conditions, both required ───────────────────────────────────────────
 *
 * 1. `INDEXING_ENABLED` — the launch flip, false until openmined.org is served
 *    from this build. This is the ONE line that changes at cutover
 *    (LAUNCH.md §3), replacing what used to be a hand-edit of two prop
 *    defaults.
 * 2. The build must BE the production branch. Amplify builds every branch from
 *    the same source — `staging`, and one per pull request — and every one of
 *    those hosts is publicly reachable with no `X-Robots-Tag` and no access
 *    control (measured 2026-08-17). Without this condition, flipping (1) would
 *    turn staging.openmined.org and every `pr-N.*.amplifyapp.com` into a fully
 *    indexable duplicate of the entire site.
 *
 * ── Why a BUILD-time gate works here when analytics needed a RUNTIME one ────
 *
 * @data/analytics.mjs gates on hostname at runtime, and its header explains why:
 * the Cloudflare Worker served staging and production from ONE deployment, so
 * nothing at build time could separate them. That constraint died with the move
 * to Amplify — each branch is its own build and knows its own name. Deciding at
 * build time is strictly better than the runtime equivalent here, because the
 * directive is then baked into the HTML and needs no JavaScript to be correct;
 * a crawler that runs no JS still sees it.
 *
 * ── It fails CLOSED, which is the safer of two bad failures ─────────────────
 *
 * An unset or unrecognised branch resolves to NOT indexable. The opposite
 * default (assume production) would leak a duplicate site into the index, which
 * is slow to notice and slow to undo. This direction fails visibly instead: the
 * smoke suite's `noindex guard` row reads the shipped meta, so a production
 * build that wrongly resolved to noindex is caught the first time anyone smokes
 * the origin — which the cutover checklist requires anyway.
 *
 * ⚠ Read the branch from `process.env`, NOT `import.meta.env`. This module is
 *   evaluated while pages prerender, and Vite only surfaces a curated subset of
 *   the environment through `import.meta.env`. The `typeof` guard is for
 *   workerd, which is what `astro dev` renders under: `process` exists there via
 *   `nodejs_compat`, but `AWS_BRANCH` does not — so local dev resolves to
 *   noindex, which is the outcome we want anyway.
 *
 * ⚠ Do NOT add `Disallow: /` to public/robots.txt for non-production hosts,
 *   tempting as the symmetry looks. A disallowed URL is never fetched, so the
 *   `noindex` below is never READ — and a URL blocked that way can still be
 *   indexed (without a snippet) on the strength of inbound links alone. Crawl
 *   must stay allowed for this directive to do its job; robots.txt says so in
 *   its own header.
 */

/** The branch whose build serves openmined.org. */
export const PRODUCTION_BRANCH = 'main';

/**
 * The launch flip, `true` since 2026-08-17. Combined with the branch condition
 * below, this makes **production and only production** indexable; `staging`,
 * every PR preview, and local dev stay `noindex` permanently.
 *
 * Setting it back to `false` is the one-line way to pull the whole site out of
 * search — the pre-launch state — if that is ever needed.
 */
export const INDEXING_ENABLED = true;

/**
 * The branch this build came from. Amplify sets `AWS_BRANCH` on every build it
 * runs (production, staging, and per-PR previews); it is absent everywhere else,
 * including local dev and GitHub Actions.
 */
export const BUILD_BRANCH =
  (typeof process !== 'undefined' && process.env ? process.env.AWS_BRANCH : '') || '';

/** The resolved answer. See the two conditions above. */
export const SITE_INDEXABLE = INDEXING_ENABLED && BUILD_BRANCH === PRODUCTION_BRANCH;
