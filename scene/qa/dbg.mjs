import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('response', r => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url()); });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.querySelector('.evidence img').scrollIntoView());
await p.waitForTimeout(1200);
console.log(await p.evaluate(() => {
  const i = document.querySelector('.evidence img');
  const s = document.querySelector('.stage');
  const h = document.querySelector('.hero h1');
  return {
    labay: { complete: i.complete, nw: i.naturalWidth, shown: Math.round(i.getBoundingClientRect().width) },
    stage: Math.round(s.getBoundingClientRect().width) + 'x' + Math.round(s.getBoundingClientRect().height),
    h1: Math.round(h.getBoundingClientRect().width) + 'x' + Math.round(h.getBoundingClientRect().height),
    heroCol: Math.round(h.parentElement.getBoundingClientRect().width),
  };
}));
await b.close();
