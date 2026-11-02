/**
 * The submit path, end to end, WITHOUT sending anything real.
 *
 * Every request to formspree.io is intercepted and answered locally, so
 * no record is ever filed. That lets both outcomes be exercised: the
 * accepted path and the rejected one.
 */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

async function run(label, fulfil) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  let sent = null;
  await ctx.route('https://formspree.io/**', async (route) => {
    sent = { method: route.request().method(), url: route.request().url(),
             body: route.request().postData() || '' };
    await route.fulfill(fulfil);
  });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:8080/contact.html?type=business', { waitUntil: 'networkidle' });
  await p.fill('#f-name', 'Test Person');
  await p.fill('#f-email', 'test@example.com');
  await p.fill('#f-business', 'Some Shop');
  await p.fill('#f-message', 'A line about the work.');
  await p.click('#submit');
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({
    status: document.getElementById('status').textContent.trim(),
    label: document.querySelector('#submit .action-label').textContent.trim(),
    busy: document.getElementById('submit').getAttribute('aria-busy'),
    name: document.getElementById('f-name').value,
    message: document.getElementById('f-message').value,
    url: location.href,
  }));
  console.log(`\n${label}`);
  await ctx.close();
  return { sent, r };
}

console.log('endpoint accepts');
{
  const { sent, r } = await run('', { status: 200, contentType: 'application/json', body: '{"ok":true}' });
  ok(sent && sent.method === 'POST', `posted to ${sent && sent.url}`);
  ok(/name=|Test Person/.test(sent.body), 'the answers are in the request body');
  ok(/_gotcha/.test(sent.body), 'the honeypot field travels with it');
  ok(/type=business|business/.test(sent.body), 'the route type is included');
  ok(r.status === 'Your note is in. Thanks for introducing yourself.', `success wording: "${r.status}"`);
  ok(r.label === 'Send your note' && r.busy === null, 'the button settles back');
  ok(r.name === '' && r.message === '', 'the form clears only on success');
  ok(!/sent=1/.test(r.url), 'and the visitor stays on the page');
}

console.log('endpoint rejects');
{
  const { r } = await run('', { status: 500, contentType: 'application/json', body: '{"error":"nope"}' });
  ok(/couldn’t be sent/.test(r.status), `error wording: "${r.status}"`);
  ok(/Your answers are still here/.test(r.status), 'and it says the answers are kept');
  ok(r.name === 'Test Person' && r.message === 'A line about the work.',
     'the answers really are still there');
  ok(r.label === 'Send your note' && r.busy === null, 'the button is usable again');
}
console.log(fails ? `\n${fails} FAILED` : '\nsubmit path: all checks pass (no real submission was made)');
await b.close();
process.exit(fails ? 1 : 0);
