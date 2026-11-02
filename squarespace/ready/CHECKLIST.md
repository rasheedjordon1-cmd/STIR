# Paste checklist

Before anything: confirm Netlify is serving **this** build.

Paste the whole of `00-verify.js` into a browser console. It prints a
PASS/FAIL line per asset and tells you whether it is safe to paste.

Do not substitute a plain `fetch(...).status === 200` check. That is
what was here before, and it passed for as long as the site was
broken: the pre-rewrite stylesheet answered 200 too, with none of the
classes these pages use. See README for the full account.

If anything FAILs, point Netlify's production branch at the branch
carrying this work and deploy. Nothing below will look right until the
verifier is clean.

---

- [ ] `00-verify.js` run in the console, all PASS
- [ ] Settings → Advanced → Code Injection → **HEADER** ← `01-code-injection-header.html`
      (re-paste this after **every** rebuild: it names the stylesheet
       by content hash, so the previous one points at a dead file)
- [ ] Settings → Advanced → Code Injection → **FOOTER** ← `02-code-injection-footer.html`
- [ ] Design → Custom CSS is **empty** (LESS breaks the stylesheet — see README)
- [ ] Page `/` — one full-width Code Block ← `03-page-home.html`
- [ ] Page `/labay` ← `04-page-labay.html`
- [ ] Page `/businesses` ← `05-page-businesses.html`
- [ ] Page `/creators` ← `06-page-creators.html`
- [ ] Page `/collaborate` ← `07-page-collaborate.html`
- [ ] Page `/about` ← `08-page-about.html`
- [ ] Page `/contact` ← `09-page-contact.html`
- [ ] Every other block removed from those seven pages
- [ ] Page URLs match the table exactly (the nav links to them)
- [ ] One real submission sent, and the Formspree confirmation email clicked
      (Formspree holds the first submission until you do)

## On the published site

```js
// tokens loaded?
getComputedStyle(document.querySelector('.stir')).getPropertyValue('--cobalt')
// '#0451AB' = yes. '' = the stylesheet is not loading.

// host chrome hidden?
getComputedStyle(document.querySelector('#header') || document.body).display
// 'none' on a STIR page.

// our font, not theirs?
getComputedStyle(document.querySelector('.stir h1')).fontFamily
// should start with "Founders Grotesk".
```
