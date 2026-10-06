/* Button system QC ─────────────────────────────────────────────────
   Three types, two grounds, four states. For each it checks the two
   things that actually break: that the label still clears 4.5:1
   against whatever is behind it once the state paints, and that the
   state paints at all (a transition that never fires looks exactly
   like a button with no hover).

   Run: node scripts/qc/buttons.mjs                                 */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const TARGETS = [
  ['index.html', '.nav-start', 'primary · nav over cobalt', 0],
  ['index.html', '.hero-cta .cta', 'primary · hero', 0],
  ['index.html', '.starter-go', 'secondary · convert', 0.72],
  ['index.html', '.svc-action .cta-line', 'tertiary · services', 0.42],
  ['contact.html', '.cta--flat', 'primary · form submit', 0.6],
  ['about.html', '.cta-line', 'tertiary · about', 0.75],
];

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0;

for (const [page, sel, label, depth] of TARGETS) {
  const pg = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pg.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.style.scrollBehavior = 'auto';
    });
    /* Testing :active means pressing and releasing, which is a click:
       every one of these buttons is a link or a submit, so without
       this the page navigates out from under the measurement. */
    document.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
    document.addEventListener('submit', (e) => e.preventDefault(), true);
  });
  await pg.goto('file:///home/user/STIR/' + page, { waitUntil: 'load' });
  await pg.evaluate(async (d) => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * d);
  }, depth);
  await pg.waitForTimeout(700);

  const el = pg.locator(sel).first();
  const shots = {};
  for (const state of ['rest', 'hover', 'active']) {
    if (state === 'hover') await el.hover();
    if (state === 'active') { await pg.mouse.down(); }
    await pg.waitForTimeout(450);
    shots[state] = PNG.sync.read(await el.screenshot());
    if (state === 'active') await pg.mouse.up();
  }
  await pg.mouse.move(0, 0);

  /* Did the state paint? Count pixels that moved by more than noise. */
  const moved = (a, b) => {
    let n = 0;
    const len = Math.min(a.data.length, b.data.length);
    for (let i = 0; i < len; i += 4) {
      if (Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) +
          Math.abs(a.data[i + 2] - b.data[i + 2]) > 24) n++;
    }
    return n / (len / 4);
  };
  const hoverMoved = moved(shots.rest, shots.hover);

  /* Contrast. Sampling one pixel kept landing on an anti-aliased
     corner, so take the most common colour inside the label box
     instead: that is the fill by definition, since type is a
     minority of the pixels. */
  const fg = (await pg.evaluate((sel) => {
    const el = document.querySelector(sel);
    const lab = el.querySelector('.cta-label') || el;
    return getComputedStyle(lab).color;
  }, sel)).match(/[\d.]+/g).slice(0, 3).map(Number);

  const ground = (img) => {
    const tally = new Map();
    const x0 = Math.round(img.width * 0.02), x1 = Math.round(img.width * 0.98);
    const y0 = Math.round(img.height * 0.1), y1 = Math.round(img.height * 0.9);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = (img.width * y + x) << 2;
      const k = (img.data[i] >> 2) + ',' + (img.data[i + 1] >> 2) + ',' + (img.data[i + 2] >> 2);
      const t = tally.get(k) || [0, 0, 0, 0];
      t[0] += img.data[i]; t[1] += img.data[i + 1]; t[2] += img.data[i + 2]; t[3]++;
      tally.set(k, t);
    }
    const top = [...tally.values()].sort((a, b) => b[3] - a[3])[0];
    return [top[0] / top[3], top[1] / top[3], top[2] / top[3]];
  };

  const rRest = ratio(fg, ground(shots.rest));
  const rHover = ratio(fg, ground(shots.hover));
  const r = Math.min(rRest, rHover);

  const bad = [];
  if (hoverMoved < 0.01) bad.push(`hover paints nothing (${(hoverMoved * 100).toFixed(1)}% of pixels moved)`);
  if (rRest < 4.5) bad.push(`label ${rRest.toFixed(2)}:1 at rest`);
  if (rHover < 4.5) bad.push(`label ${rHover.toFixed(2)}:1 on hover`);
  console.log(`${bad.length ? 'FAIL' : ' ok '}  ${label.padEnd(28)} hover ${(hoverMoved * 100).toFixed(1).padStart(5)}% moved   label rest ${rRest.toFixed(2)}:1 hover ${rHover.toFixed(2)}:1${bad.length ? '  — ' + bad.join('; ') : ''}`);
  if (bad.length) fail++;
  await pg.close();
}
await browser.close();
console.log(fail ? `${fail} of ${TARGETS.length} button states need work` : `all ${TARGETS.length} button states paint and hold contrast`);
process.exit(fail ? 1 : 0);
