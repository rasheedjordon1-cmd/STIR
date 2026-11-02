/* The two interior scenes: size, source order on mobile, the cobalt
   seam, and that nothing moves. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } });
await p.waitForTimeout(1500);

console.log('desktop proportions');
const r = await p.evaluate(() => {
  const out = {};
  document.querySelectorAll('.scene-pair').forEach(pair => {
    const key = pair.className.includes('seat') ? 'seat' : 'room';
    const art = pair.querySelector('.scene-art').getBoundingClientRect();
    out[key] = { share: +(art.width / pair.getBoundingClientRect().width * 100).toFixed(1),
                 w: Math.round(art.width), loaded: pair.querySelector('img').naturalWidth };
  });
  const heroImg = document.querySelector('.stage-still').getBoundingClientRect();
  out.heroWidth = Math.round(heroImg.width);
  return out;
});
ok(r.seat.share >= 33 && r.seat.share <= 42, `open seat takes ${r.seat.share}% of its row (target 35-40)`);
ok(r.room.share >= 28 && r.room.share <= 40, `working room takes ${r.room.share}%`);
ok(r.seat.loaded === 520 && r.room.loaded === 620, `both load (${r.room.loaded}px, ${r.seat.loaded}px)`);
ok(r.room.w < r.heroWidth && r.seat.w < r.heroWidth,
   `both are smaller than the hero (${r.room.w}, ${r.seat.w} vs ${r.heroWidth})`);

console.log('\nthe cobalt seam');
const seam = await p.evaluate(() => {
  const hex = (a) => '#' + [...a].slice(0,3).map(v => v.toString(16).padStart(2,'0').toUpperCase()).join('');
  const page = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
  const out = {};
  document.querySelectorAll('.scene-art img').forEach(img => {
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    const d = x.getImageData(2, 2, 1, 1).data;
    const key = img.src.includes('room') ? 'room' : 'seat';
    out[key] = { hex: hex(d), delta: Math.max(...[0,1,2].map(i => Math.abs(d[i] - page[i]))) };
  });
  out.page = hex(page);
  return out;
});
ok(seam.room.delta <= 2, `working room corner ${seam.room.hex} vs page ${seam.page} (delta ${seam.room.delta})`);
ok(seam.seat.delta <= 2, `open seat corner ${seam.seat.hex} vs page ${seam.page} (delta ${seam.seat.delta})`);

/* Both interiors move now. They used to be stills by direction and
   this block asserted that; the direction changed, so the assertion
   is inverted rather than deleted — a scene that silently stopped
   moving is exactly the regression worth catching, and the hero has
   already been shipped dead once by a check that never asked. */
console.log('\nboth interiors actually move');
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(3500);
const motion = await p.evaluate(() => {
  const out = {};
  document.querySelectorAll('[data-loop]').forEach(f => {
    const v = f.querySelector('video');
    out[f.getAttribute('data-loop')] = v
      ? { src: v.currentSrc.split('/').pop(), t: v.currentTime, on: v.classList.contains('is-on'),
          btn: !!f.querySelector('.stage-motion'), canvas: !!f.querySelector('canvas') }
      : null;
  });
  return out;
});
await p.waitForTimeout(1400);
const after = await p.evaluate(() => {
  const out = {};
  document.querySelectorAll('[data-loop]').forEach(f => {
    const v = f.querySelector('video');
    out[f.getAttribute('data-loop')] = v ? v.currentTime : null;
  });
  return out;
});
for (const k of ['room', 'seat']) {
  const m = motion[k];
  ok(!!m, m ? `${k}: a loop is attached (${m.src})` : `${k}: NO loop — its source 404d or autoplay was refused`);
  if (!m) continue;
  ok(m.on, `${k}: faded in over its own poster`);
  ok(m.btn, `${k}: offers a pause control beside the motion`);
  ok(!m.canvas, `${k}: ships video, not a live WebGL canvas`);
  ok(after[k] > m.t, `${k}: is playing (${m.t.toFixed(2)} -> ${after[k].toFixed(2)})`);
}
await p.close();

console.log('\nmobile order: text and actions first');
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await m.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
await m.waitForTimeout(1200);
const mo = await m.evaluate(() => {
  const out = {};
  document.querySelectorAll('.scene-pair').forEach(pair => {
    const key = pair.className.includes('seat') ? 'seat' : 'room';
    const art = pair.querySelector('.scene-art').getBoundingClientRect();
    const last = [...pair.querySelectorAll('p')].filter(n => !n.closest('.scene-art')).pop();
    out[key] = { artTop: Math.round(art.top), copyBottom: Math.round(last.getBoundingClientRect().bottom),
                 src: pair.querySelector('img').currentSrc.split('/').pop() };
  });
  out.over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return out;
});
ok(mo.room.artTop >= mo.room.copyBottom, 'working room follows its introduction');
ok(mo.seat.artTop >= mo.seat.copyBottom, 'open seat follows the heading, copy and buttons');
ok(mo.room.src.includes('phone') && mo.seat.src.includes('phone'),
   `phone framings are served (${mo.room.src}, ${mo.seat.src})`);
ok(mo.over === 0, `no horizontal overflow (${mo.over}px)`);
console.log(fails ? `\n${fails} FAILED` : '\nboth interior scenes pass');
await b.close();
process.exit(fails ? 1 : 0);
