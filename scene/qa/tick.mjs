/* Watch the real animation rather than freezing it: sample the lead and
   trailing blocks' positions over one cycle and check they actually
   advance in discrete steps. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
const read = () => p.evaluate(() => {
  const r = document.querySelector('.sign-rule').getBoundingClientRect();
  const q = (s) => Math.round((document.querySelector(s).getBoundingClientRect().left - r.left) / r.width * 100);
  return { lead: q('.sign-tick:not(.trail)'), trail: q('.sign-tick.trail') };
});
const seen = [];
for (let i = 0; i < 10; i++) { seen.push(await read()); await p.waitForTimeout(450); }
console.log('lead  %', seen.map(s => s.lead).join(' '));
console.log('trail %', seen.map(s => s.trail).join(' '));
const leads = seen.map(s => s.lead);
console.log('distinct positions visited:', new Set(leads).size);
console.log('trail is behind the lead:', seen.filter(s => s.trail < s.lead || s.lead === 0).length + '/10 samples');
// reduced motion must hold it still
const p2 = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p2.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
const a = await p2.evaluate(() => getComputedStyle(document.querySelector('.sign-tick')).animationName);
await p2.waitForTimeout(900);
console.log('reduced motion animation-name:', a);
await b.close();
