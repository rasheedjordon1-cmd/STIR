import * as THREE from 'three';
import { buildPerson, setPose } from '../kit/peopleModel-street.js';
import { STAND, REACH, walkPose, mixPose } from '../kit/poses.js';
import { C, B } from './studio.js';

/**
 * Two figures, which is the brief's cap ("at most one or two unobtrusive
 * figures"). They are what the scene was missing: a building with one moving
 * banner is a model, not a diorama. The pool reference earns its charm from
 * people doing ordinary things continuously, not from one large event.
 *
 *   the arrival  — walks the pavement, turns at the door, steps inside
 *   the worker   — stands at the ground-floor worktable, always there
 *
 * Both are driven from the same 0..1 phase as the sheet, so the whole scene
 * is one loop. The arrival's walk begins behind the building, where the mass
 * occludes it from this camera, so nobody ever pops into existence on an
 * empty pavement.
 */

const flat = (hex) => new THREE.MeshLambertMaterial({ color: hex, flatShading: true });

/* The rig asks for a wardrobe. Everything here is drawn from the scene's own
   palette so the figures resolve to the same 64 colours as the architecture;
   a stock skin/denim set would snap to the nearest cream and look ill. */
const MATS = {
  cloth: {
    navy: flat(0x17304A),
    charcoal: flat(0x241F1A),
    coral: flat(0xC4120D),
    rose: flat(0xDF1510),
  },
  skinTones: [flat(0xDFAB82), flat(0xB97D55), flat(0x9C6440), flat(0x71452E)],
  hair: [flat(0x1E1A15), flat(0x2E2820)],
  leather: flat(0x241F1A),
  steelDark: flat(0x434E56),
  ink: flat(0x161310),
  eye: flat(0x100E0C),
  mouth: flat(0x8A0B07),
  glass: flat(0x17304A),
  chrome: flat(0x8E9AA3),
  bone: flat(0xEFE7DC),
  paper: flat(0xFAF2E6),
  roseDeep: flat(0xA50F0A),
  rust: flat(0xB99650),
  rustLight: flat(0xD4B36A),
};

const smooth01 = (k) => k * k * (3 - 2 * k);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p, a, b) => clamp01((p - a) / (b - a));

/* The route, in world units. Leg 1 runs up the building's left flank, which
   is behind the mass from a 45-degree camera, so the figure walks into view
   rather than appearing. Leg 3 ends past the door plane: the front wall and
   the door leaf hide the last step, so there is no dissolve and no pop. */
const DOOR_X = -1.15;
const WALK_Z = B.d / 2 + 0.95;
const START = new THREE.Vector3(-3.15, 0, -0.75);
const CORNER = new THREE.Vector3(-3.15, 0, WALK_Z);
const DOORMAT = new THREE.Vector3(DOOR_X, 0, WALK_Z);
const INSIDE = new THREE.Vector3(DOOR_X, 0, B.d / 2 - 0.45);

/* Phase windows. The walk takes a little over half the loop; the rest of it
   he is inside, which is also what makes the loop seamless — the restart
   happens while nothing of him is on screen. */
const T = { leg1: [0.00, 0.26], turn1: [0.26, 0.30], leg2: [0.30, 0.47],
            turn2: [0.47, 0.51], leg3: [0.51, 0.57] };

const STRIDE = 1.35;   // radians of walk cycle per metre travelled

export function buildCast(scene) {
  const G = new THREE.Group();

  /* ── The arrival ────────────────────────────────────────────────────
     Dark jacket over a red tee: the one figure carries the scene's accent
     at a size where a 2px flash of red still reads as a person, not a prop. */
  const walker = buildPerson(MATS, {
    skin: MATS.skinTones[2],
    hair: MATS.hair[0],
    top: MATS.cloth.charcoal,
    bottom: MATS.cloth.navy,
    shoe: MATS.leather,
    topStyle: 'jacket',
    sleeve: 'long',
  });
  G.add(walker.group);

  /* ── The worker ─────────────────────────────────────────────────────
     Standing at the table rather than seated: a chair at this scale is three
     pixels of ambiguity, and a standing figure at a worktable reads as work
     without one. Faces +Z, so the window shows a front, not a back. First
     placement put him at x = 1.12, where the window's right jamb cut him in
     half; he sits in the open half of the glazing now. */
  const worker = buildPerson(MATS, {
    skin: MATS.skinTones[1],
    hair: MATS.hair[1],
    top: MATS.cloth.navy,
    bottom: MATS.cloth.charcoal,
    shoe: MATS.leather,
    sleeve: 'short',
  });
  worker.group.position.set(0.52, B.paveY + 0.04, B.d / 2 - 0.72);
  worker.group.rotation.y = 0.38;   // the table is on his +Z, so is the window
  G.add(worker.group);

  const pos = new THREE.Vector3();

  function place(phase) {
    const g = walker.group;
    let travelled, facing, done = false;

    if (phase < T.leg1[1]) {
      const k = seg(phase, ...T.leg1);
      pos.lerpVectors(START, CORNER, k);
      travelled = k * START.distanceTo(CORNER);
      facing = 0;                       // walking +Z, the rig's own front
    } else if (phase < T.turn1[1]) {
      pos.copy(CORNER);
      travelled = START.distanceTo(CORNER);
      facing = -Math.PI / 2 * smooth01(seg(phase, ...T.turn1));
    } else if (phase < T.leg2[1]) {
      const k = seg(phase, ...T.leg2);
      pos.lerpVectors(CORNER, DOORMAT, k);
      travelled = START.distanceTo(CORNER) + k * CORNER.distanceTo(DOORMAT);
      facing = -Math.PI / 2;            // walking +X
    } else if (phase < T.turn2[1]) {
      pos.copy(DOORMAT);
      travelled = START.distanceTo(CORNER) + CORNER.distanceTo(DOORMAT);
      facing = -Math.PI / 2 + (Math.PI / 2) * smooth01(seg(phase, ...T.turn2));
    } else if (phase < T.leg3[1]) {
      const k = seg(phase, ...T.leg3);
      pos.lerpVectors(DOORMAT, INSIDE, k);
      travelled = START.distanceTo(CORNER) + CORNER.distanceTo(DOORMAT)
        + k * DOORMAT.distanceTo(INSIDE);
      facing = 0;                       // back to +Z? no: through the door
    } else {
      done = true;
    }

    g.visible = !done;
    if (done) return;

    g.position.set(pos.x, B.paveY + 0.03, pos.z);
    g.rotation.y = facing;

    const turning = (phase >= T.turn1[0] && phase < T.turn1[1])
      || (phase >= T.turn2[0] && phase < T.turn2[1]);
    if (turning) {
      // A pause on the spot: standing, not sliding through a walk cycle.
      setPose(walker, STAND);
    } else {
      setPose(walker, walkPose(travelled * STRIDE * Math.PI, { amp: 0.30, armAmp: 0.40 }));
    }
  }

  function work(phase) {
    /* One slow lean in and back out over the loop, plus a small head turn.
       Enough that the window is never a frozen tableau; not so much that it
       competes with the sheet, which is the scene's one real event. */
    const k = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
    setPose(worker, mixPose(STAND, REACH, 0.22 + 0.5 * k));
  }

  G.userData.setPhase = (phase) => { place(phase); work(phase); };
  G.userData.setPhase(0);
  scene.add(G);
  return G;
}
