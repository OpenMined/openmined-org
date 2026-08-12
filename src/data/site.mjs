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
