#!/usr/bin/env node
/**
 * audit-headers — the built `_headers` must still be parseable and complete.
 *
 * WHY THIS EXISTS
 * Every way this file breaks is SILENT. A missing response header changes
 * nothing on the page: no error, no visual difference, no failing build. The
 * only way to notice is to look, which is exactly the property that earns a
 * guard here (same reasoning as audit-image-urls: the build stayed green, the
 * dev server was fine, and nothing failed).
 *
 * Three specific silent failures, each seen or reasoned from the adapter source:
 *
 *   1. SUPPRESSED CACHE-CONTROL INJECTION. The adapter merges its own
 *      `/_astro/*` immutable Cache-Control block into this file at build — but
 *      first it probes for a Cache-Control on any rule matching `/_astro/probe`.
 *      `/*` compiles to `^.*$`, so it matches. On a hit the adapter skips its
 *      injection entirely and says so only at DEBUG level, so a normal build
 *      looks completely clean while a year of immutable asset caching quietly
 *      disappears. (@astrojs/cloudflare/dist/utils/headers.js.)
 *   2. INDENTED COMMENTS. Indentation is the only thing separating a header line
 *      from a path line, and Cloudflare's documented syntax shows `#` only at
 *      column 0 — so an indented comment sits in header position. A parser that
 *      doesn't special-case it reads a malformed header instead of skipping.
 *   3. A DROPPED HEADER. Any hand-edit, or a future adapter version changing its
 *      merge behavior, can remove one without a trace.
 *
 * WHAT IT CHECKS
 *   • the adapter's `/_astro/*` Cache-Control block survived, and is immutable
 *   • no rule outside that block sets Cache-Control on an `/_astro/*` path
 *     (the CAUSE of failure 1, reported separately from its symptom so the
 *     error names the edit to undo)
 *   • every comment sits at column 0
 *   • a floor of security header NAMES is present on a rule covering all pages
 *   • Cloudflare's documented limits: ≤100 rules, ≤2000 chars per line
 *
 * It deliberately asserts header NAMES, never VALUES. `public/_headers` owns the
 * values (one fact, one home) — pinning them here would fork that and would go
 * red on a deliberate change, e.g. relaxing X-Frame-Options for a partner embed.
 * The list below is a FLOOR: adding a header needs no change here, removing one
 * fails. It does not, and cannot, check that Cloudflare actually APPLIES the
 * file at runtime — that is the `_headers` row in smoke-deploy.mjs, which needs
 * a live host.
 *
 * Usage:  npm run audit:headers [-- dist-dir]
 * Exit 1 on any failure, so it can gate CI or a deploy. Runs against the build
 * output, so `npm run build` must have run first.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] || 'dist/client');
const HEADERS_PATH = join(ROOT, '_headers');

/** Minimum header names that must cover every page. A floor, not the full set. */
const REQUIRED = [
  'x-content-type-options',
  'referrer-policy',
  'content-security-policy',
  'x-frame-options',
  'permissions-policy',
  'cross-origin-opener-policy',
];

const MAX_RULES = 100;
const MAX_LINE = 2000;

if (!existsSync(HEADERS_PATH)) {
  console.error(`✗ no _headers in the build output: ${HEADERS_PATH}`);
  console.error(`  Expected public/_headers to be copied to dist/client at build.`);
  console.error(`  Run \`npm run build\` first, or pass the dist path as an argument.`);
  process.exit(1);
}

const raw = readFileSync(HEADERS_PATH, 'utf8');
const lines = raw.split('\n');
const errors = [];

/** Cloudflare pattern → regex. Mirrors the adapter's own translation. */
const patternToRegex = (pattern) => {
  let out = '';
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === '*') {
      out += '.*';
      i++;
    } else if (ch === ':' && /[A-Za-z]/.test(pattern[i + 1] ?? '')) {
      i++;
      while (i < pattern.length && /\w/.test(pattern[i])) i++;
      out += '[^/]+';
    } else {
      out += ch.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      i++;
    }
  }
  return new RegExp(`^${out}$`);
};

// ── Parse into rules, checking syntax as we go ──────────────────────────────
const rules = []; // { pattern, headers: Map<lowername, value>, line }
let current = null;

