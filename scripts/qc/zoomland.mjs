/* R7 — the two viewports the sweep did not cover: a short landscape window
   and 200% browser zoom. Browser zoom is a CSS-pixel change, so 1440x900 at
   200% is a 720x450 layout viewport at dpr 2. */
import { chromium } from 'playwright-core';
const URL = 'http://127.0.0.1:8080/index.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
for (const [name, w, h, dpr] of [
  ['short landscape 1024x480', 1024, 480, 1],
  ['short landscape  844x390', 844, 390, 2],
  ['200% zoom of 1440x900', 720, 450, 2],
  ['200% zoom of 1024x768', 512, 384, 2],
]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const st = document.querySelector('.stage').getBoundingClientRect();
    const h1 = document.querySelector('.hero h1').getBoundingClientRect();
    const cta = document.querySelector('.hero .action').getBoundingClientRect();
    const idx = document.querySelector('.band-head').getBoundingClientRect();
    return {
      over,
      stage: Math.round(st.width) + 'x' + Math.round(st.height),
      // nothing in the hero may overlap anything else
      typeOverStage: !(h1.right <= st.left || h1.left >= st.right || h1.bottom <= st.top || h1.top >= st.bottom),
      ctaOverStage: !(cta.right <= st.left || cta.left >= st.right || cta.bottom <= st.top || cta.top >= st.bottom),
      ctaReachable: cta.width > 60 && cta.height > 28,
      idxVisible: idx.height > 0,
    };
  });
  const bad = r.over > 0 || r.typeOverStage || r.ctaOverStage || !r.ctaReachable;
  if (bad || errs.length) fails++;
  await p.screenshot({ path: `scene/out/site/r7-${name.replace(/[^a-z0-9]+/gi, '-')}.png` });
  console.log(`${bad ? 'FAIL' : 'PASS'}  ${name.padEnd(26)} overflow ${r.over}px  stage ${r.stage.padEnd(9)}` +
    `  type/stage overlap ${r.typeOverStage}  cta/stage overlap ${r.ctaOverStage}  cta ${r.ctaReachable ? 'reachable' : 'TOO SMALL'}` +
    (errs.length ? `  ERRORS ${errs.join('; ')}` : ''));
  await p.close();
}
console.log(fails ? `\n${fails} FAILED` : '\nR7 short-landscape and 200%-zoom cases pass');
await b.close();
process.exit(fails ? 1 : 0);
