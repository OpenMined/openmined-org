/**
 * verify-donate.mjs — drives the real donate modal in a browser.
 *
 * Defaults to localhost; pass a base URL to run it against a deployed host:
 *   node scripts/verify-donate.mjs https://<worker>.workers.dev
 * Screenshots land in scripts/screenshots/ (gitignored).
 *
 * The submit assertion is adaptive, because both outcomes are legitimate
 * depending on whether STRIPE_SECRET_KEY is provisioned on the target:
 *   503 → dormant; assert the friendly error surfaces in the modal
 *   200 → live; assert a checkout_url comes back AND the browser actually
 *         lands on Stripe's hosted checkout (the part curl can't prove)
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Screenshot output — resolved from the script's own location so the run
// works from any cwd.
const SHOTS = join(dirname(fileURLToPath(import.meta.url)), 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = (process.argv[2] || 'http://localhost:4321').replace(/\/$/, '');
// Tag screenshots by target so a remote run never overwrites the localhost refs.
const TAG = BASE.includes('localhost') ? '' : '-deployed';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const assert = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'} — ${name}${extra ? ' :: ' + extra : ''}`);

  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });

    // 1. open via header nav trigger
    await page.click('.site-nav__link[data-donate-open]');
    await sleep(500);
    const open = await page.evaluate(() => document.querySelector('[data-donate-modal]')?.open === true);
    assert(`[${theme}] modal opens from header nav`, open);

    // screenshot the open modal
    await page.screenshot({ path: join(SHOTS, `donate-modal-astro-desktop-${theme}.png`) });

    if (theme === 'light') {
      // 2. tab switch
      await page.click('.donate-form__tab[data-tab="monthly"]');
      await sleep(200);
      const submitText = await page.textContent('.donate-form__submit');
      assert('submit label → "Donate Monthly"', submitText.trim() === 'Donate Monthly', submitText.trim());
      const monthlyPresets = await page.$$eval('.donate-form__group[data-group="monthly"].is-active .donate-form__preset-face', els => els.map(e => e.textContent.trim()));
      assert('monthly presets visible', monthlyPresets.length === 6, monthlyPresets.join(','));

      // back to once
      await page.click('.donate-form__tab[data-tab="once"]');
      await sleep(150);

      // 3. currency swap
      await page.selectOption('.donate-form__group[data-group="once"] .donate-form__currency', 'EUR');
      await sleep(150);
      const sym = await page.$eval('.donate-form__group[data-group="once"] .donate-form__symbol', el => el.textContent);
      assert('currency symbol swaps to €', sym === '€', JSON.stringify(sym));
      const otherSelect = await page.$eval('.donate-form__group[data-group="monthly"] .donate-form__currency', el => el.value);
      assert('currency selects synced', otherSelect === 'EUR', otherSelect);

      // 4. custom amount unchecks presets
      await page.fill('.donate-form__group[data-group="once"] .donate-form__amount', '73');
      await sleep(150);
      const anyChecked = await page.$$eval('.donate-form__group[data-group="once"] input[type=radio]', els => els.some(e => e.checked));
      assert('typing custom unchecks presets', anyChecked === false);

      // 5. submit → endpoint. Two legitimate outcomes (see header).
      const [resp] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/create-donation'), { timeout: 20000 }),
        page.click('.donate-form__submit'),
      ]);
      assert('submit reaches /api/create-donation', !!resp, 'status ' + resp.status());

      if (resp.status() === 200) {
        // NOTE: don't assert on resp.json() here — the modal navigates away the
        // moment the response lands, and Playwright can't read a body after its
        // page is gone (it resolves empty). Landing on a cs_* checkout URL is
        // the stronger claim and subsumes it; curl covers the payload shape.
        await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 }).catch(() => {});
        const onStripe = /checkout\.stripe\.com/.test(page.url());
        assert('browser lands on Stripe checkout', onStripe, page.url().slice(0, 60));
        if (onStripe) {
          await page.screenshot({ path: join(SHOTS, `donate-stripe-checkout${TAG}.png`) });
        }
        // Navigated away from the site — the modal checks below no longer apply.
      } else {
        await sleep(400);
        const errShown = await page.evaluate(() => {
          const e = document.querySelector('.donate-form__error');
          return e && !e.hidden ? e.textContent : null;
        });
        assert('friendly error shown when dormant', !!errShown, errShown);

        // 6. close via Esc
        await page.keyboard.press('Escape');
        await sleep(300);
        const closed = await page.evaluate(() => document.querySelector('[data-donate-modal]')?.open === false);
        assert('Esc closes modal', closed);
      }
    }
    await ctx.close();
  }

  // 7. thank-you page
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const r = await page.goto(BASE + '/donate/thank-you/?session_id=cs_test_123', { waitUntil: 'networkidle', timeout: 30000 });
  assert('thank-you page 200', r.status() === 200);
  const h1 = await page.textContent('h1');
  assert('thank-you heading', /thank you/i.test(h1), h1);
  await page.screenshot({ path: join(SHOTS, 'donate-thankyou-astro.png') });
  await ctx.close();

  await browser.close();
  console.log(results.join('\n'));
  console.log(results.every(r => r.startsWith('PASS')) ? '\nALL PASS' : '\nSOME FAILED');
})();
