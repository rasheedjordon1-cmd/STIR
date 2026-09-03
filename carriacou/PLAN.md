# Carriacou Logistics — Pass 1: plan and interrogation

Deliverable: one static page at `carriacou/index.html`, one deferred script `carriacou/main.js`, a designed 404, OG image, favicon set. No framework, no build step.

## 1. Token system

### Color (as briefed, plus one derived tone)

| Token | Hex | Role |
|---|---|---|
| `--frost` | `#F5F8F9` | Page ground |
| `--deep` | `#0B1F2A` | Type, dark sections, plan hairlines |
| `--galv` | `#98A4AB` | Rules, inactive, secondary type on dark ground only |
| `--amber` | `#E8A00D` | Active zone, primary CTA, focus ring. Under 6% of any screen |
| `--spice` | `#14513C` | Ownership paragraph. Once |
| `--slate` | `#4F6169` | Secondary type on Frost |

Why `--slate` exists: Galvanized on Frost is 2.4:1 and fails WCAG AA for text. It is fine for hairlines and inactive strokes, and passes 6.2:1 as secondary type on Deep Cold, so it keeps those jobs. Secondary type on the light ground uses `--slate`, a darkened Galvanized at 6.4:1. This is the one place the brief's palette table is extended, and it is extended because the brief's accessibility rule outranks its usage column.

Contrast checked: Deep Cold on Amber 7.0:1. Amber on Deep Cold 7.0:1. Frost on Deep Cold 14.7:1.

### Type

