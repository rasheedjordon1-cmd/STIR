# Shopify competitor research

This tool scrapes the public storefront data of the Shopify stores listed in `stores.txt` and saves the raw data as a dated snapshot. From each snapshot it builds `research_YYYY-MM-DD.xlsx`, which has one row per product, with flags and a cross-store saturation count. `diff.py` compares the two most recent snapshots to show what changed from one week to the next.

## Setup

```bash
cd tools/shopify-research
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Requires Python 3.10+.

## Run

```bash
# 1. Put competitor domains in stores.txt, one per line (# comments OK)
# 2. Scrape + snapshot + report
python research.py
#    -> snapshots/2026-09-29/<domain>/{store,products,meta,bestsellers}.json
#    -> reports/research_2026-09-29.xlsx

# 3. After at least two runs on different days
python diff.py
#    -> diffs/diff_2026-09-22_to_2026-09-29.md
```

Useful options:

| Command | What it does |
|---|---|
| `python research.py --from-snapshot 2026-09-29` | Rebuild the xlsx from saved data without making any requests (use it after changing thresholds) |
| `python research.py --stores other.txt --out-dir ~/Desktop` | Use a different input file or output location |
| `python research.py --sat-threshold 92` | Stricter title matching (the default is 88; lower it to catch more matches, and more false positives) |
| `python research.py --max-pages 20` | Cap very large catalogs at 20 × 250 products |
| `python diff.py --old 2026-09-01 --new 2026-09-29` | Compare any two snapshots, e.g. month over month |

## What it fetches (per store)

| Request | Purpose |
|---|---|
| `/products.json?limit=250&page=N` | Full catalog. If page 1 isn't Shopify JSON, the store is skipped. It stops at the first page with fewer than 250 products, since that page is the last one. |
| `/meta.json` | Saved exactly as returned. No fields are assumed. |
| `/collections/all?sort_by=best-selling&page=1..3` | Product handles in page order give `best_seller_rank`. |

Rate limiting:

- It sends a browser User-Agent and runs requests one at a time, with 1.5 s between them.
- On 429 or 430 (Shopify's bot-throttle code), 5xx or a network error, it retries up to 3 times. It waits for `Retry-After` when the server sends it, and otherwise backs off exponentially (2 s, 4 s, 8 s).
- A typical store needs about 6 requests (about 10 s), so 50 stores take roughly 8–10 minutes.

A skipped store gets one of these statuses on the **Stores** sheet:

- `non_shopify`: not a Shopify store.
- `shopify_blocked`: a Shopify store behind a password page or bot wall, or with `products.json` turned off.
- `error`: a network failure.

## The spreadsheet

**Products**: the columns from the brief, then `PROVEN`, `TESTING`, `FAKE_ANCHOR`, `saturation_stores` and `saturation_group`. Rows are sorted by store, then by best-seller rank. PROVEN rows are green and TESTING rows are yellow. For FAKE_ANCHOR products, the discount cell is red.

| Flag | Rule |
|---|---|
| PROVEN | `best_seller_rank <= 20` and `days_live >= 90` |
| TESTING | `days_live <= 21` |
| FAKE_ANCHOR | `discount_pct >= 50` |

How some of the columns are calculated:

- `compare_at` is the highest variant compare-at price that is above that variant's price.
- `discount_pct` is the deepest discount on any single variant.
- `days_live` is the snapshot date minus `created_at`, so rebuilding a report gives the same numbers.

**Saturation**: products sold by 2 or more stores, ranked by how many stores sell them.

**Stores**: status of each store, flag counts, median price, and the name and currency from `meta.json` when present.

**Legend**: definitions of every flag and derived column.

## Weekly cron

`crontab -e`, then:

```cron
# Mondays 06:47 — scrape, report, diff
47 6 * * 1 cd /ABSOLUTE/PATH/STIR/tools/shopify-research && .venv/bin/python research.py >> run.log 2>&1 && .venv/bin/python diff.py >> run.log 2>&1
```

Use absolute paths, because cron doesn't load your shell profile. On macOS, cron needs Full Disk Access (System Settings → Privacy & Security) if the repo is in `~/Documents` or `~/Desktop`. A laptop that is asleep at 06:47 skips that week's run.

## Limits of the data

- **`best_seller_rank` depends on the theme.** Rank is read from the order of links inside `<main>` on the collection page. If a theme loads products with JavaScript or has no `/collections/all`, rank is blank, so PROVEN can't be set. Check `ranked_bestsellers` on the Stores sheet. If it is 0, don't read anything into that store's PROVEN count. Merchants can also build a custom `all` collection, which replaces Shopify's built-in one.
- **`created_at` is not the launch date.** It is when the product was created in the admin. A product drafted in March and launched in September reads as 200+ days old. The diff marks "new" products whose `created_at` is older than the previous snapshot as **re-listed**, which catches most of these.
- **Prices are in each store's own currency.** Price ranges on the Saturation sheet mix currencies if your competitors sell in different ones.
- **Removals are only reported when both catalogs were fetched completely**, so a blocked or partial run can't make a whole catalog look like it was deleted.
- **Title matching misses renamed products.** Dropshippers who rename the same supplier item won't be matched. The next step up would be perceptual hashing of each product's first image.
