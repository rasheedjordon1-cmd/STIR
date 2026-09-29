#!/usr/bin/env python3
"""Compare the latest two snapshots (or any two) and write a Markdown diff report.

    python diff.py                                   # latest two snapshots
    python diff.py --old 2026-09-22 --new 2026-09-29

Reports: new products, removed products, price changes, availability changes,
and best-seller rank movement. Products are matched by Shopify product id and
variants by variant id, so a renamed handle is not counted as removed + new.
"""
from __future__ import annotations

import argparse
import sys
from datetime import date
from pathlib import Path

from common import list_snapshot_dates, load_snapshot, parse_dt, product_metrics, to_float

TOP_N = 20
RANK_MOVE_MIN = 5


def _money(x):
    return "—" if x is None else f"{x:,.2f}"


def _range(m):
    lo, hi = m["min_price"], m["max_price"]
    return _money(lo) if lo == hi else f"{_money(lo)}–{_money(hi)}"


def _link(domain_base, p):
    return f"[{p.get('title') or p.get('handle')}]({domain_base}/products/{p.get('handle', '')})"


def _variant_name(v):
    return v.get("title") or str(v.get("id"))


def diff_store(domain, old, new, old_date: date, new_date: date) -> dict:
    base = new["store"].get("base_url") or f"https://{domain}"
    o = {p["id"]: p for p in old["products"] if "id" in p}
    n = {p["id"]: p for p in new["products"] if "id" in p}
    complete = old["store"].get("products_complete") and new["store"].get("products_complete")
    out = {"domain": domain, "base": base, "old_count": len(o), "new_count": len(n), "complete": complete,
           "new": [], "removed": [], "price": [], "avail": [], "ranks": {}}

    for pid in n.keys() - o.keys():
        p = n[pid]
        created = parse_dt(p.get("created_at"))
        relisted = bool(created and created.date() < old_date)
        out["new"].append((p, product_metrics(p, new_date), relisted))
    # A missing product only means "removed" if both catalogs were fully fetched.
    if complete:
        for pid in o.keys() - n.keys():
            out["removed"].append((o[pid], product_metrics(o[pid], old_date)))

    for pid in o.keys() & n.keys():
        po, pn = o[pid], n[pid]
        vo = {v["id"]: v for v in po.get("variants") or [] if "id" in v}
        vn = {v["id"]: v for v in pn.get("variants") or [] if "id" in v}
        shared = vo.keys() & vn.keys()
        price_changed = [vid for vid in shared
                         if to_float(vo[vid].get("price")) != to_float(vn[vid].get("price"))
                         or to_float(vo[vid].get("compare_at_price")) != to_float(vn[vid].get("compare_at_price"))]
        if price_changed:
            out["price"].append((pn, product_metrics(po, old_date), product_metrics(pn, new_date), len(price_changed)))
        sold_out = [_variant_name(vn[v]) for v in shared if vo[v].get("available") is True and vn[v].get("available") is False]
        restocked = [_variant_name(vn[v]) for v in shared if vo[v].get("available") is False and vn[v].get("available") is True]
        if sold_out or restocked:
            out["avail"].append((pn, product_metrics(po, old_date), product_metrics(pn, new_date), sold_out, restocked))

    ro = {h: i for i, h in enumerate(old["bestsellers"], 1)}
    rn = {h: i for i, h in enumerate(new["bestsellers"], 1)}
    title = {(p.get("handle") or "").lower(): p for p in new["products"]}
    for p in old["products"]:
        title.setdefault((p.get("handle") or "").lower(), p)
    entered = [(h, rn[h], ro.get(h)) for h in rn if rn[h] <= TOP_N and (ro.get(h) is None or ro[h] > TOP_N)]
    left = [(h, ro[h], rn.get(h)) for h in ro if ro[h] <= TOP_N and (rn.get(h) is None or rn[h] > TOP_N)]
    moved = [(h, ro[h], rn[h]) for h in rn.keys() & ro.keys()
             if abs(ro[h] - rn[h]) >= RANK_MOVE_MIN and (ro[h] <= TOP_N or rn[h] <= TOP_N)]
    out["ranks"] = {"entered": sorted(entered, key=lambda x: x[1]), "left": sorted(left, key=lambda x: x[1]),
                    "moved": sorted(moved, key=lambda x: x[2] - x[1]), "titles": title}
    return out


