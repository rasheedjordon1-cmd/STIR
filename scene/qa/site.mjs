import { chromium } from 'playwright-core';
const OUT = '/home/user/STIR/scene/out/site';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
for (const [name, w, h, dpr] of [['1440', 1440, 900, 1], ['1024', 1024, 820, 1], ['390', 390, 844, 2], ['320', 320, 700, 2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  p.on('console', m => { if (m.type() === 'error') errs.push(`${name}: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`${name}: PAGEERROR ${e.message}`));
  await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${OUT}/hero-${name}.png` });
  // horizontal overflow
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const loop = await p.evaluate(() => {
    const v = document.querySelector('.hero-loop');
    return v ? { src: v.currentSrc.split('/').pop(), playing: !v.paused, on: v.classList.contains('is-on'), btn: !!document.querySelector('.hero-motion') } : null;
  });
  console.log(`${name}: overflow ${over}px  loop ${JSON.stringify(loop)}`);
  await p.close();
}
console.log(errs.length ? 'CONSOLE ERRORS:\n' + errs.join('\n') : 'no console errors');
await b.close();
