/**
 * AWS Lambda twin of src/pages/api/create-donation.ts — the Stripe Checkout
 * Session creator for the AWS Amplify deployment, where the site is served
 * static and this one dynamic route runs as a Lambda behind an Amplify
 * rewrite (200-proxy): /api/create-donation → this function's URL. Keep the
 * request/response contract identical to the Astro route — the donate modal
 * (DonateModal.astro) is the shared client of both.
 *
 * Two deliberate differences from the Astro route, both proxy-imposed:
 *
 *  - SECRET: read from SSM Parameter Store (SecureString, name in SSM_PARAM)
 *    via the runtime's bundled AWS SDK, cached across warm invocations —
 *    never a build-time value, per the same reasoning as the Astro route's
 *    getStripeKey seam. Parameter missing → the same dormant 503 the Astro
 *    route returns before its secret exists.
 *
 *  - ORIGIN: behind the proxy, request.url is the function URL, not the site
 *    — so success/cancel URLs derive from the browser's Origin header,
 *    validated against SITE_URL and *.{APP_DOMAIN} (so PR previews work),
 *    falling back to SITE_URL. Never trust Origin unvalidated: it becomes
 *    the post-payment redirect target.
 *
 * donation.mjs here is COPIED from src/data/donation.mjs at deploy time by
 * deploy.sh — single source of truth for currencies + amount encoding; never
 * hand-edit the copy.
 */
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { CURRENCIES, toStripeAmount } from './donation.mjs';

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions';
const CURRENCY_SET = new Set(CURRENCIES.map((c) => c.toUpperCase()));

const SITE_URL = process.env.SITE_URL || 'https://openmined.org';
// The Amplify app's default domain (e.g. dXXXX.amplifyapp.com) — branch and PR
// preview origins are subdomains of it.
const APP_DOMAIN = process.env.APP_DOMAIN || '';
const SSM_PARAM = process.env.SSM_PARAM || '/openmined-org/STRIPE_SECRET_KEY';

const ssm = new SSMClient({});
let cachedKey; // warm-invocation cache; undefined = not yet fetched

async function getStripeKey() {
  if (cachedKey !== undefined) return cachedKey;
  try {
    const res = await ssm.send(new GetParameterCommand({ Name: SSM_PARAM, WithDecryption: true }));
    cachedKey = res.Parameter?.Value || null;
  } catch {
    // ParameterNotFound (dormant state) or transient SSM failure — treat both
    // as "no key": the modal shows the friendly 503 message either way. Do not
    // cache null on transient errors forever; a fresh cold start retries.
    cachedKey = null;
  }
  return cachedKey;
}

/** Same shape + security headers as the Astro route's json() helper. */
const json = (data, status = 200) => ({
  statusCode: status,
  headers: {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
  },
  body: JSON.stringify(data),
});

/** Origin header if it's one of ours (site, branch, or PR preview); else SITE_URL. */
function safeOrigin(headers) {
  const origin = headers?.origin || '';
  if (origin === SITE_URL) return origin;
  if (APP_DOMAIN) {
    try {
      const u = new URL(origin);
      if (u.protocol === 'https:' && (u.host === APP_DOMAIN || u.host.endsWith('.' + APP_DOMAIN)))
        return origin;
    } catch {
      /* malformed Origin — fall through */
    }
  }
  return SITE_URL;
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method !== 'POST') {
    return json({ message: 'Method not allowed.' }, 405);
  }

  const secretKey = await getStripeKey();
  if (!secretKey) {
    return json({ message: 'Donations are not available right now. Please try again later.' }, 503);
  }

  let body;
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || '';
    body = JSON.parse(raw);
  } catch {
    return json({ message: 'Invalid request.' }, 400);
  }

  const amount = Number(body.amount);
  const isMonthly = body.is_monthly === true || body.is_monthly === 'true';
  const currency = String(body.currency || 'USD').toUpperCase();

  if (!Number.isFinite(amount) || amount < 1) {
    return json({ message: 'Please select or enter a valid donation amount.' }, 400);
  }
  if (!CURRENCY_SET.has(currency)) {
    return json({ message: 'Unsupported currency.' }, 400);
  }

  const origin = safeOrigin(event.headers);
  const unitAmount = toStripeAmount(amount, currency);

  const params = new URLSearchParams();
  params.set('mode', isMonthly ? 'subscription' : 'payment');
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', currency.toLowerCase());
  params.set(
    'line_items[0][price_data][product_data][name]',
    isMonthly ? 'OpenMined Monthly Donation' : 'OpenMined Donation',
  );
  params.set('line_items[0][price_data][unit_amount]', String(unitAmount));
  if (isMonthly) {
    params.set('line_items[0][price_data][recurring][interval]', 'month');
  } else {
    params.set('submit_type', 'donate');
  }
  params.set('success_url', `${origin}/donate/thank-you/?session_id={CHECKOUT_SESSION_ID}`);
  params.set('cancel_url', `${origin}/?donate=cancelled`);
  params.set('billing_address_collection', 'auto');

  const res = await fetch(STRIPE_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await res.json();
  if (!res.ok || !data?.url) {
    // Log Stripe's own error server-side only (CloudWatch) — NEVER forward it
    // to the browser: Stripe's auth-failure messages embed a partially-redacted
    // API key, and a key mismatch is likeliest at exactly the moment the key is
    // rotated (LAUNCH.md §2 / BACKLOG §14).
    console.error('create-donation: Stripe error', res.status, data?.error?.type, data?.error?.message);
    return json({ message: 'Could not start checkout. Please try again.' }, 502);
  }

  return json({ checkout_url: data.url });
};
