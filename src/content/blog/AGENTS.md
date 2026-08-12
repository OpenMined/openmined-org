# Blog content — authoring & editing contract

Guidance for humans and AI agents editing posts in this directory. Not loaded as
a collection entry (the loader only globs `**/index.{md,mdx}`).

## Layout

One **page bundle per post**: `<dir>/index.md` (or `.mdx`) plus its co-located
`cover.*` and body images. The directory name is **cosmetic** — see slug rules.

The layout is **flat today** (`<slug>/index.md`). It may later be grouped into
subfolders (e.g. `<year>/<slug>/index.md`); the glob loader recurses, so nesting
"just works". Because the URL comes from the `slug` field (below), a move is a
pure `git mv` with no URL change. **After moving files, do a clean build**
(`rm -rf .astro dist && npm run build`) so the content-layer cache re-resolves
co-located images — a stale cache otherwise throws `ImageNotFound`.

## Frontmatter contract

The authoritative schema is `src/content.config.ts → blog collection` (Zod —
required/optional fields, defaults). Don't restate it here; read it there. The
conventions that the schema alone doesn't make obvious:

- **`slug`** — the authoritative public URL: `/blog/<slug>/`. Decoupled from the
  folder, so posts stay move-safe. **Preserve verbatim from live** (URLs are
  indexed). It's also the stable handle for inbound links and for locating a post
  in an edit. Resolved in the routes via `@utils/posts → postSlug` (falls back to
  the path-derived id when unset). One home for the rule: that helper.
- **`draft`** — publish gate. Drafts render in dev, are excluded from prod builds.
  **Publish by flipping `draft: false`, never by moving files.**
- **`categories`** — an array (posts may be filed under several, e.g.
  `[research, policy]`); the first is primary (listing/related card label). The
  post header meta shows *categories*, not tags.
- **`tags`** — finer topics; shown in the end-of-post foot, not the header meta.
- Presentation flags map 1:1 from live ACF: `subtitle` (deck), `headerDownsize`
  (1|2 — shift in-content heading levels down), `hideDefaultForm` (suppress the
  end-of-post CTA), `titleMax` (h1 cap), `toc`, `location`. See the schema.
- **`sectionSpacing`** (`default` | `spacious`, default `default`) — the one
  presentation flag with no live ACF counterpart. `spacious` gives every h2
  generous whitespace above it, to separate sections visually in a LONG read;
  h3–h6 are unaffected. An editorial call per post, not a property of the
  content — set it because the post is long enough to need the air, not because
  it has many headings.

## Rich blocks in a Markdown body (media, tabs, columns, …)

Post bodies are **`.md`, not `.mdx`** — so you **cannot import/use an Astro
component** in them. Anything richer than bare prose is authored as **raw HTML
with classes + `data-*` hooks**; styling lives in `@styles/global.css` and any
behavior is wired by a **global initializer in `layouts/Base.astro`** that runs
on every page (same pattern as the HubSpot form loader). This is why a block
works identically whether it came from the `@ui`/`@elements` component (on a
`.astro` page) or from hand-authored HTML here.

**The one rule that makes it work — blank-line isolation.** CommonMark treats a
block-level HTML tag (`<div>`, `<figure>`, …) on its own line as an *HTML block*
that ends at the next blank line. So Markdown placed **between** a block tag and
its close — separated by blank lines — is parsed as Markdown, while the wrapper
passes through untouched:

```
<figure class="…">

![alt](./media/x.png)     ← parsed as Markdown → optimized by the image service

<figcaption>Caption</figcaption>
</figure>
```

Without the blank lines the image stays a literal string and is **not**
optimized. This nests (e.g. tabs → panels → Markdown), as long as every raw tag
and every Markdown block is blank-line-separated.

**Media specifics:**
- **Images** — co-locate in `<slug>/media/`, reference **relatively as Markdown**
  `![alt](./media/x.png)`. Only Markdown image syntax is optimized (webp,
  responsive, hashed); a relative `src` in a raw `<img>` is shipped verbatim and
  404s. If you must use a `<figure>`, put the image as blank-line-isolated
  Markdown inside it (above).
