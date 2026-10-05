/* Does the argument copy stay on the shadow?
 * Hide the type, screenshot the section, then sample the picture at
 * each text block's corners. Cream under type is a fail — that is the
 * lit wall, and ivory on it is unreadable. */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
const VIEWS = [[1920,1080],[1792,1120],[1680,1040],[1600,900],[1536,960],[1440,893],[1440,720],[1366,768],[1280,800],[1280,1024]];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let bad = 0;
console.log('viewport       worst sample   verdict');
for (const [w,h] of VIEWS) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const pg = await ctx.newPage();
  await pg.goto('file:///home/user/STIR/index.html');
  await pg.waitForTimeout(700);
  const el = await pg.$('.belief');
  await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(700);
  const boxes = await pg.evaluate(() => {
    // line boxes, not element boxes: a <p> spans the whole column
    // whether or not its sentence reaches the end of it.
    const s = document.querySelector('.belief').getBoundingClientRect();
    const out = [];
    ['.belief-label','.belief-intro','.belief-claim','.belief-deck'].forEach(sel => {
      const el = document.querySelector(sel);
      const r = document.createRange();
      r.selectNodeContents(el);
      [...r.getClientRects()].forEach(x => {
        if (x.width < 2 || x.height < 2) return;
        out.push({ sel, x: x.left - s.left, y: x.top - s.top, w: x.width, h: x.height });
      });
    });
    return out;
  });
  // take the plate without the type on it
  await pg.evaluate(() => { document.querySelector('.belief-inner').style.visibility = 'hidden'; });
  await pg.waitForTimeout(120);
  const png = PNG.sync.read(await el.screenshot());
  const lum = (x,y) => {
    x = Math.max(0, Math.min(png.width-1, Math.round(x)));
    y = Math.max(0, Math.min(png.height-1, Math.round(y)));
    const i = (y*png.width + x)*4;
    return 0.299*png.data[i] + 0.587*png.data[i+1] + 0.114*png.data[i+2];
  };
  let worst = { l: -1 };
  for (const bx of boxes) {
    // sample along the block's right edge and its bottom edge, plus a
    // 10px breathing margin, which is where the diagonal arrives first
    for (let t = 0; t <= 1; t += 0.1) {
      for (const [sx,sy] of [[bx.x+bx.w+10, bx.y + bx.h*t], [bx.x + bx.w*t, bx.y+bx.h+8]]) {
        const l = lum(sx,sy);
        if (l > worst.l) worst = { l, sel: bx.sel };
      }
    }
  }
  // the shadow reads well under 90; the lit wall is up above 180
  const ok = worst.l < 110;
  if (!ok) bad++;
  console.log((w+'x'+h).padEnd(14), (worst.l.toFixed(0)+' @ '+worst.sel).padEnd(26), ok ? 'ok' : 'ON THE LIT WALL');
  await ctx.close();
}
await b.close();
console.log(bad ? `\n${bad} of ${VIEWS.length} viewports put type on the lit wall` : `\nall ${VIEWS.length} viewports keep the copy on the shadow`);
process.exit(bad ? 1 : 0);
