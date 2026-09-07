# STIR — deploying on Netlify

Static site. No framework, no bundler. The only build step stamps the
live domain into the share metadata (`scripts/prepare-deploy.sh`).

## 1. Connect the repo

1. netlify.com → **Add new site → Import an existing project → GitHub**
2. Pick **rasheedjordon1-cmd/STIR**
3. **Branch to deploy:** `claude/stir-homepage-prototype-1wopp0`
   ⚠️ The repo's default branch is an old one, so Netlify will preselect
   the wrong branch. Change it here, or make this branch the repo default
   (GitHub → Settings → Branches → Default branch).
4. Build command and publish directory come from `netlify.toml` — leave
   them as they are. Deploy.

First deploy takes about a minute. You get a URL like
`random-name-123.netlify.app` — rename it under
**Site configuration → Site details → Change site name**.

## 2. Turn on inquiry notifications

The contact form is live the moment the site deploys, but nothing emails
you until you switch it on:

**Site configuration → Forms → Form notifications → Add notification →
Email notification** → send to your address, form: `start-a-project`.

Submissions are also stored under the **Forms** tab. Free tier covers
100 submissions/month.

Test it: submit the form on `/contact`, then confirm the entry appears
in the Forms tab and the email arrives.

## 3. Custom domain (when ready)

**Domain management → Add a domain**, then point DNS at Netlify (they
give exact records). HTTPS is automatic. Trigger one redeploy after the
domain is live so the share metadata picks up the new URL.

## What's already configured

- `/about` and `/contact` work with or without `.html`
- `404.html` serves automatically for unknown URLs
- Long cache on `/assets/*`, always-fresh HTML
- Social share cards (og/twitter) auto-fill with the deployed domain
- `robots.txt` + `sitemap.xml` auto-fill the same way
- Spam honeypot on the form; no CAPTCHA

## After it's live

Send me the URL and I'll check the deployed site — Safari behavior,
share-card preview, and form round-trip.
