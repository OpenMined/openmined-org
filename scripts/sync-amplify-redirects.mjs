#!/usr/bin/env node
/**
 * sync-amplify-redirects — push the built redirect set to AWS Amplify.
 *
 * WHY: Amplify does not read `_redirects` (a Cloudflare format), and with the
 * Cloudflare adapter present Astro emits NO meta-refresh fallback pages for
 * `redirects.mjs` entries either — so on the Amplify host a redirect exists
 * ONLY as an app-level custom rule. Without this step, a redirect merged in
 * code silently does nothing until someone re-ports the rules by hand. Wired
 * into the build (amplify.yml → postBuild) for the same reason the Pagefind
 * index is an integration: a sync no build can skip cannot be forgotten.
 *
 * WHAT: parses `dist/client/_redirects` — the MERGED file (public/_redirects
 * plus everything the adapter derives from redirects.mjs), so the two source
 * registries keep their existing single-source-of-truth roles — converts
 * Cloudflare splats (`*` → `<*>`), and rebuilds the COMPLETE rule set
 * deterministically:
 *
 *   1. the www → apex 301 (domain-qualified; see the not-honored caveat at
 *      the constant)
 *   2. the main-default-domain → apex 301 (closes LAUNCH.md §3's duplicate-
 *      host residual; same not-honored caveat)
 *   3. the /api/create-donation 200-proxy (the Lambda dynamic tier — see
 *      aws/create-donation/README.md; this script is the rule's home)
 *   4. every parsed redirect, file order preserved (first match wins on both
 *      platforms)
 *   5. the /404.html catch-all (`404-200` = in-place true 404), always last
 *
 * Idempotent: no-ops when the stored rules already match. Runs from
 * .github/workflows/sync-redirects.yml on pushes to staging (flip to main at
 * cutover, see LAUNCH.md) — NOT from the Amplify build: builds only get AWS
 * credentials via an app service role, whose mere presence silently disables
 * PR preview creation (verified 2026-08-14). Rules are app-wide, so nothing
 * PR-triggered may ever run this.
 *
 * Local run (needs OpenMined-account AWS creds + a fresh `npm run build`):
 *   node scripts/sync-amplify-redirects.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const APP_ID = process.env.AWS_APP_ID || 'd1otfqlvqd3jby';
const REGION = process.env.AWS_REGION || 'us-west-1';

// ⚠ The two domain-qualified rules below are emitted but NOT currently
// honored: Amplify does not match domain-qualified custom rules for
// branch-mapped hosts (measured at cutover 2026-08-17 — both documented rule
// forms tested; a path rule in the same update fired in seconds while these
// never matched; www and main's branch domain serve 200). Kept because they
// are the documented AWS form and self-activate if the platform ever honors
// them. Operative mitigations: per-page canonicals to the apex + the GSC
// watch; untried lead: the console's domain-management redirect toggle.
// HOSTING.md → Routing and LAUNCH.md §3 hold the full record.
//
// www → apex 301, path-preserving (live parity: WordPress emitted this).
const WWW_REDIRECT = {
  source: 'https://www.openmined.org/<*>',
  target: 'https://openmined.org/<*>',
  status: '301',
};
// main's own default domain serves the same artifact as openmined.org — an
// indexable full-site duplicate (LAUNCH.md §3's residual). Same not-honored
// caveat as above; staging and pr-N subdomains are different hosts and would
// be unaffected either way.
const MAIN_DOMAIN_REDIRECT = {
  source: 'https://main.d1otfqlvqd3jby.amplifyapp.com/<*>',
  target: 'https://openmined.org/<*>',
  status: '301',
};
const DONATE_PROXY = {
  source: '/api/create-donation',
  target: 'https://fsjjiho8ec.execute-api.us-west-1.amazonaws.com/api/create-donation',
  status: '200',
};
// Status '404-200' is Amplify's IN-PLACE variant: serve the target's content
// at the requested URL with a true HTTP 404 — exactly the HOSTING.md routing
// contract. Plain '404' is NOT that: it 301s to /404.html which then answers
// 200 — the soft-404 the smoke `unknown path → true 404` row exists to catch.
// Both verified empirically against the live app 2026-08-14.
const CATCH_ALL = { source: '/<*>', target: '/404.html', status: '404-200' };

const redirectsFile = new URL('../dist/client/_redirects', import.meta.url);
let text;
try {
  text = readFileSync(redirectsFile, 'utf8');
} catch {
  console.error('sync-amplify-redirects: dist/client/_redirects not found — run the build first.');
  process.exit(1);
}

const rules = [WWW_REDIRECT, MAIN_DOMAIN_REDIRECT, DONATE_PROXY];
const seen = new Set([WWW_REDIRECT.source, MAIN_DOMAIN_REDIRECT.source, DONATE_PROXY.source]);
for (const raw of text.split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const parts = line.split(/\s+/);
  if (parts.length !== 3 || !/^\d{3}$/.test(parts[2])) {
    // A line this file's two writers (public/_redirects + the adapter) never
    // produce — surface it loudly rather than silently dropping a redirect.
    console.error(`sync-amplify-redirects: unparseable line, refusing to continue: "${line}"`);
    process.exit(1);
  }
  const source = parts[0].replace(/\*/g, '<*>');
  if (seen.has(source)) continue; // first match wins, as on the host
  seen.add(source);
  rules.push({ source, target: parts[1], status: parts[2] });
}
rules.push(CATCH_ALL);

const aws = (args) =>
  execFileSync('aws', [...args, '--region', REGION], { encoding: 'utf8' });

// Canonical per-rule key — the stored JSON's object-key order is not ours.
const key = (r) => `${r.source} ${r.target} ${r.status}`;
const current = JSON.parse(
  aws(['amplify', 'get-app', '--app-id', APP_ID, '--query', 'app.customRules', '--output', 'json']) || '[]',
);
if (current.length === rules.length && current.every((r, i) => key(r) === key(rules[i]))) {
  console.log(`sync-amplify-redirects: already in sync (${rules.length} rules).`);
  process.exit(0);
}

const tmp = join(tmpdir(), `amplify-rules-${process.pid}.json`);
writeFileSync(tmp, JSON.stringify(rules));
aws(['amplify', 'update-app', '--app-id', APP_ID, '--custom-rules', `file://${tmp}`, '--query', 'app.name', '--output', 'text']);
console.log(`sync-amplify-redirects: applied ${rules.length} rules (was ${current.length}).`);
