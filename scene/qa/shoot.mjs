import { chromium } from 'playwright-core';
const URL = process.env.URL || 'http://127.0.0.1:8080/index.html';
const TAG = process.env.TAG || 'home';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
for (const [name, w, h, dpr] of [['1440', 1440, 900, 1], ['1024', 1024, 900, 1], ['390', 390, 844, 2], ['320', 320, 700, 2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  p.on('console', m => { if (m.type() === 'error') errs.push(`${name}: ${m.text()}`); });
  p.on('pageerror', e => errs.push(`${name}: PAGEERROR ${e.message}`));
  p.on('response', r => { if (r.status() >= 400) errs.push(`${name}: ${r.status()} ${r.url()}`); });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `out/site/${TAG}-${name}.png`, fullPage: name === '1440' });
  const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const font = await p.evaluate(() => getComputedStyle(document.querySelector('h1') || document.body).fontFamily);
  console.log(`${name}: overflow ${over}px  h1 font ${font.split(',')[0]}`);
  await p.close();
}
console.log(errs.length ? 'ISSUES:\n' + errs.join('\n') : 'no console errors, no 4xx');
await b.close();
