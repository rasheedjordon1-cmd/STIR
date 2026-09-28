# Carriacou Logistics: Squarespace kit

The same page as the Netlify build, packaged to drop into a Squarespace 7.1 site. Two pastes, one form endpoint, and it renders pixel for pixel like the original.

## What this is, and what it is not

Squarespace 7.1 does not accept uploaded custom templates. There is no theme file to install. The way to run a hand-built page on Squarespace is to paste its design into the page's code injection and its content into a code block. This kit is exactly that, prepared so it survives Squarespace's theme, section padding, layout grid, and block animations without losing a pixel.

## Requirements

- A Squarespace 7.1 site.
- A plan that includes Code Injection and JavaScript in Code Blocks. At the time of writing that is Core and above, formerly called Business. If Squarespace shows "scripts are disabled" on the live page, the plan is the reason.
- A form endpoint. Netlify Forms only works on Netlify, so the quote form posts to a Formspree-compatible endpoint instead. Formspree has a free tier. Any service that accepts a standard form post and answers with JSON will work.

## Files

| File | Where it goes |
|---|---|
| `1-page-header-injection.html` | The page's Page Header Code Injection. Fonts, all styles, and structured data. |
| `2-code-block.html` | One Code Block, alone in one blank section. The page content and its script. |
| `3-optional-404-code-block.html` | Optional. One Code Block on the page you choose as the 404. |
| `build.py` | Regenerates all three from the Netlify source. |

## Install

1. **Create the form endpoint.** In Formspree, create a form and copy its endpoint, which looks like `https://formspree.io/f/abcdwxyz`. Set the notification email to the founder's inbox.
2. **Put the endpoint in the page.** Open `2-code-block.html`, search for `YOUR_FORM_ID`, and replace the whole placeholder URL with your endpoint. It appears once.
3. **Create the page.** Add a new blank page. Set its URL slug, or set it as the homepage.
4. **Paste the design.** Open that page's settings, go to Advanced, and paste all of `1-page-header-injection.html` into Page Header Code Injection. Save.
5. **Paste the content.** Edit the page. Add one blank section, add a Code Block to it, and paste all of `2-code-block.html`. Leave "Display source" off. Save. Delete any other sections on the page.
6. **Set the page's search and social details.** In the page's SEO settings, use:
   - Title: `Cold storage in Waterbury, CT: freezer, cooler, and dry pallet storage`
   - Description: `Public refrigerated warehouse at 85 South Leonard Street, Waterbury, Connecticut. Freezer, cooler, and dry pallet positions rented by the month, four loading docks, and refrigerated delivery into grocery DCs.`
   - Social image: upload `../og.png`.
7. **Set the browser icon.** In Squarespace's browser icon setting, upload `../favicon-512.png`.
8. **Check it logged out.** Squarespace does not run scripts in code blocks while you are editing. In the editor you will see the page's resting state with no motion, which is intended. Open the live URL in a private window to see the real thing, then send one test quote and confirm the email arrives.

Optional 404: create a page, add a Code Block with `3-optional-404-code-block.html`, and choose that page as the site's 404 page in Squarespace's settings.

## What changed from the Netlify build

- **Nothing visible.** Tested full page at desktop and phone width against the Netlify original, inside a deliberately hostile mock of a Squarespace page: 0.0% of pixels differ. The 404 also matches exactly.
- **The form backend.** Same form, same load ticket, same stamp. It posts to your endpoint and adds a subject line such as "Rate request: Freezer, 21 to 50 positions, Northside Frozen Foods" so the inbox is scannable. The honeypot field is renamed to Formspree's `_gotcha`.
- **Squarespace's header and footer are hidden on this page only.** The page brings its own header, with the live zone readout and the rate button, and its own footer. Every override is keyed to this page's content, so other pages are untouched.
- **Fonts are inlined.** Nothing to upload, and no extra requests.
- **Everything is namespaced.** Styles live under `#cl-root`, animations and font names carry a `cl-` prefix, and the page uses no second `main` element or skip link, so it cannot clash with Squarespace or other blocks.
- **Speed will be lower than on Netlify.** The Netlify build scores 100 on mobile Lighthouse. Squarespace adds its own platform scripts and styles to every page, and the page cannot remove them. Expect a good score, not that one.

## Editing

**Change facts in the Netlify source, then rebuild.** Every pending fact is a `TK` with a `data-fact` key in `../index.html`. Fill them there, then run:

```
python3 build.py
```

and paste the regenerated files again. Editing the pasted code inside Squarespace works for a one-word fix, but it forks the two versions, and the next rebuild will overwrite it.

The same rules as the Netlify build apply. Every `data-authorize` claim needs the founder's approval before launch, and the wordmark is a stand-in until the master vector arrives. See `../CRITIQUE.md`.

## Troubleshooting

- **A gap or a Squarespace header shows above the page.** Some templates add extra header spacing. Confirm the header injection is on this page's Page Header Code Injection, not a different page's.
- **The form shows "This didn't send."** The endpoint is still the placeholder or is mistyped. The browser console says so in one line.
- **Squarespace rejects a paste as too long.** Move the two `@font-face` rules out of file 1: upload `../fonts/archivo-display.woff2` and `../fonts/archivo-text.woff2` through Custom CSS's custom files, and replace each `url(data:font/woff2;base64,…)` with the uploaded file's URL.
- **You want Squarespace's own header and footer back.** Delete the first rule after the "Squarespace chrome" comment in file 1, and add `#cl-root .hdr, #cl-root .ftr { display:none }`.

## Verification, and its limit

`python3 build.py --mock mock.html` writes a mock Squarespace 7.1 page with hostile theme styles, padded sections that clip overflow, a layout grid, and a block entrance animation. Tested in it: pixel parity, sticky header, the scroll-linked effects, zone selection, the load ticket, the dock appointment, both form states, the fixed phone bar, the reading line, and the scripts-off editor state. No console errors.

It has not been tested on a live Squarespace account. Squarespace changes its markup from time to time. The overrides target structure rather than exact class names wherever possible, but check the live page once after installing.
