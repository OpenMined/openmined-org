/**
 * /rss.xml — the blog feed (replaces WordPress's /feed/).
 *
 * Newest-first, drafts excluded (same gate as the blog routes). Item links use
 * the canonical `/blog/<slug>/` from @utils/posts → postSlug. `context.site`
 * comes from astro.config.mjs → site, so links resolve to absolute URLs.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { postSlug } from '@utils/posts';
import { SITE_NAME } from '@data/site';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: `${SITE_NAME} Blog`,
    description:
      'The latest research, product, and community news from OpenMined.',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.seo?.description ?? p.data.excerpt ?? '',
      link: `/blog/${postSlug(p)}/`,
      categories: p.data.categories.map((c) => c.id),
    })),
    customData: '<language>en-us</language>',
  });
}
