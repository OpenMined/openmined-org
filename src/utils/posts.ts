import type { CollectionEntry } from 'astro:content';

/** Strip the glob-loader `/index(.md|.mdx)` suffix from a blog entry id. */
export const stripIndex = (id: string): string => id.replace(/\/index(\.mdx?)?$/, '');

/**
 * First-paragraph excerpt from a post's raw markdown body — the social blurb
 * (og:/twitter:description) for the ~340 posts that set no `seo.description`.
 *
 * Why derive one at all: posts deliberately ship NO meta description (live
 * parity — see @components/Seo.astro), but an EMPTY social card is a real
 * regression, and live does emit an og:description built the same way. So this
 * feeds the social tags only.
 *
 * Best-effort by design. It skips the block constructs that open a post but say
 * nothing useful (headings, code fences, images, blockquotes, HTML, MDX imports,
 * lists, tables), then flattens the inline markdown of the first real paragraph.
 * A post whose body is entirely non-prose yields '' and simply falls back to the
 * site default.
 */
export function postExcerpt(body: string | undefined, maxLength = 160): string {
  if (!body) return '';

  const lines = body.split('\n');
  const paragraph: string[] = [];
  let inFence = false;

  for (const raw of lines) {
    const line = raw.trim();

    // Fenced code — track and skip wholesale (``` or ~~~, any info string).
    if (/^(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (!line) {
      // Blank line ends the first paragraph once we've collected something.
      if (paragraph.length) break;
      continue;
    }

    // Non-prose openers: skip while we haven't started a paragraph yet.
    const skippable =
      /^#{1,6}\s/.test(line) || // heading
      /^!\[/.test(line) || // standalone image
      /^>/.test(line) || // blockquote
      /^([-*_]\s*){3,}$/.test(line) || // thematic break
      /^[-*+]\s/.test(line) || // bullet list
      /^\d+\.\s/.test(line) || // ordered list
      /^\|/.test(line) || // table row
      /^</.test(line) || // raw HTML / JSX block
      /^import\s/.test(line) || // MDX import
      /^export\s/.test(line); // MDX export

    if (skippable) {
      if (paragraph.length) break;
      continue;
    }

    paragraph.push(line);
  }

  const text = paragraph
    .join(' ')
    // Inline markdown → plain text. Links first: keep the label, drop the URL.
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    // Emphasis runs are UNBOUNDED on purpose. A `{1,3}` cap looks safe — nobody
    // writes more than bold-italic — but converted WordPress bodies do: one post
    // opens `****Introduction****`, and a capped pattern matches the inner run
    // only, leaving stray asterisks in the blurb.
    .replace(/\*+([^*]+)\*+/g, '$1')
    // Underscore emphasis only when the run isn't inside a word, so snake_case
    // identifiers in a technical post survive intact.
    .replace(/(^|[^A-Za-z0-9])_+([^_]+)_+(?![A-Za-z0-9])/g, '$1$2')
    // Any asterisk left is markup residue — it has no place in a prose blurb.
    // (Underscores are deliberately NOT swept: they're legitimate in code names.)
    .replace(/\*/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  // Truncate on a word boundary, never mid-word.
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

/**
 * Canonical public slug for a blog post → `/blog/<slug>/`.
 *
 * Prefers the explicit `slug` frontmatter (the URL is authoritative in the
 * content, decoupled from the file's folder — so posts can be reorganized into
 * subfolders without changing URLs), falling back to the path-derived id for
 * posts that don't set one. This is also the stable handle for inbound links
 * and AI-assisted edits. Single source of truth for slug rules — the blog
 * routes (`pages/blog/**`) all resolve through here.
 */
export const postSlug = (entry: CollectionEntry<'blog'>): string =>
  entry.data.slug ?? stripIndex(entry.id);

/**
 * Resolve a listing's featured post. Featuring is a property of the LISTING (the
 * main blog config or a category), not the post — each listing names its pick by
 * public slug, and a listing that names nothing has **no featured post**.
 *
 * There is deliberately **no fallback to the newest post.** Featuring is an
 * editorial act: live features a post on `/blog` and on 3 of 7 category archives
 * (product, news, stories) and shows nothing in that slot on the rest — research
 * and foundation run header-less, community puts its tag rail there, policy shows
 * its team block. A newest-first fallback would silently invent a featured post
 * on every one of those, and would also quietly re-feature whatever was published
 * most recently — turning an editorial pick into a side effect of the publish
 * date. Callers already treat `undefined` as "no featured slot" and skip the
 * grid exclusion. A set-but-unresolved slug is a typo — we warn at build time.
 */
export function resolveFeatured(
  pool: CollectionEntry<'blog'>[],
  featuredSlug: string | undefined,
  scopeLabel: string,
): CollectionEntry<'blog'> | undefined {
  if (!featuredSlug) return undefined;
  const hit = pool.find((p) => postSlug(p) === featuredSlug);
  if (hit) return hit;
  console.warn(`[blog] featured slug "${featuredSlug}" for ${scopeLabel} did not resolve — no featured post will render`);
  return undefined;
}

/**
 * Blog listing pagination. Page 1 (the `/blog`, `/blog/category/*`,
 * `/blog/tag/*` landing routes) and the `/…/page/N` continuation routes MUST
 * slice the same featured-excluded, newest-first pool with the same page size,
 * or the client-side "load more on scroll" append would drop or duplicate a
 * card at a page boundary. These helpers are that single source of truth.
 */
export const POSTS_PER_PAGE = 12;

/** Number of listing pages a pool of `total` grid posts spans (min 1). */
export const pageCount = (total: number): number =>
  Math.max(1, Math.ceil(total / POSTS_PER_PAGE));

/** One page's worth of a newest-first array (1-indexed page). */
export const pageSlice = <T>(items: T[], page: number): T[] =>
  items.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

/**
 * Blog "location" taxonomy (live `/blog/locations/<slug>/`). Unlike categories
 * and tags — which are reference collections with their own registry JSON — a
 * post's location is free-text frontmatter (`location`), so the archive's term
 * set is DERIVED from the posts themselves (see `collectLocations`). The slug
 * must reproduce the live taxonomy exactly: lowercase, punctuation dropped,
 * runs of non-alphanumerics collapsed to a single hyphen — e.g.
 * "United States of America (USA)" → "united-states-of-america-usa".
 */
export const locationSlug = (label: string): string =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * The locations a post belongs to. `location` is free text that may comma-join
 * several (live is a multi-term taxonomy — one post can be filed under both UK
 * and USA); split on commas, trim, and dedupe by slug. Empty array when unset.
 */
export const postLocations = (
  entry: CollectionEntry<'blog'>,
): { label: string; slug: string }[] => {
  const raw = entry.data.location;
  if (!raw) return [];
  const seen = new Set<string>();
  const out: { label: string; slug: string }[] = [];
  for (const part of raw.split(',')) {
    const label = part.trim();
    if (!label) continue;
    const slug = locationSlug(label);
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push({ label, slug });
  }
  return out;
};

/**
 * Distinct locations across a set of posts — the location archive's term set.
 * Deduped by slug; the label is the first-seen spelling. Feeds the location
 * archive routes' `getStaticPaths` so every location that appears on a post has
 * a resolvable `/blog/locations/<slug>/` page.
 */
export function collectLocations(
  posts: CollectionEntry<'blog'>[],
): { label: string; slug: string }[] {
  const map = new Map<string, string>(); // slug -> label
  for (const p of posts) {
    for (const { label, slug } of postLocations(p)) {
      if (!map.has(slug)) map.set(slug, label);
    }
  }
  return [...map].map(([slug, label]) => ({ slug, label }));
}

/**
 * Blog author archives (live `/blog/author/<slug>/`). Unlike locations, authors
 * ARE a reference collection (`people`), so the term set is the set of people
 * actually credited on a post — NOT every `people` entry. Two consequences:
 *
 *  - A `people` record with no posts gets no archive (an empty author archive is
 *    noise; live has 9 such 0-post terms, redirected in `redirects.mjs`).
 *  - The archive slug is the person **id**, which is name-derived (see
 *    `export-blog.mjs → getAuthor`) and so can differ from live's WP author slug
 *    (PublishPress sometimes derives its own from an email). The differing live
 *    slugs 301 to the canonical id — audited by `scripts/audit-author-archives.mjs`.
 *
 * Returns ids sorted by post count (desc) then id, so build output is stable.
 */
export function collectAuthors(
  posts: CollectionEntry<'blog'>[],
): { id: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const ref of p.data.authors) {
      counts.set(ref.id, (counts.get(ref.id) ?? 0) + 1);
    }
  }
  return [...counts]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

/**
 * Href for a listing page under `base` (e.g. `/blog`, `/blog/category/news`).
 * Page 1 is `base/` (the landing route); later pages get the WordPress-style
 * `/page/N/` segment — `/blog/page/2/` — which sidesteps the `/blog/[…slug]`
 * post catch-all that owns bare `/blog/*`.
 */
export const listingPageHref = (base: string, page: number): string =>
  page <= 1 ? `${base}/` : `${base}/page/${page}/`;
