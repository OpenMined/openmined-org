import type { APIRoute } from 'astro';
import { CURRENCIES, toStripeAmount } from '@data/donation.mjs';

/**
 * POST /api/create-donation — creates a Stripe Checkout Session for a one-time
 * or monthly donation of an arbitrary amount/currency, and returns its hosted
 * `checkout_url` for the browser to redirect to. This is the one server-side
 * piece of the donate flow: it holds the Stripe SECRET key, which must never
 * reach the client. Faithful replacement for the live WordPress AJAX action
 * `app_create_donation_payment`.
 *
 * Runtime: on-demand (NOT prerendered) — runs as an on-demand Cloudflare Worker
 * invocation via @astrojs/cloudflare (v14, Workers-only; NOT a Pages Function).
 * Uses only Web-standard fetch/Request/Response +
 * form-encoded Stripe REST (no Stripe SDK), so the logic is host-portable: to
 * move off Cloudflare, swap the adapter and the env access below is already
 * host-neutral.
 *
 * Dormant until STRIPE_SECRET_KEY is set (Cloudflare secret in prod; a local
 * .dev.vars line for `astro dev`). Without it the endpoint returns 503 and the
 * modal surfaces a friendly error — nothing else in the build depends on it.
 */
export const prerender = false;

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions';
const CURRENCY_SET = new Set(CURRENCIES.map((c) => c.toUpperCase()));

/**
 * The ONE host-specific seam. On Cloudflare (dev + prod) the runtime secret
 * binding is read from the `cloudflare:workers` virtual module; on
 * Node/Vercel/Netlify it comes from `import.meta.env` / `process.env`. The
 * dynamic import is guarded so the file stays host-neutral at the source level
 * — moving hosts touches only this helper.
 */
async function getStripeKey(): Promise<string | undefined> {
  try {
    // On workerd this module IS the environment, so its `env` is authoritative:
    // return whatever it holds, INCLUDING undefined. Do not fall through — Vite
    // inlines the fallback below as a string literal at build time, so a
    // fall-through would (a) let a stale build-time value shadow the real
    // "secret not provisioned yet" state (503) and (b) bake a local .dev.vars
    // value into the production bundle. Verified 2026-07-27: a placeholder in
    // .dev.vars compiled to `return "PASTE_TEST_SECRET_KEY_HERE"` and was
    // deployed, making the dormant endpoint 502 against Stripe instead of 503.
    const mod: any = await import('cloudflare:workers');
    return mod?.env?.STRIPE_SECRET_KEY;
  } catch {
    /* not running on a workerd runtime — fall through */
  }
  // Deliberately NOT `import.meta.env.STRIPE_SECRET_KEY`: Vite resolves that at
  // BUILD time and inlines the value as a string literal, so any local .dev.vars
  // key would be embedded in the shipped bundle (dead code here, but still a
  // secret sitting in a build artifact). `process.env` is read at RUNTIME and
  // covers the same Node-ish hosts (Vercel/Netlify/node adapter).
  return typeof process !== 'undefined' ? process.env?.STRIPE_SECRET_KEY : undefined;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const secretKey = await getStripeKey();
  if (!secretKey) {
    // Not configured yet — the build ships this way until the secret is added.
    return json({ message: 'Donations are not available right now. Please try again later.' }, 503);
  }

  let body: { amount?: unknown; is_monthly?: unknown; currency?: unknown };
  try {
    body = await request.json();
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

  const origin = new URL(request.url).origin;
  const unitAmount = toStripeAmount(amount, currency);

  // Build the Checkout Session as form-encoded params (Stripe's REST contract).
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
    // Shows a "Donate" button + donation framing on Stripe's hosted page.
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

  const data: any = await res.json();
  if (!res.ok || !data?.url) {
    const message = data?.error?.message || 'Could not start checkout. Please try again.';
    return json({ message }, 502);
  }

  return json({ checkout_url: data.url });
};
