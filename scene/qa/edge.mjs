import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,h,tag] of [[1440,900,'desk'],[390,844,'phone']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:2 });
  await p.goto('http://127.0.0.1:8080/index.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(3500);
  const r = await p.evaluate(() => {
    const b = document.querySelector('.stage').getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  });
  // a band spanning the stage's left edge and its top edge
  await p.screenshot({ path:`out/site/edge-${tag}-left.png`, clip:{ x:r.x-30, y:r.y+r.h*0.15, width:60, height:120 } });
  await p.screenshot({ path:`out/site/edge-${tag}-top.png`,  clip:{ x:r.x+r.w*0.05, y:r.y-30, width:120, height:60 } });
  await p.close();
}
await b.close();
