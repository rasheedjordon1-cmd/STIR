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
