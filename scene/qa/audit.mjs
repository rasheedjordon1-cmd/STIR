import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const PAGES = ['index','labay','businesses','creators','collaborate','about','contact'];

console.log('── heading structure');
for (const n of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`http://127.0.0.1:8080/${n}.html`, { waitUntil: 'domcontentloaded' });
  const r = await p.evaluate(() => {
    const hs = [...document.querySelectorAll('main h1, main h2, main h3')];
    const order = hs.map(h => +h.tagName[1]);
    let jump = null;
    for (let i = 1; i < order.length; i++) if (order[i] - order[i-1] > 1) jump = `h${order[i-1]}→h${order[i]}`;
    return { h1: document.querySelectorAll('main h1').length, jump,
             first: hs.length ? 'h' + order[0] : 'none',
             landmarks: ['header','nav','main','footer'].filter(t => document.querySelector(t)).join(',') };
  });
  console.log(`  ${n.padEnd(12)} h1:${r.h1}  starts:${r.first.padEnd(4)} skip:${r.jump || '-'}  landmarks:${r.landmarks}`);
  await p.close();
}

console.log('\n── headline with the webfont blocked (real fallback metrics)');
for (const w of [1440, 1024, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route('**/founders-grotesk-*.woff2', r => r.abort());
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    // The spans are display:block, so their box is the column width and
    // tells you nothing. Measure the TEXT with a Range, and ask the
    // element whether its content overflows its box.
    const out = [];
    document.querySelectorAll('.hero h1 span').forEach(sp => {
      const rg = document.createRange(); rg.selectNodeContents(sp);
      out.push({ t: sp.textContent.trim(), text: Math.round(rg.getBoundingClientRect().width),
                 box: Math.round(sp.getBoundingClientRect().width),
                 clipped: sp.scrollWidth > sp.clientWidth + 1 });
    });
    // did the webfont actually fail?
    const loaded = document.fonts.check('700 112px "Founders Grotesk"');
    return { out, loaded, over: Math.round(document.documentElement.scrollWidth - document.documentElement.clientWidth) };
  });
  console.log(`  ${w}px  webfont loaded: ${r.loaded}  page overflow ${r.over}px`);
  r.out.forEach(l => console.log(`      "${l.t}" text ${l.text}px in ${l.box}px box${l.clipped ? '  ← CLIPPED' : ''}`));
  await ctx.close();
}
await b.close();
