/**
 * Site-wide identity constants — the single home for values that appear in the
 * document head, the sitemap, and the RSS feed. Imported by:
 *   - astro.config.mjs      → `site:` (canonical origin, sitemap, RSS)
 *   - @components/Seo.astro  → <title>, description, OG/Twitter defaults
 *   - src/pages/rss.xml.js   → feed metadata
 *
 * Kept as .mjs (not .ts) so astro.config.mjs can import it directly alongside
 * redirects.mjs. Values are canonical here — don't restate them in components.
 */

/** Canonical production origin. Drives canonical URLs, the sitemap, and RSS. */
export const SITE_URL = 'https://openmined.org';

/** Brand name — used as the <title> suffix and og:site_name. */
export const SITE_NAME = 'OpenMined';

/**
 * Default meta/OG description for pages that don't set their own.
 * Verbatim from live's home meta description (verified against openmined.org
 * head: 2026-07-15).
 */
export const DEFAULT_DESCRIPTION =
  "Unlock insights from data you can't access. Create value from data you can't share. OpenMined builds the technology to make it happen. Non-profit. Open-source.";

/** Default social-share card (public/og-default.jpg — 1200×675). */
export const DEFAULT_OG_IMAGE = '/og-default.jpg';

/**
 * Compose the document title from a raw page title: append the brand UNLESS the
 * title already carries it (home, "Careers at OpenMined", …). No title at all →
 * the bare site name.
 *
 * Lives here, not in Seo.astro, because two consumers need the SAME string —
 * Seo emits it as <title>/og:title, and JsonLd uses it as the graph's
 * WebPage.name. A second copy of this rule would drift.
 *
 * @param {string} [title] Raw page title, no brand suffix.
 * @returns {string}
 */
export function composeTitle(title) {
  const trimmed = title?.trim();
  if (!trimmed) return SITE_NAME;
  return trimmed.includes(SITE_NAME) ? trimmed : `${trimmed} — ${SITE_NAME}`;
}

/**
 * Organization logo for the JSON-LD graph (@utils/schema.ts → Organization).
 * Same asset live's Yoast graph points at, served locally rather than from
 * wp-content (verified against openmined.org: 2026-08-12).
 */
export const ORG_LOGO = '/logos/OpenMined-Icon-large.svg';

/**
 * Canonical profile URLs for the organization — JSON-LD `sameAs`, the main
 * knowledge-panel signal. Live omits this; we emit it. Keep in sync with the
 * social links rendered in @components/layout/Footer.astro.
 */
export const SAME_AS = [
  'https://github.com/OpenMined',
  'https://x.com/openminedorg',
  'https://bsky.app/profile/openmined.bsky.social',
];
