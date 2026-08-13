/**
 * Analytics identity constants — the single home for the third-party ids the
 * site reports to. Consumed by @components/Analytics.astro.
 *
 * ── The public site is PLAUSIBLE ONLY, and that is a decision ─────────────────
 * Decided 2026-08-13: no GA4, no HubSpot tracking code. Rationale and the full
 * diagnosis live in LAUNCH.md §4; the short version:
 *
 *   - Plausible stores NOTHING on the device (daily-rotating server-side hash),
 *     so the site sets zero cookies and needs no consent banner. Store nothing
 *     non-essential → nothing to consent to.
 *   - GA4 sets non-essential cookies (`_ga`, `_ga_*`), which for EU visitors
 *     requires prior opt-in — i.e. keeping GA4 means keeping a banner. Live runs
 *     it ungated today; that is a live defect, not a pattern to port.
 *   - HubSpot's tracking code is likewise omitted. Consent cannot retroactively
 *     cure storage that already happened (CJEU *Planet49*), so banner-free means
 *     the tracking code simply never loads.
 *
 * **The HubSpot FORMS embed is unaffected** and stays — it sets no cookies of its
 * own (verified empirically). See Base.astro's forms loader; the site is
 * forms-only by construction unless someone adds the tracking snippet back.
 *
 * Values here were PROBED off the live WordPress site (2026-08-12/13), not
 * chosen. Don't "correct" one without re-probing live.
 */

/** Plausible site identifier — matches live's `data-domain`. */
export const PLAUSIBLE_DOMAIN = 'openmined.org';

/**
 * Plausible script variant. Live loads the outbound-links build (so outbound
 * clicks are tracked) — but loads it TWICE, alongside plain `script.js`, which
 * double-counts every pageview. We ship one.
 *
 * `script.outbound-links.js` is Plausible's current filename for that build;
 * live's `plausible.outbound-links.js` is the older WordPress-plugin naming and
 * still served. Same feature, current path.
 */
export const PLAUSIBLE_SRC = 'https://plausible.io/js/script.outbound-links.js';

/**
 * Hostnames allowed to report. Everything else — `*.workers.dev`, localhost,
 * preview branches — sends nothing.
 *
 * This is NOT a parity deviation: dev and preview are not visitor-facing, so
 * production behaviour is unchanged. It exists because Plausible points at the
 * client's PRODUCTION site, and the workers.dev URL is served by the same Worker
 * as production — so a build-time flag cannot separate them. Plausible does not
 * validate the requesting origin, so without this gate every local page load
 * would land in the client's real stats.
 *
 * That matters more now than when this was written for three tools: Plausible is
 * the ONLY measurement, and it is the before/after baseline for the cutover
 * (LAUNCH.md §4). A polluted baseline can't be un-polluted.
 *
 * `www` is included because the www→apex redirect is a cutover task; if it is
 * ever briefly missing, www should still report rather than silently go dark.
 */
export const ANALYTICS_HOSTS = ['openmined.org', 'www.openmined.org'];
