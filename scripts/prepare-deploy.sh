#!/usr/bin/env bash
# Netlify build step. No bundler — this stamps the live domain into the
# share metadata and fingerprints the two assets whose contents change
# under a stable filename.
set -euo pipefail

# Netlify sets CONTEXT to production | deploy-preview | branch-deploy.
# On a production build, URL is the real domain and DEPLOY_PRIME_URL is
# the same; on a branch or preview build, DEPLOY_PRIME_URL is that
# deploy's own subdomain. Preferring DEPLOY_PRIME_URL unconditionally
# meant that when a branch deploy was published to production by hand,
# the live site shipped with every canonical and og:url pointing at
# claude-stir-...--stirnyc.netlify.app instead of the real domain --
# which is what search engines were being told to index.
if [ "${CONTEXT:-}" = "production" ]; then
  SITE="${URL:-${DEPLOY_PRIME_URL:-}}"
else
  SITE="${DEPLOY_PRIME_URL:-${URL:-}}"
fi
if [ -n "$SITE" ]; then
  SITE="${SITE%/}"
  echo "prepare-deploy: setting canonical URL to $SITE"
  for f in ./*.html robots.txt sitemap.xml; do
    [ -f "$f" ] || continue
    sed -i "s|SITE_URL|$SITE|g" "$f"
  done
else
  echo "prepare-deploy: no URL in env; leaving placeholders untouched."
fi

# ── Fingerprint the stylesheet and the script ────────────────────────
# netlify.toml caches /assets/* for a year as `immutable`, which tells
# the browser never to revalidate — not even conditionally. That is
# only ever safe when the filename changes with the contents. It did
# not: assets/stir.css was rewritten under the same name, so every
# browser that had visited before kept serving a stylesheet from
# before the rebuild. The symptom is a site with its colours and its
# utility type intact and every newer component unstyled, which looks
# like a broken build rather than a cached one.
#
# Hashing the filename fixes both halves: the URL changes when the
# content does, so caches miss, and `immutable` becomes true.
for base in stir.css stir.js; do
  src="assets/$base"
  [ -f "$src" ] || continue
  ext="${base##*.}"
  stem="${base%.*}"
  hash="$(sha1sum "$src" | cut -c1-10)"
  hashed="$stem.$hash.$ext"
  cp "$src" "assets/$hashed"
  for f in ./*.html; do
    [ -f "$f" ] || continue
    sed -i "s|assets/$base|assets/$hashed|g" "$f"
  done
  echo "prepare-deploy: $base -> $hashed"
done

echo "prepare-deploy: done."
