/**
 * schema.ts — builds the JSON-LD `@graph` emitted by @components/JsonLd.astro.
 *
 * Kept out of the component so the graph is a pure function of its inputs: the
 * component stays a thin mount, and the node/@id conventions live in one place.
 *
 * MODELLED ON LIVE'S YOAST GRAPH (probed off openmined.org: 2026-08-12), because
 * the WordPress site is what search engines currently have on file — matching its
 * shape is what keeps rich results continuous across the cutover. Node set and
 * `@id` idiom are Yoast's:
 *
 *   <site>/#website            WebSite        (site-wide)
 *   <site>/#organization       Organization   (site-wide, the publisher)
 *   <site>/#/schema/logo/image/ ImageObject   (the org logo)
 *   <url>                      WebPage        (every page — bare URL is the @id)
 *   <url>#primaryimage         ImageObject    (when the page has an image)
 *   <url>#breadcrumb           BreadcrumbList
 *   <url>#article              Article        (posts only)
 *   <site>/#/schema/person/<id> Person        (post authors)
 *
 * Deliberate departures from live, both improvements rather than parity gaps:
 *   - `sameAs` on Organization (live omits it) — the primary knowledge-panel
 *     signal, and we have canonical profile URLs in @data/site.mjs.
 *   - The SearchAction targets our real /search/ route rather than WordPress's
 *     `/?s=` query form.
 *   - No `commentCount` / `CommentAction` — this site has no comments, so live's
 *     `commentCount: 0` would be a claim about a feature that doesn't exist.
 */

/** A post author, as far as the graph is concerned. */
export interface SchemaAuthor {
  name: string;
  /** Author-archive id → /blog/author/<id>/ and the Person `@id`. */
  id?: string;
  bio?: string;
  /** Root-relative or absolute image path; skipped if neither. */
  avatar?: string;
}

/** One crumb. The final crumb (the current page) carries no `item`, per Yoast. */
export interface Breadcrumb {
  name: string;
  /** Absolute URL. Omit on the current-page crumb. */
  item?: string;
}

export interface GraphInput {
  /** Canonical origin, no trailing slash (e.g. https://openmined.org). */
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  /** Absolute URL of the organization logo. */
  orgLogo: string;
  /** Canonical profile URLs for the organization. */
  sameAs?: string[];
  /** Absolute canonical URL of THIS page. */
  url: string;
  /** Page name — the composed <title>, brand suffix included (WebPage.name). */
  name: string;
  /**
   * Article.headline — the BARE title, no brand suffix. Live splits these the
   * same way: WebPage.name carries "… – OpenMined" while Article.headline is the
   * post title alone (verified 2026-08-12). Keeping the suffix out matters —
   * headline is what Google renders in an article rich result, and it eats into
   * the ~110-character budget before truncation. Falls back to `name`.
   */
  headline?: string;
  description?: string;
  /** Absolute URL of the page's primary image, if any. */
  image?: string;
  type?: 'website' | 'article';
  breadcrumbs?: Breadcrumb[];
  /** ISO 8601. */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: SchemaAuthor[];
  keywords?: string[];
  articleSection?: string[];
  inLanguage?: string;
}

type Node = Record<string, unknown>;

/** Absolutize a root-relative path; pass through anything already absolute. */
const abs = (path: string, siteUrl: string): string =>
  /^https?:\/\//i.test(path) ? path : `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;

/**
 * Stable Person `@id`. Yoast hashes the author name; we key on the author's
 * collection id instead, which is already the stable identifier behind
 * /blog/author/<id>/ — readable, and it survives a display-name change.
 */
const personId = (siteUrl: string, author: SchemaAuthor): string =>
  `${siteUrl}/#/schema/person/${author.id ?? encodeURIComponent(author.name.toLowerCase().replace(/\s+/g, '-'))}`;

