# STIR — studio and campaign sheet, design sheet

Filled from the brief (31 Oct 2026) and the playbook defaults. Not a
questionnaire for the client.

## Premise

Work leaves a small studio and takes a much larger place outside it. One
standalone cream building; one oversized red campaign sheet extending from an
upper opening into the open cobalt.

**Supersedes** the market-led hero, the studio-above-a-shop premise and the
24 s retail storyboard (brief revision, 31 Oct). The market scene's palette,
pixel treatment and text/art balance carry over; its subject does not.

- Assumption line: 4.6 × 3.4 m building on a 8.2 × 6.6 pavement fragment,
  14 s loop, no cast, one symbolic event, cobalt surround.
- The sheet is the single controlled impossible event. Everything else quiet:
  no shopfront, no awning, no produce, no courier, no queue, no service props.

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
- The sheet is composed in the camera's own plane (R/U span the lens plane,
  N is the billow depth). Two earlier constructions took the width from world
  up and then from the view vector; both put most of the breadth along the
  view axis or along -Y, so the sheet foreshortened into a ribbon or draped
  onto the pavement. The camera is locked, so composing in screen space is
  the honest construction, not a cheat.
- `?frame=phone` drops the far third of the sheet from the fit, so the phone
  render is a reframe rather than a shrunken desktop composition.
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

None. The brief caps figures at one or two optional scale references and
forbids a staged agency team; the scene currently carries none, so the
building and the sheet do all the work.

## System sheet

- Loop 14.0 s. One travelling wave through the already-extended sheet.
- Building and camera stationary. No arrival, unrolling or retraction.
- Seamless by construction: the wave is a pure function of a phase that wraps
  0..1 over the loop, so the last frame and the first are the same geometry.
  No crossfade, no reset to hide.

## Beat sheet

| Phase | Visual behaviour | Review question |
| --- | --- | --- |
| Opening | full composition readable, sheet already extended | does the frame read as a studio and work reaching beyond it? |
| Middle | one gentle wave through the broad sheet, nothing else moves | restrained, coherent, clear of text? |
| Return | the sheet returns to its initial visible state | is the final-to-first seam invisible? |

## Hero objects

| Name | Type | Parts | Construction layers | Story detail | Contact |
| --- | --- | --- | --- | --- | --- |
| `studio` | landmark | 30–45 | two storeys, storey band, cornice, parapet, dark window frames, red entrance with reveal and step, sign board, upper opening | lit worktable, desk lamp and one red print read through the ground-floor glass | footing on the pavement fragment |
| `sheet` | the symbolic event | one surface + edges | fans from 0.85 m half-height at the opening to 3.5 m at the far edge; real thickness so the paper edge is geometry, not a drawn line | three cream blocks riding the surface | pinned at the opening by a ramp that cannot reach zero |
| `pavement` | prop | 5 | pad, inset top, two seams at 0.085 m | — | grounds the building |

## Ambient loops

| Loop | Period | Motion | Phase | Touches |
| --- | --- | --- | --- | --- |
| awning valance | 3.6 s | 0.03 rad sway | 0.0 | awning edge |
| studio window light | 5.2 s | slow warm pulse, 4% | 1.7 | studio interior |

Two loops, phased apart. No flicker, no particles.

## Palette and pixel presentation

`src/scene/palette.js` — exactly 64 entries, the length the shader declares as
`vec3[64]`. Built from the brand colours, not from the kit's own palette: the
shipped one is a pool/market set (skin, water, swimwear) with no entry anywhere
near cream `#FAF2E6`, cobalt `#0451AB` or red `#F21B16`, so snapping to it
would quietly repaint the brand.

Ramps: cream ×10, warm grey / pavement ×8, ink ×6, red ×8, cobalt ×10,
blue-black glass ×8, cool-cream shadow ×6, accent/metal ×8.

The cream ramp is **generated from cream's own ratio** (250:242:230), not
picked by eye. A hand-picked ramp drifted to R−B = 40 where cream itself is 20,
which is what first rendered the building khaki.

Forbidden: pure black, gradients, any colour not in the array.

### The post pass — this is what makes it a diorama

`src/kit/post.js`, ported from the playbook's `templates/post.js`. The first
pass of this scene shipped without it and the result was a smooth low-poly
render with continuous gradients: Look Contract rules 3 (palette snap), 4 (ink
contour) and 5 (gated dither) were simply absent. The port restores all three
plus the fragmented silhouette.

Two adaptations, both required by the brief:

