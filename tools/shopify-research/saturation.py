"""Cross-store product saturation via fuzzy title matching.

Titles are normalized (case, punctuation, the store's own brand name, marketing
filler), exact duplicates are grouped, then unique titles are clustered with
*leader* clustering: each title joins the best-matching existing cluster
representative at or above the threshold, otherwise it starts a new cluster.
Leader clustering (vs. union-find over all pairs) avoids chaining
"hoodie" -> "zip hoodie" -> "zip jacket" into one mega-cluster.

Numbers are a hard gate: titles only match if they contain the same numeric
tokens, so "iPhone 14 Case" never merges with "iPhone 15 Case".
"""
from __future__ import annotations

import re
import unicodedata
from collections import Counter

from rapidfuzz import fuzz, process

# Words that describe the listing, not the product.
NOISE = {
    "new", "sale", "hot", "best", "seller", "bestseller", "limited", "edition", "free",
    "shipping", "official", "original", "authentic", "premium", "exclusive", "restock",
    "restocked", "trending", "viral", "the", "a", "an", "and", "for", "with", "of", "in",
    "by", "pack", "set", "pcs", "pc", "piece", "pieces", "gift",
}
YEAR_RE = re.compile(r"\b(19|20)\d{2}\b")
NUM_RE = re.compile(r"\d+")


def normalize_title(title: str, vendor: str | None = None) -> str:
    t = unicodedata.normalize("NFKD", title or "").encode("ascii", "ignore").decode().lower()
    t = YEAR_RE.sub(" ", t)
    t = re.sub(r"[^a-z0-9]+", " ", t)
    drop = set(NOISE)
    if vendor:
        v = re.sub(r"[^a-z0-9]+", " ", vendor.lower()).split()
        if len(v) <= 3:  # only strip short brand names; long "vendors" are often descriptive
            drop.update(v)
    words = [w for w in t.split() if w not in drop]
    return " ".join(words)


def cluster(items: list[dict], threshold: int = 88) -> tuple[list[int], list[dict]]:
    """items: [{"store", "title", "vendor", ...}]. Returns (cluster_id per item, clusters).

    Each cluster: {"id", "label", "stores": set, "members": [item indexes]}.
    """
    norms = []
    for it in items:
        n = normalize_title(it.get("title", ""), it.get("vendor"))
        norms.append(n or (it.get("title") or "").strip().lower())

    # Most common normalized titles go first so they become cluster leaders.
    freq = Counter(norms)
    uniques = sorted(freq, key=lambda n: (-freq[n], len(n), n))

    # Leaders are bucketed by numeric signature; a title only competes within its bucket.
    buckets: dict[frozenset, tuple[list[str], list[int]]] = {}
    cid_of: dict[str, int] = {}
    n_clusters = 0
    for n in uniques:
        texts, cids = buckets.setdefault(frozenset(NUM_RE.findall(n)), ([], []))
        match = None
        if texts and n:
            match = process.extractOne(n, texts, scorer=fuzz.token_sort_ratio, score_cutoff=threshold)
        if match is not None:
            cid_of[n] = cids[match[2]]
        else:
            cid_of[n] = n_clusters
            texts.append(n)
            cids.append(n_clusters)
            n_clusters += 1

    clusters = [{"id": i, "label": "", "stores": set(), "members": []} for i in range(n_clusters)]
    ids = []
    for idx, (it, n) in enumerate(zip(items, norms)):
        c = clusters[cid_of[n]]
        c["members"].append(idx)
        c["stores"].add(it["store"])
        ids.append(c["id"])
    for c in clusters:
        # Human label: the most common original title in the cluster.
        c["label"] = Counter(items[i]["title"] for i in c["members"]).most_common(1)[0][0]
    return ids, clusters
