# STIR on Squarespace

The full site as custom code. Squarespace handles hosting, domain,
SSL and billing; Formspree handles inquiries. Nothing about the
result reads as a Squarespace template.

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

> Squarespace won't host the `.mp4`. Two options: upload the Labay
> video to Vimeo/YouTube unlisted and swap that one `<video>` for an
> embed, or keep serving it from the existing Netlify URL. The rest
> of the reel is images and works as-is.

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

In the header file, swap `ASSET_BASE/og-stir.jpg` for the uploaded
share image URL.

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
email. `_gotcha` is the spam honeypot. The JS posts over fetch and
shows **WE'VE GOT IT.** without a page reload.

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

## Two things the Netlify build doesn't have

- **Adaptive nav.** The nav reads the section passing beneath it and
  inverts — ivory mark on cobalt, ink mark on ivory. Add
  `data-ground="cobalt|ivory"` to any new section to include it.
- **Running index.** A quiet publication marker, bottom-left, showing
  which part of the argument you're in, with a hairline progress
  rule. Desktop only. Add `data-index="..."` to any new section.

## Editing later

Copy lives in the page Code Blocks — edit it right in Squarespace.
Design tokens (colour, type scale, spacing) live at the top of the
Custom CSS. Behaviour lives in the footer injection.

`_preview.html` in this folder renders the whole thing inside a mock
Squarespace DOM so changes can be checked before pasting.
