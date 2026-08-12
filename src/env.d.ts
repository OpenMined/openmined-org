/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

// workerd's virtual environment module — provided by the Cloudflare runtime at
// request time, so no installed package declares it. Only `env` is read
// (create-donation.ts → getStripeKey).
declare module 'cloudflare:workers' {
  export const env: Record<string, string | undefined>;
}