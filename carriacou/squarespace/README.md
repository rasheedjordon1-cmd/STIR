# Carriacou Logistics: Squarespace kit

The Netlify page, cut into one paste per section for a Squarespace 7.1 page. It renders pixel for pixel like the original.

## What this is

Squarespace 7.1 does not accept uploaded templates. A hand-built page runs on Squarespace as pasted code: shared styles in the page's code injection, and the page itself in code blocks. This kit splits the page into one code block per section, in page order, so each section can be pasted, checked, and later replaced on its own.

## Requirements

- A Squarespace 7.1 site.
- A plan that includes Code Injection and JavaScript in Code Blocks. At the time of writing that is Core and above, formerly called Business.
- A form endpoint, which can come last. Until it is set, sending the form shows the page's designed "This didn't send" panel with the phone number.

## Files

| Step | File | Where it goes |
|---|---|---|
| 0 | `00-page-header-injection.html` | The page's Page Header Code Injection. Fonts, shared styles, the Squarespace overrides, structured data. |
| 1 | `01-header.html` | Section 1. Must stay first: it switches the page motion on. |
| 2 | `02-hero.html` | Section 2. Headline and the facility plan. |
| 3 | `03-zones.html` | Section 3. Freezer, cooler, dry. |
| 4 | `04-facility.html` | Section 4. The building. |
| 5 | `05-compliance.html` | Section 5. Retail compliance. |
| 6 | `06-delivery.html` | Section 6. Storage and delivery. |
| 7 | `07-serves.html` | Section 7. Who this is built for. |
| 8 | `08-terms.html` | Section 8. Terms. |
| 9 | `09-ownership.html` | Section 9. Who runs this. |
| 10 | `10-quote.html` | Section 10. Rate and tour form, and the load ticket. The form endpoint goes here. |
| 11 | `11-footer.html` | Section 11. Must stay last: it carries the script that runs every section. |
| | `404-optional.html` | A Code Block on the page you set as the site's 404. |

Each section file carries only the styles that section uses. The styles every section shares live in step 0.

## Install

1. Create one blank page and delete any sections Squarespace adds to it.
2. Page settings, then Advanced, then Page Header Code Injection: paste step 0.
3. For each of steps 1 to 11, in order: add a blank section, add one Code Block, paste the file, and leave "Display source" off.
4. In the page's SEO settings use the title `Cold storage in Waterbury, CT: freezer, cooler, and dry pallet storage` and the description `Public refrigerated warehouse at 85 South Leonard Street, Waterbury, Connecticut. Freezer, cooler, and dry pallet positions rented by the month, four loading docks, and refrigerated delivery into grocery DCs.`
5. Upload `../og.png` as the page's social image and `../favicon-512.png` as the site's browser icon.
6. Open the live page logged out, in a private window. Squarespace does not run code block scripts while you edit, so the editor shows the page still.

**Later, the form:** create a Formspree form, edit section 10's Code Block, and replace `https://formspree.io/f/YOUR_FORM_ID` with your endpoint. It appears once in the code. Then send one test quote and confirm the email arrives.

## What changed from the Netlify build

- **Nothing visible.** Tested at desktop and phone width inside a deliberately hostile mock of a Squarespace page, each section in its own Squarespace section: 0.0% of pixels differ from the Netlify original. The 404 also matches.
- **The header is fixed rather than sticky.** A sticky element cannot travel outside its own Squarespace section. A 56px slot holds its place, so the layout is unchanged.
- **The form posts to your endpoint**, with a subject line such as "Rate request: Freezer, 21 to 50 positions, Northside Frozen Foods".
- **Squarespace's header and footer are hidden on this page only.** Every override keys off the kit's own class, so other pages are untouched.
- **Everything is namespaced**, so the theme cannot restyle the page and the page cannot restyle the site.
- **Speed will be lower than on Netlify**, because Squarespace adds its own scripts to every page.

## Editing

Fill pending facts in `../index.html` (search `data-fact`), then run:

```
python3 build.py
```

and re-paste only the sections that changed. A fix typed straight into Squarespace is fine for one word, but the next rebuild will not know about it.

`python3 build.py --guide guide.html` writes the step-by-step page with copy buttons. `python3 build.py --mock mock.html` writes the test page.

## Troubleshooting

- **Squarespace's header still shows.** Step 0 is on another page's code injection, or it is in the site-wide one with the code blocks on a different page.
- **Motion missing on the live page.** Section 1 is not first or section 11 is not last, or the plan does not allow scripts in code blocks.
- **The form says it didn't send.** The endpoint is still the placeholder or is mistyped. The browser console says so.
- **You want Squarespace's own header and footer back.** Delete the first rule after the "Squarespace overrides" comment in step 0, and delete sections 1 and 11's header and footer markup.

## Verification, and its limit

Tested in the mock: pixel parity, the fixed header across sections, scroll-linked effects, header and hero buttons reaching the form in another section, zone select filling the form, the load ticket, the dock appointment, both form states, the phone bar, the reading line, and the scripts-off editor state. No console errors.

It has not been tested on a live Squarespace account. Check the live page once after installing.
