/* Selected-work stage QC ───────────────────────────────────────────
   Four things that would be invisible in a screenshot and fatal in
   use: that exactly one project is live at any scroll position and
   that the index and the stage agree on which; that the capture is
   contained by its plate rather than clipped by it; that every
   project is reachable by keyboard; and that on a narrow screen each
   capture sits under its own name rather than after all three.

   Run: node scripts/qc/stage.mjs                                   */
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fail = 0;
const say = (ok, line) => { if (!ok) fail++; console.log(`${ok ? ' ok ' : 'FAIL'}  ${line}`); };

async function open(viewport, js = true) {
  const ctx = await browser.newContext({ viewport, javaScriptEnabled: js });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.style.scrollBehavior = 'auto';
    });
  });
  await pg.goto('file:///home/user/STIR/index.html', { waitUntil: 'load' });
  if (js) {
    await pg.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });
  }
  await pg.waitForTimeout(600);
  return { ctx, pg };
}

/* 1 · one live project, index and stage agreeing, all the way down */
for (const viewport of [{ width: 1440, height: 900 }, { width: 1180, height: 820 }, { width: 1024, height: 768 }]) {
  const { ctx, pg } = await open(viewport);
  const seen = new Set();
  let bad = 0, steps = 0;
  const range = await pg.evaluate(() => {
    const r = document.querySelector('.site-stage').getBoundingClientRect();
    return [r.top + window.scrollY - window.innerHeight * 0.5, r.bottom + window.scrollY];
  });
  for (let i = 0; i <= 30; i++) {
    const y = Math.round(range[0] + ((range[1] - range[0]) * i) / 30);
    const r = await pg.evaluate(async (y) => {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 80));
      const rows = [...document.querySelectorAll('.site-row')].map((e) => e.classList.contains('is-active'));
      const shots = [...document.querySelectorAll('.site-shot')].map((e) => e.classList.contains('is-active'));
      return { rows, shots };
    }, y);
    steps++;
    const nRow = r.rows.filter(Boolean).length, nShot = r.shots.filter(Boolean).length;
    if (nRow !== 1 || nShot !== 1 || r.rows.indexOf(true) !== r.shots.indexOf(true)) bad++;
    else seen.add(r.rows.indexOf(true));
  }
  say(bad === 0 && seen.size === 3,
    `${viewport.width}w  one live project, index and stage agreeing  (${steps - bad}/${steps} positions, ${seen.size}/3 projects reached)`);

  /* 2 · the capture is contained, not clipped */
  const fit = await pg.evaluate(() => {
    const out = [];
    document.querySelectorAll('.site-shot').forEach((sh) => {
      sh.classList.add('is-active');
      const plate = document.querySelector('.site-screen-inner').getBoundingClientRect();
      const img = sh.querySelector('img').getBoundingClientRect();
      out.push(img.width <= plate.width + 1 && img.height <= plate.height + 1 && img.width > 100);
      sh.classList.remove('is-active');
    });
    return out;
  });
  say(fit.every(Boolean), `${viewport.width}w  every capture fits inside its plate`);

  /* 3 · keyboard reaches all three */
  const tabbed = await pg.evaluate(() => {
    const names = [...document.querySelectorAll('.site-name a')];
    return names.every((a) => a.tabIndex >= 0 && a.offsetParent !== null);
  });
  say(tabbed, `${viewport.width}w  all three project links are focusable`);
  await ctx.close();
}

/* 4 · narrow: name, then its own capture, then the next name */
for (const viewport of [{ width: 768, height: 1024 }, { width: 390, height: 844 }]) {
  const { ctx, pg } = await open(viewport);
  const order = await pg.evaluate(() => {
    const items = [...document.querySelectorAll('.site-row, .site-shot')]
      .map((e) => ({ kind: e.classList.contains('site-row') ? 'row' : 'shot', i: +e.dataset.site, top: e.getBoundingClientRect().top }))
      .sort((a, b) => a.top - b.top);
    return items.map((x) => x.kind + x.i).join(' ');
  });
  say(order === 'row0 shot0 row1 shot1 row2 shot2', `${viewport.width}w  interleaved: ${order}`);
  await ctx.close();
}

/* 5 · no script: everything present, nothing hidden */
{
  const { ctx, pg } = await open({ width: 1440, height: 900 }, false);
  const r = await pg.evaluate(() => {
    const shots = [...document.querySelectorAll('.site-shot')];
    const vis = shots.every((s) => getComputedStyle(s).visibility !== 'hidden' && +getComputedStyle(s).opacity > 0.9);
    const caps = shots.every((s) => getComputedStyle(s.querySelector('.site-shot-cap')).display !== 'none');
    const cover = document.querySelector('.stir-enter');
    return { vis, caps, cover: cover ? getComputedStyle(cover).display : 'absent', links: document.querySelectorAll('.site-name a').length };
  });
  say(r.vis && r.caps && r.links === 3, `no script  all three captures shown with their names (${r.links} links)`);
  say(r.cover === 'none', `no script  the entrance cover does not block the page (display: ${r.cover})`);
  await ctx.close();
}

await browser.close();
console.log(fail ? `${fail} checks failed` : 'the stage holds at every width, with and without script');
process.exit(fail ? 1 : 0);