- **Video** — Astro copies only *image* references from a bundle, so a relative
  `<video src="./media/…">` 404s. Put the file in `public/blog/<slug>/<name>.mp4`
  and reference it **absolutely**: `<video src="/blog/<slug>/x.mp4" autoplay loop
  muted playsinline></video>`. Ship motion as mp4, not GIF.

**Tabs** (segmented control; styling `global.css → .tabs`, behavior the
`[data-tabs]` initializer in `Base.astro`). Emit this shape — `data-base` must be
unique per block; panels are direct children of `.tabs__panels`, in tab order:

```
<div class="tabs tabs--center tabs--card" data-tabs data-base="my-steps" data-initial="0">
<div class="tabs__list" role="tablist" aria-label="…">
<button type="button" class="tabs__tab" role="tab">Tab A</button>
<button type="button" class="tabs__tab" role="tab">Tab B</button>
</div>
<div class="tabs__panels">

<div>

![alt](./media/a.png)     ← blank-line-isolated Markdown; lists/prose work too

Panel A prose.

</div>

<div>

Panel B prose.

</div>

</div>
</div>
```

Variants (compose on the container): `tabs--center` centers the selector (panel
content stays left-aligned); `tabs--card` wraps the whole selector + active panel
in one raised card; `tabs--bordered` renders square outlined tabs on a baseline
with the active tab filled solid (the live "folder-tab" look). Panels render
**all-visible without JS** (graceful); the initializer hides inactive ones and
adds ARIA + arrow-key nav. Two posts use this — ai-audit-part-1 (`tabs--card`
stepper) and the RAG tutorial (`tabs--bordered` code toggles) — grep `data-tabs`
for live examples.

## Finding / navigating posts

There is **no generated index or manifest, by design** — content is canonical, and
a committed index would be a stale mirror. The Astro collection *is* the index:

- In code: `getCollection('blog')` → filter/sort on frontmatter (e.g. sort by
  `data.date`; ordering is otherwise non-deterministic).
- Ad hoc: fuzzy-find by the slug-named directory, or `grep` frontmatter
  (`slug:`, `legacyId:`, `title:`) across this tree.

## Authoring a new post

Create `<slug>/index.md` and write it. There is no generator and none is needed —
the schema is small enough to author by hand, and the surrounding 371 posts are
the reference for anything ambiguous (`grep` for a field to see it used).

**Four fields are required** (`src/content.config.ts → blog collection` is
authoritative; everything else is optional or defaulted):

| Field | Note |
|---|---|
| `title` | |
| `date` | publish date; drives all ordering |
| `categories` | array, ≥1 — the first is primary |
| `authors` | array, ≥1 |

Set `slug` too whenever the URL should differ from the directory name, and
always on a post migrated from elsewhere (see the slug rule above).

**References must already exist.** `categories`, `tags`, and `authors` are
`reference()` fields — the build **fails** on an id that isn't in its registry,
which is the intended behavior (a typo'd author is caught at build, not in
production). So before writing the post:

- **New author** → add an entry to `src/data/people.json`. Also the place for
  their avatar, role, bio, and links; the byline and `/blog/author/<id>/` archive
  both read from it. A first-time author creates a **new public archive route**.
- **New tag** → add to `src/data/tags.json`.
- **New category** → add to `src/data/categories.json` with its description,
  accent, and people. Categories are the curated blog nav, not a free-form label
  — adding one changes site navigation, so it's a deliberate call.

**Cover image.** Optional. Co-locate it in the post's directory and point `cover:`
at it relatively; it goes through Astro's image service (`cover` is an `image()`
field, so a missing file is a build error, not a broken page). Set `coverAlt`.
Posts without a cover render fine — listing cards fall back to a placeholder.
After adding co-located images, do a clean build (see Layout above).

**Publish** by flipping `draft: false`. Drafts render in dev and are excluded
from production builds.

Finally: prefer the smallest frontmatter that works. Most presentation flags
exist to reproduce a specific live post's layout — a new post should generally
set none of them.