def render(old_date: str, new_date: str, results: list[dict], skipped: list[str]) -> str:
    L = [f"# Competitor diff: {old_date} → {new_date}", ""]
    L += ["| Store | Products | New | Removed | Price changes | Availability changes | Top-20 entries |",
          "|---|---|---|---|---|---|---|"]
    for r in results:
        removed = str(len(r["removed"])) if r["complete"] else "n/a*"
        L.append(f"| {r['domain']} | {r['old_count']} → {r['new_count']} | {len(r['new'])} | {removed} | "
                 f"{len(r['price'])} | {len(r['avail'])} | {len(r['ranks']['entered'])} |")
    if any(not r["complete"] for r in results):
        L += ["", "\\* catalog not fully fetched in one of the snapshots, so removals can't be trusted."]
    if skipped:
        L += ["", "**Skipped** (missing or failed in one snapshot): " + ", ".join(skipped)]

    for r in results:
        if not (r["new"] or r["removed"] or r["price"] or r["avail"] or any(r["ranks"][k] for k in ("entered", "left", "moved"))):
            continue
        L += ["", f"## {r['domain']}"]
        if r["new"]:
            L += ["", f"### New products ({len(r['new'])})", ""]
            for p, m, relisted in sorted(r["new"], key=lambda x: x[0].get("title") or ""):
                tag = " _(re-listed: created " + str(m["created_at"].date()) + ")_" if relisted else ""
                L.append(f"- {_link(r['base'], p)} — {_range(m)}, {m['variant_count']} variants{tag}")
        if r["removed"]:
            L += ["", f"### Removed products ({len(r['removed'])})", ""]
            for p, m in sorted(r["removed"], key=lambda x: x[0].get("title") or ""):
                L.append(f"- {_link(r['base'], p)} — was {_range(m)}, live {m['days_live']} days")
        if r["price"]:
            L += ["", f"### Price changes ({len(r['price'])})", "",
                  "| Product | Price | Compare-at | Max discount | Variants changed |", "|---|---|---|---|---|"]
            for p, mo, mn, k in sorted(r["price"], key=lambda x: x[0].get("title") or ""):
                L.append(f"| {_link(r['base'], p)} | {_range(mo)} → {_range(mn)} | {_money(mo['compare_at'])} → "
                         f"{_money(mn['compare_at'])} | {mo['discount_pct'] or 0:.0f}% → {mn['discount_pct'] or 0:.0f}% | {k} |")
        if r["avail"]:
            L += ["", f"### Availability changes ({len(r['avail'])})", "",
                  "| Product | % variants available | Sold out | Restocked |", "|---|---|---|---|"]
            for p, mo, mn, so, rs in sorted(r["avail"], key=lambda x: -len(x[3])):
                pct = lambda m: "—" if m["pct_variants_available"] is None else f"{m['pct_variants_available']:.0f}%"
                L.append(f"| {_link(r['base'], p)} | {pct(mo)} → {pct(mn)} | {', '.join(so[:8]) or '—'}"
                         f"{' …' if len(so) > 8 else ''} | {', '.join(rs[:8]) or '—'}{' …' if len(rs) > 8 else ''} |")
        rk = r["ranks"]
        if rk["entered"] or rk["left"] or rk["moved"]:
            name = lambda h: (rk["titles"].get(h) or {}).get("title") or h
            L += ["", "### Best-seller movement", ""]
            for h, now, was in rk["entered"]:
                L.append(f"- ▲ **entered top {TOP_N}**: {name(h)} — #{now} (was {'#' + str(was) if was else 'unranked'})")
            for h, was, now in rk["left"]:
                L.append(f"- ▼ left top {TOP_N}: {name(h)} — was #{was}, now {'#' + str(now) if now else 'unranked'}")
            for h, was, now in rk["moved"]:
                if (was <= TOP_N) == (now <= TOP_N):
                    L.append(f"- {'▲' if now < was else '▼'} {name(h)} — #{was} → #{now}")
    return "\n".join(L) + "\n"


def main(argv=None) -> int:
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--snapshots-dir", type=Path, default=here / "snapshots")
    ap.add_argument("--out-dir", type=Path, default=here / "diffs")
    ap.add_argument("--old", help="older snapshot date (default: second-latest)")
    ap.add_argument("--new", help="newer snapshot date (default: latest)")
    args = ap.parse_args(argv)

    dates = list_snapshot_dates(args.snapshots_dir)
    new_d = args.new or (dates[-1] if dates else None)
    older = [d for d in dates if new_d and d < new_d]
    old_d = args.old or (older[-1] if older else None)
    if not old_d or not new_d:
        print(f"Need two snapshots in {args.snapshots_dir}; found: {dates or 'none'}", file=sys.stderr)
        return 1

    old, new = load_snapshot(args.snapshots_dir / old_d), load_snapshot(args.snapshots_dir / new_d)
    results, skipped = [], []
    for domain in sorted(old.keys() | new.keys()):
        so, sn = old.get(domain), new.get(domain)
        if not so or not sn or so["store"].get("status") != "ok" or sn["store"].get("status") != "ok":
            skipped.append(domain)
            continue
        results.append(diff_store(domain, so, sn, date.fromisoformat(old_d), date.fromisoformat(new_d)))

    report = render(old_d, new_d, results, skipped)
    args.out_dir.mkdir(parents=True, exist_ok=True)
    out = args.out_dir / f"diff_{old_d}_to_{new_d}.md"
    out.write_text(report, encoding="utf-8")
    tot = lambda k: sum(len(r[k]) for r in results)
    print(f"{out}\n  {len(results)} stores compared, {len(skipped)} skipped | new {tot('new')}, removed "
          f"{tot('removed')}, price changes {tot('price')}, availability changes {tot('avail')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
