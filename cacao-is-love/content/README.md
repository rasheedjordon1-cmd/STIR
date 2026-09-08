# Content model — replace before launch

Every file in `content/` is plain TypeScript. No CMS required to start; the
shapes map cleanly onto Shopify metafields or a headless CMS later.

## Must be replaced before launch

| File | Field | Why |
|---|---|---|
| `product.ts` | `price` | Marked PLACEHOLDER. |
| `product.ts` | `gallery[].src` | All `null`. Renders a labelled empty plate until set. |
| `origin.ts` | `records[].value` | **Never guess.** Nulls render as an empty record line, which is honest. |
| `origin.ts` | `plates[].src` | Origin photography. |
| `founder.ts` | `note`, `portrait.src` | Placeholder copy in Nicolas's voice. |
| `making.ts` | `nicolasWay.body` | Placeholder. Specificity is what makes it believable. |
| `people.ts` | every entry with `placeholder: true` | **Invented testimonials are a legal and trust problem.** |
| `site.ts` | `secondaryNav` contact, `shipping` | Placeholder contact address and shipping terms. |
| `faq.ts` | shipping answer | Marked PLACEHOLDER. |

## Brand assets

| Asset | Location | Note |
|---|---|---|
| Mastermark | `public/mastermark.svg` | Handwritten logotype. **Do not redraw in code, do not substitute a font.** `components/ui/Mastermark.tsx` renders the file if present and a labelled reserved space if not. |
| Photography | `public/` | Wire paths into the `src` fields above. |
| Illustrations | `components/ui/Diagrams.tsx` | Cut-paper SVG. Replace with commissioned artwork using the same viewBox. |

## Availability

`product.availability` drives the entire buy experience:

- `in_stock` — option toggle, quantity, ADD TO BAG
- `low_stock` — as above plus "Last N bags of this harvest". Only use when
  `unitsRemaining` is a **real** count. Fabricated scarcity is the fastest way
  to lose the trust this whole site is built to earn.
- `sold_out` — JOIN THE NEXT DROP with email + optional SMS. The page stays
  fully alive: education, origin, preparation and social proof all remain.
  `nextDropLabel` renders only if set; leave it `null` if you do not know.
