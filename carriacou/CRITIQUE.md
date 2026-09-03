# Carriacou Logistics — Pass 3: critique

Screenshots are in `screenshots/`. Desktop at 1440 × 900, mobile at 390 × 844 and 320 × 640. Captures named `mechanism-test-*` were made with temporary injected numbers to prove the countdown, counter, and capacity grid work; those numbers are not facts and are not in the page.

## 1. Can a buyer find temperature ranges, dock count, and the phone number in under 20 seconds?

Dock count: yes. It is in the hero subhead, drawn and numbered on the plan, and is the first stat in the facility section.

Temperature ranges: the position is right, the value is not there yet. The set point is the first line under each zone name on the plan, the first row of each zone column, and rolls in the header as the buyer scrolls. Every one of them currently reads `TK`. Until the founder supplies ranges, a buyer scanning for a number finds a pending state instead. This is the single most important fact to close.

Phone: the position is right, the value is `TK`. It sits in the sticky header on desktop, in the fixed bottom bar on mobile, in the footer, and in the form's success and failure states.

## 2. Which animations reveal no fact? Deleted.

- The load curtain was cut before build. It revealed nothing and cost LCP.
- The headline mask-rise in M-01 was cut during build. Lighthouse put LCP at 1.7 s on simulated slow 4G with the headline as the LCP element; the brief's budget is 1.5 s and the brief's own governing case is the buyer on LTE. The headline now paints at first render. The outline still draws, the zones still fill in sequence, the subhead and actions still rise after the outline, and the temperature countdown still finishes last. The plan-view holds the choreography; the headline does not.
- The hover lift, the fade-and-slide on every section, and the tagline word-reveal that the repo's generic landing-page skill mandates were never built.

Everything that remains is listed in `PLAN.md` section 4 with the fact it reveals. M-05 and the M-01 countdowns are built and tested but stay inert until real numbers exist, because a counter that runs to a placeholder reveals nothing.

## 3. Anything on the Section 14 ban list?

Scanned the rendered body text and the stylesheet.

| Tell | Result |
|---|---|
| Tracked-out all-caps eyebrows | none; no `text-transform: uppercase`, no positive letter-spacing anywhere |
| 01 / 02 / 03 markers | only the three steps in Storage + delivery, which is a real sequence |
| Middle dots | none |
| Spaced em dash | none; no em dash at all |
| Arrow glyph on links or buttons | none |
| One coloured word in the headline | none |
| Identical rounded cards with soft shadow | no `border-radius`, no `box-shadow` in the file |
| Fade-and-slide-up on every section | mask-rise once per section, one direction, no fade |
| Hover lift on every card | none; only the freezer column has a hover state, and it is a fact |
| Monospace for small data labels | none |
| Warm cream ground, serif display, clay accent | Frost ground, Archivo throughout, Amber rationed |
| Stock warehouse photography | no photography at all |
| Filler vocabulary | none of the listed phrases appear |
| Unconfirmed figures | every unconfirmed value is a `TK` with a `data-fact` key |

## 4. Does every Section 13 craft signal hold?

| Signal | Holds | Note |
|---|---|---|
| Optical alignment | yes | H1 and H2 carry a negative left margin of 0.04 em and 0.03 em |
| Hanging punctuation | partial | `hanging-punctuation: first last` set on the H1; only Safari honours it and there is no pull quote on the page |
| 8pt spacing, no orphans | yes | tokens 4, 8, 16, 24, 32, 48, 64, 96, 128, 160 only |
| Custom SVG, no icon library | yes | wordmark, plan, frost, reticle, map, locator, favicon all drawn in the file |
| Designed focus rings | yes | Amber 2 px ring offset 3 px; on the plan a drawn Amber rectangle; primary buttons switch the ring to Deep Cold so it is visible on Amber |
| Empty, error, success states | yes | pending fact state, form field errors with the fix stated, designed sent and failed panels, footprint empty state, spec panel empty hint |
| Designed 404 | yes | `404.html`, an empty plan with the copy "Nothing is stored at this address" |
| OG image 1200 × 630 | yes | `og.png`, rendered from `assets/og-source.html` |
| Favicon set | yes | SVG with dark-mode media query, 32, 192, 512, 512 maskable, 180 Apple |
| Selection colour | yes | Amber on Deep Cold |
| Scrollbar native | yes | untouched |
| Zero layout shift | yes | CLS 0 on both audits; fallback face size-adjusted to 98.2% and 126.3% from measured widths; spec panel and footprint have reserved heights |
| Real content | partial | no lorem, no placeholder logos; `TK` values remain and are listed in section 6 |
| Full state sets | yes | hover, focus, active, disabled on buttons, chips, fields, and plan zones |
| Landmarks, heading order, skip link | yes | header, main, footer, nav for the mobile bar; h1 then h2 with h3 inside; Lighthouse accessibility 100 |