| Kit | Here | Why |
| --- | --- | --- |
| Composites onto paper white; rim fragments to white | `uBg` / `uBgLinear` uniforms, both cobalt | The surround is the page's own cobalt field, and the pre-grade composite is in linear space while the rim writes are post-gamma, so the colour is supplied in both spaces. |
| `mix(vec3(l), c, 1.07)` | `1.20` | Cream is only 8% warm. With the kit's grade the lit faces snapped to a neutral and the building came back as concrete. |
| dither `0.0012 + 0.019 * gate` | `0.0008 + 0.0095 * gate` | The sheet is one continuous ramp, so every pixel of it dithered at once and read as film grain rather than banding. |

Resolution is the kit's own ratio — one target pixel per CSS pixel — so the
page must carry `image-rendering: pixelated` on the still and the loop. Without
it a 2× display resamples the art smoothly and averages the palette snap, the
ink contour and the dithered rim back into the gradients they replaced.

### Scene corrections the first renders forced

- **Roof aerial.** A mast with one centred crossbar is a crucifix at this size;
  it read as a church. Replaced with three asymmetric spars on one side of the
  boom, which can only be an aerial.
- **Sheet proportion.** `h0 → h1` was 0.85 → 3.5, a 4:1 taper — a windsock, not
  a sheet. Now 1.5 → 2.6.
- **Sheet graphic.** Three plain pale rectangles read as windows punched
  through the sheet; the eye takes any pale rectangle on a dark field as an
  opening. Replaced with the STIR wordmark built from the same 5×7 alphabet as
  the building's sign, plus one rule.
- **Pavement.** Was the same value as the building, so the base dissolved into
  the slab. Darkened and cooled.
- **Framing.** Rendered portrait (760×830) against a landscape subject, which
  wasted roughly half the slot. Desktop is 820×620, phone 390×330. The phone
  reframe kept only the near 58% of the sheet, which cut the wordmark to
  "STI"; it keeps 92% now and reframes vertically instead.

## Cast

Two figures, which is the brief's cap. The scene had none, and that was the
whole of what "lacks charm" meant: a building with one moving banner is a
model. The pool reference in the playbook's own media earns its charm from
people doing ordinary things continuously — a lifeguard pacing the deck, a
swimmer, someone on a lounger — not from one large event.

Both come from the kit's `peopleModel-street.js` rig and `poses.js` walk
cycle, which were copied into `src/kit/` during the blockout and left unused
with a broken import (`../core/geometry.js`, a directory that is empty here).

| Figure | What they do | Why they are placed where they are |
| --- | --- | --- |
| The arrival | Walks the pavement, turns at the door, steps into the dark of it. | Leg 1 starts at (-3.15, -0.75), which a 45° camera has behind the building mass, so he walks into view instead of appearing on an empty pavement. Leg 3 ends past the door plane, where the front wall hides him. The loop restarts while nothing of him is on screen, so the seam stays exact. |
| The worker | Stands at the ground-floor worktable, leaning in and back across the loop. | Standing, not seated: a chair at this size is three pixels of ambiguity. Faces +Z because the table and the window are both on his +Z. |

Walk phase windows are in `cast.js` under `T`. The export is rotated to start
at `START_T=5.6` so frame 0 — and therefore the poster — opens on the
approach rather than on an empty pavement.

## The room behind the window

The brief asks the large window to show "a working table, one original print,
and a considered light source". A worktable, lamp and print were already
modelled in there and had never once been visible, for two compounding
reasons, both the same mistake:

1. The ground floor was a **solid box**, so its front face at `z = hd` was
   drawn in front of everything inside it. It is a shell now: the mass is set
   back by `REC = 1.05` and a front skin is built as a list of panels between
   the openings, which is the only description of that wall that cannot drift
   out of register with them.
2. The window "frame" was a **solid 2.3 × 1.7 slab** sitting in the opening,
   not a frame. It is four members now. The entrance got the same treatment,
   so the doorway is an opening the figure can be seen stepping into.

The room is lit from inside: a recess facing the camera gets almost nothing
from a key at (-13, 18, 15), and Lambert alone renders it black. The lit
surfaces carry a small `emissive`, and the desk lamp is an actual
`PointLight`. It is kept at 0.95/2.9m — at 2.6 it blew the back wall to white
and the palette snapped the falloff into concentric rings, which is exactly
the bloom the brief excludes.

## Sign

The 1 November revision makes the sign a shared construction across the
building, the header brand cell and the closing invitation: a stepped ivory
board, **cobalt** lettering, two small square mounting details. So the scene's
sign is no longer red on cream. The scene's red is the door and the sheet.

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
