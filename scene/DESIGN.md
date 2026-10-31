# STIR — street corner, design sheet

Filled from the brief (31 Oct 2026) and the playbook defaults. Not a
questionnaire for the client.

## Premise

A Brooklyn corner market works an ordinary morning: produce is set out, a
delivery arrives, it gets filmed, a customer goes in. The studio above it is
the one that notices.

- Archetype (router row): **market / shop** — stalls, prep, pass, dispatch.
- Assumption line: 18 × 13 m slab, 24 s loop at 40 Hz, four roles, no
  disruption, 32-entry palette on STIR's four colour roles, cobalt surround.

### Where the brief overrides the playbook

Recorded here because both documents are in the repo and the next reader will
otherwise follow the wrong one.

| Playbook default | This scene | Why |
| --- | --- | --- |
| White page, empty paper, no surrounding copy | **Cobalt `#0451AB` surround, live HTML headline and controls beside it** | The brief: the kit's white-background and no-copy defaults do not govern this website. |
| Every scene needs an interruption and a goal | **No disruption, no goal, no counters** | The brief: an ordinary business day; do not manufacture systems to satisfy the kit's general-purpose defaults. |
| 46 s loop, 4–6 systems, 4–6 roles | **24 s, no systems, 4 roles** | The brief's beat table and cast cap. |
| 64-entry palette | **32 entries** | The brief fixes four colour roles plus a few extras for people and fruit. Fewer, deliberate steps. |
| Ship the scene as a live Three.js page | **Render a still + a short loop; the site ships neither three.js nor WebGL** | The brief: do not install a site-wide runtime merely to display a still or video. |
| Perspective camera, fov 20.5, elevation 33 ("near-ortho") | **Orthographic, elevation 26.565** | The eBoy reference supplied 31 Oct is strict parallel projection: verticals stay vertical and diagonals hold one slope. That is a projection difference, not a lens length, so a long lens cannot reach it. |
| `MeshStandardMaterial` | **`MeshLambertMaterial`, `flatShading`** | The reference is one flat tone per face with a hard boundary. Standard's roughness and environment response put a gradient across every face. |

## Camera side

- Locked: azimuth 45, **orthographic**, elevation 26.565 (2:1 pixel isometric).
  No orbit, no drift, no zoom. `?elev=iso` switches to true isometric (35.264)
  for comparison; 2:1 is the shipped default because a storefront's subject is
  its façade, and true iso trades façade for roof.
- Subject scale 1.0 for the desktop frame; a separate tighter framing for phone.
- Exterior scene. Pavement and kerb on the camera side (+Z).
- Slab 18 × 13 × 0.42. Deck y 0 is the kerb lane; pavement is a raised 0.16 slab.
- +Z / hero face: the market's open shopfront and its pavement display.
- Threshold: the shop doorway, kept clear 2 m — no crates, no hand truck, no
  figure parked in it.
- Tall mass: the corner building (market below, STIR studio above), back-left,
  offset in screen x from the neighbouring mass.
- Second mass: a lower neighbouring frontage with a roll-down gate, back-right.
- Foreground prop: produce crates at the near corner of the pavement.
- Mid-ground prop: the folded A-board, leading the eye to the door.
- Must never be occluded: the shop doorway, the awning band, the STIR sign.

## Cast sheet

Four roles, the brief's cap. No crowd, no idle bobbing.

| Role | Silhouette feature | Locomotion | Action | Reaction | Exit | Signature prop |
| --- | --- | --- | --- | --- | --- | --- |
| Shop owner | apron, forearms bare, stocky stance | short steps along the display | adjusts a crate, takes the handoff | looks up at the courier | returns to rest at the display | produce crate |
| Courier | backpack, cap, high-vis band | walk in from -X behind the near mass | carries a crate, hands it over | steps back after release | walks out along +X | crate, hand truck |
| Camera operator | tripod, shoulder bag, crouch | holds position | lifts camera, captures display, lowers | — | lowers and rests | camera + tripod |
| Visitor | tote bag, longer coat | walk in from +X | pauses at the display, enters the doorway | — | passes through the door, concealed | tote |

## System sheet

- Loop 24.0 s, DT 1/40.
- No defence systems, no machines, no economy, no score. The brief forbids
  manufacturing them.
- What changes first beat to last: a crate moves from the courier to the
  display; the visitor is inside; everything else returns to rest.

## Beat sheet

| Time | Beat | Camera proof |
| --- | --- | --- |
| 0.0–4.0 | hold; owner adjusts the display | `out/beat-00.png` |
| 4.0–9.0 | courier enters, carries, hands off | `out/beat-04.png`, `out/beat-07.png` |
| 9.0–14.0 | camera operator lifts, captures, lowers | `out/beat-11.png` |
| 14.0–20.0 | visitor enters the door; courier leaves | `out/beat-16.png` |
| 20.0–24.0 | rest poses; hold for the seam | `out/beat-22.png` |

Seam: the courier is fully off-slab before reset; the visitor is concealed
behind the door reveal. No visible figure teleports; the scene does not fade.

## Hero objects

| Name | Type | Parts | Construction layers | Story detail | Contact |
| --- | --- | --- | --- | --- | --- |
| `cornerBlock` | landmark | 30–60 | brick courses, sills, cornice, fire escape, awning frame, roll gate | fire escape, rooftop antenna | footing on pavement |
| `marketFront` | service station | 25–45 | stall boards, crates, canopy, price board, door reveal | mesh sacks, a leaning broom | pallets on pavement |
| `stirStudio` | prop | 8–15 | window bay, sign band, interior warm light | one lit desk lamp | carried by the block |
| `handTruck` | prop | 8–15 | frame, toe plate, two wheels, handle | strap wound on the handle | wheels on pavement |
| `aBoard` | prop | 5–8 | two leaves, hinge, chalk face, foot | chalked price | feet on pavement |

## Ambient loops

| Loop | Period | Motion | Phase | Touches |
| --- | --- | --- | --- | --- |
| awning valance | 3.6 s | 0.03 rad sway | 0.0 | awning edge |
| studio window light | 5.2 s | slow warm pulse, 4% | 1.7 | studio interior |

Two loops, phased apart. No flicker, no particles.

## Palette

- Length 32. Must equal `uPalette[N]` in the shader and the JS array.
- Roles: cobalt `#0451AB` ground and shadow steps; ivory `#FAF2E6` façade and
  light; ink `#161310` frames and structure; signal red `#F21B16` awning and one
  mark. Extras: four skin steps, three produce greens/golds, two timber steps.
- Forbidden: pure black, gradients, any colour not in the array.

## QA frames

| Frame | Time | Proves |
| --- | --- | --- |
| Grey blockout | 0.0 | staging before palette |
| Hero still | selected | staging + palette on cobalt |
| Handoff | ~7.0 | palms on the crate, release |
| Capture | ~11.0 | camera lifted, display in shot |
| Door | ~17.0 | visitor through the threshold |
| Seam | 23.9 vs 0.0 | final visible state matches initial |
| Pavement edge | any | no lip, flush to slab, no float |
| Phone framing | selected | market readable at 390 px |

## Risks

- Reading the scene at 1:1 against cobalt rather than white: outlines and the
  pavement edge are the first things to fail. Test on blue from the first render.
- Four figures at 30–45 px on a 56% column — the courier/owner handoff is the
  one close contact and the most likely to read badly.
- The STIR sign must stay legible at phone size or it becomes noise.
