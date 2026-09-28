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

## 1 · Upload the assets

**Design → Custom CSS → Manage Custom Files.** Upload:

- the 5 font files from `assets/fonts/`
- `hero-stir-attention.webp`, `illustration-corner.webp`,
  `illustration-city.webp`, `stir-mark.png`, `stir-mark-ivory.png`,
  `og-stir.jpg`
- everything in `assets/labay/`

Squarespace gives each file a URL. Keep the tab open — you need them
in steps 2 and 4.

> **The Labay video.** Squarespace won't host `.mp4`. The build keeps
> it on the existing Netlify deploy, which now serves only as an asset
> host. In `pages/home.html`, replace `VIDEO_URL` with:
> `https://stirnyc.netlify.app/assets/labay/labay-social-01.mp4`
>
> **Do not delete that Netlify site** — it costs nothing and the video
> is the only thing still pointing at it. (Fallback if you ever want to
> consolidate: put the clip on Vimeo unlisted and swap the `<video>`
> for an embed, accepting the player chrome.)

## 2 · Custom CSS

Paste all of `stir-custom.css` into **Design → Custom CSS**.

Then replace the five font placeholders with your uploaded URLs:

```
FONT_LIGHT_URL          founders-grotesk-light.woff2
FONT_LIGHT_ITALIC_URL   founders-grotesk-light-italic.woff2
FONT_MEDIUM_URL         founders-grotesk-medium.woff2
FONT_BOLD_URL           founders-grotesk-bold.woff2
FONT_BOLD_ITALIC_URL    founders-grotesk-bold-italic.woff2
```

## 3 · Code Injection

**Settings → Advanced → Code Injection**

- **Header** ← `header-injection.html`
- **Footer** ← `footer-injection.html`

In the header file, replace **both** `ASSET_BASE/` occurrences — the
share image (`og-stir.jpg`) and the entrance mark
(`stir-mark-ivory.png`).

The header also carries the entrance: a cobalt hold that covers
Squarespace's unstyled flash and lifts the moment the page is ready.
It is capped at 900ms, shows once per session and is skipped entirely
under reduced motion. It has to live in the head — a Code Block paints
too late to cover anything — so it is drawn with pseudo-elements on
`<html>` rather than markup.

## 4 · The pages

Create three blank pages: **/** (home), **/about**, **/contact**.
On each, add ONE **Code Block**, full width, and paste the matching
file from `pages/`.

In each pasted block, find/replace `ASSET_BASE/` with your Squarespace
file URL prefix — one operation per page.

Set the page layout to have no padding if your template offers it;
the Custom CSS already neutralises the usual wrappers.

## 5 · The form

1. formspree.io → **New Form** → copy the form ID.
2. In `pages/contact.html`, replace `FORMSPREE_ID`.
3. Submit once yourself to confirm the address.

Fields captured: business, situation, show_us, not_seeing, name,
email. `_gotcha` is the spam honeypot. The footer injection posts over
fetch and shows **WE'VE GOT IT.** without a page reload; the red
signal travels the rail while the request is in flight. Without JS the
form still submits normally and Formspree answers.

The homepage **Start here** field hands its answer to `/contact`, which
prefills question 01 and moves the visitor to question 02 rather than
the top of the form.

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
