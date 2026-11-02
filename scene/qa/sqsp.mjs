/* Render the generated package inside the hostile mock and report
   whether the host's styles leaked through. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };
const ORIGIN = 'http://127.0.0.1:8080';

for (const [name, file] of [['home', '_preview.html'], ['labay', '_preview-page-labay.html'], ['contact', '_preview-page-contact.html']]) {
  console.log('\n' + name);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:8080/squarespace/' + file, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const cs = (s, prop) => { const el = document.querySelector(s); return el ? getComputedStyle(el)[prop] : null; };
    // not .utility headings: those are mono by design
    const h = document.querySelector('.stir h1:not(.utility), .stir h2:not(.utility)');
    return {
      token: getComputedStyle(document.querySelector('.stir')).getPropertyValue('--cobalt').trim(),
      headFont: h ? getComputedStyle(h).fontFamily.split(',')[0] : null,
      headWeight: h ? getComputedStyle(h).fontWeight : null,
      linkDecor: cs('.stir .nav-links a', 'textDecorationLine'),
      // Only meaningful on a real list: list-style-type is inherited,
      // so a div reports 'disc' without ever drawing a marker.
      bullets: document.querySelector('.stir ul') ? cs('.stir ul', 'listStyleType') : 'n/a',
      hostHeader: cs('#header', 'display'),
      hostFooter: cs('#footer-sections', 'display'),
      stirWidth: Math.round(document.querySelector('.stir').getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      btnRadius: cs('.stir .action-label', 'borderRadius'),
    };
  });
  ok(r.token === '#0451AB', `tokens resolve on .stir (--cobalt ${r.token || 'MISSING'})`);
  ok(r.headFont === '"Founders Grotesk"', `headings keep our font, not the host's Georgia (${r.headFont})`);
  ok(r.headWeight === '700', `and our weight, not the host's normal (${r.headWeight})`);
  ok(r.linkDecor === 'none', `nav links are not host-underlined (${r.linkDecor})`);
  ok(r.bullets === 'none' || r.bullets === 'n/a', `no disc bullets on real lists (${r.bullets})`);
  ok(r.hostHeader === 'none' && r.hostFooter === 'none', 'the host header and footer are hidden');
  ok(r.stirWidth >= 1430, `the block escapes the padded wrappers (${r.stirWidth}px of 1440)`);
  ok(r.overflow === 0, `no horizontal overflow (${r.overflow}px)`);
  ok(errs.length === 0, `no page errors${errs.length ? ': ' + errs.join('; ') : ''}`);
  await p.screenshot({ path: `out/site/sqsp-${name}.png`, fullPage: name !== 'home' });
  await p.close();
}

/* The hero loop, in the host's document.
   The footer script used a relative path for the loop, which on a
   foreign origin resolves to <that host>/assets/... — a 404, after
   which its own error handler removes the video and the hero falls
   back to the still. Nothing here asked whether it moved, so the
   preview rendered a static hero and still reported a clean pass. */
console.log('\nthe hero loop, on the host origin');
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const missing = [];
  p.on('response', r => { if (r.status() >= 400) missing.push(r.status() + ' ' + r.url().replace(ORIGIN, '')); });
  await p.goto(ORIGIN + '/squarespace/_preview.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  const v = await p.evaluate(() => {
    const stage = document.querySelector('.stage[data-scene]');
    const el = document.querySelector('.stage-loop');
    return { stage: !!stage, on: !!stage && stage.classList.contains('has-loop'),
             el: !!el, src: el ? (el.currentSrc || el.src) : '', btn: !!document.querySelector('.stage-motion') };
  });
  ok(v.stage, 'the hero stage is in the pasted markup');
  ok(v.el, v.el ? `the loop element survives (${v.src.split('/').pop()})` : 'the loop was DROPPED — its src 404d on this origin');
  ok(v.on && v.btn, 'it attached and the motion control is offered');
  const t1 = await p.evaluate(() => { const e = document.querySelector('.stage-loop'); return e ? e.currentTime : -1; });
  await p.waitForTimeout(1200);
  const t2 = await p.evaluate(() => { const e = document.querySelector('.stage-loop'); return e ? e.currentTime : -1; });
  ok(t2 > t1, `and it is actually playing (${t1.toFixed(2)} -> ${t2.toFixed(2)})`);
  ok(!missing.length, missing.length ? 'asset 404s: ' + missing.join(', ') : 'no asset 404s on the page');
  await p.close();
}


/* Phone width, against the standalone site.
   This preview only ever ran at 1440, and two bugs lived in that gap
   for as long as it did.

   The scoper lost every rule in the first `@media (max-width: 1023px)`
   block — a comment sat directly above the at-rule and the cursor was
   on the newline before it, so neither the comment branch nor the
   at-rule branch fired and the whole block was emitted unscoped, to
   lose to the unprefixed base rules on specificity. The hero never
   collapsed on a phone: headline and diorama side by side in half a
   screen each, the headline breaking mid-word because that was the
   only way it fit.

   And the mock set the host's font on headings but not its colour, so
   a heading colour leaking from the real theme was invisible here.

   Comparing against the standalone site rather than against fixed
   numbers is the point: the question is never "is this value right",
   it is "does the package render what the site renders". */
console.log('\nphone width matches the standalone site');
{
  const read = async (url) => {
    const q = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await q.goto(url, { waitUntil: 'networkidle' });
    await q.waitForTimeout(900);
    const r = await q.evaluate(() => {
      const col = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).color : 'absent'; };
      const g = document.querySelector('.hero-grid');
      const h1 = document.querySelector('.hero h1');
      return {
        heroColumns: getComputedStyle(g).gridTemplateColumns.split(' ').length,
        h1FontSize: Math.round(parseFloat(getComputedStyle(h1).fontSize)),
        h1Width: Math.round(h1.getBoundingClientRect().width),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        c_h1span: col('.hero h1 span'),
        c_lede: col('.hero .lede'),
        c_actionLabel: col('.action-label'),
        c_action2: col('.action-2'),
        c_navLink: col('.nav-links a'),
      };
    });
    await q.close();
    return r;
  };
  const site = await read(ORIGIN + '/index.html');
  const pkg = await read(ORIGIN + '/squarespace/_preview.html');
  ok(site.heroColumns === 1, `the site's hero is one column on a phone (${site.heroColumns})`);
  for (const k of Object.keys(site)) {
    ok(pkg[k] === site[k], `${k}: package ${pkg[k]} === site ${site[k]}`);
  }
}

console.log(fails ? `\n${fails} FAILED` : '\nthe package survives the hostile host');
await b.close();
process.exit(fails ? 1 : 0);
