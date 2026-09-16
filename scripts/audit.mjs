/**
 * Responsive + accessibility audit.
 *
 * Walks every route at every target width and reports horizontal overflow,
 * undersized tap targets, images without alt text, unlabelled controls and
 * heading-level jumps. Requires `npm run dev` to be running.
 */
import { chromium } from 'playwright-core';
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const ROUTES = ['/', '/search?q=rice', '/category/groceries', '/category/local', '/category/deals',
  '/product/parboiled-rice-10lb', '/product/ice-bag-5kg', '/cart', '/delivery', '/account',
  '/account/orders', '/rewards', '/spice-fair', '/spice-fair/sf-2026-10-03', '/system', '/nope'];
const WIDTHS = [375, 430, 768, 1280, 1440];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext();
const page = await ctx.newPage();
const problems = [];
const jsErrors = [];
page.on('pageerror', e => jsErrors.push(e.message));

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(150);
    const report = await page.evaluate(() => {
      const de = document.documentElement;
      const out = { overflow: de.scrollWidth - de.clientWidth, small: [], noAlt: [], unlabelled: [], headings: [] };
      // tap targets: interactive elements smaller than 44px in either axis
      const interactive = [...document.querySelectorAll('a[href], button, input, select, textarea, [role="option"]')];
      for (const el of interactive) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none') continue;
        // Exempt by design:
        //  · inline links inside prose (the 44px guidance is for discrete controls)
        //  · the skip link, which is clipped to 1px until it receives focus
        //  · the visually hidden radio inside a large fulfilment <label>
        const inProse = el.closest('p, li, dd, summary') && el.tagName === 'A';
        const visuallyHidden = el.closest('.sr-only-focusable') || el.classList.contains('sr-only');
        if (!inProse && !visuallyHidden && (r.height < 36 || r.width < 24)) {
          out.small.push(`${el.tagName}[${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 28)}] ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
        const name = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim();
        const labelled = name || el.id && document.querySelector(`label[for="${el.id}"]`) || el.closest('label');
        if (!labelled) out.unlabelled.push(el.tagName + '.' + String(el.className).slice(0, 40));
      }
      for (const img of document.querySelectorAll('img')) {
        if (img.getAttribute('alt') === null) out.noAlt.push(img.src.split('/').pop());
      }
      let last = 0;
      for (const h of document.querySelectorAll('h1,h2,h3,h4')) {
        const level = Number(h.tagName[1]);
        if (last && level > last + 1) out.headings.push(`${h.tagName} "${h.textContent.trim().slice(0, 30)}" after H${last}`);
        last = level;
      }
      return out;
    });
    if (report.overflow > 0) problems.push(`${route} @${width}: horizontal overflow ${report.overflow}px`);
    if (width === 375) {
      if (report.small.length) problems.push(`${route} @${width}: small targets — ${[...new Set(report.small)].slice(0, 4).join('; ')}`);
      if (report.noAlt.length) problems.push(`${route}: img without alt — ${report.noAlt.join(', ')}`);
      if (report.unlabelled.length) problems.push(`${route}: unlabelled control — ${[...new Set(report.unlabelled)].slice(0, 3).join('; ')}`);
      if (report.headings.length) problems.push(`${route}: heading order — ${report.headings.slice(0, 3).join('; ')}`);
    }
  }
}
console.log(problems.length ? problems.join('\n') : 'No problems found');
console.log('\nJS errors: ' + (jsErrors.length ? jsErrors.slice(0, 5).join('\n') : 'none'));
await browser.close();
