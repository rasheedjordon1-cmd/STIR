# CACAO IS LOVE — storefront

Next.js App Router, TypeScript, CSS Modules. **Zero UI dependencies** — no
component library, no CSS framework, no animation library.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

Routes: `/` (homepage) · `/shop/whole-cacao` (PDP).

---

## The idea

Someone makes a cup. Someone shares it. A conversation starts. The page is
built in that order, and the commerce is never more than one screen away.

The visual identity lives in the code, not on top of it. If the hero photograph
and the product photograph both disappeared, the site would still be
unmistakably CIL: red, cream, green, ink, the mastermark, the heavy grotesk, the
utility information system, the micro-assets and the asymmetric grid.

---

## Colour is a contract

`app/tokens.css` holds four colours and nothing else. No fifth colour, no
gradients, no tints outside the family. The measured contrast makes the system
narrower than it first looks:

```
cream on red    4.77  AA        red on green   1.36  FAIL
cream on green  6.50  AA        ink on green   2.34  FAIL
cream on ink   15.19  AA        ink on red     3.18  large only
ink on cream   15.19  AA        green on ink   2.34  FAIL
red on cream    4.77  AA
green on cream  6.50  AA
```

So **red and green fields carry cream type only** — hierarchy there comes from
weight and scale, not colour, which is how packaging works anyway. The four
field classes (`.field-cream`, `.field-red`, `.field-green`, `.field-ink`) remap
every semantic token, and a failing pairing is simply never mapped, so a
component cannot reach one. No component references the raw palette.

Each major section makes a colour decision, and the rhythm of those decisions is
the storytelling:

```
CREAM → INK → RED → CREAM → CREAM → GREEN → CREAM → CREAM → RED → CREAM → CREAM → GREEN
hero    strip  truth  pack   what     origin  make   nicolas poster  buy   people  email
```

---

## Typography

| System | Face | Job |
|---|---|---|
| **A — brand** | the mastermark | Letterform art. Never text, never a font. |
| **B — display** | Archivo 800/900, width 112% | Every live heading. Blunt, wide, commercial. |
| **C — utility** | Archivo 700 narrow + IBM Plex Mono | Product data, labels, prices, origin, shipping. Shelf-edge and warehouse-label register. |
| **D — human** | Newsreader | The Nicolas quote and field notes. Rare, and no longer carries the brand. |

The supplied mastermark artwork was separated onto an alpha channel and emitted
in all three brand colours (`public/brand/mastermark-{cream,red,ink}.png`), so
the mark sits on any field with no plate behind it.

---

## CIL asset system

`components/cil/CilMarks.tsx` — the six micro-assets: **Seed Chamber** (bullets,
inventory markers, row markers, punctuation), **Double Steam** (preparation
headings), **Cacao Shard** (transitions and rule interruptions), **Split Pod
Half** (cropped off a section edge), **Cup Rim** (recipes, FAQ), **Curious
Finger** (educational links only, and it advances toward the link on hover).

Every mark paints in `currentColor` and cuts with `var(--bg)`, so it inherits
whatever field it lands on and never takes a colour prop. Restraint is the rule:
never more than one or two on a screen.

**SOFT OUTSIDE, CUT INSIDE** — the mastermark's own logic — is applied to the
interface as a single corner cut (`.cut-br`, `.cut-tl`, `.cut-tr`, and the
primary button), not as a general rounding. Corners are otherwise square.

### Supplied artwork

`components/cil/CilAssets.tsx` serves the delivered illustrations: **PROVENANCE
001 — HAND + POD**, **EDU 001** (whole cacao / cocoa powder), **CURIOSITY 001 —
TELL ME MORE**, and the **DOUBLE STEAM** and **SPLIT POD HALF** micro-assets.

They arrived on a near-white ground (`#FDFCF2`), which is far lighter than PAPER
CREAM, so dropping them in as rectangles would have shown a bright box on every
field. The pipeline lifts each one onto an alpha channel and snaps its colours
to the canonical palette:

- Coverage is recovered from each pixel's distance to the background, the flat
  ink underneath is un-blended out of the antialiasing, that ink is classified,
  and the result is re-emitted with the coverage as alpha. Classifying colours
  directly would have jagged every edge.
