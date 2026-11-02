/* Render one still of a named scene. */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const S = process.env.SCENE || 'room';
const W = +(process.env.W || 620), H = +(process.env.H || 460);
const OUT = process.env.OUT || `out/${S}.png`;
mkdirSync('out', { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
/* T freezes the loop at a time in seconds, so a still is a frame
   you chose rather than whichever one the clock happened to be on. */
const T = process.env.T;
await p.goto(`http://127.0.0.1:4180/index.html?scene=${S}` + (T === undefined ? '' : `&t=${T}`), { waitUntil: 'load' });
await p.waitForFunction(() => window.__dioramaReady === true, null, { timeout: 20000 });
await p.waitForTimeout(700);
await p.screenshot({ path: OUT });
console.log(errs.length ? 'ERRORS: ' + errs.join('; ') : `${S} -> ${OUT} at ${W}x${H}`);
await b.close();
