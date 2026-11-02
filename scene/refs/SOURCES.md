# Sources — STIR street corner

Research log for the STIR pixel-diorama scene. One row per question, the query
actually run, and the decision. Written before the first mesh.

Two lookups the playbook asks for could not be run in this container. Both are
recorded as blocked rather than quietly skipped.

## Shape — what does the place look like, exactly

| Question | Searched | Found | Decision |
| --- | --- | --- | --- |
| Brooklyn corner-market architecture | repo: `assets/labay/**` | `creators/creator-01-poster.webp` — the clearest exterior in the set | Primary architectural reference. Read below. |
| wider street context | repo: `assets/labay/activations/*-poster.webp` | act-01 shows the kerb and a parked vehicle; act-03 is an indoor event, not architecture | act-01 for kerb/lane only; act-03 unused |
| eBoy New York poster, for density | `eboy.com`, `www.eboy.com` | **BLOCKED** — host denied by this environment's network policy | Worked from the brief's stated principle (recognisable buildings, signage, objects and activity, at much quieter density) and the supplied hero mockup. Not from the poster itself. Re-check if the host is allowed later. |
| moving footage of the subject | `yt-dlp` | **MISSING** from this container | No contact sheets stepped from video. The scene is an ordinary business day with no fast action, so the cost is low; the beat timings come from the brief's table, not from frame counts. |

### What the reference actually shows

Read off `creator-01-poster.webp`, which is LABAY's own storefront:

- Corner building. Buff/tan brick above, painted storefront band below.
- Upper floor: white-framed double-hung windows, two per visible bay, with sills.
- Black iron **fire escape** on the side elevation. The most Brooklyn object in frame.
- **Wrap-around awning** at first-floor level, carried around the corner, with a
  second smaller canopy over the recessed entrance.
- Produce stacked on **pallets in mesh sacks** directly on the pavement, plus
  open crates. This is the signature of the business, not the signage.
- Pavement in large poured panels with visible seams; kerb drops to asphalt.
- Open shopfront: goods visible from the street, no closed glass line.

## Motion — what happens, in what order, how fast

No footage research (see above). Beats are the brief's five, treated as staging
targets rather than measured timings:

```
0–4 s    hold; owner makes one small display adjustment
4–9 s    courier enters concealed, carries a crate, readable handoff
9–14 s   camera operator lifts, captures the display, lowers
14–20 s  visitor approaches and enters; courier leaves on a clear route
20–24 s  actors return to rest; hold for a clean seam
```

## Assets — does a rig or model already exist

| Asset | Ladder step | Source / query | Licence | Decision |
| --- | --- | --- | --- | --- |
| human rig | 1 (already on disk) | `diorama/templates/peopleModel-street.js` | MIT (kit) | Used. Clothed street rig, 1.69 m, faces +Z. |
| poses, paths, camera, post, palette, lighting, geometry, detail | 1 (already on disk) | `diorama/templates/*` | MIT (kit) | Copied into `src/kit/`, adapted. Installed copy untouched. |
| buildings, awning, crates, produce, hand truck, A-board | 5 (hand-build) | — | — | Hand-built against the reference above. No pack searched: the shapes are simple boxes and lathes, and the brief requires an original street fragment rather than an imported one. |

Nothing was downloaded, so `CREDITS.md` carries only the kit.

## Proof

| Beat | Capture | Compared against | Result |
| --- | --- | --- | --- |
| blockout | `out/blockout-*.png` | composition in the supplied hero mockup | pending |

## Rules

- The scene is a **conceptual** brand setting. It is not a reconstruction of
  LABAY, not a STIR office, and carries no real street address. The reference is
  used for the grammar of a Brooklyn corner shop, not for identifying detail.
- The in-scene market sign reads `MARKET`, generically. If the scene is ever
  labelled as a named business, its actual identifying details must be matched.