- The source red and green drift slightly off brand (`#C11A1A` / `#2A6636`), so
  they are snapped to CIL RED and MARKET GREEN. The powder's brown maps to INK,
  keeping the four-colour rule.
- EDU 001 arrives as one landscape plate holding both panels; it is split on the
  widest empty column run so each half can be laid out and labelled separately.
- Flat two- and three-colour art compresses far better losslessly: 416KB for the
  whole set.

**The hands are MARKET GREEN, and that is a layout constraint.** Any of this
artwork on a green field disappears, and recolouring it either erases the cream
cut lines that separate the fingers or drops the red seeds onto green at 1.36:1.
So the provenance section is a **cream / green split field** — artwork on the
cream half, cream type on the green half — which keeps the green in the colour
rhythm and the red pod as the chromatic focal point, with the artwork exactly as
drawn.

### Still interim

`components/cil/CilArt.tsx` holds the three preparation steps (BREAK, MELT +
MIX, MAKE IT YOURS), drawn to the same rules, plus the Seed Chamber, Cacao
Shard, Cup Rim and Curious Finger micro-marks in `CilMarks.tsx`.

⚠ Hands do not survive reduction to geometric masses at this scale — they read
as blobs, which is exactly what the first attempt at the preparation hands did.
The interim versions lead with the object instead: the block snapped in two, the
pan and spoon, the cup and what goes in it. Drop the real artwork into the same
viewBoxes when it lands.

## Commerce — unchanged

The buy module remains a state machine driven by `product.availability`:
`in_stock`, `low_stock` (harvest-anchored, only with a real count), and
`sold_out`, which renders waitlist capture instead of a disabled button and
keeps the whole page's education intact.

**MAKE TWO** is a gift mechanic, not a quantity discount: an optional recipient
name and note travel with the cart line, and lines carrying a note never merge.
The bag is a printed order slip — cream stock, dashed tear-rules, a product
thumbnail, and a MAKE TWO? upsell.

---

## Swap points

Everything a launch needs to replace is listed in
[`content/README.md`](content/README.md), plus `content/photography.ts` for
image slots. Origin fields are all optional and render as blank record lines
when unset, so an unconfirmed sourcing fact cannot ship as a fabricated one.
Sample testimonials are flagged for replacement.

---

## Accessibility and performance

Verified in a headless browser at 320 / 390 / 768 / 1440 on both routes:

- No horizontal overflow at any width.
- Exactly one `h1` per page, no heading-level jumps, every image has `alt`,
  every button has an accessible name.
- Semantic landmarks, skip link, visible focus rings, `Escape` to close, and a
  focus trap on the cart drawer and the mobile menu sheet (verified).
- The comparison table is a real `<table>` that reflows to labelled blocks on
  mobile rather than scrolling sideways.
- Cart state changes announced via `aria-live`.
- Motion is 150–300ms and physical: the Seed Chamber slides into nav items, the
  Curious Finger advances toward a link, the poster scales 1.5% on hover, the
  marquee pauses on hover. All of it disabled under `prefers-reduced-motion`.
- Both routes prerender static. Photography is webp and self-hosted, optimised
  from 9.7MB to 0.92MB; the illustration set is lossless webp at 416KB.

---

## Shareable demo

```bash
node scripts/build-demo.mjs     # -> demo/cacao-is-love.html
```

Emits one self-contained HTML file (~2.1 MB) with every image inlined as a data
URI, so it can be published, emailed or opened straight off disk with no server.

It reuses the **real** stylesheets verbatim — tokens, globals and all four CSS
modules — so what ships is the actual design system, not a re-creation. What it
re-authors is the markup and the interactivity in vanilla JS, because the app is
React and a single portable file cannot carry the framework. The working parts
are the bag (add, quantity, remove, MAKE TWO upsell, gift note on the line), the
mobile menu, the sticky buy bar, the scroll reveals, and a demo-only switcher
for the three stock states.

⚠ The copy in the demo is a **snapshot**. The app reads `content/*.ts`; the demo
does not. Re-run the build after content changes.

Two source bugs surfaced while building it, both fixed: `.field` meant two
different things in two CSS modules, and `.nicArt svg` silently stopped applying
when that illustration became an `<img>`, so its size cap had been lost.
