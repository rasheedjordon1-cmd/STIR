#!/usr/bin/env bash
# Netlify build step (no bundler — just fills in the live domain).
# Netlify sets $URL to the site's primary URL and $DEPLOY_PRIME_URL for
# branch/preview deploys. We rewrite the SITE_URL placeholder in the
# share metadata so social cards resolve on whatever domain is serving.
set -euo pipefail

SITE="${DEPLOY_PRIME_URL:-${URL:-}}"
if [ -z "$SITE" ]; then
  echo "prepare-deploy: no URL in env; leaving placeholders untouched."
  exit 0
fi
SITE="${SITE%/}"   # strip any trailing slash

echo "prepare-deploy: setting canonical URL to $SITE"
# Every HTML page plus the two text files. This was a hardcoded list of
# four pages, which meant /businesses, /creators, /collaborate and /labay
# would have shipped with a literal "SITE_URL" in their share tags.
for f in ./*.html robots.txt sitemap.xml; do
  [ -f "$f" ] || continue
  sed -i "s|SITE_URL|$SITE|g" "$f"
done
echo "prepare-deploy: done."
