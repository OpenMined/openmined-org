/**
 * Donation constants — shared by the DonateModal component (currency <select>
 * + symbol display) and the /api/create-donation endpoint (amount encoding).
 *
 * PROVENANCE: CURRENCIES below MIRRORS STRIPE, not WordPress. The live site's
 * `get_supported_currencies` AJAX action only relayed Stripe — the codes come back
 * `usd` first then strictly alphabetical, which is the shape of a Stripe country
 * spec's `supported_payment_currencies`, and the action carried ~0.5–0.8s of
 * upstream latency per call. So the upstream does NOT disappear at cutover; only
 * the relay does.
 *
 * We ship it statically rather than fetching, because presentment support is a
 * function of the Stripe account's COUNTRY — not a dashboard toggle anyone can
 * flip — so it moves on Stripe's schedule, a few codes a year (the ANG/XCG and
 * SLE transitions below are what that looks like). Paying live's blocking latency
 * on every modal open to re-read a yearly-changing list would be a bad trade.
 *
 * Being a mirror, it needs a watcher, because nothing else here would notice drift:
 *   npm run audit:currencies
 * diffs this list against the live account's Stripe country spec and self-checks
 * toStripeAmount(). Run it if donations start failing, or before a release.
 */

/** Preset amounts per mode — verbatim from the live donate form. */
export const PRESETS = {
  once: [25, 50, 100, 250, 500, 1000],
  monthly: [10, 15, 20, 25, 30, 50],
};

/** Full supported currency list (ISO 4217), USD first. */
export const CURRENCIES = ["USD","AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BIF","BMD","BND","BOB","BRL","BSD","BWP","BYN","BZD","CAD","CDF","CHF","CLP","CNY","COP","CRC","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ETB","EUR","FJD","FKP","GBP","GEL","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HTG","HUF","IDR","ILS","INR","ISK","JMD","JPY","KES","KGS","KHR","KMF","KRW","KYD","KZT","LAK","LBP","LKR","LRD","LSL","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SEK","SGD","SHP","SLE","SOS","SRD","STD","SZL","THB","TJS","TOP","TRY","TTD","TWD","TZS","UAH","UGX","UYU","UZS","VND","VUV","WST","XAF","XCD","XCG","XOF","XPF","YER","ZAR","ZMW"];

/**
 * Display symbols for the amount field. Mirrors the live JS map exactly; every
 * other currency shows its code + a space (handled in the component/`symbolFor`).
 */
export const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$',
  JPY: '¥', INR: '₹', CHF: 'CHF', NZD: 'NZ$',
};

export function symbolFor(code) {
  return CURRENCY_SYMBOLS[code] || `${code} `;
}

/**
 * Stripe zero-decimal currencies — amounts are NOT multiplied by 100 when sent
 * as `unit_amount`. https://docs.stripe.com/currencies#zero-decimal
 *
 * ISK and UGX are deliberately ABSENT even though both transitioned to
 * zero-decimal: Stripe's "Special cases" table requires each be sent as a
 * two-decimal value whose decimal part is always 00 (5 UGX → `500`), so ×100 is
 * the correct path for them. Stripe's own docs are self-inconsistent here — UGX
 * still appears in the zero-decimal enumeration — and we follow the narrower
 * special-case override. UGX sat in this set until 2026-08-11 and undercharged
 * by 100×; `npm run audit:currencies` now covers both rows.
 * Verified against https://docs.stripe.com/currencies: 2026-08-11.
 */
export const ZERO_DECIMAL = new Set([
  'BIF','CLP','DJF','GNF','JPY','KMF','KRW','MGA','PYG','RWF',
  'VND','VUV','XAF','XOF','XPF',
]);

/** Encode a major-unit amount to Stripe's smallest-unit integer. */
export function toStripeAmount(amount, currency) {
  return ZERO_DECIMAL.has(String(currency).toUpperCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}
