/* B — the hero/audience gap, measured against the brief's targets. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,h,want] of [[1440,900,48],[1024,900,48],[390,844,32],[320,700,32]]) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  await p.goto('http://127.0.0.1:8080/index.html', { waitUntil:'networkidle' });
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const low = (sel) => { const e = document.querySelector(sel); return e ? e.getBoundingClientRect().bottom : -1e9; };
    const bottom = Math.max(low('.hero .actions'), low('.stage'));
    const eyebrow = document.querySelector('#ways-t').getBoundingClientRect();
    const frame = document.querySelector('.ways').getBoundingClientRect();
    return { gap: Math.round(eyebrow.top - bottom), toFrame: Math.round(frame.top - eyebrow.bottom) };
  });
  const ok = Math.abs(r.gap - want) <= 4 && Math.abs(r.toFrame - 16) <= 4;
  console.log(`  ${ok?'PASS':'FAIL'}  ${String(w).padStart(4)}px  hero→eyebrow ${r.gap}px (target ${want})   eyebrow→frame ${r.toFrame}px (target 16)`);
  await p.close();
}
await b.close();
