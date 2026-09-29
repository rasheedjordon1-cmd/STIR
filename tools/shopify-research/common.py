"""Shared helpers: input parsing, snapshot I/O, and per-product metrics.

Everything downstream (the xlsx report, diff.py) reads from snapshots, never
from the network, so a report can always be rebuilt from saved raw data.
"""
from __future__ import annotations

import json
import re
from datetime import date, datetime
from pathlib import Path
from typing import Any

DATE_DIR_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


# --------------------------------------------------------------------------- input

def normalize_domain(line: str) -> str | None:
    """'https://Foo.com/collections/x' -> 'foo.com'. Returns None for blanks/comments."""
    line = line.split("#", 1)[0].strip()
    if not line:
        return None
    line = re.sub(r"^[a-z]+://", "", line, flags=re.I)
    return line.split("/", 1)[0].strip().lower() or None


def read_stores(path: Path) -> list[str]:
    seen: dict[str, None] = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        d = normalize_domain(raw)
        if d:
            seen.setdefault(d, None)
    return list(seen)


# --------------------------------------------------------------------------- snapshots

def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(path)


def read_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def list_snapshot_dates(snapshots_dir: Path) -> list[str]:
    if not snapshots_dir.is_dir():
        return []
    return sorted(p.name for p in snapshots_dir.iterdir() if p.is_dir() and DATE_DIR_RE.match(p.name))


def load_snapshot(snap_dir: Path) -> dict[str, dict]:
    """Return {domain: {"store": ..., "products": [...], "bestsellers": [...], "meta": ...}}."""
    stores: dict[str, dict] = {}
    for d in sorted(p for p in snap_dir.iterdir() if p.is_dir()):
        store = read_json(d / "store.json")
        if store is None:
            continue
        meta_path = d / "meta.json"
        stores[d.name] = {
            "store": store,
            "products": read_json(d / "products.json", []),
            "bestsellers": read_json(d / "bestsellers.json", []),
            "meta": _read_meta(meta_path),
        }
    return stores


def _read_meta(path: Path) -> Any:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except ValueError:
        return None


# --------------------------------------------------------------------------- metrics

def to_float(v: Any) -> float | None:
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def parse_dt(s: Any) -> datetime | None:
    if not s or not isinstance(s, str):
        return None
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return None


def tags_to_str(tags: Any) -> str:
    # products.json returns a list on current stores, a comma string on some older ones.
    if isinstance(tags, list):
        return ", ".join(str(t).strip() for t in tags if str(t).strip())
    if isinstance(tags, str):
        return ", ".join(t.strip() for t in tags.split(",") if t.strip())
    return ""


def variant_discount(v: dict) -> tuple[float | None, float | None]:
    """(compare_at, discount_pct) for a single variant, only when compare_at > price."""
    price, cap = to_float(v.get("price")), to_float(v.get("compare_at_price"))
    if price is None or cap is None or cap <= price or cap <= 0:
        return None, None
    return cap, (cap - price) / cap * 100


def product_metrics(p: dict, as_of: date) -> dict:
    variants: list[dict] = p.get("variants") or []
    prices = [x for x in (to_float(v.get("price")) for v in variants) if x is not None]
    discounts = [variant_discount(v) for v in variants]
    caps = [c for c, _ in discounts if c is not None]
    pcts = [d for _, d in discounts if d is not None]
    avail = [bool(v["available"]) for v in variants if "available" in v]
    created = parse_dt(p.get("created_at"))
    return {
        "min_price": min(prices) if prices else None,
        "max_price": max(prices) if prices else None,
        # Highest real anchor price, and the deepest per-variant markdown.
        "compare_at": max(caps) if caps else None,
        "discount_pct": round(max(pcts), 1) if pcts else None,
        "variant_count": len(variants),
        "pct_variants_available": round(100 * sum(avail) / len(avail), 1) if avail else None,
        "image_count": len(p.get("images") or []),
        "created_at": created,
        "days_live": (as_of - created.date()).days if created else None,
    }

