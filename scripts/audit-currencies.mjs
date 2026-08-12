/**
 * audit-currencies — watch the donation currency list for drift from Stripe.
 *
 *   npm run audit:currencies
 *   npm run audit:currencies -- --strict     # also fail when no key is available
 *
 * WHY this exists: `@data/donation.mjs → CURRENCIES` is a MIRROR of Stripe, not a
 * local preference list. The live WordPress site fetched it per modal-open via a
 * `get_supported_currencies` AJAX action that proxied Stripe (~0.5–0.8s of upstream
 * latency, which is why we ship it statically instead). Because the upstream is
 * Stripe and not WordPress, it does NOT stop changing at cutover — and nothing
 * else in the repo would notice if it did.
 *
 * Drift is asymmetric, so the two directions are reported separately:
 *   in Stripe, not ours  → currencies a donor could have used and we never offered
 *   in ours, not Stripe  → a live dead end: the <select> offers it, Stripe rejects
 *                          the session, /api/create-donation returns 502
 *
 * The account's country is DISCOVERED rather than assumed — presentment support is
 * a function of the Stripe account's country, so hardcoding one would quietly audit
 * against the wrong spec.
 *
 * Also self-checks `toStripeAmount()` against Stripe's documented minor-unit rules,
 * which is the only coverage the zero-decimal branch has (the browser test in
 * verify-donate.mjs only exercises USD→EUR, and both are ×100).
 *
 * Read-only: two authenticated GETs, no writes, no charges. A test key is fine —
 * country specs are platform data and identical in both modes.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRENCIES, ZERO_DECIMAL, toStripeAmount } from '../src/data/donation.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');

/**
 * Expected minor-unit encodings, from Stripe's own tables.
 * Verified against https://docs.stripe.com/currencies: 2026-08-11.
 * ISK and UGX are the interesting rows — both transitioned to zero-decimal, but
 * Stripe's "Special cases" table requires each be sent as a two-decimal value
 * whose decimal part is always 00, so both take the ×100 path.
 */
const ENCODING_CASES = [
  { amount: 25, currency: 'USD', expect: 2500, note: 'two-decimal' },
  { amount: 25, currency: 'EUR', expect: 2500, note: 'two-decimal' },
  { amount: 25, currency: 'JPY', expect: 25, note: 'zero-decimal' },
  { amount: 1000, currency: 'KRW', expect: 1000, note: 'zero-decimal' },
  { amount: 1000, currency: 'XOF', expect: 1000, note: 'zero-decimal' },
  { amount: 5, currency: 'ISK', expect: 500, note: 'special case — two-decimal, always 00' },
  { amount: 5, currency: 'UGX', expect: 500, note: 'special case — two-decimal, always 00' },
  { amount: 5, currency: 'HUF', expect: 500, note: 'two-decimal for charges (payout-only special case)' },
  { amount: 5, currency: 'TWD', expect: 500, note: 'two-decimal for charges (payout-only special case)' },
];

/** STRIPE_SECRET_KEY from the environment, else the local .dev.vars line. */
function readKey() {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();
  try {
    const line = readFileSync(join(ROOT, '.dev.vars'), 'utf8')
      .split('\n')
      .find((l) => l.trim().startsWith('STRIPE_SECRET_KEY='));
    return line?.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') ?? null;
  } catch {
    return null;
  }
}

async function stripe(path, key) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Stripe ${path} → ${res.status}: ${body?.error?.message ?? 'unknown error'}`);
  return body;
}

/**
 * Secondary source, available only until the WordPress site is retired. Never
 * fatal — after cutover it is expected to fail, and Stripe is the real check.
 */
async function liveWordpressList() {
  try {
    const res = await fetch(
      'https://openmined.org/wp-admin/admin-ajax.php?action=get_supported_currencies',
      { signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) return null;
    const body = await res.json();
    return Array.isArray(body?.data) ? body.data.map((c) => c.toUpperCase()) : null;
  } catch {
    return null;
  }
}

const diff = (a, b) => {
  const B = new Set(b);
  return a.filter((c) => !B.has(c));
};

let failed = false;

// ── 1. Amount encoding ────────────────────────────────────────────────────────
const encodingFails = ENCODING_CASES.filter((c) => toStripeAmount(c.amount, c.currency) !== c.expect);
if (encodingFails.length) {
  failed = true;
  console.error(`✗ toStripeAmount: ${encodingFails.length}/${ENCODING_CASES.length} case(s) wrong\n`);
  for (const c of encodingFails) {
    console.error(`  ${c.amount} ${c.currency} → ${toStripeAmount(c.amount, c.currency)}, expected ${c.expect}  (${c.note})`);
    console.error(`    fix: ${c.expect === c.amount ? 'add' : 'remove'} '${c.currency}' ${c.expect === c.amount ? 'to' : 'from'} ZERO_DECIMAL in src/data/donation.mjs\n`);
  }
} else {
  console.log(`✓ amount encoding — ${ENCODING_CASES.length}/${ENCODING_CASES.length} cases match Stripe's minor-unit rules`);
}

