/* C04 — clips play on intent only. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

const media = [];
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('request', r => { if (/\.mp4$/.test(r.url()) && !/scene\//.test(r.url())) media.push(r.url().split('/').pop()); });
await p.goto('http://127.0.0.1:8080/labay.html', { waitUntil: 'networkidle' });
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
});
await p.waitForTimeout(1200);
ok(media.length === 0, `nothing downloads before anyone presses Play (${media.length} clip requests)`);
ok(await p.evaluate(() => document.querySelectorAll('.tile-frame video').length === 0), 'and no <video> exists yet');

const first = p.locator('.tile-frame').first();
await first.scrollIntoViewIfNeeded();
await first.click();
await p.waitForTimeout(1200);
ok(media.length === 1, `pressing Play fetches exactly one clip (${media.join(', ')})`);
ok(await p.evaluate(() => { const v = document.querySelector('.tile-frame video'); return !!v && !v.paused; }), 'it plays');
ok(await p.evaluate(() => document.querySelector('.tile-frame video').muted), 'muted — no sound without a control');
ok(await p.evaluate(() => document.querySelector('.tile-frame[data-playing="true"] .tile-play').textContent === 'Pause'),
   'and the control now says Pause');

const second = p.locator('.tile-frame').nth(1);
await second.click();
await p.waitForTimeout(1000);
ok(await p.evaluate(() => document.querySelectorAll('.tile-frame video').length === 1),
   'starting another stops the first — only one clip runs at a time');

await second.click();
await p.waitForTimeout(400);
ok(await p.evaluate(() => document.querySelectorAll('.tile-frame video').length === 0), 'pressing again stops it');

// keyboard
await p.keyboard.press('Enter');
await p.waitForTimeout(900);
ok(await p.evaluate(() => document.querySelectorAll('.tile-frame video').length === 1), 'Enter works from the keyboard');
console.log(fails ? `\n${fails} FAILED` : '\nclip playback: all checks pass');
await b.close();
process.exit(fails ? 1 : 0);
