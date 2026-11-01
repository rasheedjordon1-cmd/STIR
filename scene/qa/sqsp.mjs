/* Render the generated package inside the hostile mock and report
   whether the host's styles leaked through. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

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
console.log(fails ? `\n${fails} FAILED` : '\nthe package survives the hostile host');
await b.close();
process.exit(fails ? 1 : 0);