// Every zero-decimal code must actually be offerable, or the branch is unreachable.
const orphans = [...ZERO_DECIMAL].filter((c) => !CURRENCIES.includes(c));
if (orphans.length) {
  failed = true;
  console.error(`✗ ZERO_DECIMAL contains ${orphans.length} code(s) absent from CURRENCIES: ${orphans.join(', ')}`);
} else {
  console.log(`✓ ZERO_DECIMAL — all ${ZERO_DECIMAL.size} codes are present in CURRENCIES`);
}

// ── 2. The list, against Stripe ───────────────────────────────────────────────
const key = readKey();

// `rk_` as well as `sk_`: Stripe now recommends restricted keys over unrestricted
// secret keys, and the endpoint forwards either unchanged as a bearer token. A RAK
// needs read scope on Account + Country specs for the checks below.
if (!key || !/^(sk|rk)_/.test(key)) {
  const why = !key ? 'no STRIPE_SECRET_KEY in env or .dev.vars' : `STRIPE_SECRET_KEY is not a Stripe key (${key.slice(0, 12)}…)`;
  console.log(`\n⊘ SKIPPED the Stripe list check — ${why}.`);
  console.log('  The currency list is therefore UNVERIFIED by this run.');
  console.log('  Provide a key (a sk_test_ one is enough) or pass --strict to make this a failure.');
  if (STRICT) failed = true;
} else {
  try {
    const account = await stripe('account', key);
    const country = account?.country;
    const mode = key.startsWith('sk_live_') ? 'live' : 'test';
    if (!country) throw new Error('account object has no `country`');

    const spec = await stripe(`country_specs/${country}`, key);
    const stripeList = (spec?.supported_payment_currencies ?? []).map((c) => c.toUpperCase());
    if (!stripeList.length) throw new Error(`country_specs/${country} returned no supported_payment_currencies`);

    console.log(`\nStripe account country: ${country}  (${mode} mode)  — ${stripeList.length} presentment currencies`);
    console.log(`Ours (src/data/donation.mjs): ${CURRENCIES.length}`);

    const deadEnds = diff(CURRENCIES, stripeList);
    const missed = diff(stripeList, CURRENCIES);

    if (deadEnds.length) {
      failed = true;
      console.error(`\n✗ ${deadEnds.length} offered but NOT supported by Stripe — each is a live dead end (502 on submit):`);
      console.error(`    ${deadEnds.join(', ')}`);
      console.error('    fix: remove from CURRENCIES in src/data/donation.mjs');
    }
    if (missed.length) {
      failed = true;
      console.error(`\n✗ ${missed.length} supported by Stripe but NOT offered — donors cannot choose them:`);
      console.error(`    ${missed.join(', ')}`);
      console.error('    fix: add to CURRENCIES in src/data/donation.mjs (keep USD first, rest alphabetical)');
    }
    if (!deadEnds.length && !missed.length) {
      console.log(`✓ currency list matches Stripe's ${country} country spec exactly`);
    }
  } catch (err) {
    failed = true;
    console.error(`\n✗ could not verify against Stripe — ${err.message}`);
  }
}

// ── 3. Secondary source, while WordPress is still up ──────────────────────────
const live = await liveWordpressList();
if (live) {
  const d = [...diff(CURRENCIES, live), ...diff(live, CURRENCIES)];
  console.log(
    d.length
      ? `\nnote: live WordPress list (${live.length}) differs from ours on: ${d.join(', ')}`
      : `\nnote: still byte-identical to the live WordPress list (${live.length} codes)`,
  );
} else {
  console.log('\nnote: live WordPress list unreachable — expected after cutover; Stripe above is the real check.');
}

process.exit(failed ? 1 : 0);
