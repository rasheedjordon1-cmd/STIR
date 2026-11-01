/* Render the tree exactly as the Netlify build leaves it. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bad = [];
p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
await p.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
console.log(await p.evaluate(() => {
  const s = [...document.styleSheets].find(s => (s.href || '').includes('stir.'));
  const probe = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : 'NO ELEMENT'; };
  return {
    stylesheet: s ? s.href.split('/').pop() + ' (' + s.cssRules.length + ' rules)' : 'NOT LOADED',
    'brand img height': probe('.brand img', 'height'),
    'stage-loop position': probe('.stage-loop', 'position'),
    'stage-motion background': probe('.stage-motion', 'backgroundColor'),
    'nav link padding': probe('.nav-links a', 'padding'),
    canonical: document.querySelector('link[rel=canonical]').href,
  };
}));
console.log(bad.length ? 'FAILED REQUESTS:\n' + bad.join('\n') : 'no failed requests');
await p.screenshot({ path: 'out/site/deployed-sim.png' });
await b.close();
