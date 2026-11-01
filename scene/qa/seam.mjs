/* Is there a visible edge where the scene meets the page?
   Sampled in the browser via canvas, because the exports carry no
   colour tags and the browser's decode is what the visitor sees. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(3500);

console.log(await p.evaluate(() => {
  const hex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0').toUpperCase()).join('');
  const corner = (el, w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(el, 0, 0, w, h);
    const d = x.getImageData(2, 2, 1, 1).data;      // empty background, top-left
    return { rgb: [d[0], d[1], d[2]], hex: hex(d[0], d[1], d[2]) };
  };
  const page = getComputedStyle(document.body).backgroundColor
    .match(/\d+/g).map(Number);
  const img = document.querySelector('.stage-still');
  const vid = document.querySelector('.stage-loop');
  const out = { pageBackground: { rgb: page, hex: hex(...page) },
                poster: corner(img, img.naturalWidth, img.naturalHeight) };
  if (vid && vid.videoWidth) out.video = corner(vid, vid.videoWidth, vid.videoHeight);
  const dd = (a) => Math.max(...a.rgb.map((v, i) => Math.abs(v - page[i])));
  out.posterDelta = dd(out.poster);
  if (out.video) out.videoDelta = dd(out.video);
  out.verdict = Math.max(out.posterDelta, out.videoDelta ?? 0) <= 2 ? 'no visible seam' : 'VISIBLE SEAM';
  return out;
}));
await b.close();
