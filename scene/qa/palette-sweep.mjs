/**
 * Does a surface hold its colour while it moves?
 *
 * The palette snap picks the nearest of 64 entries. A flat face whose
 * shading drifts across the boundary between two of them does not fade
 * from one to the other — it dithers, 50/50, and in motion that reads
 * as the surface sparkling rather than turning. It is invisible in a
 * still and obvious in a loop, which is the worst way round.
 *
 * This froze the open seat's door leaf at sixteen phases and found it
 * sitting on #670905 for most of the loop and mixing #860C07 into it
 * for a quarter of it. The fix was to stop the leaf rotating past its
 * rest position, not to change the palette.
 *
 * Reads by screenshot, not by drawing the canvas into a 2D context:
 * the renderer does not preserve its drawing buffer, so that comes
 * back blank and every sample looks identical and black.
 *
 *   SCENE=seat W=520 H=420 X=416 Y=185 RW=18 RH=70 node qa/palette-sweep.mjs
 *
 * X/Y/RW/RH is a window in render pixels. Put it INSIDE the face under
 * test — a window that catches the background instead reports the
 * object sweeping in and out, which is geometry, not a snap.
 *
 * Reading it: one dominant colour across every phase is clean. Two
 * that trade places gradually is a boundary crossing. A second colour
 * that appears as a solid block is usually another object entering the
 * window, not a problem.
 */
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
const S = process.env.SCENE, W = +process.env.W, H = +process.env.H;
const X = +process.env.X, Y = +process.env.Y, RW = +process.env.RW, RH = +process.env.RH;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await p.goto(`http://127.0.0.1:4180/index.html?scene=${S}`, { waitUntil: 'load' });
await p.waitForFunction(() => window.__dioramaReady === true);
const seen = new Set();
for (let i = 0; i < 16; i++) {
  const ph = i / 16;
  await p.evaluate(t => window.__diorama.freeze(t), ph * 14);
  await p.waitForTimeout(80);
  const buf = await p.screenshot({ clip: { x: X, y: Y, width: RW, height: RH } });
  const img = PNG.sync.read(buf); const m = {};
  for (let k = 0; k < img.data.length; k += 4) {
    const key = '#' + [img.data[k], img.data[k+1], img.data[k+2]].map(v => v.toString(16).padStart(2,'0')).join('').toUpperCase();
    m[key] = (m[key] || 0) + 1;
  }
  const top = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 3);
  top.forEach(([k]) => seen.add(k));
  console.log(`  p=${ph.toFixed(3)}  ` + top.map(([k, n]) => `${k}:${n}`).join('  '));
}
console.log(`\n  distinct dominant colours across the loop: ${seen.size}`);
await b.close();
