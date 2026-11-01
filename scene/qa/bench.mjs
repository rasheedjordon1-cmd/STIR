/* C — the workbench: one connected frame, aligned regions, each
   illustration running once, completed state without JS or motion. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await p.evaluate(() => document.querySelector('.bench').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(1600);

const r = await p.evaluate(() => {
  const bench = document.querySelector('.bench');
  const cells = [...document.querySelectorAll('.bench-cell')];
  const cs = (el, prop) => getComputedStyle(el)[prop];
  const boxes = cells.map(c => c.getBoundingClientRect());
  const slots = [...document.querySelectorAll('.bench-slot')].map(s => Math.round(s.getBoundingClientRect().top));
  const outs = [...document.querySelectorAll('.bench-out')].map(s => Math.round(s.getBoundingClientRect().bottom));
  return {
    cells: cells.length,
    outer: cs(bench, 'borderTopWidth'),
    internal: cs(cells[1], 'borderLeftWidth'),
    firstNoLeft: cs(cells[0], 'borderLeftWidth'),
    gaps: boxes.slice(1).map((bx, i) => Math.round(bx.left - boxes[i].right)),
    equalWidth: new Set(boxes.map(bx => Math.round(bx.width))).size === 1,
    slotsAligned: new Set(slots).size === 1,
    outsAligned: new Set(outs).size,
    triggered: cells.filter(c => c.classList.contains('is-in')).length,
    headings: cells.map(c => c.querySelector('h3').textContent.trim()),
    svgHidden: [...document.querySelectorAll('.bench-art')].every(s => s.getAttribute('aria-hidden') === 'true'),
    tabStops: bench.querySelectorAll('a,button,[tabindex]').length,
  };
});
ok(r.cells === 3, `three compartments (${r.cells})`);
ok(r.outer === '2px' && r.internal === '1px' && r.firstNoLeft === '0px',
   `2px outer, 1px internal drawn once (outer ${r.outer}, internal ${r.internal}, first ${r.firstNoLeft})`);
ok(r.gaps.every(g => g <= 1), `zero gaps between compartments (${r.gaps.join(',')})`);
ok(r.equalWidth, 'equal widths');
ok(r.slotsAligned, 'illustration regions aligned');
ok(r.outsAligned === 1, `outcome lines aligned (${r.outsAligned} distinct baselines)`);
ok(r.triggered === 3, `all three illustrations triggered on entry (${r.triggered}/3)`);
ok(r.headings.join(' ') === 'Read the room. Set the scene. Make it travel.'.replace(/\. /g, '. ').trim()
   || r.headings.every((h,i) => h.includes(['Read the room','Set the scene','Make it travel'][i])),
   `headings: ${r.headings.join(' / ')}`);
ok(r.svgHidden, 'illustrations are aria-hidden');
ok(r.tabStops === 0, `no fake keyboard stops inside the panels (${r.tabStops})`);
await p.screenshot({ path: 'out/site/bench.png', clip: await p.evaluate(() => {
  const b = document.querySelector('.bench').getBoundingClientRect();
  return { x: b.x - 4, y: b.y - 40, width: b.width + 8, height: b.height + 48 };
}) });
await p.close();

/* reduced motion and no-JS must show the completed illustrations */
for (const [label, opts, js] of [['reduced motion', { reducedMotion: 'reduce' }, true], ['no JavaScript', { javaScriptEnabled: false }, false]]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const q = await ctx.newPage();
  await q.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'load' });
  await q.waitForTimeout(900);
  const v = await q.evaluate(() => {
    const o = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).opacity : 'none'; };
    return { pick: o('.bench-pick'), mounts: o('.bench-mounts'),
             copy: document.querySelectorAll('.bench-cell p').length };
  });
  ok(v.pick === '1' && v.mounts === '1', `${label}: illustrations show completed (pick ${v.pick}, mounts ${v.mounts})`);
  ok(v.copy >= 6, `${label}: all copy present (${v.copy} paragraphs)`);
  await ctx.close();
}
console.log(fails ? `\n${fails} FAILED` : '\nworkbench: all checks pass');
await b.close();
process.exit(fails ? 1 : 0);
