/**
 * Render the seamless loop to a frame sequence, then let ffmpeg encode it.
 *
 * Frames come from freeze(t), not from wall-clock playback, so the sequence is
 * reproducible and the seam is exact: phase wraps 0..1 across LOOP, so frame N
 * would be identical to frame 0 and is therefore never written.
 *
 *   BASE_URL  page to drive        FPS  frames per second
 *   SECONDS   loop length          W,H  viewport, rendered at DPR
 *   OUT       frame directory      FRAME  'desk' | 'phone'
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4180/index.html';
const FPS = +(process.env.FPS || 24);
const SECONDS = +(process.env.SECONDS || 14);
const W = +(process.env.W || 1280);
const H = +(process.env.H || 1400);
const DPR = +(process.env.DPR || 1);
const OUT = process.env.OUT || 'out/frames';
const FRAME = process.env.FRAME || 'desk';
/* Where in the loop frame 0 sits. Everything in the scene is a pure function
   of phase, so rotating the start costs nothing and keeps the seam exact —
   but it decides the poster, because the poster is frame 0. At t=0 the
   pavement is empty (the walker is still behind the building), which is a
   poor still; this opens on the approach instead. */
const START_T = +(process.env.START_T || 0);

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
page.on('pageerror', (e) => { console.error('PAGEERROR', e.message); process.exitCode = 1; });

const q = FRAME === 'phone' ? '?frame=phone' : '';
await page.goto(BASE + q, { waitUntil: 'load' });
await page.waitForFunction(() => window.__dioramaReady === true, null, { timeout: 20000 });
const loop = await page.evaluate(() => window.__diorama.LOOP);
if (Math.abs(loop - SECONDS) > 0.01) {
  console.error(`loop mismatch: page says ${loop}s, rendering ${SECONDS}s`);
}

const total = Math.round(FPS * SECONDS);     // frame `total` == frame 0, omitted
for (let i = 0; i < total; i++) {
  const t = (START_T + (i / total) * SECONDS) % SECONDS;
  await page.evaluate((t) => window.__diorama.freeze(t), t);
  await page.screenshot({ path: `${OUT}/f${String(i).padStart(4, '0')}.png` });
  if (i % 48 === 0) process.stdout.write(`${i}/${total} `);
}
console.log(`\nwrote ${total} frames to ${OUT} at ${W}x${H} dpr${DPR}`);
await browser.close();
