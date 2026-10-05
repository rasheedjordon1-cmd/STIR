/* Image × Interface: is every line of live type actually readable on
 * the picture under it?
 *
 * Hide the copy, screenshot the section, then sample the artwork at
 * each line box and compute the real contrast ratio against that
 * line's own colour. This is the only honest test of a composition
 * where the background is a photograph rather than a fill. */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const SECTIONS = [
  ['hero',     '.hero',   '.hero-inner',   ['.eyebrow','.hero-headline','.hero-prop','.hero-index']],
  ['argument', '.belief', '.belief-inner', ['.belief-label','.belief-intro','.belief-claim','.belief-deck']],
];
const VIEWS = [
  [1920,1080],[1680,1040],[1536,960],[1440,893],[1366,768],[1280,800],
  [1180,820],[1024,768],[900,1200],[834,1112],[768,1024],[700,900],[640,960],
  [600,900],[540,960],[430,932],[414,896],[390,844],[375,667],[360,780],[320,568],
];
const AA = 4.5;

const srgb = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
const lum = (r,g,b) => 0.2126*srgb(r) + 0.7152*srgb(g) + 0.0722*srgb(b);
const ratio = (a,b) => (Math.max(a,b)+0.05) / (Math.min(a,b)+0.05);

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0, checked = 0;
console.log('section    viewport     worst contrast           verdict');

for (const [name, sectionSel, coverSel, parts] of SECTIONS) {
  for (const [w,h] of VIEWS) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
    const pg = await ctx.newPage();
    await pg.goto('file:///home/user/STIR/index.html');
    await pg.waitForTimeout(600);
    const el = await pg.$(sectionSel);
    await el.scrollIntoViewIfNeeded();
    await pg.waitForTimeout(1200);

    // line boxes and each line's own computed colour
    const lines = await pg.evaluate(({ sectionSel, parts }) => {
      const s = document.querySelector(sectionSel).getBoundingClientRect();
      const out = [];
      parts.forEach(sel => {
        const root = document.querySelector(sel);
        if (!root) return;
        // Per text node, not per element: a range over an element
        // returns the line boxes of its block children, which span the
        // whole column whether or not any ink reaches the end of it.
        // Sampling those reports the picture beside the text as if it
        // were behind it.
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          if (!n.nodeValue.trim()) continue;
          const col = getComputedStyle(n.parentElement).color.match(/[\d.]+/g).map(Number);
          const r = document.createRange();
          r.selectNodeContents(n);
          [...r.getClientRects()].forEach(x => {
            if (x.width < 3 || x.height < 3) return;
            out.push({ sel, col, x: x.left - s.left, y: x.top - s.top, w: x.width, h: x.height });
          });
        }
      });
      return out;
    }, { sectionSel, parts });

    await pg.evaluate(sel => { document.querySelector(sel).style.visibility = 'hidden'; }, coverSel);
    await pg.waitForTimeout(140);
    const png = PNG.sync.read(await el.screenshot());
    const at = (x,y) => {
      x = Math.max(0, Math.min(png.width-1, Math.round(x)));
      y = Math.max(0, Math.min(png.height-1, Math.round(y)));
      const i = (y*png.width + x)*4;
      return lum(png.data[i], png.data[i+1], png.data[i+2]);
    };

    let worst = { r: Infinity };
    for (const L of lines) {
      const fg = lum(L.col[0], L.col[1], L.col[2]);
      // sample across the line, not just its middle: a diagonal edge
      // arrives at one end first
      for (let t = 0.02; t <= 0.98; t += 0.08) {
        for (const yy of [L.y + L.h*0.3, L.y + L.h*0.7]) {
          const r = ratio(fg, at(L.x + L.w*t, yy));
          if (r < worst.r) worst = { r, sel: L.sel };
        }
      }
    }
    checked++;
    const ok = worst.r >= AA;
    if (!ok) fails++;
    console.log(name.padEnd(10), (w+'x'+h).padEnd(12),
      (worst.r.toFixed(1)+':1 @ '+worst.sel).padEnd(26), ok ? 'ok' : 'BELOW AA');
    await ctx.close();
  }
}
await b.close();
console.log(fails
  ? `\n${fails} of ${checked} compositions put type below 4.5:1 on its own picture`
  : `\nall ${checked} compositions keep every line at or above 4.5:1 on the artwork`);
process.exit(fails ? 1 : 0);
