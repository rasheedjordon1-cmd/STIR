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
paper #F2EDE1 · paper-deep #E8E0CE · kraft #C9B896 · ink #171310
green #3F5B45 · blue #7E93A3 · blue-deep #4E6675 · pod #A6331F
```

Colour sequences the narrative — each chapter takes a ground — and the hot note
is reserved for **actions and availability only**.

### Type

- **Archivo** — structural sans: nav, labels, product data, headings.
- **Newsreader** — editorial serif with true italics: long-form, the founder note.
- **IBM Plex Mono** — record-keeping only: plate numbers, weights, origin fields.
- **The mastermark** is the handwritten logotype. It is the homepage `h1`. It is
  never redrawn in code and never approximated with a typeface — see below.

Radius is `0` everywhere except form controls at `2px`.

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
| Photography | `src` fields across `content/*.ts` |
| Price, shipping, contact | `content/product.ts`, `content/site.ts` |
| Origin facts | `content/origin.ts` — **all null. Never guess.** |
| Testimonials | `content/people.ts` — **all sample data.** |
| Checkout | `chrome/CartDrawer.tsx`, marked `SWAP POINT` |
| Email / waitlist capture | `BuyModule.tsx` and `sections/Convert.tsx`, marked `SWAP POINT` |

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
