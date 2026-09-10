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

### Interim illustrations

`components/cil/CilArt.tsx` stands in for the commissioned assets (EDU 001,
PROVENANCE 001, CURIOSITY 001, the preparation hands) and is drawn to the same
rules so the page reads as one system today.

⚠ **Hands do not survive reduction to geometric masses at this scale** — they
read as blobs. The first attempt at PROVENANCE 001 (hand + pod) and the
preparation hands failed on exactly that, so the interim versions lead with the
object: the pod on the branch, the block snapped in two, the cup and what goes
in it. When the real hand artwork arrives, drop it into the same viewBoxes.

---

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
- Both routes prerender static. Photography is webp and self-hosted; the four
  supplied assets were optimised from 9.7MB to 0.92MB.
