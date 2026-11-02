import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('response', r => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
await p.goto('http://127.0.0.1:8080/labay.html', { waitUntil: 'networkidle' });
// scroll the whole page so every lazy image is asked for
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); }
});
await p.waitForTimeout(1500);
console.log(await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('.tile-frame img')];
  return {
    tiles: imgs.length,
    loaded: imgs.filter(i => i.complete && i.naturalWidth > 0).length,
    broken: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop()),
    tileBox: (() => { const r = document.querySelector('.tile-frame').getBoundingClientRect();
      return Math.round(r.width) + 'x' + Math.round(r.height); })(),
    pageH: document.body.scrollHeight,
  };
}));
await b.close();
