# SPICEMART

**Grenada's homegrown commerce platform.** A front-end prototype of a Shopify-powered
headless commerce experience: groceries, fresh produce, household essentials and personal
care, with local delivery, counter collection, and pickup at **The Spice Fair**.

Runs entirely on mock data. No credentials, no backend, no real checkout.

```bash
npm install
npm run dev     # http://localhost:3000
```

---

## What this is

A working prototype, not a mockup. Search, filtering, sorting, the basket, quantity
changes, serviceability, fulfilment eligibility and reordering all function against a
typed mock catalogue of 76 products across 8 aisles.

It is built around one operating principle: **Spicemart only promises what its
configuration says it can deliver.** Choosing an area in Tivoli genuinely removes the
delivery option and offers collection in Grenville instead; putting ice cream in the
basket genuinely removes Spice Fair pickup, because a tent has no chilled van bay.
Everything the interface claims traces back to a value in `data/`.

### Routes

| Route | What it is |
| --- | --- |
| `/` | Home — commerce hero, aisles, trust strip, essentials, Buy It Again, fresh, Local shelf, deals, Spice Fair, how it works |
| `/search?q=` | Search results with aisle filter, refinements and sort |
| `/category/[handle]` | Aisle or merchandising shelf (`local`, `deals` are computed shelves) |
| `/product/[handle]` | Product detail: gallery, buy box, fulfilment eligibility, details, related, frequently bought together |
| `/cart` | Full basket with fulfilment decision and totals |
| `/delivery` | Serviceability reference — every zone, window, fee and collection point |
| `/account` | Overview: saved location, active order, rewards, saved list, recently viewed, help |
| `/account/orders` | Past orders, tracking, one-tap reorder, Buy It Again |
| `/rewards` | Points, activity, possible rewards — with confirmed rules separated from concepts |
| `/spice-fair` | Event landing page: next edition, schedule, pickup, programme, vendors, vendor interest, FAQ, archive |
| `/spice-fair/[id]` | A single edition |
| `/system` | **Internal design system** — tokens, measured contrast, type, components, all 59 icons, states |

The cart drawer and the delivery-area sheet are global overlays, reachable from every view.

### Notable interactions

- **Search** matches title, vendor, aisle and tags, with a keyboard-navigable combobox
  (arrow keys, Enter, Escape) in the header. The results page reads its query on the
  client, which costs nothing (a result page has no SEO value) and keeps the whole app
  statically exportable.
- **Add to cart** turns into a quantity stepper in place — no page change, no toast.
- **Multibuy** applies automatically once the quantity is reached and shows the saving on
  the cart line.
- **Serviceability** drives the header, the hero card, the product page, the cart and the
  checkout gate from one rules module.
- **Spice Fair pickup** only appears when an edition with a collection tent is genuinely
  open — gated on venue capability *and* the 36-hour staging cutoff.
- **Checkout** hands off to Shopify. The mock adapter returns no checkout URL, so the
  button states plainly that checkout is not connected rather than faking a payment flow.
- **Reorder** rebuilds a past basket, skipping anything now out of stock, and says so.
- **Add to calendar** generates a real `.ics` file in the browser.

---

## Project structure

```
app/                      Routes (App Router). Server components fetch through the adapter.
components/
  brand/                  Logo treatments
  commerce/               Product card, art, grid, cart drawer, buy box, collection view
  events/                 Event card, vendor grid, calendar, vendor interest
  fulfillment/            Service status, fulfilment picker, location sheet
  home/                   Homepage sections
  account/                Orders, account and rewards views
  icons/                  The whole icon system (one file, one grammar)
  layout/                 Header, search, bottom nav, footer, page heading
  system/                 /system galleries
  ui/                     Button, Badge, Field, Notice, Overlay, EmptyState, Skeleton, Section
data/                     All mock content and configuration
lib/
  commerce/               The service boundary: types, mock, shopify placeholder, selection
  store/                  Cart, location, session, fair, overlay state
  fulfillment.ts          The fulfilment rules engine
  format.ts search.ts     Money/date formatting, weighted search
scripts/                  Brand asset derivation, e2e and audit scripts
styles/                   tokens.css (design tokens) + globals.css
types/                    Domain types
public/brand/             Logo artwork and derived treatments
```

