/* Check the DEPLOYED site, not a local copy, in a clean browser
   profile. Every other script here tests the working tree; this one
   tests what visitors actually get, which is a different question —
   a correct tree can sit behind a stale deploy or a stale cache and
   every local check will still pass.
 *
 *   URL=https://stirnyc.netlify.app/ node scene/qa/live.mjs
 *
 * It reports the stylesheet actually in use, its rule count, and the
 * cache header — an `immutable` year on an unhashed filename is what
 * pinned a pre-rebuild stylesheet in a browser for a year. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bad = [];
p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
p.on('pageerror', e => bad.push('JS ' + e.message));
const URL = process.env.URL || 'https://stirnyc.netlify.app/';
let cache = '(not seen)';
p.on('response', r => { if (/stir[.\w]*\.css$/.test(r.url())) cache = r.headers()['cache-control'] || '(none)'; });
await p.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
await p.waitForTimeout(2500);
console.log(await p.evaluate(() => {
  const s = [...document.styleSheets].find(x => (x.href || '').includes('stir'));
  const probe = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : 'NO ELEMENT'; };
  return {
    stylesheet: s ? s.href.split('/').pop() + ' — ' + s.cssRules.length + ' rules' : 'NOT LOADED',
    'brand img height': probe('.brand img', 'height'),
    'stage-loop position': probe('.stage-loop', 'position'),
    'stage-motion background': probe('.stage-motion', 'backgroundColor'),
    'nav link padding': probe('.nav-links a', 'padding'),
    'h1 font-size': probe('.hero h1', 'fontSize'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
}));
console.log('stylesheet cache-control:', cache);
if (/immutable/.test(cache) && !/stir\.[0-9a-f]{6,}\.css/.test(cache + ' ')) {
  console.log('  NOTE: immutable caching is only safe on a fingerprinted filename.');
}
console.log(bad.length ? 'PROBLEMS:\n' + bad.join('\n') : 'no failed requests, no JS errors');
await p.screenshot({ path: 'out/site/live-1440.png' });
await b.close();
