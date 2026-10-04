/* Display type must never be clipped by its own reveal mask.
 *
 * The editorial reveal masks each headline, and the headlines are set
 * at line-height 0.94, so the glyphs draw outside the element box. A
 * mask sized to the box shaves the apex off every A. This renders each
 * masked headline twice — once as shipped, once with the mask removed
 * — and fails if a single pixel differs. */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : [
  'file:///home/user/STIR/index.html',
  'file:///home/user/STIR/about.html',
  'file:///home/user/STIR/contact.html',
  'file:///home/user/STIR/squarespace/_preview.html',
  'file:///home/user/STIR/squarespace/_preview.html?p=about',
  'file:///home/user/STIR/squarespace/_preview.html?p=contact',
];
const WIDTHS = [1440, 1024, 768, 390];

/* Compare the shipped render against the same render with the mask
 * removed. Masking puts the element on its own compositing layer,
 * which shifts text anti-aliasing a level or two along glyph edges, so
 * an exact pixel compare is all false positives.
 *
 * Clipping is different in kind: it takes whole rows of ink away. So
 * measure rows, not pixels — the first and last row carrying ink must
 * match, and no row may lose a fifth of what it had. */
const INK = 140;

function rows(png) {
  const p = PNG.sync.read(png);
  const counts = new Array(p.height).fill(0);
  for (let y = 0; y < p.height; y++) {
    for (let x = 0; x < p.width; x++) {
      if (p.data[(y * p.width + x) * 4] < INK) counts[y]++;
    }
  }
  return counts;
}

function clipping(shipped, bare) {
  const a = rows(shipped), b = rows(bare);
  if (a.length !== b.length) return 'render size changed';
  const first = c => c.findIndex(n => n > 0);
  const last  = c => c.length - 1 - [...c].reverse().findIndex(n => n > 0);
  if (first(a) !== first(b)) return `ink starts ${first(a) - first(b)}px lower`;
  if (last(a) !== last(b))   return `ink ends ${last(b) - last(a)}px higher`;
  for (let y = 0; y < a.length; y++) {
    if (b[y] > 20 && a[y] < b[y] * 0.8) return `row ${y} lost ${b[y] - a[y]} of ${b[y]} ink px`;
  }
  return null;
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let failures = 0, checked = 0;

for (const url of PAGES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const n = await page.locator('[data-reveal="editorial"]').count();
    for (let i = 0; i < n; i++) {
      const el = page.locator('[data-reveal="editorial"]').nth(i);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const box = await el.boundingBox();
      if (!box || box.height === 0) continue;
      const clip = {
        x: Math.max(0, box.x - 14), y: Math.max(0, box.y - 14),
        width: Math.min(box.width + 28, width - Math.max(0, box.x - 14)),
        height: box.height + 28,
      };
      const shipped = await page.screenshot({ clip });
      await page.evaluate(() => document.querySelectorAll('[data-reveal="editorial"]')
        .forEach(e => { e.style.maskImage = 'none'; e.style.webkitMaskImage = 'none'; }));
      const bare = await page.screenshot({ clip });
      await page.evaluate(() => document.querySelectorAll('[data-reveal="editorial"]')
        .forEach(e => { e.style.maskImage = ''; e.style.webkitMaskImage = ''; }));
      await page.waitForTimeout(80);

      const bad = clipping(shipped, bare);
      checked++;
      if (bad) {
        failures++;
        const text = (await el.textContent()).trim().replace(/\s+/g, ' ').slice(0, 34);
        console.log(`FAIL  ${width}px  "${text}"  ${url.split('/').pop()}  — ${bad}`);
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.log(failures
  ? `\n${failures} clipped headline${failures > 1 ? 's' : ''} of ${checked} checked`
  : `PASS  ${checked} masked headlines, no clipped pixels`);
process.exit(failures ? 1 : 0);