### Where the important things live

| Thing | File |
| --- | --- |
| **Design tokens** | `styles/tokens.css` — colour, type scale, space, radius, motion. Surfaced to Tailwind v4 via `@theme`, so `bg-leaf`, `text-forest-muted` etc. are generated from them. |
| **Fulfilment rules** | `lib/fulfillment.ts` — the only place that decides what can be promised |
| **Delivery zones** | `data/zones.ts` — every window, fee, threshold and collection point |
| **Platform config** | `data/config.ts` — fees, thresholds, minimum order, rewards rate, fair cutoff, trust claims |
| **Catalogue** | `data/products.ts` — 76 products through a compact seed |
| **Event schedule** | `data/events.ts` — generated from a rule, not a stored list |
| **Commerce boundary** | `lib/commerce/` — `types.ts`, `mock.ts`, `shopify.ts`, `index.ts` |
| **Badge priority** | `components/commerce/badges.ts` — max two merchandising badges per card |
| **Icons** | `components/icons/index.tsx` — add one entry to `PATHS` and it is typed, usable and in the gallery |

---

## Shopify readiness

The prototype runs on mock data but every read and cart mutation already goes through a
single interface:

```ts
interface CommerceAdapter {
  getProducts, getProduct, getCollections, getCollection, searchProducts,
  createCart, addCartLines, updateCartLines, removeCartLines, getCart, getCheckoutUrl
}
```

`lib/commerce/index.ts` picks the adapter at runtime: if `SHOPIFY_STORE_DOMAIN` and
`SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set it uses the Shopify adapter, otherwise the mock.
**No presentation component imports a Shopify type, a GID, or a GraphQL document.**

### Environment variables

Copy `.env.example` to `.env.local` only when connecting a real store. The prototype needs
none of them.

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
SHOPIFY_API_VERSION=2025-07
```

These are deliberately **not** prefixed `NEXT_PUBLIC_`, so they stay server-side and are
never bundled into the client.

### Where the Shopify calls go

All of them in `lib/commerce/shopify.ts`. That file documents the mapping in detail;
the summary:

- **Money** — Storefront returns decimal strings; convert to minor units on the way in.
  Everything downstream already works in EC cents.
- **`unit` / `unitPrice`** — no first-class Shopify field. Use a metafield, or Shopify's
  own unit pricing on the variant.
- **`local` / `fresh`** — product tags or metafields, mapped in the adapter so the shelf
  logic in the UI never changes.
- **`fulfillmentMethods`** — a product metafield. Cold-chain lines must exclude
  `spice-fair-pickup`; that single flag is what drives the gating described above.
- **`inventoryStatus`** — `availableForSale` + `quantityAvailable`; map `<= 5` to
  `low-stock`.
- **Images** — replace `ProductArt` with `image.url` + `image.altText` once real
  photography exists. `ProductImage.alt` is already carried through the data model.
- **Cart** — `cartCreate` / `cartLinesAdd` / `cartLinesUpdate` / `cartLinesRemove`,
  with the cart id in a cookie. `cart.checkoutUrl` is what `getCheckoutUrl` must return;
  the UI follows it. Cart mutations should move to route handlers or server actions at
  that point, since the Storefront token is server-side only.
- **Context** — `@inContext(country: GD, language: EN)` so prices return in XCD via
  Shopify Markets.

### Content that does not belong in the product catalogue

- **Spice Fair events, venues and vendor line-ups** → Shopify metaobjects or an external
  CMS. `data/events.ts` is already isolated behind functions for exactly this reason:
  swap the generator for a feed and everything downstream keeps working.
