/* Nav theme QC ─────────────────────────────────────────────────────
   The invariant is not "at 55% of .proof the bar is cream" — the
   document reflows as images decode, so no pixel target is stable.
   The invariant is that the bar's theme always equals the theme of
   the zone actually under it. So: sample a ladder of scroll
   positions, and at each one measure the zone under the sampling
   line independently and compare. Layout can move between the
   scroll and the read; that is fine, because both sides of the
   comparison are read from the same final frame.

   Run: node scripts/qc/navtheme.mjs                                */
import { chromium } from 'playwright-core';

const PAGES = ['index.html', 'about.html', 'contact.html'];
const VIEWPORTS = [
  { width: 1440, height: 900 }, { width: 1180, height: 820 },
  { width: 768, height: 1024 }, { width: 390, height: 844 },
];
const STEPS = 48;
const DECLARED = ['hero', 'belief', 'proof', 'sites', 'services',
  'method', 'who', 'convert', 'footer', 'page'];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let bad = 0, samples = 0;
const seen = new Map();

for (const page of PAGES) {
  for (const viewport of VIEWPORTS) {
    const pg = await browser.newPage({ viewport });
    /* The stylesheet sets html { scroll-behavior: smooth }, so every
       programmatic scrollTo animates and a measurement taken a frame
       later reads a position still in flight — which is why a ladder
       built on pixel targets never landed where it asked to. Turn it
       off for the harness only. */
    await pg.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.style.scrollBehavior = 'auto';
      });
    });
    await pg.goto('file:///home/user/STIR/' + page, { waitUntil: 'load' });
    await pg.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    /* Settle the document. Lazy images only reserve their height once
       they decode, and a programmatic scroll ladder is too fast for
       Chromium to notice them coming — half of them never loaded, the
       document stayed short, and every later sample measured a layout
       that was still growing. So promote them and wait on the decode. */
    await pg.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
      window.scrollTo(0, 0);
    });
    try {
      await pg.waitForFunction(() => [...document.images].every(i => i.complete), null, { timeout: 15000 });
    } catch {
      const stuck = await pg.evaluate(() => [...document.images].filter(i => !i.complete).map(i => i.currentSrc || i.src));
      console.log(`  NOTE ${page} ${viewport.width}w: ${stuck.length} image(s) never completed \u2014 ${stuck.join(', ')}`);
    }
    await pg.waitForTimeout(500);

    const max = await pg.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    for (let i = 0; i <= STEPS; i++) {
      const res = await pg.evaluate(async (y) => {
        window.scrollTo(0, y);
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        await new Promise(r => setTimeout(r, 90));
        const nav = document.querySelector('.nav');
        const line = nav.offsetHeight + 1;
        let under = null, name = null;
        for (const z of document.querySelectorAll('[data-nav-theme]')) {
          const r = z.getBoundingClientRect();
          if (r.top <= line && r.bottom > line) {
            under = z.getAttribute('data-nav-theme');
            name = z.className.split(' ')[0];
            break;
          }
        }
        return { got: nav.getAttribute('data-theme'), under, name, at: Math.round(window.scrollY) };
      }, Math.round((max * i) / STEPS));
      if (!res.under) continue;           /* a gap between zones keeps the last theme */
      samples++;
      seen.set(res.name, (seen.get(res.name) || 0) + 1);
      if (res.got !== res.under) {
        bad++;
        console.log(`  MISMATCH ${page} ${viewport.width}w y=${res.at} ${res.name}: bar ${res.got}, zone ${res.under}`);
      }
    }
    await pg.close();
  }
}
await browser.close();

console.log([...seen].map(([k, v]) => `${k}×${v}`).join('  '));
/* A zone shorter than the page's remaining scroll can never reach the
   bar — the footer is 129px at the very bottom, so at maximum scroll
   the line is still inside .convert. Say so rather than leave a silent
   gap in the coverage line. */
for (const z of DECLARED) if (!seen.has(z)) {
  console.log(`  UNREACHABLE ${z} — never passes under the bar at any scroll position`);
}
console.log(bad
  ? `${bad} mismatches of ${samples} samples`
  : `nav theme matches the zone beneath it at all ${samples} samples (${PAGES.length} pages × ${VIEWPORTS.length} viewports)`);
process.exit(bad ? 1 : 0);
