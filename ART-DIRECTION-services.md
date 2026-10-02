# Service plate illustrations — what to draw

Three cut-out figures, one per service panel. They sit on a cobalt
plate between the service name and its proposition, and they are
allowed to stand out of the top of that plate.

## Format

| | |
|---|---|
| **File** | `assets/svc-01.webp`, `svc-02.webp`, `svc-03.webp` |
| **Background** | **Transparent.** The plate supplies the cobalt. |
| **Aspect** | Taller than wide. Roughly 3:4 to 4:5. |
| **Size** | ~1200px on the long edge. |
| **Safe area** | The bottom ~82% sits inside the plate; the top ~18% breaks out above it onto the paper. Put the head, the light, the thing you want noticed in that top fifth. |
| **Width limit** | The figure is capped at 106% of the plate width, so keep it narrow. A wide composition will be scaled down and stop breaking the edge. |

## Palette

Same world as the hero and the corner store:

- **Warm ivory `#FAF2E6`** and the flesh/terracotta range — this is what
  the figure is made of, and what separates it from the field.
- **Ink `#161310`** for line and shadow.
- **Signal red `#F21B16`** — at most one small element per figure, and
  only on the thing that acts. The plate already carries a red
  threshold along its base; do not compete with it.
- **Avoid cobalt in the figure.** It is the field. A cobalt figure
  disappears into it.

Same litho feel as the existing artwork: visible paper grain, slightly
mis-registered colour, confident line. Not flat vector, not 3D render,
not photography.

## The three subjects

Each should be a fragment of the STIR world rather than an icon of a
service — the same logic as the giant observer and the corner store.

**01 · Content & campaigns** — a camera light on a market corner. A
crew light or a phone on a gimbal raised over crates of produce. The
lit thing is an ordinary business, not a studio.

**02 · Brand & websites** — a shop window being lettered. A hand and a
brush painting a sign onto glass, mid-stroke. The business getting its
face.

**03 · Ongoing creative & growth** — the operator, mid-shift. A single
figure at a counter or a desk with the work visibly in motion around
them. Someone is in charge; that is the whole proposition.

## Dropping them in

In each panel, replace the placeholder span with the image:

```html
<div class="svc-plate" data-reveal="registration">
  <span class="svc-plate-no" aria-hidden="true">01</span>
  <img class="svc-fig" src="assets/svc-01.webp" alt="">
  <i class="svc-plate-rule" aria-hidden="true"></i>
</div>
```

Delete the `.svc-plate-note` span. Keep `alt=""` — the figure is
decorative; the service name and scope carry the meaning.

The plate number stays behind the figure. It is the empty state and
the composition both.
