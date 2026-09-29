"""Polite HTTP client and the three per-store fetches (products, meta, best-sellers)."""
from __future__ import annotations

import logging
import random
import re
import time
from datetime import datetime, timezone
from urllib.parse import unquote, urlsplit

import requests

log = logging.getLogger("shopify")

DEFAULT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)
# 430 is Shopify's own "slow down / security rejection" code; treat it like 429.
RATE_LIMIT_STATUSES = {429, 430}
TRANSIENT_STATUSES = {500, 502, 503, 504}
PAGE_SIZE = 250
MAX_RETRY_AFTER = 120.0


class FetchError(Exception):
    pass


class PoliteSession:
    """Sequential GETs with a fixed gap between every request and exponential backoff.

    - `delay` seconds between the end of one request and the start of the next.
    - On 429/430 (and 5xx / connection errors) retry up to `max_retries` times,
      waiting Retry-After if the server sends one, else backoff_base * 2**attempt.
    """

    def __init__(self, delay: float = 1.5, max_retries: int = 3, timeout: float = 30.0,
                 user_agent: str = DEFAULT_UA, backoff_base: float = 2.0):
        self.delay = delay
        self.max_retries = max_retries
        self.timeout = timeout
        self.backoff_base = backoff_base
        self._last = 0.0
        self.request_count = 0
        self.s = requests.Session()
        self.s.headers.update({
            "User-Agent": user_agent,
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })

    def _wait_turn(self) -> None:
        gap = self.delay - (time.monotonic() - self._last)
        if gap > 0:
            time.sleep(gap)

    def _backoff(self, attempt: int, resp: requests.Response | None) -> float:
        if resp is not None:
            ra = resp.headers.get("Retry-After", "")
            try:
                return min(float(ra), MAX_RETRY_AFTER)
            except ValueError:
                pass
        return self.backoff_base * (2 ** attempt) + random.uniform(0, 0.5)

    def get(self, url: str) -> requests.Response:
        attempt = 0
        while True:
            self._wait_turn()
            resp, err = None, None
            try:
                self.request_count += 1
                resp = self.s.get(url, timeout=self.timeout)
            except requests.RequestException as e:
                err = e
            finally:
                self._last = time.monotonic()

            retryable = err is not None or resp.status_code in RATE_LIMIT_STATUSES | TRANSIENT_STATUSES
            if not retryable:
                return resp
            if attempt >= self.max_retries:
                if resp is not None:
                    return resp
                raise FetchError(f"{url}: {err}")
            wait = self._backoff(attempt, resp)
            why = f"HTTP {resp.status_code}" if resp is not None else type(err).__name__
            log.warning("  %s on %s — retry %d/%d in %.1fs", why, url, attempt + 1, self.max_retries, wait)
            time.sleep(wait)
            attempt += 1


# --------------------------------------------------------------------------- detection

def _json_or_none(resp: requests.Response):
    if resp.status_code != 200:
        return None
    try:
        return resp.json()
    except ValueError:
        return None


def looks_like_shopify(resp: requests.Response) -> bool:
    h = {k.lower(): v for k, v in resp.headers.items()}
    if any(k in h for k in ("x-shopid", "x-shopify-stage", "x-sorting-hat-shopid", "x-shardid")):
        return True
    if "shopify" in h.get("powered-by", "").lower():
        return True
    return "cdn.shopify.com" in resp.text[:200_000]


def base_url_from(resp: requests.Response) -> str:
    """Scheme+host after redirects, so later requests skip the redirect hop."""
    parts = urlsplit(resp.url)
    return f"{parts.scheme}://{parts.netloc}"


# --------------------------------------------------------------------------- best-sellers

MAIN_RE = re.compile(r"<main\b.*?</main>", re.S | re.I)
# /products/h, /collections/all/products/h, /en-us/products/h, absolute URLs...
PRODUCT_HREF_RE = re.compile(
    r"""href\s*=\s*["'](?:https?://[^"'/]+)?(?:/[a-z]{2}(?:-[a-z]{2})?)?"""
    r"""(?:/collections/[^"'/?#]+)?/products/([^"'/?#]+)""",
    re.I,
)