One deviation from the palette table, stated in the plan: Galvanized fails AA as text on Frost at 2.4:1, so secondary text on the light ground uses a darkened Galvanized, `--slate`, at 6.4:1. Galvanized keeps its rule, inactive, and dark-ground text jobs.

## 5. The one memorable element, and is everything around it quiet enough?

The plan-view cold start: the building draws itself, fills warm to cold, and the temperatures count down to their set points. The header readout then carries the same numbers with the buyer through the page.

Is the rest quiet? Mostly. The two places that compete are the frost bloom and the dock shutter, and both are single-use by rule. The route draw is on a dark section far below, so it does not fight the hero. One honest concern: with every set point at `TK`, the countdown does not run, and the hero is currently quieter than it should be. It is the founder's temperatures that turn the memorable element on.

## 6. Which numbers are still `TK`?

Forty keys, each marked with `data-fact` in the markup so a search finds every instance:

appointment-policy, backup-power, certifications, clear-height, cooler-positions, cooler-setpoint, cooler-temp-range, cross-dock, delivery-radius, dock-levelers, dry-positions, dry-setpoint, dry-temp-range, edi-asn, email, entity, fleet-size, founder, freezer-positions, freezer-setpoint, freezer-temp-range, hours, insurance, minimum-pallets, minimum-term, monitoring, office-hours, onboarding, phone, pick-pack, racking, rate-lock, routing-guide, scheduled-routes, square-feet, states-served, total-positions, who-calls, wms, zip.

How to close them: replace the `TK` text. For the animated ones also fill the data attribute: `data-setpoint` on the three plan readouts, `data-count` on square feet, clear height, and total pallet positions. The capacity grid and the counter read the same attribute, so they cannot disagree.

Twelve claims are marked `data-authorize` for the founder to approve or strike before launch. They are the Section 5 offer, not facts, and the page prints them as written in the brief: month to month, no annual contract; quoted in one business day; built for 5 pallets and 500; and five process commitments in the compliance section (appointments booked before dispatch, OTIF handling, lot-code rotation, lot-level recall trace, lumper coordination). If any of these will not be met every time, strike it. A struck process row is better than a chargeback conversation.

The form is wired to Netlify Forms with a honeypot; the founder's notification email is set in the Netlify UI (see `DEPLOY.md`). The canonical, `og:image`, JSON-LD, sitemap, and robots URLs are stamped from the site URL at deploy by the one-line build command in `netlify.toml`. JSON-LD omits postal code, geo, telephone, and hours until verified; the ZIP discrepancy (07608 vs 06708) in the brief still needs a yes from the founder.

Cut from the architecture for lack of confirmed input: Proof (H), Inventory visibility (I), and the Visibility row of the offer.

## 7. Lighthouse

Served locally with gzip, Chromium headless, Lighthouse 12.

| | Mobile | Desktop |
|---|---|---|
| Performance | 100 | 95 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1.4 s | 1.4 s |
| CLS | 0 | 0 |
| FCP | 0.8 s | 0.8 s |
| TBT | 0 ms | 0 ms |
| Transfer | 61 KB | 61 KB |

Remaining audit notes are hosting configuration, not page code: set long cache headers on the fonts and script.

Budgets from the brief: JS is 5.7 KB gzipped against a 60 KB ceiling. Total transfer is 61 KB against 500 KB. LCP 1.4 s against 1.5 s on simulated slow 4G. No framework, no build step, no dependency: the site is `index.html`, `main.js`, two font files, and the icon and OG images.

Browser notes. Thermal scrub and route draw run on CSS scroll timelines in Chrome, Edge, and Safari 26; Firefox falls back to an IntersectionObserver with fifty thresholds writing one custom property, which is the only scroll-linked code path and contains no scroll listener. Hanging punctuation is Safari-only. `size-adjust` fallback metrics are honoured everywhere except older Safari, where the swap will show a small shift.

## What I would push back on

- **Temperatures before anything else.** The page is designed around a fact it does not have. Get the three set points and ranges this week; nothing else moves the needle as much.
- **The compliance section is a capability claim written as if it were confirmed.** Appendix B question 5 decides whether it is worth a lot or a little. If the brand does its own ASNs, rewrite the ASN row as coordination and keep the rest.
- **The proof section is gone, and that is correct.** Do not let anyone talk it back in with grey logos. One named national brand with written permission would be worth more than the whole terms table.
- **"Month to month" is in the headline.** It is the strongest line on the page and it is unauthorised. If the founder will not commit to it, the H1 changes, not just a table row.
