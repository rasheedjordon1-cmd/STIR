import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let bad = 0;

// The real test: does the browser's parser agree with the markup?
// An unbalanced tag does not error — it silently reparents everything
// after it, which on the standalone build is invisible because the CSS
// is unscoped, and fatal under Squarespace because it is not.
for (const [name, url, scoped] of [
  ['standalone',   'file:///home/user/STIR/index.html', false],
  ['sqsp-preview', 'file:///home/user/STIR/squarespace/_preview.html', true],
]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url + '?' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate((scoped) => {
    const out = { sectionsInMain: [], orphans: [], outsideScope: [] };
    // the host's own wrappers are not ours to police
    const ours = e => !e.classList.contains('page-section');
    document.querySelectorAll('main section').forEach(s => out.sectionsInMain.push(s.className.split(' ')[0]));
    document.querySelectorAll('section').forEach(s => {
      if (ours(s) && !s.closest('main')) out.orphans.push(s.className.split(' ')[0]);
    });
    if (scoped) {
      document.querySelectorAll('main section, .svc, .creator, .trade, .footer').forEach(e => {
        if (ours(e) && !e.closest('.stir')) out.outsideScope.push(e.className.split(' ')[0]);
      });
    }
    return out;
  }, scoped);
  const ok = r.orphans.length === 0 && r.outsideScope.length === 0;
  if (!ok) bad++;
  console.log((ok ? 'PASS ' : 'FAIL ') + name.padEnd(14),
    r.sectionsInMain.length + ' sections in <main>',
    r.orphans.length ? '| orphaned: ' + r.orphans : '',
    r.outsideScope.length ? '| outside .stir: ' + [...new Set(r.outsideScope)] : '');
  await p.close();
}
await b.close();
process.exit(bad ? 1 : 0);