- Display: Archivo, `font-stretch: 125%`, 700. Google Fonts serves the `wdth` axis so no second file is needed.
- Body and UI: Archivo, `font-stretch: 100%`, 400 / 500.
- Numerals: `font-variant-numeric: tabular-nums` on every spec, counter, and readout.
- Fallback stack: a local `Archivo Fallback` face over Arial with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` tuned so swap produces no shift. A second fallback face at a wider `size-adjust` covers the expanded display cut.
- Stepped scale (px): 12, 14, 16, 18, 22, 28, 36, 48, 64, 88, fluid between 48 and 88 for the H1 with `clamp()`. Body measure capped at 64ch.

### Space

8pt system: 4, 8, 16, 24, 32, 48, 64, 96, 128, 160. Nothing else. Section padding 96 / 128 desktop, 64 mobile.

### Motion tokens

Exactly as briefed: `--ease-reveal`, `--ease-state`, `--ease-micro`, `--dur-micro 140`, `--dur-state 320`, `--dur-reveal 560`, `--dur-sequence 900`. One added: `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` for the M-08 snap back, because a spring needs overshoot and none of the three briefed curves overshoot.

## 2. Wireframes

### Desktop (1440)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▣ Carriacou Logistics     In view  Freezer  TK°F     tel   [Get a pallet rate] │  sticky, 56px
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Freezer, cooler, and dry          ┌───────────────────────────────┐ │
│  pallet storage in                 │  FACILITY PLAN  85 S Leonard  │ │
│  Waterbury, Connecticut.           │ ┌────────┬─────────┬────────┐ │ │
│  Month to month.                   │ │FREEZER │ COOLER  │  DRY   │ │ │
│                                    │ │TK°F    │ TK°F    │ TK°F   │ │ │
│  85 South Leonard Street. Four     │ │▦▦▦▦▦▦  │ ▦▦▦▦▦▦  │ ▦▦▦▦▦▦ │ │ │
│  docks. Refrigerated Sprinters     │ │▦▦▦▦▦▦  │ ▦▦▦▦▦▦  │ ▦▦▦▦▦▦ │ │ │
│  and trucks that deliver into      │ └────────┴─────────┴────────┘ │ │
│  the DC window.                    │  ── staging ──────────────── │ │
│                                    │   ▭1    ▭2    ▭3    ▭4  docks│ │
│  [Get a pallet rate] [Book a dock tour]  └──────────────────────────┘ │
│                                      ┌ spec panel (on zone select) ┐ │
├──────────────────────────────────────────────────────────────────────┤
│  Three zones. One building.                          (thermal scrub) │
│  ┌ Freezer ──────────┐ ┌ Cooler ───────────┐ ┌ Dry ──────────────┐   │
│  │ TK to TK °F       │ │ TK to TK °F       │ │ Ambient           │   │
│  │ TK positions      │ │ TK positions      │ │ TK positions      │   │
│  │ frozen entrées …  │ │ dairy, produce …  │ │ shelf-stable …    │   │
│  └───────────────────┘ └───────────────────┘ └───────────────────┘   │
├──────────────────────────────────────────────────────────────────────┤
│ ▓▓▓ DOCK SHUTTER (once) ▓▓▓  →  dark section                          │
│  The building.                                                        │
│  4 docks   TK sq ft   TK ft clear   TK racking   hours TK             │
│  ▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦  TK pallet positions (capacity fill)           │
│  Certifications TK  Backup power TK  Monitoring TK                    │
├──────────────────────────────────────────────────────────────────────┤
│  Product arrives inside the window. Documented. No chargeback.        │
│  appointments / OTIF / ASN / lot codes / FEFO / temp log / recall     │
│  (spec-row list, hairlines, no cards)                                 │
├──────────────────────────────────────────────────────────────────────┤
│ dark: Stored and delivered by one operation.                          │
│  1 Receive   2 Store   3 Deliver          ┌ CT map, route draws ┐     │
│                                           │  ● Waterbury ──▶ DC │     │
├──────────────────────────────────────────────────────────────────────┤
│  Who this serves — CPG categories, grocery retail supply              │
├──────────────────────────────────────────────────────────────────────┤
│  Terms — insurance TK · certifications TK · month to month · quote 1d │  (table rows, no dots)
├──────────────────────────────────────────────────────────────────────┤
│  Ownership — one paragraph, Spice Green rule                          │
├──────────────────────────────────────────────────────────────────────┤
│  Get a pallet rate                                                    │
│  ┌ form (7 fields) ───────────────┐ ┌ footprint preview ▦▦▦▦▦ ┐       │
│  └────────────────────────────────┘ └─────────────────────────┘       │
├──────────────────────────────────────────────────────────────────────┤
│ footer: NAP, hours, service area, drafted locator map, entity          │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile (390)

```
┌──────────────────────┐
│ ▣ Carriacou  TK°F ☏  │ sticky, 52px
├──────────────────────┤
│ Freezer, cooler, and │
│ dry pallet storage   │
│ in Waterbury,        │
│ Connecticut.         │
│ Month to month.      │
│                      │
│ 85 South Leonard …   │
│ [Get a pallet rate]  │
│ [Book a dock tour]   │
│ ┌──────────────────┐ │
│ │ plan view, full  │ │
│ │ width, tap zones │ │
│ └──────────────────┘ │
│ spec panel below     │
├──────────────────────┤
│ zones stacked        │
│ facility stacked     │
│ compliance list      │
│ steps 1 2 3, map     │
│ serves               │
│ terms table          │
│ ownership            │
│ form: one screen,    │
│ footprint under the  │
│ pallet field         │
│ footer               │
├──────────────────────┤
│ [ Call ] [Get a rate]│ fixed bottom bar, 56px
└──────────────────────┘
```

## 3. Plan-view concept

A drafted plan, not an icon. viewBox 960 × 600. Deep Cold hairlines (0.75 and 1.25 at 1×) on Frost.

- Building envelope: one rectangle. Square corners. No perspective.
- Dock edge on the south wall: four dock doors drawn as recessed leveler pits with door leaves, numbered 1 to 4, evenly spaced. Spacing is a drafting assumption until the site plan arrives; the brief asks for true relative spacing, so the spacing is a single constant in the SVG that can be changed without redrawing.
- A staging apron along the dock wall, hatched at 45°, labeled.
- Three zones in a row, north of the apron: Freezer (west), Cooler, Dry (east). Equal widths until capacity lands; each zone's `width` is one attribute.
- Inside each zone, a `<pattern>` of pallet-position units (a 48 × 40 rectangle per unit, the 1:1.2 aspect of a standard 40 × 48 pallet) so scale reads instantly.
- Each zone carries its name in the expanded cut, a set-point readout in tabular figures, and a position count. Readouts are `TK` until verified.
- A legend: one filled unit equals one pallet position. A north arrow. No scale bar until square footage is known.
- Interaction: each zone group is an SVG `<a href="#zone-…">`, so it is focusable and works without JavaScript by jumping to that zone's spec block. With JavaScript, the link selects instead: zone fills Amber, others drop to 40% opacity, the spec panel beside the plan expands, and the form's temperature field is set. The focus ring is a drawn Amber rectangle offset 6 units, not the UA outline.
- Without JavaScript the plan is fully rendered at its final state: all three zones filled with their tint, readouts printed, docks numbered.

## 4. Motion storyboard

| ID | Name | Trigger | Duration | Implementation | Fact revealed |
|---|---|---|---|---|---|
| M-01 | Cold Start | load | 420 outline, fills at 420 / 510 / 600, readouts count 72 → set point, headline at 700, all done by 900 | CSS keyframes with delays, `stroke-dashoffset` for the outline, opacity for fills; JS only for the tabular countdown | What the building contains and at what temperature |
| M-02 | Thermal Scrub | scroll through zones section | continuous, clamped | A cold layer whose opacity is driven by a CSS `view()` scroll timeline. Fallback: IntersectionObserver with 50 thresholds writes a custom property. Layer opacity only, saturation shift under 4% | Relative temperature, felt |
| M-03 | Frost Bloom | hover / focus on the freezer card | 400 in, 240 out | Four dendritic edge groups, each `scaleY` from its own border inward, transform only. Used once | Which zone is coldest |
| M-04 | Dock Shutter | facility section enters, once | 620 (12 slats, 40 stagger, 180 each) | Slats `scaleY(1 → 0)`, origin top, bottom slat first so the door reads as rolling up | Entry into the building |
| M-05 | Capacity Fill | capacity block enters | 12 ms per unit, counter 700 | Units are `<i>` elements toggled by transition-delay; counter reads `data-count`. With `TK` the grid renders its empty outline and no count runs | Real scale |
| M-06 | Route Draw | scroll through delivery section | scroll-linked | `stroke-dashoffset` on a `view()` timeline; reefer marker on `offset-path` with `offset-distance` on the same timeline. Same IO fallback | Service radius, storage-to-delivery coupling |
| M-07 | Zone Select | click / Enter on a zone | 200 fill, 320 panel | Class toggle, CSS transitions | Zone specs on demand |
| M-08 | Magnetic CTA | pointer within 40 px, desktop only | live, spring snap-back | 40 px padded hit wrapper, `pointermove`, translate up to 6 px, `--ease-spring` return. Off on touch and reduced motion | Primary action priority |
| M-09 | Live Zone Readout | zone in view changes | 180 digit roll | IO with a centered rootMargin band; digits are a vertical strip translated by transform | Where you are in the building |
| M-10 | Number Roll | stat enters viewport | 700 | rAF count with `--ease-reveal`, tabular figures; the final value is in the DOM from the start for AT | The specs, emphasized |
| M-11 | Live Footprint | pallet range changes | 10 ms stagger | Grid of units toggled by class, transition-delay per unit | What their order looks like in the building |
| M-12 | Reticle Cursor | pointer over the plan region, desktop | live | `cursor: none` on the region, crosshair element on transform, label from the hovered zone | The drawing is a real plan |
| M-13 | Field Choreography | focus / blur / input / submit | 140 label, 320 validation | Floating label on transform, underline `scaleX`, inline messages saying what to fix, designed success and error states | Form state at every step |
| M-14 | Section Reveal | section enters, once | 560 | Mask wrapper `overflow: hidden`, child rises from `translateY(100%)`. One direction across the page. No hover lift anywhere | Reading order |

| M-15 | Load Ticket | every form input | 320 state changes, pallets glide with a 10 ms stagger, route 480 | The right column is a drafted ticket that reuses the plan-view. Temperature fills the zone Amber; pallet count draws the buyer's pallets inside that zone; retail DC draws a route stub from Dock 3; pickup and delivery parks a reefer at Dock 2; company sets the ticket header. Send stamps it Received with the real time. Mobile pins a compact strip under the header until the stamp | What the buyer's order looks like in this building, and that the request was received |
| M-16 | Dock Appointment | the Book a dock tour tab | 320 | Same form, second mode. A strip of the next ten business days (real dates) and a morning or afternoon window. Picking a day rolls Dock 1's door up and parks the visitor's trailer. Copy says the time is confirmed by phone because receiving hours are unverified | When the visit is, and where in the building it starts |

Load curtain: cut. It costs LCP and reveals nothing.

Reduced motion: a single `@media (prefers-reduced-motion: reduce)` block sets every animated element to its final state and JS checks the same query before installing any observer or listener. Counters print their final value.

## 5. Interrogation: would I build this for any other logistics brief?

| Decision | Generic? | What changed |
|---|---|---|
| Hero with a headline left and a picture right | Yes, every 3PL does it with a stock photo | The picture is a drafted plan of this building that fills itself with its temperatures on load. The plan is the product. The headline overlaps the drawing's left edge so type and plan share one field |
| Three service cards | Yes, the most generic move on any warehouse site | Not cards. A single ruled spec table, three columns, hairlines, no shadow, no radius. The freezer column alone gets the frost bloom because it is the coldest, so the columns are not interchangeable |
| Stats row with counters | Yes | Counters exist only where a real figure exists. `TK` figures do not animate. The pallet-position count is tied to a drawn unit grid that fills to exactly the same number, so the number is checked by the drawing |
| "Why choose us" bullets | Yes | Replaced by a compliance spec written in the buyer's operating vocabulary: appointments, OTIF, ASN, lot codes, FEFO, temperature record, recall trace, lumpers. No adjectives |
| Service-area map | Yes, usually a radius circle on a stock map | A drafted Connecticut with the real interstate corridors this facility sits on (I-84, I-91, I-95). The route draws with scroll, and the radius is `TK` rather than a made-up circle |
| Contact form at the bottom | Yes | The form starts with temperature and pallet count, is pre-filled by the plan, and draws the buyer's own footprint as they choose. Company and name are last, after the buyer has told us about the load |
| Testimonials, logo wall, team | Yes | Cut. No permission, no logos. Credibility carries on specs and the compliance standard |
| Dark footer | Yes | Kept, because the footer is a NAP block and should be flat. The locator map is the same drafted Connecticut at small size, not an embed |
| Palette | A blue and an orange is every logistics site | Frost is deliberately blue-shifted white, Deep Cold is a navy-slate not black, Amber is a dock light not a brand orange. Amber is rationed under 6% and appears only where something is active |

## 6. Facts and authorizations in the build

Confirmed facts are printed plainly. Every unverified fact prints as `TK` inside `<span class="tk">`, a designed pending state, with a `data-fact` key. Every claim from Section 5 that the founder must authorize carries `data-authorize` in the markup so it can be found and struck. Both lists are reproduced in `CRITIQUE.md`.

Cut from the architecture for lack of confirmed input: H Proof, I Inventory visibility, and the Visibility row of the offer.

## 7. Conflicts resolved against the repo's `landing-page-design` skill

The repo carries a generic landing-page skill whose visual rules contradict the brief: Geist type, gradient headings, a floating pill nav, blur-and-rise reveals on every element, Phosphor icons, a mandatory word-by-word tagline section. The skill's own scope rule says the user's explicit prompt wins. The brief is the prompt. Taken from the skill: full state sets, no orphans, real copy, a branded 404, a skip link.
