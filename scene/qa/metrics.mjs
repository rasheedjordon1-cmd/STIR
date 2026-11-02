import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const measure = async (block) => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  if (block) await ctx.route('**/founders-grotesk-*.woff2', r => r.abort());
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const w = await p.evaluate(() => {
    const sp = document.querySelector('.hero h1 span');
    const rg = document.createRange(); rg.selectNodeContents(sp);
    return rg.getBoundingClientRect().width;
  });
  await ctx.close();
  return w;
};
const real = await measure(false), fb = await measure(true);
console.log(`Founders  "ATTENTION" ${real.toFixed(1)}px`);
console.log(`fallback  "ATTENTION" ${fb.toFixed(1)}px`);
console.log(`ratio ${(real / fb * 100).toFixed(1)}%  -> size-adjust: ${Math.round(real / fb * 1000) / 10}%`);
await b.close();
