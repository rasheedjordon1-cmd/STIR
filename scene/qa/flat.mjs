import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(3500);
console.log(await p.evaluate(() => {
  const scan = (el, w, h, label) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(el, 0, 0, w, h);
    // the lower-left quadrant is empty background in this composition
    // true empty corner: the building is centre-left, the sheet runs right
    const d = x.getImageData(0, 0, Math.floor(w * 0.14), Math.floor(h * 0.12)).data;
    const seen = new Map();
    for (let i = 0; i < d.length; i += 4) {
      const k = d[i] + ',' + d[i+1] + ',' + d[i+2];
      seen.set(k, (seen.get(k) || 0) + 1);
    }
    const top = [...seen.entries()].sort((a, b2) => b2[1] - a[1]).slice(0, 5);
    const n = d.length / 4;
    return { label, distinctColours: seen.size,
             top: top.map(([k, v]) => `${k} (${(v / n * 100).toFixed(1)}%)`) };
  };
  const img = document.querySelector('.stage-still');
  const vid = document.querySelector('.stage-loop');
  const out = [scan(img, img.naturalWidth, img.naturalHeight, 'poster')];
  if (vid && vid.videoWidth) out.push(scan(vid, vid.videoWidth, vid.videoHeight, 'video'));
  return out;
}));
await b.close();