- **Delivery zones, windows and fees** → operational config, not Shopify. At launch these
  should come from the routing/delivery system of record so a window is never wrong.
- **Rewards balances and activity** → a loyalty service, once the programme exists.

### Replacing the mock data

Every mock file is standalone and typed. Either implement `shopify.ts` (preferred), or
point `mock.ts` at a different source — the adapter is the only thing that reads `data/`.

---

## Design system

**Grenadian marketplace modernism × mobile commerce utility.** Warm paper surfaces,
Forest ink, decisive rules, compact product cards, flat colour, almost no shadow.

- **Brand** — the supplied logo is authoritative. `scripts/derive-brand-assets.mjs`
  crops it to its own clear space and separates the ink from its green ground to produce
  light, dark and symbol-only treatments. Nothing is redrawn, distorted or outlined.
  Re-run with `npm run brand:derive`.
- **Signal Green `#5DAE35`** is sampled from the supplied artwork. It is a *ground*, not a
  text colour: Paper on it measures 2.71 and is never used. Forest on it measures 5.84.
- **Type** — Archivo for display and headings (tight tracking), Hanken Grotesk for the
  interface. Prices, quantities and dates use tabular figures everywhere.
- **Icons** — 59 custom SVGs on one grammar: 24px box, 1.75 stroke, round caps,
  `currentColor`, no fills, silhouette first. No libraries, no emoji.
- **Product artwork** — there is no product photography, and inventing photorealistic
  shots would misrepresent an assortment that does not exist. Instead each product renders
  a flat packaging graphic from its motif and one palette tint: honest about being
  prototype content, and dense enough to scan in a grid.

`/system` shows all of it, including **measured** contrast ratios computed at render time
rather than asserted in a comment.

### Accessibility

Targeting a WCAG 2.2 AA baseline:

- Semantic HTML, one `h1` per page, no heading-level jumps (audited).
- Visible focus on every interactive element, with a variant that stays legible on dark
  and Signal Green surfaces.
- Both overlays are proper dialogs: labelled, Escape to close, focus moved in, Tab cycled
  within, focus returned on close.
- Tone is never carried by colour alone — every status has an icon and a word.
- Add-to-cart and quantity steppers are 44px targets; secondary inline controls are 40px.
- `prefers-reduced-motion` disables all animation and smooth scrolling.
- Icons are decorative by default and hidden from assistive technology, because each one
  sits beside a real text label. `<Icon title="…">` is for the rare icon that carries
  meaning alone.

---

## Testing

Both scripts need the dev server running (`npm run dev`) and use the preinstalled Chromium.

```bash
npm run test:e2e     # 21 interaction checks: search, cart, stepper, drawer focus,
                     # zone changes, fulfilment gating, minimum order, checkout state,
                     # sort, filter, reorder, skip link
npm run test:audit   # every route at 375/430/768/1280/1440: horizontal overflow,
                     # tap targets, alt text, control labels, heading order
npm run lint
npm run typecheck
npm run build
```

---

## Deploying

Two paths. Pick based on whether you want the date-relative content to stay fresh.

### Recommended — connect the repository (full Next.js)

Point Netlify at this repo. It detects Next.js and installs its Next runtime;
`netlify.toml` sets the build command and Node version. Nothing else to configure —
with no Shopify credentials set, the app runs on the mock adapter and renders the
honest "checkout not connected" state.

Server rendering and the hourly ISR revalidation both work, so "next Spice Fair"
and the relative order dates stay correct without a rebuild.

### Drag-and-drop — the static zip

```bash
npm run package        # -> dist/spicemart-prototype-<date>.zip  (~5.4 MB)
```

Drop the zip onto Netlify's deploy area. The archive root *is* the site root, so
there is no build step and no configuration. All 102 pages are real HTML files,
so pretty URLs and the 404 page work on any static host.

