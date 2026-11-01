/**
 * R4 — the hero scene's fallback and control states.
 *
 * Each case asserts what a visitor actually gets, not that a code path ran:
 * the still must be the correct per-breakpoint render in every failure mode,
 * and a pause the visitor asked for must survive tab and scroll changes.
 */
import { chromium } from 'playwright-core';

const URL = 'http://127.0.0.1:8080/index.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let fails = 0;
const ok = (c, m) => { console.log(`  ${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fails++; };

async function page(opts = {}) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, ...opts });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  return p;
}
const still = (p) => p.evaluate(() => {
  const i = document.querySelector('.hero-still');
  return { src: i && i.currentSrc.split('/').pop(), w: i && i.naturalWidth, shown: !!(i && i.offsetWidth) };
});
const loop = (p) => p.evaluate(() => {
  const v = document.querySelector('.hero-loop');
  return v ? { playing: !v.paused, on: v.classList.contains('is-on'), muted: v.muted } : null;
});

console.log('\nreduced motion');
{
  const p = await page({ reducedMotion: 'reduce' });
  ok(!(await loop(p)), 'no video element is created at all');
  const s = await still(p);
  ok(s.shown && s.w === 820, `the desktop still carries the hero (${s.src}, ${s.w}px)`);
  await p.close();
}

console.log('\nno javascript');
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(900);
  ok(!(await loop(p)), 'no video');
  const s = await still(p);
  ok(s.shown && s.w === 820, `the still still paints (${s.src}, ${s.w}px)`);
  const h = await p.evaluate(() => document.querySelector('.hero-headline').offsetHeight > 40);
  ok(h, 'the headline is live text, not part of an image');
  await ctx.close();
}

console.log('\nmissing media');
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/assets/scene/hero-*.webm', (r) => r.abort());
  await ctx.route('**/assets/scene/hero-*.mp4', (r) => r.abort());
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load' });
  await p.waitForTimeout(2200);
  ok(!(await loop(p)), 'the failed video removes itself rather than sitting black');
  ok(!(await p.$('.hero-motion')), 'and takes its control with it');
  const s = await still(p);
  ok(s.shown, 'the still is what remains');
  await ctx.close();
}

console.log('\npause control');
{
  const p = await page();
  ok((await loop(p)).playing, 'the loop autoplays muted');
  ok((await loop(p)).muted, 'and is muted');
  // keyboard: reachable and operable without a pointer
  const reached = await p.evaluate(async () => {
    const btn = document.querySelector('.hero-motion');
    btn.focus();
    return document.activeElement === btn;
  });
  ok(reached, 'the control takes keyboard focus');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  ok(!(await loop(p)).playing, 'Enter pauses it');
  ok((await p.textContent('.hero-motion')).trim() === 'Play motion', 'and the label says what it will now do');

  // the pause must survive a hidden tab
  await p.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await p.waitForTimeout(200);
  await p.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await p.waitForTimeout(400);
  ok(!(await loop(p)).playing, 'a user pause survives the tab going away and coming back');

  // and scrolling it out of view and back
  await p.evaluate(() => window.scrollTo(0, 3000));
  await p.waitForTimeout(500);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  ok(!(await loop(p)).playing, 'and survives scrolling away and back');

  await p.keyboard.press('Enter');
  await p.waitForTimeout(400);
  ok((await loop(p)).playing, 'pressing again resumes it');
  await p.close();
}

console.log(fails ? `\n${fails} FAILED` : '\nall hero-loop states pass');
await b.close();
process.exit(fails ? 1 : 0);
