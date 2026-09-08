# CACAO IS LOVE — ecommerce template

An editorial, education-led storefront for a single-SKU cacao brand.
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

The visitor journey is `EDUCATE → BUILD TRUST → CREATE DESIRE → CONVERT`,
expressed as a publication rather than a product page. The homepage is the
canonical conversion surface; the PDP reuses the same education components at
higher density and adds the gallery, the origin record and the FAQ. There is
one source of truth for every claim.

Two deliberate departures from a conventional DTC homepage:

1. **CACAO / COFFEE sits before the benefits grid.** The biggest barrier is not
   "is this good for me" but "where does this fit in my day". Coffee is the
   mental slot everyone already has — give them the slot, then the reasons.
2. **The first purchase ask is chapter 06**, after the education. The hero
   invites; the ask is earned. Four commerce touches follow, each in a
   different register (`SHOP CACAO` → `ADD TO BAG` → `MAKE TWO` →
   `JOIN THE NEIGHBORHOOD`) so repetition reads as narrative, not nagging.

---

## The visual system

A **botanical field guide**: numbered plates, hairline rules, marginal
metadata, flat colour, warm paper. Four devices carry it.

| Device | Component | What it does |
|---|---|---|
| **Specimen rail** | `ui/SpecimenRail` | A hairline margin column of record entries running the length of a chapter. The single most identifying element on the site. |
| **Plate** | `ui/Plate` | Every image and diagram sits in a numbered, captioned frame, so the site reads as designed before any photography exists — and identically once it arrives. |
| **Contents** | inside `sections/Hero` | A publication's table of contents with dot leaders. Doubles as fast orientation and a jump menu, which is what earns the page its length. |
| **Cut-paper diagrams** | `ui/Diagrams` | Flat two-colour inline SVG. No wellness iconography, no photography dependency. |

### Colour is a contract, not a palette

`app/tokens.css` has two layers: a raw **palette** that components never touch,
and **semantic** tokens remapped by four ground classes. This exists because
the palette contains pairings that fail WCAG AA — pale field blue on cream is
2.73:1, and pod red on cacao black is 2.74:1. The ground classes make the safe
pairing the only reachable one.

The dark chapter inverts which accent carries text: on ink, pod red fails and
pale blue passes at 5.80:1, so blue speaks and pod survives only as a filled
button. Every ratio in the token file was measured, not estimated.

```
paper #F5EFE1 · paper-deep #EBE2CE · kraft #D4BC93 · ink #1B1512
clay  #A03D24 · forest    #2E4636 · bloom #E0A05A · shell #F2D9B8
```

Colour sequences the narrative — each chapter takes a ground, and two of them
(**clay** and **forest**) are saturated full-bleed fields rather than tinted
cream. That is deliberate: the first pass was ~85% cream with hairline rules and
read institutional, like a museum catalogue rather than something you want to
drink. Warmth in a food brand comes from committed colour, softened geometry and
type with a voice.

Clay is a narrow ground on purpose — only cream (5.75:1) and shell (4.83:1)
clear AA on it — so its semantic map offers nothing else, and its CTA inverts to
a cream fill with clay text.

### Type

- **Fraunces** — the voice: headlines and long-form. Its `SOFT` and `WONK` axes
  are set explicitly (`SOFT 80, WONK 1` at display sizes); at its defaults it is
  sharp and high-contrast, which reads fashion-magazine rather than warm.
- **Archivo** — the discipline: nav, labels, product data, UI.
- **IBM Plex Mono** — record-keeping only: plate numbers, weights, origin fields.
- **The mastermark** is the handwritten logotype. It is the homepage `h1`. It is
  never redrawn in code and never approximated with a typeface — see below.

Radius: `12px` on plates and cards, `8px` on inputs, pill on buttons. The first
pass used `0` everywhere, which is precise and cold; buttons carry the largest
share of the softness signal.

**No component references the raw palette.** Every colour, including inline
styles, resolves through a semantic token, so a section can change ground
without a single component edit and nothing can be left stranded on a failing
pairing.

---

## The buy module is a state machine

`components/commerce/BuyModule.tsx` is driven entirely by
`product.availability`:

| State | What renders |
|---|---|
| `in_stock` | option toggle · quantity · `ADD TO BAG` |
| `low_stock` | the same, plus *"Last N bags of this harvest"* |
| `sold_out` | `JOIN THE NEXT DROP` — email + optional SMS, next-availability line only if `nextDropLabel` is set |

**Sold out is never a dead end.** There is no disabled button and no bare
"Sold Out" message; the page keeps all of its education, origin, preparation
and social proof. **Low stock is never fabricated** — only use it when
`unitsRemaining` is a real count. Invented urgency undoes the trust the rest of
the site exists to build.

### MAKE TWO is a gift mechanic, not a quantity discount

Selecting MAKE TWO reveals an optional recipient name and a 140-character note,
which travels with the cart line and shows in the drawer. It raises AOV and
creates a referral loop at zero acquisition cost — the brand thesis made
operational. Lines carrying a note never merge with other lines, because they
are addressed to someone.

---

## Swap points

Everything a real launch needs to replace is listed in
[`content/README.md`](content/README.md). The short version:

| What | Where |
|---|---|
| Mastermark | `public/mastermark.svg`, then flip `HAS_ASSET` in `ui/Mastermark.tsx` |
| Photography | `content/photography.ts` — drop files in `public/photo/`, add the key to `AVAILABLE` |
| Price, shipping, contact | `content/product.ts`, `content/site.ts` |
| Origin facts | `content/origin.ts` — **all null. Never guess.** |
| Testimonials | `content/people.ts` — **all sample data.** |
| Checkout | `chrome/CartDrawer.tsx`, marked `SWAP POINT` |
| Email / waitlist capture | `BuyModule.tsx` and `sections/Convert.tsx`, marked `SWAP POINT` |

### Photography lands one file at a time

`content/photography.ts` is the single registry for all 14 image slots. Every
slot already has its aspect ratio, plate number, caption and alt text, and an
unset slot renders as a numbered picture-box rather than a broken image. So
adding a photograph is two lines — drop the file in `public/photo/` under the
listed filename, add its key to `AVAILABLE` — with no component or layout work.

Two rules while imagery is interim: packaging stays **unbranded** (a mocked-up
label would be inventing an identity the brand does not have yet), and origin
imagery is never captioned as though it documents a specific farm.

Unset origin fields render as a visible blank line in the record — an unfilled
form field, which is honest. A guessed field is a false sourcing claim, so the
component is built to make the honest state the easy one.

---

## Accessibility and performance

Verified in a headless browser at 320 / 390 / 768 / 1440:

- No horizontal overflow at any width.
- Exactly one `h1` per page, no heading-level jumps, every image has `alt`,
  every button has an accessible name.
- Semantic landmarks, skip link, visible focus rings, `Escape` to close, and a
  focus trap on the cart drawer and the mobile menu sheet.
- The comparison table is a real `<table>` that reflows to labelled blocks on
  mobile rather than scrolling sideways.
- Cart state changes are announced via `aria-live`.
- One scroll effect only: an 8px rise and fade, once, on entry — disabled
  entirely under `prefers-reduced-motion`.
- Both routes prerender as static. Fonts are variable and self-hosted through
  `next/font`. Diagrams are inline SVG.
