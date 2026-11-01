/* R8 — what the hero costs, measured, split by whether it blocks first paint. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [label, w, h, dpr] of [['desktop 1440', 1440, 900, 1], ['phone 390', 390, 844, 2]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const reqs = [];
  p.on('response', async (r) => {
    const len = Number(r.headers()['content-length'] || 0);
    reqs.push({ url: r.url(), type: r.request().resourceType(), len });
  });
  await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'load' });
  const paint = await p.evaluate(() => new Promise((res) => {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') res(Math.round(e.startTime)); })
      .observe({ type: 'paint', buffered: true });
    setTimeout(() => res(-1), 4000);
  }));
  const atPaint = reqs.length;
  const beforeVideo = reqs.filter((r) => r.type !== 'media').reduce((s, r) => s + r.len, 0);
  await p.waitForTimeout(3000);
  const media = reqs.filter((r) => r.type === 'media');
  const total = reqs.reduce((s, r) => s + r.len, 0);
  const kb = (n) => (n / 1024).toFixed(0) + ' KB';
  console.log(`\n${label}`);
  console.log(`  first contentful paint      ${paint} ms (${atPaint} requests had responded)`);
  console.log(`  everything except the loop  ${kb(beforeVideo)} over ${reqs.length - media.length} requests`);
  console.log(`  the loop                    ${kb(media.reduce((s, r) => s + r.len, 0))} over ${media.length} request(s): ${media.map((m) => m.url.split('/').pop()).join(', ') || 'none'}`);
  console.log(`  total                       ${kb(total)}`);
  const hero = reqs.filter((r) => r.url.includes('/assets/scene/'));
  hero.forEach((r) => console.log(`    ${r.url.split('/').pop().padEnd(24)} ${kb(r.len)}`));
  await p.close();
}
await b.close();
