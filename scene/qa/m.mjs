import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [tag, url] of [['netlify','http://127.0.0.1:8080/index.html'],['sqsp','http://127.0.0.1:8080/squarespace/_preview.html']]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  console.log(tag, await p.evaluate(() => {
    const h = document.querySelector('.hero h1') || document.querySelector('.stir .hero h1');
    const sp = h.querySelector('span');
    const col = h.parentElement.getBoundingClientRect();
    return { fs: getComputedStyle(h).fontSize, col: Math.round(col.width),
             word: Math.round(sp.getBoundingClientRect().width),
             over: Math.round(sp.getBoundingClientRect().right - col.right) };
  }));
  await p.close();
}
await b.close();