lines.forEach((rawLine, idx) => {
  const n = idx + 1;
  const trimmed = rawLine.trim();

  if (rawLine.length > MAX_LINE) {
    errors.push(`line ${n}: ${rawLine.length} chars exceeds Cloudflare's ${MAX_LINE}-char limit`);
  }
  if (!trimmed) return;

  const indented = /^\s/.test(rawLine);

  if (trimmed.startsWith('#')) {
    // Failure 2: a comment in header position.
    if (indented) {
      errors.push(
        `line ${n}: indented comment — comments must start at column 0, or Cloudflare reads ` +
          `this as a header line. Move it above the rule block.\n      ${trimmed.slice(0, 72)}`,
      );
    }
    return;
  }

  if (!indented) {
    current = { pattern: trimmed.replace(/^https?:\/\/[^/]+/, ''), headers: new Map(), line: n };
    rules.push(current);
    return;
  }

  const m = trimmed.match(/^(!?\s*[A-Za-z0-9-]+)\s*:?(.*)$/);
  if (!m) {
    errors.push(`line ${n}: indented line is not a \`Name: value\` header\n      ${trimmed.slice(0, 72)}`);
    return;
  }
  if (!current) {
    errors.push(`line ${n}: header with no preceding path rule\n      ${trimmed.slice(0, 72)}`);
    return;
  }
  current.headers.set(m[1].trim().toLowerCase().replace(/^!\s*/, ''), m[2].trim());
});

if (rules.length > MAX_RULES) {
  errors.push(`${rules.length} rules exceeds Cloudflare's ${MAX_RULES}-rule limit`);
}

// ── Failure 1: the adapter's immutable asset caching ────────────────────────
const ASSET_PROBE = '/_astro/probe';
const assetRules = rules.filter((r) => {
  try {
    return patternToRegex(r.pattern).test(ASSET_PROBE);
  } catch {
    return false;
  }
});

const immutableRule = assetRules.find((r) => (r.headers.get('cache-control') || '').includes('immutable'));

if (!immutableRule) {
  errors.push(
    `no immutable Cache-Control covers ${ASSET_PROBE} — the adapter's injection is missing.\n` +
      `      The adapter SKIPS it (debug-level log only) when this file already sets\n` +
      `      Cache-Control on a matching rule. Remove any Cache-Control from a broad\n` +
      `      block like \`/*\` and rebuild; see the footgun note in public/_headers.`,
  );
}

// The cause, reported separately from the symptom above.
for (const r of assetRules) {
  if (r === immutableRule) continue;
  if (r.headers.has('cache-control')) {
    errors.push(
      `rule \`${r.pattern}\` (line ${r.line}) sets Cache-Control and matches ${ASSET_PROBE}.\n` +
        `      This is what suppresses the adapter's immutable-asset injection. Scope the\n` +
        `      pattern so it cannot match /_astro/*, or drop the Cache-Control.`,
    );
  }
}

// ── Failure 3: the security-header floor, on a rule covering every page ─────
const PAGE_PROBES = ['/', '/blog/', '/pysyft/', '/donate/thank-you/'];
const covering = rules.filter((r) => {
  try {
    const re = patternToRegex(r.pattern);
    return PAGE_PROBES.every((p) => re.test(p));
  } catch {
    return false;
  }
});

const present = new Set(covering.flatMap((r) => [...r.headers.keys()]));
const missing = REQUIRED.filter((h) => !present.has(h));

if (!covering.length) {
  errors.push(
    `no rule covers every page (probed ${PAGE_PROBES.join(', ')}), so no security\n` +
      `      header reaches the whole site. Expected a \`/*\` block.`,
  );
} else if (missing.length) {
  errors.push(
    `${missing.length} required header(s) missing from the site-wide rule:\n` +
      missing.map((h) => `        ${h}`).join('\n'),
  );
}

// ── Report ─────────────────────────────────────────────────────────────────
if (!errors.length) {
  const headerCount = covering.reduce((a, r) => a + r.headers.size, 0);
  console.log(
    `✓ _headers clean — ${rules.length} rule(s), ${headerCount} site-wide header(s), ` +
      `all ${REQUIRED.length} required present, immutable asset caching intact`,
  );
  process.exit(0);
}

console.error(`\n✗ ${errors.length} problem(s) in ${HEADERS_PATH}:`);
for (const e of errors) console.error(`    • ${e}`);
console.error(
  `\n  Edit public/_headers (the source) — dist/client/_headers is generated from it\n` +
    `  plus the adapter's injected asset-caching block.\n`,
);
process.exit(1);
