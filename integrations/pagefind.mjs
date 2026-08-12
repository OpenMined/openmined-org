import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Build the Pagefind search index as part of `astro build`.
 *
 * WHY THIS IS AN INTEGRATION AND NOT AN npm SCRIPT: the index used to be a
 * second command chained after the build (`astro build && pagefind --site
 * dist/client`). That works only if every caller remembers to invoke the npm
 * script — and one that didn't (the Workers Builds deploy command) shipped a
 * site whose search silently returned nothing: `/pagefind/pagefind.js` 404s,
 * every query comes back empty, and NOTHING else about the deploy looks wrong.
 * A build step that is only correct when invoked the right way is a footgun in
 * a repo about to change hands. As an integration it runs on `astro build`
 * itself, so `astro build`, `npm run build`, and any CI or dashboard build
 * command all produce the index.
 *
 * Runs in `astro:build:done` — the last hook, after every page is on disk —
 * and indexes the build's own output directory (`dir`), so it follows the
 * adapter's client output rather than hardcoding `dist/client`.
 *
 * Uses Pagefind's Node API rather than spawning its binary: the package's
 * `exports` map is import-only and exposes no subpaths, so the binary can't be
 * resolved through `require.resolve` at all.
 *
 * Node-only by construction: build hooks run in the build process, not in
 * workerd, so filesystem access here does not violate the render-time
 * no-Node-APIs rule that applies to component/page code.
 *
 * FAILS THE BUILD if anything goes wrong. A throwing `astro:build:done` hook
 * aborts `astro build` with exit 1 (verified 2026-08-11 with a forced throw),
 * so CI and Workers Builds both stop rather than deploying. The final `access`
 * check exists because the failure this guards against is a *silent* one:
 * every step can report success while nothing lands on disk, and a missing
 * index is invisible until a user searches and gets nothing back.
 */
export default function pagefind() {
  return {
    name: 'pagefind-index',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const site = fileURLToPath(dir);
        const outputPath = path.join(site, 'pagefind');

        const pagefind = await import('pagefind');
        const { index, errors: createErrors } = await pagefind.createIndex();
        if (!index) throw new Error(`pagefind: createIndex failed — ${createErrors?.join('; ')}`);

        const { page_count, errors: addErrors } = await index.addDirectory({ path: site });
        if (addErrors?.length) throw new Error(`pagefind: ${addErrors.join('; ')}`);

        const { errors: writeErrors } = await index.writeFiles({ outputPath });
        if (writeErrors?.length) throw new Error(`pagefind: ${writeErrors.join('; ')}`);
        await pagefind.close();

        // The index is the whole point of this hook — prove it landed rather
        // than trusting the return values, since a missing index is invisible
        // until a user searches and gets nothing.
        const entry = path.join(outputPath, 'pagefind.js');
        try {
          await access(entry);
        } catch {
          throw new Error(`pagefind: index missing at ${entry} after write — search would ship broken`);
        }

        logger.info(`indexed ${page_count} pages → ${path.relative(process.cwd(), outputPath)}`);
      },
    },
  };
}
