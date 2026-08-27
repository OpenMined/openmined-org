// `z` is imported from zod directly: astro:content's re-export is deprecated in
// Astro 7. defineCollection/reference still come from astro:content.
import { defineCollection, reference } from 'astro:content';
import { z } from 'zod';
import { glob, file } from 'astro/loaders';

const organizations = defineCollection({
  loader: file('./src/data/organizations.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    monochrome: z.boolean().optional(),
    url: z.url().optional(),
    roles: z.array(z.string()).default([]),
  }),
});

const people = defineCollection({
  loader: file('./src/data/people.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    links: z.object({
      x: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      site: z.url().optional(),
    }).partial().default({}),
    roles: z.array(z.enum(['author', 'team', 'advisor', 'alumni'])).default([]),
    org: z.string().optional(), // id reference to organizations
  }),
});

const categories = defineCollection({
  loader: file('./src/data/categories.json'),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    people: z.array(z.string()).default([]), // id references to people
    cover: z.string().optional(),
    accent: z.string().optional(),
    featured: z.string().optional(), // slug of featured blog post for this category archive
    // What fills the archive header's LEFT/hero column: the featured post
    // (default), or this category's `team` block (people + description) with no
    // featured post at all (e.g. /blog/category/policy/).
    headerLeft: z.enum(['featured', 'team']).default('featured'),
    // Right-rail widgets for the archive header (left column = featured post).
    // An ordered list; each category picks what its rail shows (live: product →
    // "Solutions & Resources" tags, community → "Popular Tags", policy → team).
    // Omit for no rail (single-column header).
    rail: z.array(z.discriminatedUnion('type', [
      // Titled list of tag links → /blog/tag/<id>/ (rendered by PopularTopics).
      z.object({ type: z.literal('tags'), title: z.string(), tags: z.array(z.string()) }),
      // Team block — reuses this category's `people` + `description`.
      z.object({ type: z.literal('team'), title: z.string().optional() }),
    ])).optional(),
  }),
});

const tags = defineCollection({
  loader: file('./src/data/tags.json'),
  schema: z.object({
    id: z.string(),
    label: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/index.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // Explicit public URL slug → `/blog/<slug>/`. Decouples the URL from the
    // file's folder: the post can live anywhere under src/content/blog/ (flat
    // today; a `<year>/` subfolder later) without the URL changing. Falls back
    // to the path-derived id when unset (see @utils/posts → postSlug). Also the
    // stable handle for inbound links + AI edits — preserve verbatim from live.
    slug: z.string().optional(),
    // Optional deck / standfirst under the title (live ACF `post_subtitle`,
    // rendered as the muted h4 in `.article-single__head`). Surfaced in the
    // post hero between the h1 and the meta row; omitted when unset.
    subtitle: z.string().optional(),
    excerpt: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Live posts may be filed under several categories (e.g. research + policy).
    // Stored in display order; the first is treated as primary (listing/related
    // card label, "shares a category" related logic). All appear in the post
    // header meta row and the end-of-post foot.
    categories: z.array(reference('categories')).min(1),
    tags: z.array(reference('tags')).default([]),
    // Optional post "Location" — surfaced in the end-of-post meta foot (live
    // "Location: …"). Free text; the row is omitted when unset.
    location: z.string().optional(),
    // Live ACF `hide_default_form` — suppresses the default end-of-post
    // newsletter CTA on this post's template.
    hideDefaultForm: z.boolean().default(false),
    // Live ACF `header_downsize` (1 or 2) — shifts in-content prose headings
    // down 1 or 2 levels (see `.prose.downsize-N` in typography.css). 0 = off.
    headerDownsize: z.coerce.number().int().min(0).max(2).default(0),
    // Space above in-content h2s. 'spacious' gives every h2 the full break
    // (--spacing-full) instead of the default brand spacing — for LONG posts,
    // where the extra air separates sections visually. Editorial choice per
    // post, not derived from live. Named to match the site's spacing-preset
    // vocabulary, where 'spacious' already means --spacing-full
    // (`SimpleHero.padTop`). See `.prose.spacious-sections` in global.css.
    sectionSpacing: z.enum(['default', 'spacious']).default('default'),
    authors: z.array(reference('people')).min(1),
    cover: image().optional(),
    coverAlt: z.string().default(''),
    // Live ACF `app_hide_featured_image_on_single` — hides the cover in the post
    // hero (the cover is still used for the listing/related card).
    hideCover: z.boolean().default(false),
    // Text color over the cover on listing cards (PostCard) and the featured
    // panel (BlogFeatured) — both overlay text on the cover image. Optional (no
    // schema default) so each surface defaults for itself when a post doesn't
    // set it (both currently default 'light'). Set explicitly from live ACF
    // `app_change_text_color` (white→light, black→dark).
    // NOTE: which post is *featured* is a property of the LISTING, not the post —
    // see blog.json (main listing) and categories.json `featured` (archives).
    cardText: z.enum(['light', 'dark']).optional(),
    // Optional per-post title cap (px). Overrides --h1-max on the post <h1> so a
    // long title can use a smaller desktop size (see the "Custom heading sizes"
    // convention). The 36px mobile floor (--h1-min) and fluid clamp rate stay
    // automatic — values at/below 36 render a flat 36px title. Live set custom
    // per-post title sizes; we snap those to this max, flooring at 36px.
    titleMax: z.number().optional(),
    // Hand-picked "Continue reading" posts, by public slug, display order.
    // Overrides the computed set (shares-a-category, newest first) when set.
    // The row is a 2-up — entries past the first two are ignored. A slug that
    // matches no visible post fails the build (typo guard, same philosophy as
    // @utils/posts → postHref).
    related: z.array(z.string()).default([]),
    toc: z.boolean().default(false),
    tocMinDepth: z.number().default(2),
    tocMaxDepth: z.number().default(3),
    draft: z.boolean().default(false),
    // Live-but-hidden. The post builds at /blog/<slug>/ (unlike `draft`, which
    // doesn't build in production at all) but is excluded from every discovery
    // surface: listings and archives, the RSS feed, the sitemap
    // (astro.config.mjs → sitemap filter), site search (Pagefind), and engines
    // (robots noindex via BlogPost → Page → Base). For embargoed posts that
    // need a shareable production URL before announcement — e.g. a partner
    // linking to the post from their own launch. Publish by deleting the flag.
    unlisted: z.boolean().default(false),
    legacyId: z.number().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { organizations, people, categories, tags, blog };