export function buildGraph(input: GraphInput): Record<string, unknown> {
  const {
    siteUrl,
    siteName,
    siteDescription,
    orgLogo,
    sameAs = [],
    url,
    name,
    headline,
    description,
    image,
    type = 'website',
    breadcrumbs = [],
    publishedTime,
    modifiedTime,
    authors = [],
    keywords = [],
    articleSection = [],
    inLanguage = 'en-US',
  } = input;

  const websiteId = `${siteUrl}/#website`;
  const orgId = `${siteUrl}/#organization`;
  const logoId = `${siteUrl}/#/schema/logo/image/`;
  const imageId = `${url}#primaryimage`;
  const breadcrumbId = `${url}#breadcrumb`;
  const articleId = `${url}#article`;

  const graph: Node[] = [];

  // --- Article (posts only), first, mirroring live's node order ---------------
  if (type === 'article') {
    const article: Node = {
      '@type': 'Article',
      '@id': articleId,
      isPartOf: { '@id': url },
      headline: headline ?? name,
      mainEntityOfPage: { '@id': url },
      publisher: { '@id': orgId },
      inLanguage,
    };
    if (authors.length === 1) {
      article.author = { '@id': personId(siteUrl, authors[0]), name: authors[0].name };
    } else if (authors.length > 1) {
      article.author = authors.map((a) => ({ '@id': personId(siteUrl, a), name: a.name }));
    }
    if (publishedTime) article.datePublished = publishedTime;
    // Yoast always emits dateModified; with no edit date it repeats datePublished.
    if (modifiedTime ?? publishedTime) article.dateModified = modifiedTime ?? publishedTime;
    if (description) article.description = description;
    if (image) {
      article.image = { '@id': imageId };
      article.thumbnailUrl = image;
    }
    if (keywords.length) article.keywords = keywords;
    if (articleSection.length) article.articleSection = articleSection;
    graph.push(article);
  }

  // --- WebPage (every page) ---------------------------------------------------
  const webPage: Node = {
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    isPartOf: { '@id': websiteId },
    inLanguage,
  };
  if (description) webPage.description = description;
  if (image) {
    webPage.primaryImageOfPage = { '@id': imageId };
    webPage.image = { '@id': imageId };
    webPage.thumbnailUrl = image;
  }
  if (publishedTime) webPage.datePublished = publishedTime;
  if (modifiedTime ?? publishedTime) webPage.dateModified = modifiedTime ?? publishedTime;
  if (breadcrumbs.length) webPage.breadcrumb = { '@id': breadcrumbId };
  graph.push(webPage);

  // --- The page's primary image ----------------------------------------------
  // No width/height: those would have to come from the source ImageMetadata, and
  // a guessed dimension is worse than an absent one (both are optional here).
  if (image) {
    graph.push({
      '@type': 'ImageObject',
      '@id': imageId,
      inLanguage,
      url: image,
      contentUrl: image,
    });
  }

  // --- Breadcrumbs ------------------------------------------------------------
  if (breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbs.map((crumb, i) => {
        const listItem: Node = { '@type': 'ListItem', position: i + 1, name: crumb.name };
        if (crumb.item) listItem.item = crumb.item;
        return listItem;
      }),
    });
  }

  // --- Site-wide: WebSite + Organization --------------------------------------
  graph.push({
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${siteUrl}/`,
    name: siteName,
    description: siteDescription,
    publisher: { '@id': orgId },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search/?q={search_term_string}`,
        },
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueRequired: true,
          valueName: 'search_term_string',
        },
      },
    ],
    inLanguage,
  });

  const organization: Node = {
    '@type': 'Organization',
    '@id': orgId,
    name: siteName,
    url: `${siteUrl}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': logoId,
      inLanguage,
      url: orgLogo,
      contentUrl: orgLogo,
      caption: siteName,
    },
    image: { '@id': logoId },
  };
  if (sameAs.length) organization.sameAs = sameAs;
  graph.push(organization);

  // --- Person nodes for post authors ------------------------------------------
  for (const author of authors) {
    const person: Node = {
      '@type': 'Person',
      '@id': personId(siteUrl, author),
      name: author.name,
    };
    if (author.bio) person.description = author.bio;
    if (author.avatar) person.image = abs(author.avatar, siteUrl);
    if (author.id) person.url = `${siteUrl}/blog/author/${author.id}/`;
    graph.push(person);
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
