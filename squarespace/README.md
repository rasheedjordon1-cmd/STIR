# STIR on Squarespace

The whole site as custom code. Squarespace handles hosting, the domain,
SSL and billing. Netlify serves the files. Nothing about the result
reads as a Squarespace template.

> **Everything in `ready/` and both `_preview*` files is generated.**
> The standalone site is the only source of truth. After changing any
> page or `assets/stir.css` or `assets/stir.js`, run:
>
> ```
> python3 scripts/build-squarespace.py
> ```
>
> Hand-edit `squarespace/src/` — never the generated files. Patching
> the output by hand is how this package previously lost its defensive
> reset without anyone noticing.

**Plan requirement:** Code Blocks and Code Injection need a Business
plan or above. Verify the current tiering — Squarespace moves it.

---

## Read this before anything else

The package loads its stylesheet, fonts, images and video from
**`https://stirnyc.netlify.app/assets/`**. That origin is the Netlify
deploy of this repository, and Netlify builds **one branch**.

At the time of writing, the branch carrying this work is
`claude/stir-homepage-prototype-1wopp0`, and Netlify has not been
pointed at it. **Until it is, every asset URL in this kit 404s and the
Squarespace pages will render as unstyled markup.**

> Netlify → Site configuration → Build & deploy → Branches and deploy
> contexts → Production branch → `claude/stir-homepage-prototype-1wopp0`
> → Deploy site.

Confirm before pasting anything, in a browser console:

```js
fetch('https://stirnyc.netlify.app/assets/stir-squarespace.css')
  .then(r => console.log(r.status === 200 ? 'assets live' : 'NOT SERVED: ' + r.status));
```

---

## Paste it in

Everything you paste is in **`ready/`**, already resolved. No find and
replace, nothing to upload.

### 1 · Code Injection

**Settings → Advanced → Code Injection.**

| slot | file |
|---|---|
| HEADER | `ready/01-code-injection-header.html` |
| FOOTER | `ready/02-code-injection-footer.html` |

> **Design → Custom CSS stays empty.**
>
> Squarespace compiles that field with LESS, which tries to evaluate
> expressions like `calc((100svh - 300px) * var(--stage-ar))` as
> arithmetic, throws, and drops the whole stylesheet. The symptom is a
> site that renders as a bare template with every image loading
> perfectly — nothing looks broken enough to point at the CSS. Code
> Injection is passed through untouched, so the stylesheet goes there.

The header has to be in the head: a Code Block paints too late to stop
Squarespace's white flash before the cobalt arrives.

### 2 · The pages

Create seven blank pages and give each one a single **Code Block**, set
to full width. Remove every other block from those pages.

| page | file |
|---|---|
| `/` | `ready/03-page-home.html` |
| `/labay` | `ready/04-page-labay.html` |
| `/businesses` | `ready/05-page-businesses.html` |
| `/creators` | `ready/06-page-creators.html` |
| `/collaborate` | `ready/07-page-collaborate.html` |
| `/about` | `ready/08-page-about.html` |
| `/contact` | `ready/09-page-contact.html` |

The page URLs must match that table exactly — the navigation, the three
audience panels and the footer all link to those paths.

The stylesheet already neutralises Squarespace's padded wrappers and
hides its header and footer on these pages, so their page settings do
not matter.

### 3 · The form — the one real gap

**Netlify Forms do not work on Squarespace.** The standalone site posts
to Netlify's own handler; that handler does not exist on another host.
There are three honest options:

1. **Formspree.** formspree.io → New Form → copy the id → put it in
   `deploy.config.json` as `formspree_id` → re-run the build →
   re-paste `ready/09-page-contact.html`. The typed routing, the
   per-route questions and the validation all survive. Submit once
   yourself to confirm delivery.
2. **Keep the form on Netlify** and point `/contact` at it. Delivery
   already works there and is already wired to your inbox. The cost is
   one hop out of the Squarespace domain.
3. **A Squarespace Form Block.** Native and reliable, but it cannot do
   the four-route switching, so the intake becomes one generic form.

**With no `formspree_id` configured the build ships the contact page
with its submit button disabled and a visible note**, rather than a
button that silently throws submissions away. That is deliberate.

---

## Where the assets come from

`netlify.toml` already sends `Access-Control-Allow-Origin: *` on
`/assets/*`, which the self-hosted fonts need cross-origin. That is why
there is nothing to upload: Squarespace gets the markup, Netlify gets
the files.

**Do not delete that Netlify site.** It costs nothing and it is the
asset origin for the entire Squarespace build.

To host on Squarespace instead: upload under **Design → Custom CSS →
Manage Custom Files**, put that URL prefix in `deploy.config.json` as
`asset_base`, re-run the build. Squarespace will not host `.mp4`, so
the scene loop and the LABAY clips stay on Netlify either way.

---

## What is different from the standalone build

Same design system, same motion, same copy. Four adaptations, all of
them because the page is a block inside someone else's document:

1. **Everything is scoped to `.stir`.** Squarespace's stylesheet is on
   the same page and its element selectors (`h1 { font-family: ... }`,
   `a { color: ... }`, `ul { list-style: disc }`) beat our inherited
   values. `src/host-layer.css` restates everything the design relies
   on inside the scope.
2. **`body { … }` becomes `.stir { … }`** in the generated stylesheet.
   The base typography lives there; dropping it is how the preview once
   showed Georgia on every heading.
3. **Full bleed is viewport-based** (`width:100vw; margin-left:50%;
   transform:translateX(-50%)`) because Squarespace nests five padded
   wrappers around a Code Block.
4. **The header is sticky, not in flow**, since the document scrolls
   under it rather than beginning with it.

## Check it before you paste

```
python3 -m http.server 8080      # from the repo root
```

Open `squarespace/_preview.html`. It renders the generated package
inside a deliberately hostile mock of Squarespace's DOM — their serif
headings, their green links, their disc bullets, their nested padded
wrappers, their header and footer. Append the page name for the others
(`_preview-page-labay.html`, `_preview-page-contact.html`, …).

It reads the repo's own files, so it works with no network at all. The
automated version of the same check:

```
node scene/qa/sqsp.mjs
```

That asserts the tokens resolve, the headings keep their font and
weight, no host underline or bullet leaks in, the host chrome is
hidden, the block escapes the wrappers, and nothing overflows.

## What lives in `src/`

| file | what it is |
|---|---|
| `host-layer.css` | wrapper neutralisers, the defensive reset, host-chrome hiding, viewport full-bleed, sticky header |
| `preview-shell.html` | the hostile mock the previews are built into |
