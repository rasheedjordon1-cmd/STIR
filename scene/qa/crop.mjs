import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/labay.html', { waitUntil: 'networkidle' });
const walls = await p.$$('.wall');
for (let i = 0; i < walls.length; i++) {
  await walls[i].scrollIntoViewIfNeeded();
  await p.waitForTimeout(1600);
  await walls[i].screenshot({ path: `out/site/wall-${i}.png` });
}
console.log(await p.evaluate(() => [...document.querySelectorAll('.wall')].map((w, i) =>
  i + ': ' + [...w.querySelectorAll('img')].map(im => im.naturalWidth).join(','))));
await b.close();
