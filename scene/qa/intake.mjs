/**
 * R9 / R10 (client half) — the typed intake.
 *
 * This deliberately never POSTs. Submitting would put a real record in
 * the owner's Netlify inbox, so delivery is NOT verified here and is
 * reported as an unverified dependency. What is verified: the route
 * switching, value preservation, which fields a record would carry,
 * validation, and the double-submit guard.
 */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

async function open(q = '') {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  // Block the POST outright: a stray submit must not reach the network.
  await p.route('**/contact*', r => r.request().method() === 'POST' ? r.abort() : r.continue());
  await p.goto('http://127.0.0.1:8080/contact.html' + q, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  return p;
}
const visible = (p, sel) => p.evaluate(s => {
  const el = document.querySelector(s);
  return !!el && !el.closest('[data-for]')?.hidden;
}, sel);

console.log('\nroute selection from ?type=');
for (const [q, want] of [['?type=business', 'business'], ['?type=creator', 'creator'],
                         ['?type=collaborator', 'collaborator'], ['', 'business']]) {
  const p = await open(q);
  const got = await p.evaluate(() => document.querySelector('input[name="type"]:checked').value);
  ok(got === want, `${q || '(no query)'} selects "${got}"`);
  await p.close();
}

console.log('\neach route shows its own questions');
/* The brief consolidates the creator and collaborator questions into
   one "Tell us a little more" field whose help text follows the route,
   so the only route-specific FIELDS are the business pair. */
{
  const p = await open('?type=business');
  ok(await visible(p, '#f-business'), 'business sees the business name');
  ok(await visible(p, 'input[name="engagement"]'), 'and how to work together');
  await p.click('input[name="type"][value="creator"]');
  ok(!(await visible(p, '#f-business')), 'creator does not see the business name');
  ok(!(await visible(p, 'input[name="engagement"]')), 'nor the engagement question');
  await p.click('input[name="type"][value="general"]');
  ok(!(await visible(p, '#f-business')), 'general sees neither');
  ok(await visible(p, '#f-message'), 'but every route gets the open question');
  await p.close();
}

console.log('\nshared values survive a route change');
{
  const p = await open('?type=business');
  await p.fill('#f-name', 'Test Person');
  await p.fill('#f-email', 'test@example.com');
  await p.fill('#f-message', 'A line about the work.');
  await p.fill('#f-business', 'Some Shop');
  await p.click('input[name="type"][value="creator"]');
  await p.click('input[name="type"][value="business"]');
  const v = await p.evaluate(() => ({
    n: document.getElementById('f-name').value,
    e: document.getElementById('f-email').value,
    m: document.getElementById('f-message').value,
    b: document.getElementById('f-business').value,
  }));
  ok(v.n === 'Test Person' && v.e === 'test@example.com' && v.m === 'A line about the work.',
     'name, email and message are all preserved');
  ok(v.b === 'Some Shop', 'and the business answer survives leaving and returning to that route');
  await p.close();
}

console.log('\nthe record carries only the asked questions');
{
  const p = await open('?type=creator');
  const names = await p.evaluate(() => {
    const d = new FormData(document.getElementById('inquiry'));
    return [...d.keys()];
  });
  ok(names.includes('type') && names.includes('message'), `creator record has type + message (${names.join(', ')})`);
  ok(!names.includes('business') && !names.includes('engagement') && !names.includes('brings'),
     'and not the other routes’ fields');
  ok(names.includes('form-name'), 'form-name is present for Netlify’s handler');
  await p.close();
}

console.log('\nvalidation and the submit guard');
{
  const p = await open();
  await p.click('#submit');
  await p.waitForTimeout(250);
  ok(await p.evaluate(() => document.getElementById('f-name').getAttribute('aria-invalid') === 'true'),
     'an empty required field is marked aria-invalid');
  ok(await p.evaluate(() => !document.getElementById('e-name').hidden),
     'with an adjacent message, not colour alone');
  ok(await p.evaluate(() => document.activeElement.id === 'f-name'), 'focus moves to the first bad field');
  ok(await p.evaluate(() => document.getElementById('submit').textContent.indexOf('Sending') === -1),
     'and it does NOT claim to be sending');
  ok(await p.evaluate(() => document.querySelector('[data-help]').textContent.indexOf('working') > -1),
     'the business route shows its own help text');
  await p.fill('#f-email', 'not-an-email');
  await p.click('#submit');
  await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.getElementById('f-email').getAttribute('aria-invalid') === 'true'),
     'a malformed email is caught');
  await p.close();
}
console.log('\nhelp text follows the route');
{
  const p = await open('?type=creator');
  ok((await p.textContent('[data-help]')).indexOf('make') > -1, 'creator help text');
  await p.click('input[name="type"][value="collaborator"]');
  ok((await p.textContent('[data-help]')).indexOf('bring') > -1, 'collaborator help text');
  await p.click('input[name="type"][value="general"]');
  ok((await p.textContent('[data-help]')).indexOf('talk about') > -1, 'general help text');
  await p.close();
}
console.log('\nengagement deep-link from /businesses');
{
  const p = await open('?type=business&engagement=partnership');
  ok(await p.evaluate(() => document.querySelector('input[name="engagement"]:checked').value === 'Ongoing partnership'),
     '?engagement=partnership preselects the partnership option');
  await p.close();
  const q = await open('?type=business&engagement=project');
  ok(await q.evaluate(() => document.querySelector('input[name="engagement"]:checked').value === 'Defined project'),
     '?engagement=project preselects the project option');
  await q.close();
}
console.log(fails ? `\n${fails} FAILED` : '\nintake: all client-side checks pass');
console.log('NOT verified here: actual delivery. Submitting would file a real record in the owner’s inbox.');
await b.close();
process.exit(fails ? 1 : 0);
