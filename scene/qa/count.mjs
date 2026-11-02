import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const s = [...document.styleSheets].find(s => (s.href || '').includes('stir.css'));
  const probe = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : 'NO ELEMENT'; };
  return {
    rules: s ? s.cssRules.length : 'stylesheet not found',
    'brand img height': probe('.brand img', 'height'),
    'stage-loop position': probe('.stage-loop', 'position'),
    'stage-motion background': probe('.stage-motion', 'backgroundColor'),
    'nav link padding': probe('.nav-links a', 'padding'),
  };
}));
await b.close();
