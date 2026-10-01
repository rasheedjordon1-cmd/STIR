# STIR on Squarespace

The full site as custom code. Squarespace handles hosting, domain,
SSL and billing; Formspree handles inquiries. Nothing about the
result reads as a Squarespace template.

> **Everything in this folder is generated.** The standalone site
> (`index.html`, `about.html`, `contact.html`, `assets/stir.css`) is
> the only source of truth. After changing any of those, run:
>
> ```
> python3 scripts/build-squarespace.py
> ```
>
> Hand-edit `squarespace/src/` — never the generated files, which are
> overwritten on the next build. Hand-patching the output is how the
> package previously lost its defensive reset and its contact-form
> behaviour without anyone noticing.

**Plan requirement:** Code Blocks and Code Injection need a Business
plan or above. Custom CSS with file uploads is on the same tier.
(Verify current tiering — Squarespace moves it.)

---

## Paste it in

Everything you paste lives in **`ready/`**, already resolved — no
find and replace, nothing to upload. `ready/CHECKLIST.md` is the
short version; this is the long one.

Nothing goes in **Design → Custom CSS**. See step 1.

### 1 · Code Injection

**Settings → Advanced → Code Injection.**

- **Header** ← `ready/01-code-injection-header.html`
- **Footer** ← `ready/02-code-injection-footer.html`

The header carries the stylesheet link, the page tagging, the share
tags and the entrance cover. It has to be in the head: a Code Block
paints too late to cover Squarespace's unstyled flash.

> **Design → Custom CSS stays empty.**
>
> Squarespace compiles that field with LESS, which tries to evaluate
> `calc(var(--bleed) * -1)` as arithmetic, throws, and drops the whole
> stylesheet. The symptom is a site that renders as a bare template
> with every image loading perfectly — nothing looks broken enough to
> point at the CSS. Code Injection is passed through untouched, so the
> stylesheet goes there.

If the stylesheet is not yet being served from the CDN, put
`ready/ALT-header-with-inline-css.html` in the HEADER slot instead:
same CSS, carried inline, no external dependency. Move to the linked
version when the CDN copy is live — it is cached and keeps the
injection small.

Check which you have, in the console on the published site:

```js
getComputedStyle(document.querySelector('.stir')).getPropertyValue('--cobalt')
// '#0451AB' = loading.  '' = not.
```

### 2 · The pages

Create three blank pages — **/**, **/about**, **/contact** — and give
each one a single **Code Block**, set to full width:

| page | file |
|---|---|
| `/` | `ready/03-page-home.html` |
| `/about` | `ready/04-page-about.html` |
| `/contact` | `ready/05-page-contact.html` |

Remove every other block from those pages. The stylesheet already
neutralises Squarespace's own padded wrappers, headers and footers on
STIR pages, so the layout does not need their page settings.

### 3 · The form

1. formspree.io → **New Form** → copy the form id.
2. Put it in `deploy.config.json` as `formspree_id`.
3. Re-run `python3 scripts/build-squarespace.py`.
4. Re-paste `ready/06-page-contact.html`.
5. Submit once yourself to confirm the address.

Fields captured: business, situation, show_us, not_seeing, name,
email. `_gotcha` is the spam honeypot. The footer injection posts over
fetch and shows **WE'VE GOT IT.** without a page reload, with the red
signal travelling the rail while the request is in flight. Without JS
the form still submits normally and Formspree answers.

---

## Where the assets come from

The Netlify deploy at `stirnyc.netlify.app` serves the images, fonts,
video and the stylesheet, and sends the `Access-Control-Allow-Origin`
header the self-hosted fonts need cross-origin (see `netlify.toml`). That is why
there is nothing to upload: Squarespace gets the markup, Netlify gets
the files.

**Do not delete that site.** It costs nothing and it is now the asset
origin for the whole Squarespace build, not just the video.

Before pasting, run the console snippet in `ready/CHECKLIST.md` to
confirm every file is actually being served — Netlify builds a
specific branch, so anything added on a branch it is not watching will
404.

To host on Squarespace instead, upload the files under **Design →
Custom CSS → Manage Custom Files**, put that URL prefix in
`deploy.config.json` as `asset_base`, and re-run the build. Note that
Squarespace will not host `.mp4`, so the Labay clip stays on Netlify
either way.

---

## What's different from the Netlify build

Same design system, same motion. Three adaptations:

1. **Everything is scoped to `.stir`** so Squarespace's stylesheet
   can't leak in and ours can't leak out. There's a defensive reset
   for the elements Squarespace styles directly — without it their
   `h1 { font-family: Georgia }` beats our inherited font.
2. **Full-bleed is viewport-based** (`width:100vw; margin-left:50%;
   transform:translateX(-50%)`) rather than shell-math, because
   Squarespace nests several padded wrappers.
3. **The nav is fixed**, not absolute, since the document scrolls.

## What lives in `src/`

| file | what it is |
|---|---|
| `host-layer.css` | the defensive reset, the wrapper neutralisers, full-bleed for a nested DOM, and the two enhancements' styling |
| `host-behaviour.js` | adaptive nav + running index |
| `contact-behaviour.js` | the Formspree submit and the homepage handoff |
| `header-injection.html` | page tagging, share tags, the entrance |
| `preview-shell.html` | the mock host `_preview.html` is built into |

## Two things the Netlify build doesn't have

- **Adaptive nav.** The nav reads the section passing beneath it and
  inverts — ivory mark on cobalt, ink mark on ivory. Add
  `data-ground="cobalt|ivory"` to any new section to include it.
- **Running index.** A quiet publication marker, bottom-left, showing
  which part of the argument you're in, with a hairline progress
  rule. Desktop only, and it retires over the closing section — the
  CTA owns that corner, and an index of a journey that has finished is
  clutter. Add `data-index="..."` to any new section.

Both read `data-ground` / `data-index`, which the build script stamps
onto sections from a table at the top of
`scripts/build-squarespace.py`. Add a new section there, not by hand in
the generated page.

## Editing later

Copy lives in the page Code Blocks — edit it right in Squarespace.
Design tokens (colour, type scale, spacing) live at the top of the
Custom CSS. Behaviour lives in the footer injection.

`_preview.html` renders the whole package inside a deliberately hostile
mock of Squarespace's DOM — their serif headings, their green links,
their disc bullets, their nested padded wrappers. Append `?p=about` or
`?p=contact` for the other pages. Open it before pasting: it is where
the host-versus-us problems show up, and it is the reason the defensive
reset exists at all.
