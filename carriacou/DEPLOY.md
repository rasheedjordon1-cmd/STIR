# Deploying Carriacou Logistics to Netlify

The site is static: `index.html`, `main.js`, two font files, icons, a 404, and a no-JavaScript confirmation page. There is no bundler and nothing to install. The only build step is one `sed` line in `netlify.toml` that stamps the live URL into the canonical link, Open Graph tags, JSON-LD, sitemap, and robots file.

## 1. Connect the repository

1. Netlify: **Add new site** then **Import an existing project** then GitHub then `rasheedjordon1-cmd/STIR`.
2. Branch to deploy: the branch that carries `carriacou/` (currently `claude/carriacou-logistics-landing-6zz3ih`; switch to `main` once merged).
3. **Base directory:** `carriacou`. This is the one setting that matters. It tells Netlify to read `carriacou/netlify.toml` and leaves the STIR studio site at the repo root alone.
4. Build command and publish directory fill in from `netlify.toml`. Leave them.
5. Deploy.

If you deploy by drag-and-drop or `netlify deploy` instead of Git, the build command does not run and `__SITE_URL__` stays in the markup. Use Git.

## 2. Turn on form notifications

The quote form uses Netlify Forms. Submissions land under **Forms** in the Netlify UI with every field (intent, temperature, pallets, product, retail, delivery, start, company, name, email, phone).

1. Site configuration then **Forms** then **Form notifications** then **Add notification** then **Email notification**.
2. Event: new form submission. Form: `quote`. Email: the founder's inbox (`[VERIFY]` email in the fact registry).
3. Submit the form once from the live site and confirm the email arrives. Do this before sharing the URL.

Spam: the form carries a honeypot field. Netlify's Akismet filtering is on by default. Both are free.

Netlify Forms on the free plan allows 100 submissions a month. A cold-storage quote form will not get near that; if it does, that is a good problem and the Forms Level 1 add-on covers it.

## 3. Custom domain and HTTPS

1. **Domain management** then **Add a domain**. Use the domain that will go on the Google Business Profile.
2. Point DNS at Netlify (their nameservers, or a CNAME for `www` and an ALIAS or A record for the apex).
3. HTTPS is automatic through Let's Encrypt. Force HTTPS is on by default.
4. After the domain is live, trigger one redeploy (**Deploys** then **Trigger deploy**) so `$URL` becomes the custom domain and the stamped URLs update.

## 4. Before sharing the URL

- Fill every `TK` fact in `index.html` (search `data-fact`). Phone, ZIP, and the three temperature ranges first. See `CRITIQUE.md` section 6.
- Approve or strike every `data-authorize` claim.
- Set `og:image` check: paste the live URL into a social preview tool and confirm the plan-view image appears.
- Match the NAP on the page to the Google Business Profile character for character.
- Run Lighthouse from Chrome DevTools on the live URL. Expect 100 / 100 / 100 / 100 on mobile. The headers in `netlify.toml` take care of the caching audit that the local run flagged.

## What `netlify.toml` sets

- Publish directory `.` relative to the `carriacou` base.
- Fonts cached one year, immutable. Icons and OG image one week. HTML and `main.js` revalidated on every request, which is Netlify's default and correct for un-fingerprinted files.
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a Content Security Policy that allows only same-origin scripts plus the one inline class-name script by hash. Inline styles are allowed because the critical CSS is inline by design.
- `skip_processing = true` so Netlify does not rewrite the HTML, CSS, or JS.
- `/index.html` redirects to `/`.

## If the form stops working

Netlify only registers a form that exists in the deployed HTML with `data-netlify="true"` and a `name`. Do not move the form into JavaScript. If a field is added, add it to the markup, redeploy, and Netlify picks it up.
