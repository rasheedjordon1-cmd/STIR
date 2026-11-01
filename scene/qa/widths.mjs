import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const URL = process.env.URL || 'https://stirnyc.netlify.app/';
for (const [w, h, dpr] of [[2000,1155,1],[2560,1440,1],[1920,1080,1],[1440,900,2],[1280,800,1]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, bypassCSP: true });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const el = (s) => document.querySelector(s);
    const box = (s) => { const e = el(s); if (!e) return 'NO ELEMENT'; const b = e.getBoundingClientRect(); return Math.round(b.width)+'x'+Math.round(b.height); };
    return { brandImg: box('.brand img'), stage: box('.stage'),
             loopPos: el('.stage-loop') ? getComputedStyle(el('.stage-loop')).position : 'no video yet',
             over: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  console.log(`${String(w).padStart(4)}x${h} dpr${dpr}  brand img ${r.brandImg.padEnd(10)} stage ${r.stage.padEnd(10)} loop ${r.loopPos.padEnd(10)} overflow ${r.over}px`);
  if (w === 2000) await p.screenshot({ path: 'out/site/live-2000.png' });
  await ctx.close();
}
await b.close();
