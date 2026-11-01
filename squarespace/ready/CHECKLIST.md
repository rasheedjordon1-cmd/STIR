# Paste checklist

Before anything: confirm the assets are actually being served.

```js
fetch('https://stirnyc.netlify.app/assets/stir-squarespace.css')
  .then(r => console.log(r.status === 200 ? 'assets live' : 'NOT SERVED: ' + r.status));
```

If that is not 200, point Netlify's production branch at the branch
carrying this work and deploy. Nothing below will look right until it is.

---

- [ ] Settings → Advanced → Code Injection → **HEADER** ← `01-code-injection-header.html`
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
