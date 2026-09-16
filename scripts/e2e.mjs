import { chromium } from 'playwright-core';
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
const results = [];

const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

// 1. Search from the header
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.getByPlaceholder('Search rice, callaloo, coconut oil…').first().fill('callaloo');
await page.waitForTimeout(400);
const suggestionCount = await page.locator('[role="option"]').count();
check('search suggestions appear', suggestionCount > 0, `${suggestionCount} options`);
await page.keyboard.press('Enter');
await page.waitForURL('**/search?q=callaloo');
// Results resolve through the commerce adapter, so wait for the grid rather
// than counting on the first frame. This holds for both build modes.
await page.waitForSelector('article', { timeout: 5000 });
const resultCount = await page.locator('article').count();
check('search results page renders', resultCount > 0, `${resultCount} cards`);

// 2. Add to cart from a card
const firstAdd = page.getByRole('button', { name: /^Add / }).first();
await firstAdd.click();
await page.waitForTimeout(350);
const badge = await page.locator('button[aria-label^="Open basket"]').innerText();
check('cart count updates from grid', /1/.test(badge), badge.replace(/\n/g, ' '));

// 3. Stepper increments
await page.getByRole('button', { name: /^Increase quantity of/ }).first().click();
await page.waitForTimeout(250);
const badge2 = await page.locator('button[aria-label^="Open basket"]').getAttribute('aria-label');
check('stepper increases quantity', /2 items/.test(badge2), badge2);

// 4. Cart drawer opens, traps focus, closes on Escape
await page.locator('button[aria-label^="Open basket"]').click();
await page.waitForTimeout(400);
const dialogVisible = await page.locator('[role="dialog"]').isVisible();
check('cart drawer opens', dialogVisible);
const drawerTitle = await page.locator('[role="dialog"] h2').first().innerText();
check('drawer is labelled', drawerTitle.includes('basket'), drawerTitle);
await page.keyboard.press('Escape');
await page.waitForTimeout(350);
check('Escape closes drawer', (await page.locator('[role="dialog"]').count()) === 0);

// 5. Location sheet changes zone and the promise updates
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.locator('button:has-text("Set your area"), button:has-text("Deliver to")').first().click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: /Tivoli/ }).first().click();
await page.waitForTimeout(300);
const sheetText = await page.locator('[role="dialog"]').innerText();
check('pickup-only zone shows collection only', /Collection only/i.test(sheetText));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
const heroCard = await page.locator('aside[aria-label="Delivery availability"]').innerText();
check('hero fulfilment card follows the zone', /collection only/i.test(heroCard) && /Grenville/.test(heroCard), heroCard.split('\n').slice(0,6).join(' | '));

// 6. Fulfilment gating: delivery unavailable for a pickup-only zone
await page.goto(BASE + '/cart', { waitUntil: 'networkidle' });
const cartText = await page.locator('main').innerText();
check('cart persists across navigation', /callaloo/i.test(cartText));
const deliveryOption = page.locator('label:has-text("Local delivery")').first();
check('delivery shown unavailable in pickup-only zone', /unavailable/i.test(await deliveryOption.innerText()));

// 7. Minimum-order gate, then the honest checkout handoff
const checkoutBtn = page.getByRole('button', { name: /Continue to secure checkout/ });
check('checkout blocked below minimum order', await checkoutBtn.isDisabled());
check('minimum order is explained', /minimum order/i.test(await page.locator('main').innerText()));
// Build the basket past the minimum.
await page.goto(BASE + '/product/parboiled-rice-10lb', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Add to basket/ }).click();
await page.waitForTimeout(500);
await page.keyboard.press('Escape');
await page.goto(BASE + '/cart', { waitUntil: 'networkidle' });
const checkoutBtn2 = page.getByRole('button', { name: /Continue to secure checkout/ });
check('checkout enabled once the minimum is met', await checkoutBtn2.isEnabled());
await checkoutBtn2.click();
await page.waitForTimeout(500);
const afterCheckout = await page.locator('main').innerText();
check('checkout states it is not connected', /not connected/i.test(afterCheckout));

// 8. Sort + filter on a collection
await page.goto(BASE + '/category/groceries', { waitUntil: 'networkidle' });
const before = await page.locator('article h3').first().innerText();
await page.getByLabel('Sort products').selectOption('price-asc');
await page.waitForTimeout(300);
const after = await page.locator('article h3').first().innerText();
check('sort reorders the collection', before !== after, `${before} -> ${after}`);
const countBefore = await page.locator('article').count();
await page.getByRole('button', { name: 'Local' }).first().click();
await page.waitForTimeout(300);
const countAfter = await page.locator('article').count();
check('filter narrows the collection', countAfter < countBefore, `${countBefore} -> ${countAfter}`);

// 9. Reorder from account
await page.goto(BASE + '/account/orders', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Preview a signed-in account/ }).click();
await page.waitForTimeout(400);
check('signed-in orders render', (await page.locator('main').innerText()).includes('SM-24818'));
await page.getByRole('button', { name: /^Reorder/ }).first().click();
await page.waitForTimeout(500);
check('reorder opens the basket', (await page.locator('[role="dialog"]').count()) > 0);
await page.keyboard.press('Escape');

// 10. Spice Fair pickup gating for frozen items
await page.goto(BASE + '/product/ice-cream-1-8l', { waitUntil: 'networkidle' });
const pdp = await page.locator('main').innerText();
check('frozen line blocks Spice Fair pickup', /Spice Fair pickup[\s\S]{0,80}not available/i.test(pdp));

// 11. Keyboard: tab to skip link
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
const focused = await page.evaluate(() => document.activeElement?.textContent);
check('skip link is first tab stop', /Skip to content/.test(focused || ''), focused || '');

console.log(results.join('\n'));
console.log('\nJS errors: ' + (errors.length ? '\n  ' + errors.slice(0,6).join('\n  ') : 'none'));
await browser.close();
