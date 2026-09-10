/**
 * Builds a single self-contained HTML file of the storefront for demo/sharing.
 *
 * It reuses the REAL stylesheets verbatim (tokens, globals and all four CSS
 * modules) and inlines every image as a data URI, so what ships is the actual
 * design system rather than a re-creation. What it does re-author is the markup
 * and the interactivity, in vanilla JS — the app itself is React, and a single
 * portable file cannot carry the framework.
 *
 * Consequence to keep in mind: the copy here is a SNAPSHOT. The running app
 * reads content/*.ts; this file does not. Re-run after content changes.
 *
 *   node scripts/build-demo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'

const css = (p) => readFileSync(p, 'utf8')
const b64 = (p, mime) => `data:${mime};base64,${readFileSync(p).toString('base64')}`

/* ---------- stylesheets, in cascade order ---------- */
const STYLES = [
  'app/tokens.css',
  'app/globals.css',
  'components/ui/ui.module.css',
  'components/chrome/chrome.module.css',
  'components/commerce/buy.module.css',
  'components/sections/sections.module.css',
]
  .map(css)
  .join('\n')
  .replace(/@import\s+['"][^'"]+['"];/g, '') // tokens are concatenated, not imported
  .replace(/\/\*[\s\S]*?\*\//g, '') // comments belong in the source, not the shipped file
  .replace(/\n{3,}/g, '\n\n')

/* ---------- assets ---------- */
const A = {
  mmInk: b64('public/brand/mastermark-ink.png', 'image/png'),
  mmCream: b64('public/brand/mastermark-cream.png', 'image/png'),
  hero: b64('public/photo/hero-pass.webp', 'image/webp'),
  packStudio: b64('public/photo/pack-studio.webp', 'image/webp'),
  packWood: b64('public/photo/pack-wood.webp', 'image/webp'),
  poster: b64('public/poster/one-more-cup.webp', 'image/webp'),
  prov: b64('public/cil/provenance-hand-pod.webp', 'image/webp'),
  eduWhole: b64('public/cil/edu-whole-cacao.webp', 'image/webp'),
  eduPowder: b64('public/cil/edu-cocoa-powder.webp', 'image/webp'),
  curiosity: b64('public/cil/curiosity-tell-me-more.webp', 'image/webp'),
  steam: b64('public/cil/micro-double-steam.webp', 'image/webp'),
  podHalf: b64('public/cil/micro-split-pod-half.webp', 'image/webp'),
}

/* ---------- CIL micro-marks (same geometry as CilMarks.tsx) ---------- */
const seed = (s = 13) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 5.4c3.1 1.9 4.6 4 4.6 6.6S15.1 16.7 12 18.6c-3.1-1.9-4.6-4-4.6-6.6S8.9 7.3 12 5.4Z" fill="currentColor"/><path d="M12 7.6v8.8" stroke="var(--bg)" stroke-width="1.6" stroke-linecap="round"/></svg>`
const shard = (s = 14) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M8.6 2.4 20.4 6a2 2 0 0 1 1.4 2.3l-2 9.6a2 2 0 0 1-2.4 1.6L5.2 16.6a2 2 0 0 1-1.5-1.7L2.5 5.1a2 2 0 0 1 2.6-2.2Z" fill="currentColor"/><path d="M8.9 6.2 15.6 15" stroke="var(--bg)" stroke-width="1.5" stroke-linecap="round"/></svg>`
const cupRim = (s = 13) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10.5" fill="currentColor"/><circle cx="12" cy="12" r="6.2" fill="var(--bg)"/><circle cx="12" cy="12" r="3.4" fill="currentColor"/></svg>`
const finger = (s = 16) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="9.4" width="9" height="6.6" rx="3.3" fill="currentColor"/><rect x="10.4" y="10.4" width="10.2" height="4.6" rx="2.3" fill="currentColor"/><rect x="5.4" y="14.2" width="7.6" height="4.4" rx="2.2" fill="currentColor"/><path d="M13.4 12.7h6" stroke="var(--bg)" stroke-width="1.1" stroke-linecap="round"/><path d="M7.2 13.6h4.4" stroke="var(--bg)" stroke-width="1.1" stroke-linecap="round"/></svg>`

/* ---------- preparation artwork (same paths as CilArt.tsx) ---------- */
const prepBreak = `<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><path d="M26 74h86l-14 44 16 44H26a10 10 0 0 1-10-10V84a10 10 0 0 1 10-10Z"/><g transform="rotate(9 178 118)"><path d="M136 74h78a10 10 0 0 1 10 10v68a10 10 0 0 1-10 10h-80l16-44Z"/></g></g><g stroke="var(--bg)" stroke-width="6"><path d="M16 118h84M144 122h84"/><path d="M62 74v88"/><path d="M186 70v92"/></g><g fill="currentColor"><path d="M40 190l30 8-6 26-30-8Z"/><path d="M92 196l24 6-5 21-24-6Z" transform="rotate(-12 104 210)"/><path d="M150 192l26 7-5 22-26-7Z" transform="rotate(8 163 206)"/></g></svg>`
const prepMelt = `<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M96 62c-12-14 9-22-3-36M132 62c-12-14 9-22-3-36"/></g><g fill="currentColor"><path d="M42 86h144v72a44 44 0 0 1-44 44H86a44 44 0 0 1-44-44Z"/><rect x="182" y="96" width="52" height="20" rx="10"/></g><path d="M42 112h144" stroke="var(--bg)" stroke-width="6"/><g fill="var(--bg)"><rect x="106" y="60" width="14" height="86" rx="7" transform="rotate(14 113 103)"/><ellipse cx="126" cy="150" rx="18" ry="12" transform="rotate(14 126 150)"/></g></svg>`
const prepMake = `<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"><path d="M88 48c-12-14 9-22-3-36M124 48c-12-14 9-22-3-36"/></g><g fill="currentColor"><path d="M40 78h124l-10 96a26 26 0 0 1-26 22H76a26 26 0 0 1-26-22Z"/><path d="M166 96h14a30 30 0 0 1 0 60h-20"/></g><path d="M46 100h112" stroke="var(--bg)" stroke-width="6"/><circle cx="180" cy="126" r="15" fill="var(--bg)"/><rect x="186" y="176" width="46" height="15" rx="7.5" fill="currentColor" transform="rotate(-24 209 183)"/><path d="M196 44c10 10-6 18 4 28" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><g fill="currentColor"><circle cx="26" cy="150" r="6"/><circle cx="16" cy="176" r="4.5"/><circle cx="34" cy="188" r="3.5"/></g></svg>`


/* ---------- content snapshot ---------- */
const P = { name: 'CACAO IS LOVE', price: 28, weight: 250, origin: 'COLOMBIA' }
const money = (n) => '$' + n

const MARQUEE = ['ONE INGREDIENT', 'WHOLE CACAO', 'GROWN IN COLOMBIA', 'MADE TO SHARE', 'NOTHING ADDED', '250 G']
const marqueeGroup = `<div class="marqueeGroup" aria-hidden="true">${MARQUEE.map(
  (t) => `<span class="marqueeItem">${seed(12)}<span>${t}</span></span>`,
).join('')}</div>`

const UTILITY = [
  ['CONTENTS', '100% WHOLE CACAO'],
  ['GROWN', P.origin],
  ['WEIGHT', P.weight + ' G'],
  ['PRICE', money(P.price)],
]

const STEPS = [
  ['01', 'BREAK', prepBreak, 'Take about 25–30 g off the block — roughly a two-finger piece. Chop it small so it melts evenly.'],
  ['02', 'MELT + MIX', prepMelt, 'Warm 200 ml of water or milk on low heat. Add the cacao and stir until it goes smooth and glossy. Do not boil it.'],
  ['03', 'MAKE IT YOURS', prepMake, 'Honey, cinnamon, salt, oat milk, chilli, nothing at all. This is the part where it stops being our drink and becomes yours.'],
]

const NOTES = [
  ['AMIR + JUNE', 'JACKSON HEIGHTS, NY', ['oat milk', 'cinnamon', 'honey']],
  ['NAME', 'CITY, STATE', ['—', '—']],
  ['NAME', 'CITY, STATE', ['—', '—']],
]

const tag = (t) => `<span class="t-meta chapterTag">${seed(11)}${t}</span>`

/* ---------- markup ---------- */
const BODY = `
<a href="#main" class="skip-link">Skip to content</a>

<header class="header">
  <div class="shell headerInner">
    <a href="#main" class="brandLink" aria-label="Cacao Is Love — home">
      <img src="${A.mmInk}" alt="Cacao Is Love" style="height:30px;width:auto">
    </a>
    <nav class="nav" aria-label="Primary">
      ${[['CACAO', '#cacao'], ['SOURCE', '#source'], ['MAKE', '#make'], ['PEOPLE', '#people']]
        .map(([l, h]) => `<a href="${h}" class="t-label navLink"><span class="navMark" aria-hidden="true">${seed(13)}</span>${l}</a>`)
        .join('')}
    </nav>
    <div class="headerRight">
      <a href="#buy" class="t-label shopLink">SHOP</a>
      <button type="button" class="t-label cartBtn" data-open-cart aria-label="Open bag, 0 items">
        BAG <span class="cartCount cartCountZero" data-count>0</span>
      </button>
      <button type="button" class="t-label menuBtn" data-open-menu aria-expanded="false" aria-controls="mobile-menu">MENU</button>
    </div>
  </div>
</header>

<main id="main">

<section class="field-cream hero" aria-labelledby="hero-title">
  <div class="shell">
    <div class="heroGrid">
      <div class="heroCopy">
        <p class="t-label heroEyebrow">${seed(13)}A GIFT FROM CURIOSITY</p>
        <img class="heroMark" src="${A.mmInk}" alt="Cacao Is Love" style="width:100%;max-width:560px;height:auto">
        <h1 id="hero-title" class="t-h1 heroHead">CACAO, MADE TO BE SHARED.</h1>
        <div class="heroSupport">
          <p class="t-lede">100% whole cacao.</p>
          <p class="t-lede">Grown in Colombia.</p>
        </div>
        <div class="heroCtas">
          <a href="#buy" class="btn btnPrimary btnLg btnCut">MAKE A CUP</a>
          <a href="#cacao" class="btn btnQuiet">WHAT IS CACAO?<span class="quietMark" aria-hidden="true">${finger(16)}</span></a>
        </div>
        <p class="t-meta">${P.weight} G · ${money(P.price)} · SHIPS IN 1–2 DAYS</p>
      </div>
      <div class="heroMedia">
        <div class="heroMediaInner">
          <img src="${A.hero}" alt="One person passing a mug of cacao to another across a sunlit table, beside a bag of Cacao Is Love." style="object-position:66% 45%">
        </div>
        <p class="t-meta heroCaption">PL. 01 — THE PASS</p>
      </div>
    </div>
  </div>
</section>

<div class="field-ink marquee">
  <p class="sr-only">${MARQUEE.join('. ')}.</p>
  <div class="marqueeTrack">${marqueeGroup}${marqueeGroup}</div>
</div>

<section id="truth" class="field-red field" aria-labelledby="truth-title">
  <div class="shell">
    <div class="truthGrid">
      <div>
        <p class="t-label truthKicker">CH. 01 — THE CACAO</p>
        <h2 id="truth-title" class="truthMega"><span>ONE INGREDIENT.</span><span>WHOLE CACAO.</span></h2>
        <div class="truthTail">
          <p class="t-h3">Nothing added.</p>
          <p class="t-h3">Nothing taken away.</p>
        </div>
      </div>
      <dl class="utility">
        ${UTILITY.map(([k, v]) => `<div class="utilityRow"><dt class="utilityMark" aria-hidden="true">${seed(13)}</dt><dd class="t-label utilityKey" style="grid-column:2">${k}</dd><dd class="t-meta utilityVal">${v}</dd></div>`).join('')}
      </dl>
    </div>
  </div>
</section>

<section class="field-ink field">
  <div class="shell">
    <div class="packWrap">
      <img class="podCrop" src="${A.podHalf}" alt="" style="width:200px;height:auto">
      <div class="packMedia">
        <img src="${A.packWood}" alt="A bag of Cacao Is Love and a mug of cacao on a sunlit wooden table." style="width:100%;height:auto">
      </div>
      <div class="packCap">
        <span class="t-meta">PL. 02</span>
        <span class="t-meta">CACAO IS LOVE / ${P.weight} G / ${P.origin}</span>
      </div>
    </div>
  </div>
</section>

<section id="cacao" class="field-cream field" aria-labelledby="cacao-title">
  <div class="shell">
    <div class="eduGrid">
      <div>
        ${tag('CH. 02 — THE CATEGORY')}
        <h2 id="cacao-title" class="t-h1" style="margin-top:var(--s-5)">WHAT ARE YOU ACTUALLY DRINKING?</h2>
        <p class="t-lede measure" style="margin-top:var(--s-5)">Chocolate starts as a fruit. Cacao is that fruit, before anybody adds sugar to it. That is the whole idea.</p>
        <p class="t-body measure" style="margin-top:var(--s-4)">Not cocoa powder. Not a chocolate bar. The whole bean, still whole.</p>
      </div>
      <div class="eduArt">
        <div class="eduPanel reveal"><img src="${A.eduWhole}" alt="" style="width:100%;height:auto"><div class="eduPanelLabel"><span class="t-h3">WHOLE CACAO</span><span class="t-meta eduPanelSub">Solid cacao mass.</span></div></div>
        <div class="eduPanel reveal" style="--reveal-delay:80ms"><img src="${A.eduPowder}" alt="" style="width:100%;height:auto"><div class="eduPanelLabel"><span class="t-h3">COCOA POWDER</span><span class="t-meta eduPanelSub">Processed powder form.</span></div></div>
      </div>
    </div>
  </div>
</section>

<section id="source" class="field-green" aria-labelledby="source-title">
  <div class="provSplit">
    <div class="provArtSide"><img src="${A.prov}" alt="" style="width:100%;height:auto"></div>
    <div class="provCopySide">
      <div class="provCopyInner">
        ${tag('CH. 03 — ORIGIN')}
        <h2 id="source-title" class="t-display">GROWN IN COLOMBIA.</h2>
        <p class="t-lede">Where the cacao begins.</p>
        <div class="provMeta">
          <div class="provMetaItem"><span class="t-label">COUNTRY</span><span class="t-meta">Colombia</span></div>
          <div class="provMetaItem"><span class="t-label">FORM</span><span class="t-meta">WHOLE CACAO</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="make" class="field-cream field" aria-labelledby="make-title">
  <div class="shell">
    <div class="prepHead">
      <img src="${A.steam}" alt="" style="height:44px;width:auto">
      <h2 id="make-title" class="t-display">MAKE CACAO.</h2>
    </div>
    <p class="t-lede measure" style="margin-top:var(--s-4)">If you can make a cup of tea, you can make this. There is no correct way and nobody is watching.</p>
    <ol class="prepSteps">
      ${STEPS.map(([n, t, art, body], i) => `<li class="prepStep reveal" style="--reveal-delay:${i * 90}ms"><div class="prepArt">${art}</div><div class="prepNum"><span class="t-meta">${n}</span><h3 class="t-h3">${t}</h3></div><p class="prepBody">${body}</p></li>`).join('')}
    </ol>
    <div class="prepDivider">${shard(16)}<span></span><span class="t-meta">NICOLAS’S WAY</span></div>
  </div>
</section>

<section id="nicolas" class="field-cream field" aria-labelledby="nicolas-title">
  <div class="shell">
    <div class="nicGrid">
      <div class="nicCopy">
        ${tag('CH. 04 — WORLDVIEW')}
        <h2 id="nicolas-title" class="t-display">CURIOSITY IS WHERE IT STARTS.</h2>
        <blockquote class="t-quote nicQuote">“Good things are meant to be shared, especially among neighbors.”</blockquote>
        <p class="t-body measure">Placeholder. This is where Nicolas’s note goes, written the way he talks — a question he had, the trip he took to answer it, the person who handed him the first cup.</p>
        <p class="t-body measure">It should not read like an About page. It should read like a message from somebody who found something out and wanted to tell you about it.</p>
        <p class="t-meta nicSign">${shard(13)}NICOLAS NUVAN · FOUNDER</p>
      </div>
      <div class="nicArt"><img src="${A.curiosity}" alt="" style="width:100%;height:auto"></div>
    </div>
  </div>
</section>

<div class="field-red poster">
  <img src="${A.poster}" alt="Cacao Is Love poster: One more cup? Warning — one cup has a habit of becoming two." style="width:100%;height:auto">
</div>

<section id="buy" class="field-cream field" aria-labelledby="buy-title">
  <div class="shell">
    ${tag('CH. 08 — THE COUNTER')}
    <div class="buyGrid" style="margin-top:var(--s-6)">
      <figure class="figure">
        <div class="figureMedia cut-br" style="aspect-ratio:4/5">
          <img src="${A.packStudio}" alt="The Cacao Is Love bag beside a mug of cacao, broken cacao and a wooden spoon.">
        </div>
        <figcaption class="figureCap"><span class="t-meta">PL. 03</span><span class="t-meta figureCapRight">${P.weight} G / ${P.origin}</span></figcaption>
      </figure>

      <div class="module" data-buy>
        <div class="head">
          <p class="t-label eyebrow">${seed(12)}100% WHOLE CACAO</p>
          <h2 id="buy-title" class="t-h1">${P.name}</h2>
        </div>
        <div class="priceRow"><span class="price">${money(P.price)}</span><span class="t-meta">${P.weight} G · ${P.origin}</span></div>
        <p class="t-label status" data-status></p>

        <div data-purchase>
          <fieldset style="border:0;padding:0;margin:0 0 var(--s-5)">
            <legend class="srOnly">Choose how many bags</legend>
            <div class="options">
              <div style="position:relative;display:grid">
                <input class="optionInput" type="radio" name="cil-opt" id="cil-one" value="one-bag" checked>
                <label class="option" for="cil-one"><span class="optionName">ONE BAG</span><span class="t-meta optionSub">For your kitchen.</span><span class="optionPrice">${money(P.price)}</span></label>
              </div>
              <div style="position:relative;display:grid">
                <input class="optionInput" type="radio" name="cil-opt" id="cil-two" value="make-two">
                <label class="option" for="cil-two"><span class="optionName">MAKE TWO</span><span class="t-meta optionSub">One for you. One to share.</span><span class="optionPrice">${money(P.price * 2)}</span></label>
              </div>
            </div>
          </fieldset>

          <div class="gift" data-gift hidden>
            <p class="t-label eyebrow">${seed(12)}THE SECOND BAG — OPTIONAL</p>
            <p class="t-meta">Tell us who it is for and we will write it on the bag.</p>
            <div class="formField">
              <label class="t-label" for="cil-giftto">THEIR NAME</label>
              <input id="cil-giftto" class="input" placeholder="Who is the second cup for?" autocomplete="off" maxlength="40">
            </div>
            <div class="formField">
              <label class="t-label" for="cil-giftmsg">A LINE FROM YOU</label>
              <textarea id="cil-giftmsg" class="textarea" placeholder="Short is better." maxlength="140"></textarea>
              <span class="t-meta counter" data-gift-count>0/140</span>
            </div>
          </div>

          <div class="actions">
            <div style="display:flex;align-items:center" data-qty>
              <button type="button" class="qtyBtn" data-qty-dec aria-label="Decrease quantity">−</button>
              <span class="qtyBtn qtyVal" aria-live="polite" data-qty-val>1</span>
              <button type="button" class="qtyBtn" data-qty-inc aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn btnPrimary btnLg btnCut" data-add>ADD TO BAG — ${money(P.price)}</button>
          </div>
        </div>

        <form data-waitlist class="waitlist" hidden>
          <p class="t-lede" data-nextdrop hidden></p>
          <div class="waitRow">
            <div class="formField">
              <label class="t-label" for="cil-wl-email">EMAIL</label>
              <input id="cil-wl-email" class="input" type="email" required placeholder="you@example.com" autocomplete="email">
            </div>
            <div class="formField">
              <label class="t-label" for="cil-wl-tel">MOBILE <span class="optional">— OPTIONAL</span></label>
              <input id="cil-wl-tel" class="input" type="tel" placeholder="For the drop text only" autocomplete="tel">
            </div>
          </div>
          <button type="submit" class="btn btnPrimary btnLg btnBlock btnCut">JOIN THE NEXT DROP</button>
          <p class="t-meta">One message when the cacao lands. Nothing else, and you can leave any time.</p>
        </form>

        <p aria-live="polite" class="srOnly" data-announce></p>
        <div class="t-meta micro">
          <span>SHIPS FROM: New York, NY</span><span>DISPATCH: 1–2 business days</span><span>FREE OVER: $60</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="people" class="field-ink field" aria-labelledby="people-title">
  <div class="shell">
    ${tag('THE NEIGHBORHOOD')}
    <h2 id="people-title" class="t-h1" style="margin-top:var(--s-4)">HOW PEOPLE MAKE IT.</h2>
    <ul class="notes">
      ${NOTES.map(([n, loc, cup], i) => `<li class="noteCard reveal" style="--reveal-delay:${i * 70}ms"><blockquote class="noteQuote">“Placeholder quote — replace with a real, permissioned customer note.”</blockquote><div><p class="t-label">${n}</p><p class="t-meta">${loc}</p></div><div class="theirCup">${cupRim(13)}${cup.map((c) => `<span class="t-meta cupChip">${c}</span>`).join('')}</div></li>`).join('')}
    </ul>
  </div>
</section>

<section id="newsletter" class="field-green field" aria-labelledby="email-title">
  <div class="shell">
    <div class="emailGrid">
      <div>
        ${tag('STAY CLOSE')}
        <h2 id="email-title" class="t-display" style="margin-top:var(--s-4)">GOOD THINGS ARE MEANT TO BE SHARED.</h2>
      </div>
      <div>
        <form class="emailForm" data-newsletter>
          <p class="t-lede" style="margin-bottom:var(--s-3)">Next drops, cacao, stories, and things worth knowing about.</p>
          <div class="emailField">
            <label class="sr-only" for="cil-news">Email address</label>
            <input id="cil-news" class="emailInput" type="email" required placeholder="you@example.com" autocomplete="email">
            <button type="submit" class="btn btnPrimary btnLg">JOIN THE NEIGHBORHOOD</button>
          </div>
          <p class="t-meta">No discount codes. We send when there is something to say.</p>
        </form>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="field-ink footer">
  <div class="shell">
    <div class="footerGrid">
      <div class="footerCol">
        <img src="${A.mmCream}" alt="Cacao Is Love" style="height:44px;width:auto">
        <p class="t-lede" style="max-width:26ch;margin-top:var(--s-2)">100% whole cacao from Colombia.</p>
      </div>
      <nav class="footerCol" aria-label="Footer — sections">
        <p class="t-label">READ</p>
        ${[['CACAO', '#cacao'], ['SOURCE', '#source'], ['MAKE', '#make'], ['PEOPLE', '#people']].map(([l, h]) => `<a href="${h}" class="t-label footerLink">${seed(11)}${l}</a>`).join('')}
      </nav>
      <nav class="footerCol" aria-label="Footer — information">
        <p class="t-label">INFORMATION</p>
        ${[['SHOP', '#buy'], ['FAQ', '#buy'], ['ABOUT', '#nicolas']].map(([l, h]) => `<a href="${h}" class="t-label footerLink">${seed(11)}${l}</a>`).join('')}
      </nav>
    </div>
    <div class="t-meta footerBottom">
      <span>CACAO IS LOVE · 100% WHOLE CACAO · COLOMBIA</span>
      <span>Demo build — not a live store.</span>
    </div>
  </div>
</footer>

<div class="sticky" data-sticky aria-hidden="true">
  <div class="stickyMeta">
    <span class="t-label stickyName">100% WHOLE CACAO</span>
    <span class="t-meta" data-sticky-meta>${P.weight} G · ${money(P.price)}</span>
  </div>
  <a href="#buy" class="btn btnPrimary btnCut" data-sticky-cta>ADD TO BAG</a>
</div>

<div class="sheet" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="sheetTop">
    <img src="${A.mmInk}" alt="Cacao Is Love" style="height:28px;width:auto">
    <button type="button" class="t-label" data-close-menu style="min-height:44px;padding-inline:8px">CLOSE</button>
  </div>
  <nav class="sheetNav" aria-label="Primary">
    ${[['CACAO', '#cacao'], ['SOURCE', '#source'], ['MAKE', '#make'], ['PEOPLE', '#people'], ['SHOP', '#buy']]
      .map(([l, h]) => `<a href="${h}" class="sheetLink" data-close-menu><span class="sheetNum" aria-hidden="true">${seed(16)}</span>${l}</a>`)
      .join('')}
  </nav>
  <div class="sheetFoot">
    <p class="t-meta">100% whole cacao from Colombia.</p>
  </div>
</div>

<div class="scrim" data-scrim hidden></div>
<aside class="drawer" role="dialog" aria-modal="true" aria-label="Your bag" data-drawer hidden>
  <div class="slipHead">
    <div class="slipHeadTop">
      <p class="t-label">CACAO IS LOVE — ORDER SLIP</p>
      <button type="button" class="t-label" data-close-cart style="min-height:44px">CLOSE</button>
    </div>
    <p class="t-meta" data-slip-count>0 ITEMS · SHIPS IN 1–2 DAYS</p>
  </div>
  <div class="drawerBody" data-drawer-body></div>
  <div class="drawerFoot" data-drawer-foot hidden>
    <hr class="slipRule">
    <div class="subtotal"><span class="t-label">SUBTOTAL</span><span class="t-h3" data-subtotal>$0</span></div>
    <p class="t-meta">Shipping and taxes calculated at checkout.</p>
    <button type="button" class="btn btnPrimary btnBlock btnLg btnCut" data-checkout>CHECKOUT</button>
  </div>
</aside>

<div class="demoBar" data-demo>
  <span class="t-label demoBarLabel">${seed(11)}DEMO — STOCK STATE</span>
  <div class="demoBarBtns">
    <button type="button" class="t-label demoBtn is-on" data-state="in_stock">IN STOCK</button>
    <button type="button" class="t-label demoBtn" data-state="low_stock">LOW</button>
    <button type="button" class="t-label demoBtn" data-state="sold_out">SOLD OUT</button>
  </div>
</div>
`

/* ---------- demo-only styles: the qty control is inline-styled in React,
     and the stock-state switcher exists only here ---------- */
const DEMO_CSS = `
/* The panels use display:flex/grid, which beats the hidden attribute's default.
   React conditionally renders them so this never arises there; here it must be
   stated. (The artifact runtime ships the same rule, but the file should not
   depend on its host.) */
[hidden]{display:none!important}
.qtyBtn{min-width:40px;min-height:40px;display:grid;place-items:center;border:2px solid var(--rule-strong);font-family:var(--font-mono);color:var(--fg);background:none;cursor:pointer}
.qtyBtn+.qtyBtn,.qtyVal+.qtyBtn{border-left:0}
.qtyVal{border-left:0;border-right:0;padding-inline:8px;cursor:default}
.qtyBtn[disabled]{opacity:.35;pointer-events:none}
.demoBar{position:fixed;left:12px;bottom:12px;z-index:90;background:var(--cil-ink);color:var(--cil-cream);
  display:flex;align-items:center;gap:10px;padding:8px 10px;max-width:calc(100vw - 24px);flex-wrap:wrap;
  clip-path:polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%)}
.demoBarLabel{display:inline-flex;align-items:center;gap:6px;opacity:.75}
.demoBarBtns{display:flex;gap:6px}
.demoBtn{border:1px solid color-mix(in srgb,var(--cil-cream) 45%,transparent);color:var(--cil-cream);
  background:none;padding:5px 8px;min-height:32px;cursor:pointer;font-size:.625rem}
.demoBtn.is-on{background:var(--cil-red);border-color:var(--cil-red)}
@media (max-width:899px){.demoBar{bottom:calc(var(--sticky-h) + 10px)}}
`

/* ---------- behaviour ---------- */
const JS = `
(function () {
  var PRICE = ${P.price}, WEIGHT = ${P.weight};
  var money = function (n) { return '$' + n; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- reveal on entry ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revealIn'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('revealIn'); }); }

  /* ---- cart ---- */
  var lines = [];
  var drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
  var body = $('[data-drawer-body]'), foot = $('[data-drawer-foot]');

  function count() { return lines.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() { return lines.reduce(function (n, l) { return n + l.qty * l.unit; }, 0); }

  function renderCart() {
    var c = count();
    $('[data-count]').textContent = c;
    $('[data-count]').classList.toggle('cartCountZero', c === 0);
    $('[data-open-cart]').setAttribute('aria-label', 'Open bag, ' + c + (c === 1 ? ' item' : ' items'));
    $('[data-slip-count]').textContent = c + (c === 1 ? ' ITEM' : ' ITEMS') + ' · SHIPS IN 1–2 DAYS';
    $('[data-subtotal]').textContent = money(subtotal());
    foot.hidden = lines.length === 0;

    if (!lines.length) {
      body.innerHTML = '<p class="t-lede drawerEmpty">Nothing here yet. One bag makes about eight cups.</p>';
      return;
    }
    var hasPair = lines.some(function (l) { return l.opt === 'make-two'; });
    var html = '<ul>' + lines.map(function (l, i) {
      var note = l.to
        ? '<div class="lineNote"><p class="t-label" style="color:var(--cil-green)">SECOND BAG — FOR ' + esc(l.to.toUpperCase()) + '</p>' +
          (l.msg ? '<p class="t-meta">“' + esc(l.msg) + '”</p>' : '') + '</div>'
        : '';
      return '<li class="line">' +
        '<img src="${A.packStudio}" alt="" class="lineThumb">' +
        '<div class="lineMain">' +
          '<div class="lineTop"><div><p class="t-h3">' + esc(l.title) + '</p><p class="t-meta">' + esc(l.sub) + '</p></div>' +
          '<p class="t-meta" style="color:var(--cil-ink)">' + money(l.unit * l.qty) + '</p></div>' + note +
          '<div class="lineControls">' +
            '<div style="display:flex;align-items:center">' +
              '<button type="button" class="qtyBtn" data-line-dec="' + i + '" aria-label="Decrease quantity">−</button>' +
              '<span class="qtyBtn qtyVal">' + l.qty + '</span>' +
              '<button type="button" class="qtyBtn" data-line-inc="' + i + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="t-meta remove" data-line-rm="' + i + '">Remove</button>' +
          '</div>' +
        '</div></li>';
    }).join('') + '</ul>';

    if (!hasPair) {
      html += '<div class="upsell"><div class="upsellCopy">' +
        '<span class="t-label" style="display:flex;align-items:center;gap:6px">${seed(12).replace(/"/g, '\\"')} MAKE TWO?</span>' +
        '<span class="t-meta">One for you. One to share.</span></div>' +
        '<button type="button" class="upsellBtn" data-upsell>ADD ONE — ' + money(PRICE) + '</button></div>';
    }
    body.innerHTML = html;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function add(line) {
    var mergeable = !line.to;
    var found = mergeable && lines.filter(function (l) { return l.opt === line.opt && !l.to; })[0];
    if (found) found.qty += line.qty; else lines.push(line);
    renderCart(); openCart();
  }

  /* ---- drawer + menu ---- */
  var lastFocus = null;
  function trap(panel) {
    return function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href],button:not([disabled]),input:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])', panel)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
  }
  var drawerTrap = trap(drawer), menu = $('#mobile-menu'), menuTrap = trap(menu);

  function openCart() {
    lastFocus = document.activeElement;
    scrim.hidden = false; drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    $('[data-close-cart]').focus();
    document.addEventListener('keydown', onKeyCart);
    drawer.addEventListener('keydown', drawerTrap);
  }
  function closeCart() {
    scrim.hidden = true; drawer.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeyCart);
    drawer.removeEventListener('keydown', drawerTrap);
    if (lastFocus) lastFocus.focus();
  }
  function onKeyCart(e) { if (e.key === 'Escape') closeCart(); }

  function openMenu() {
    menu.hidden = false; document.body.style.overflow = 'hidden';
    $('[data-open-menu]').setAttribute('aria-expanded', 'true');
    $('[data-close-menu]').focus();
    document.addEventListener('keydown', onKeyMenu);
    menu.addEventListener('keydown', menuTrap);
  }
  function closeMenu() {
    menu.hidden = true; document.body.style.overflow = '';
    $('[data-open-menu]').setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeyMenu);
    menu.removeEventListener('keydown', menuTrap);
  }
  function onKeyMenu(e) { if (e.key === 'Escape') closeMenu(); }

  /* ---- buy module ---- */
  var qty = 1, state = 'in_stock';
  function selectedOpt() { return ($('input[name="cil-opt"]:checked') || {}).value || 'one-bag'; }
  function unitPrice() { return selectedOpt() === 'make-two' ? PRICE * 2 : PRICE; }

  function syncBuy() {
    var isPair = selectedOpt() === 'make-two';
    $('[data-gift]').hidden = !isPair;
    $('[data-qty-val]').textContent = qty;
    $('[data-qty-dec]').disabled = qty <= 1;
    $('[data-qty-inc]').disabled = qty >= 12;
    $('[data-add]').textContent = 'ADD TO BAG — ' + money(unitPrice() * qty);
  }

  function syncState() {
    var status = $('[data-status]'), purchase = $('[data-purchase]'), wl = $('[data-waitlist]');
    var mark = '${seed(13).replace(/'/g, "\\'")}';
    status.classList.remove('statusLow');
    if (state === 'sold_out') {
      status.innerHTML = mark + 'BETWEEN HARVESTS';
      purchase.hidden = true; wl.hidden = false;
      $('[data-nextdrop]').hidden = true;
      $('[data-sticky-cta]').textContent = 'JOIN THE NEXT DROP';
      $('[data-sticky-meta]').textContent = WEIGHT + ' G · SOLD OUT';
    } else if (state === 'low_stock') {
      status.innerHTML = mark + 'LAST 41 BAGS OF THIS HARVEST';
      status.classList.add('statusLow');
      purchase.hidden = false; wl.hidden = true;
      $('[data-sticky-cta]').textContent = 'ADD TO BAG';
      $('[data-sticky-meta]').textContent = WEIGHT + ' G · ' + money(PRICE);
    } else {
      status.innerHTML = mark + 'IN STOCK — SHIPS IN 1–2 DAYS';
      purchase.hidden = false; wl.hidden = true;
      $('[data-sticky-cta]').textContent = 'ADD TO BAG';
      $('[data-sticky-meta]').textContent = WEIGHT + ' G · ' + money(PRICE);
    }
  }

  /* ---- events ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-cart],[data-close-cart],[data-scrim],[data-open-menu],[data-close-menu],[data-add],[data-qty-dec],[data-qty-inc],[data-line-dec],[data-line-inc],[data-line-rm],[data-upsell],[data-checkout],[data-state]');
    if (!t) return;
    if (t.hasAttribute('data-open-cart')) return openCart();
    if (t.hasAttribute('data-close-cart') || t.hasAttribute('data-scrim')) return closeCart();
    if (t.hasAttribute('data-open-menu')) return openMenu();
    if (t.hasAttribute('data-close-menu')) return closeMenu();
    if (t.hasAttribute('data-qty-dec')) { qty = Math.max(1, qty - 1); return syncBuy(); }
    if (t.hasAttribute('data-qty-inc')) { qty = Math.min(12, qty + 1); return syncBuy(); }
    if (t.hasAttribute('data-add')) {
      var isPair = selectedOpt() === 'make-two';
      var to = isPair ? $('#cil-giftto').value.trim() : '';
      add({
        opt: selectedOpt(), title: '${P.name}',
        sub: isPair ? 'MAKE TWO · 2 × ' + WEIGHT + ' g' : '100% Whole Cacao · ' + WEIGHT + ' g',
        qty: qty, unit: unitPrice(), to: to, msg: isPair ? $('#cil-giftmsg').value.trim() : '',
      });
      $('[data-announce]').textContent = (isPair ? 'MAKE TWO' : 'ONE BAG') + ' added to your bag.';
      return;
    }
    if (t.hasAttribute('data-upsell')) {
      return add({ opt: 'one-bag', title: '${P.name}', sub: '100% Whole Cacao · ' + WEIGHT + ' g', qty: 1, unit: PRICE, to: '', msg: '' });
    }
    if (t.hasAttribute('data-line-dec')) { var i = +t.getAttribute('data-line-dec'); lines[i].qty--; if (lines[i].qty <= 0) lines.splice(i, 1); return renderCart(); }
    if (t.hasAttribute('data-line-inc')) { lines[+t.getAttribute('data-line-inc')].qty++; return renderCart(); }
    if (t.hasAttribute('data-line-rm')) { lines.splice(+t.getAttribute('data-line-rm'), 1); return renderCart(); }
    if (t.hasAttribute('data-checkout')) { t.textContent = 'DEMO — NO CHECKOUT WIRED'; setTimeout(function () { t.textContent = 'CHECKOUT'; }, 1800); return; }
    if (t.hasAttribute('data-state')) {
      state = t.getAttribute('data-state');
      $$('[data-state]').forEach(function (b) { b.classList.toggle('is-on', b === t); });
      syncState();
      document.getElementById('buy').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  });

  $$('input[name="cil-opt"]').forEach(function (r) { r.addEventListener('change', syncBuy); });
  $('#cil-giftmsg').addEventListener('input', function (e) { $('[data-gift-count]').textContent = e.target.value.length + '/140'; });

  $$('form[data-newsletter],form[data-waitlist]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = f.querySelector('button[type=submit]');
      var was = b.textContent; b.textContent = 'YOU ARE ON THE LIST'; b.disabled = true;
      setTimeout(function () { b.textContent = was; b.disabled = false; f.reset(); }, 2200);
    });
  });

  var sticky = $('[data-sticky]');
  var onScroll = function () {
    var on = window.scrollY > window.innerHeight * 0.85;
    sticky.classList.toggle('stickyIn', on);
    sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  renderCart(); syncBuy(); syncState();
})();
`

/* ---------- emit ----------
   The file may be opened straight off disk where no charset is declared, so
   non-ASCII is escaped: numeric entities in markup, \u escapes in the script
   (JavaScript string literals do not decode HTML entities). */
const entities = (t) => t.replace(/[^\x00-\x7F]/g, (c) => '&#' + c.codePointAt(0) + ';')
const uEscapes = (t) => t.replace(/[^\x00-\x7F]/g, (c) => '\\u' + c.codePointAt(0).toString(16).padStart(4, '0'))

const html = `<title>Cacao Is Love</title>
<meta name="description" content="100% whole cacao, grown in Colombia. Made simply. Shared freely.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=IBM+Plex+Mono:wght@400&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap" rel="stylesheet">
<style>
:root{--font-archivo:'Archivo';--font-mono-plex:'IBM Plex Mono';--font-newsreader:'Newsreader'}
${STYLES}
${DEMO_CSS}
</style>
${entities(BODY)}
<script>${uEscapes(JS)}</script>
`

writeFileSync('demo/cacao-is-love.html', html)
console.log('demo/cacao-is-love.html  ' + (Buffer.byteLength(html) / 1024 / 1024).toFixed(2) + ' MB')
