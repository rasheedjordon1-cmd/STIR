import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(1900);
const r = await p.evaluate(() => { const b = document.querySelector('.sign-rule').getBoundingClientRect();
  return { x: Math.round(b.left) - 8, y: Math.round(b.top) - 120, width: Math.round(b.width) + 16, height: 190 }; });
await p.screenshot({ path: 'out/site/tick-live.png', clip: r });
await b.close();
