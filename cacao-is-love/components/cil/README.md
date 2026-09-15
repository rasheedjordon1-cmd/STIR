# CIL MICRO 2.0 — two-tier optical illustration system

One rule decides everything: **size picks the tier, and the tiers never
substitute for each other.**

| | GLYPH TIER | OBJECT TIER |
|---|---|---|
| Size | under 48px | 60px and above |
| Form | simplified SVG geometry | MICRO 2.0 illustration |
| Colour | `currentColor` + `var(--bg)` cuts | authored multi-colour + print texture |
| Where | nav, tags, bullets, utility rows, buttons, cart, footer | editorial moments, section illustrations, education modules, mega panels, product storytelling, PDP |
| File | `CilMarks.tsx` | `CilAssets.tsx`, `/public/cil/*` |

**Never enlarge a glyph to stand in for artwork. Never shrink artwork into a
glyph position.** Both failures have been measured on this project: the drawn
Curious Finger was an unreadable smudge at 13–26px, and the Seed Chamber glyph
blown up to 132px in a mega panel read as a flat leaf.

## Why the glyph tier is `currentColor`

Marks land on all four fields. One glyph that paints `currentColor` and cuts
with `var(--bg)` inherits the right foreground on cream, red, green and ink
with no per-field export. A fixed-palette raster cannot: the drawn Curious
Finger measured **invisible** on the green mega panel.

## The colour contract is unchanged

`#B63A22` · `#235C36` · `#F2E8D3` · `#17130F`

**Espresso Ink is an illustration material colour only.** It is not a field, it
is not a token, and it does not appear in `CilMarks.tsx`. It lives inside
object-tier artwork and nowhere else.

## Status

| Family | Glyph tier | Object tier |
|---|---|---|
| Seed Chamber | ✅ MICRO 2.0 | ⬜ awaiting files |
| Cacao Shard | ✅ MICRO 2.0 | ⬜ awaiting files |
| Steam | ✅ MICRO 2.0 (single + double) | ⬜ awaiting files |
| Cup Rim / Vessel | ✅ MICRO 2.0 | ⬜ awaiting files |
| Split Pod Half | ⚠️ pre-2.0, not yet redrawn | ⬜ no sheet supplied |
| Curious Finger | ⛔ retired — failed measurement twice | 64px on cream only |

Two things are outstanding:

1. **The sheets are numbered 02 (Steam) and 04 (Vessel); 01 and 03 have not
   arrived.** Split Pod Half — the SOURCE nav mark — has no MICRO 2.0
   silhouette to derive from, so it is flagged rather than invented.
2. **Object-tier artwork on saturated fields.** The mega panels are red, green
   and ink; the authored palette is Espresso Ink on Paper Cream. Either those
   panels get cream-ground colourways, or they stay glyph tier permanently.
   They cannot take the cream-ground artwork as authored.

## Proving a glyph before it ships

Render it at 11 / 13 / 16 / 20 / 26 / 40 on all four fields and look. The first
pass of these glyphs had cuts at ~6% of form width; they vanished below 16px.
Shipped cuts are ~16%.