**The one tradeoff:** a static export has no server, so anything relative to
"today" is frozen at build time — the next Spice Fair, the "in 3 days" countdown,
and the order history dates. Rebuild to refresh them. Everything else — search,
filtering, sorting, the basket, serviceability, fulfilment gating, reordering —
works identically, because it all runs in the browser.

Verified: the exported bundle passes the same 21 interaction checks and the same
responsive/accessibility audit as the server build.

```bash
npm run build:static                     # export to ./out
node scripts/serve-static.mjs out        # serve it the way a host would
BASE_URL=http://localhost:4321 npm run test:e2e
```

---

## Assumptions that need business confirmation

Everything below is a placeholder chosen so the prototype could be built. All of it is
adjustable in one file.

| Assumption | Where | Note |
| --- | --- | --- |
| 12 delivery areas, 5 collection points, 3 service states | `data/zones.ts` | Invented to demonstrate the model. Real coverage depends on drivers and routing. |
| Delivery windows (e.g. "Today, 4–7pm") | `data/zones.ts` | Not operationally validated. |
| Delivery fees EC$8–20, free over EC$150–250 | `data/zones.ts` | Illustrative. |
| EC$30 minimum order | `data/config.ts` | Illustrative. |
| Fair on the 1st and 3rd Saturday, four venues in rotation | `data/config.ts`, `data/events.ts` | The rhythm is approved; the venues and rotation are invented. |
| Collection tents only at Frequente and Grenville | `data/events.ts` | Invented operational constraint (chilled van bay). |
| 36-hour Spice Fair pickup cutoff | `data/config.ts` | Invented. |
| 1 point per EC$1, 2,500 to the next reward | `data/config.ts`, `data/rewards.ts` | **Not signed off.** The UI labels concepts as concepts. No paid membership tier exists or is proposed. |
| Vendor names | `data/vendors.ts` | Invented businesses on real Grenadian geography. Replace with signed vendors. |
| Product catalogue, prices, pack sizes, stock | `data/products.ts` | Sample data, not a commercial offer. |
| Order history | `data/orders.ts` | Generated relative to today so it never goes stale. |
| Returns and refunds copy | `components/account/AccountView.tsx` | Explicitly a placeholder. |

The interface discloses its own status: a prototype notice on the home page, product page
and basket, and "concept" vs "confirmed" labelling throughout rewards.

## Not solved by a front-end prototype

These are the things that actually decide whether Spicemart works, and none of them are
design problems:

1. **Final service zones** — which areas get a route, at what frequency, with what vehicle.
2. **Delivery windows and fees** — real drive times, batching, and the unit economics of
   a EC$8 fee on a EC$150 basket.
3. **Inventory synchronisation** — the hardest problem in grocery. A product page that
   says "In stock" is a promise; it needs live counts from the picking system, not a
   nightly export.
4. **Payment availability** — which cards, wallets and local methods Shopify Payments
   actually supports for a Grenadian merchant, and what the alternative is.
5. **Shopify plan and Storefront API setup** — Markets configured for XCD, metafield and
   metaobject definitions, a Storefront token, and a decision on where cart mutations run.
6. **Local delivery operations** — drivers, routing, cold chain, failed deliveries,
   substitutions, and what happens when produce is short on the day.
7. **Product photography** — the single biggest visual upgrade available. The generated
   artwork is a placeholder system, not a destination.
8. **Returns and refunds policy** — particularly for fresh and frozen, where the honest
   answer is usually "replace it, do not argue".
9. **Rewards economics** — earn rate, liability, expiry, and whether a Spice Fair bonus
   is affordable.
10. **Confirmed Spice Fair schedule and venue data** — permissions, site capability,
    vendor agreements, and who owns the collection tent.

---

## Note on this repository

The repository root also contains `index.html`, an unrelated single-page site for a
different brand that predates this work. It is untouched and is not part of the Next.js
application.
