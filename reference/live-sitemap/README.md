# Live sitemap baseline (capture)

Raw copy of the **WordPress (Yoast) sitemaps**, captured off production so there
is a frozen, mechanical **diff source-of-truth for URL parity at cutover**.
These are the canonical URLs search engines have on file.

Consumed by the route-parity line in `LAUNCH.md`'s cutover checklist. **It
cannot be re-created after cutover** — once the origin repoints off WordPress,
these URLs are gone from the live site. That's why the capture travels with the
code.

- **Captured:** 2026-07-22, from `https://openmined.org/sitemap_index.xml` + its
  7 children (verbatim, unmodified).
- **Re-capture before cutover if the live site changed:** refetch the same 8
  URLs. This capture is a floor, not a ceiling.
- This is a *baseline artifact*, not code — do not edit the `.xml` files by hand.
- **Delete this directory after cutover** — it has no purpose once parity is
  confirmed.

## Files & counts (at capture)

| File | URLs | What |
|---|---:|---|
| `sitemap_index.xml` | 7 | Yoast index → the 7 children below |
| `post-sitemap.xml` | 368 | Blog posts |
| `page-sitemap.xml` | 38 | **Pages** — the authoritative page-parity checklist |
| `category-sitemap.xml` | 7 | Blog category archives |
| `post_tag-sitemap.xml` | 32 | Blog tag archives |
| `locations-sitemap.xml` | 6 | Location taxonomy archives (AU/EU/UK/USA/SG/IN) |
| `resources-sitemap.xml` | 1 | `resources` CPT (1 entry) |
| `resource_type-sitemap.xml` | 1 | `resources` taxonomy |

## Notes for the diff

Two counts here look like gaps and are not. Read these before chasing either.

- **Posts: 368 here vs 371 published vs 371 built.** Yoast omits `noindex`'d
  posts from the sitemap, so the 3-post delta is almost certainly
  published-but-noindex posts that still get built — coverage is a *superset*,
  not a gap. Blog URL parity was separately proven 1:1 on 2026-07-22 (371/371
  matching `/blog/<slug>/`).
- **No `author-sitemap.xml`.** Yoast excludes author archives from sitemaps
  entirely, so their absence here says nothing about whether they exist. They do
  — `/blog/author/<slug>/` archives are built, including redirect aliases for
  legacy author slugs. Verify them separately; this capture can't.

`page-sitemap.xml` (38) is the list to diff against built routes plus
redirects, confirming every live page resolves either directly or via a 301. It
was deliberately not run at capture time because the page set was still in flux.