def parse_product_handles(html: str) -> list[str]:
    """Product handles in page order, de-duplicated.

    Scoped to <main> when present so header mega-menus / footer "featured product"
    links don't get ranked #1.
    """
    m = MAIN_RE.search(html)
    scope = m.group(0) if m else html
    out: dict[str, None] = {}
    for h in PRODUCT_HREF_RE.findall(scope):
        out.setdefault(unquote(h).strip().lower(), None)
    return list(out)


# --------------------------------------------------------------------------- store scrape

def scrape_store(session: PoliteSession, domain: str, max_pages: int = 100,
                 bestseller_pages: int = 3) -> dict:
    """Fetch one store. Returns a dict with keys: store (status summary), products,
    meta_text (raw JSON text or None), bestsellers (ordered handles)."""
    started = datetime.now(timezone.utc).isoformat(timespec="seconds")
    store = {"domain": domain, "status": "error", "reason": "", "base_url": f"https://{domain}",
             "fetched_at": started, "product_count": 0, "product_pages": 0,
             "products_complete": False, "bestseller_pages": 0, "bestseller_count": 0,
             "meta_ok": False}
    result = {"store": store, "products": [], "meta_text": None, "bestsellers": []}

    # ---- page 1 decides whether this is a Shopify store at all
    try:
        r = session.get(f"{store['base_url']}/products.json?limit={PAGE_SIZE}&page=1")
    except FetchError as e:
        store["reason"] = str(e)
        return result
    data = _json_or_none(r)
    if not isinstance(data, dict) or not isinstance(data.get("products"), list):
        if looks_like_shopify(r):
            store["status"] = "shopify_blocked"
            store["reason"] = f"Shopify store but products.json unavailable (HTTP {r.status_code}; password page, bot wall, or disabled)"
        else:
            store["status"] = "non_shopify"
            store["reason"] = f"products.json is not Shopify JSON (HTTP {r.status_code}, {r.headers.get('Content-Type', '?')})"
        return result

    base = store["base_url"] = base_url_from(r)
    by_id: dict = {}
    page = 1
    while True:
        batch = data["products"]
        store["product_pages"] = page
        for p in batch:
            by_id.setdefault(p.get("id") or f"{p.get('handle')}", p)
        # A short page is the last page; skipping the extra "empty" request is kinder to the store.
        if len(batch) < PAGE_SIZE:
            store["products_complete"] = True
            break
        if page >= max_pages:
            store["reason"] = f"stopped at --max-pages={max_pages}; catalog may be larger"
            break
        page += 1
        try:
            r = session.get(f"{base}/products.json?limit={PAGE_SIZE}&page={page}")
        except FetchError as e:
            store["reason"] = f"products page {page}: {e}"
            break
        data = _json_or_none(r)
        if not isinstance(data, dict) or not isinstance(data.get("products"), list):
            store["reason"] = f"products page {page}: HTTP {r.status_code}, not JSON"
            break
    result["products"] = list(by_id.values())
    store["product_count"] = len(by_id)
    store["status"] = "ok"
    log.info("  products: %d over %d page(s)%s", len(by_id), store["product_pages"],
             "" if store["products_complete"] else " (INCOMPLETE)")

    # ---- meta.json: keep it raw, assume nothing about its fields
    try:
        r = session.get(f"{base}/meta.json")
        if _json_or_none(r) is not None:
            result["meta_text"] = r.text
            store["meta_ok"] = True
        else:
            log.info("  meta.json: HTTP %s, not JSON", r.status_code)
    except FetchError as e:
        log.info("  meta.json failed: %s", e)

    # ---- best-sellers: page order == rank
    ranked: dict[str, None] = {}
    for n in range(1, bestseller_pages + 1):
        try:
            r = session.get(f"{base}/collections/all?sort_by=best-selling&page={n}")
        except FetchError as e:
            log.info("  best-sellers page %d failed: %s", n, e)
            break
        if r.status_code != 200:
            log.info("  best-sellers page %d: HTTP %s", n, r.status_code)
            break
        handles = parse_product_handles(r.text)
        new = [h for h in handles if h not in ranked]
        store["bestseller_pages"] = n
        if not new:  # end of collection, or theme ignores ?page= (infinite scroll)
            break
        for h in new:
            ranked[h] = None
    result["bestsellers"] = list(ranked)
    store["bestseller_count"] = len(ranked)
    log.info("  best-sellers: %d ranked handles", len(ranked))
    return result
