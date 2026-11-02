import * as THREE from 'three';
import { C, M, box, lit } from './studio.js';

/**
 * THE OPEN SEAT — a close three-quarter view into a corner of the same
 * studio, beside the closing invitation.
 *
 * The visitor has arrived; there is a place at the table for their
 * project. The empty chair carries that on its own, so nothing here
 * explains it: no caption, no second figure, no motion. The red thread
 * continues at its smallest — a single project sheet with one red mark.
 */

/* A close view into a small corner, so the corner is small. At
   3.6 x 2.8 x 2.0 the chair was a stool in a hall and the door was the
   largest thing in frame; the invitation has to be the chair. */
const S = { w: 2.9, d: 2.2, h: 1.65, wall: 0.14 };

export function buildSeat(scene) {
  const G = new THREE.Group();
  const hw = S.w / 2, hd = S.d / 2;

  /* Interiors are lit from inside, not by the exterior key. At 0.16 the
   walls came back grey: the only thing reaching them was the cool
   hemisphere. These carry their own warmth. */
  const wallMat = lit(C.cream, 0.58);
  const floorMat = lit(C.creamDeep, 0.48);

  // ── A shallow base and a short cream wall return ──────────────────
  box(G, floorMat, S.w, 0.1, S.d, 0, -0.1, 0);
  box(G, M.creamDeep, S.w + 0.26, 0.12, S.d + 0.26, 0, -0.22, 0);
  box(G, wallMat, S.w, S.h, S.wall, 0, 0, -hd + S.wall / 2);
  box(G, wallMat, S.wall, S.h, 1.5, -hw + S.wall / 2, 0, -hd + 0.75);
  box(G, M.inkSoft, S.w, 0.1, 0.05, 0, 0, -hd + S.wall + 0.01);       // skirting

  // ── The familiar red door, partly in view behind the table ────────
  /* Partial, and behind the table: a continuity detail, not the
     subject. Only the leaf and a slice of the opening are in frame. */
  /* Pushed to the frame's edge so it is genuinely partial. At full
     height and centred it was the largest shape and the darkest value
     in the picture, which took the eye off the chair. */
  const doorW = 0.66, doorH = 1.34, dx = 1.36;
  box(G, M.ink, 0.1, doorH + 0.08, 0.08, dx - doorW / 2, 0, -hd + S.wall + 0.02);
  box(G, M.ink, doorW + 0.18, 0.08, 0.08, dx, doorH, -hd + S.wall + 0.02);
  box(G, M.glass, doorW, doorH, 0.04, dx, 0, -hd + S.wall + 0.03);   // a lit hallway, not a void
  /* The leaf and its handle hang off a hinge group at the jamb, so the
     door can move the way a door does — about its hinge — rather than
     sliding sideways as one rigid block. */
  const hinge = new THREE.Group();
  hinge.position.set(dx - doorW / 2 - 0.04, 0, -hd + S.wall + 0.05);
  G.add(hinge);
  box(hinge, M.red, 0.09, doorH - 0.04, 0.5, 0, 0.02, 0.25);
  box(hinge, M.inkSoft, 0.04, 0.08, 0.08, -0.04, 0.84, 0.45);

  // ── The worktable ─────────────────────────────────────────────────
  const tW = 1.62, tD = 0.92, tH = 0.72, tx = -0.16, tz = -0.02;
  box(G, M.creamDeep, tW, 0.06, tD, tx, tH, tz);
  for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    box(G, M.ink, 0.07, tH, 0.07,
        tx + lx * (tW / 2 - 0.1), 0, tz + lz * (tD / 2 - 0.1));
  }

  // ── The visitor's place, left clear ───────────────────────────────
  // One sheet with one red mark, a pencil, and nothing else in front of
  // the empty chair. The clear span is the invitation.
  /* Sheet and mark share a pivot at the sheet's far edge, so a lift
     raises the near corner off the table instead of rotating about the
     middle and driving the other half through the tabletop. */
  const paper = new THREE.Group();
  paper.position.set(tx - 0.1, tH + 0.06, tz + 0.09);
  paper.rotation.y = -0.07;
  G.add(paper);
  box(paper, M.cream, 0.46, 0.012, 0.34, 0, 0, 0.17);
  box(paper, M.red, 0.13, 0.008, 0.085, -0.1, 0.012, 0.11);
  const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.3, 6), M.ink);
  pencil.rotation.set(Math.PI / 2, 0, 0.42);
  pencil.position.set(tx + 0.26, tH + 0.075, tz + 0.3);
  pencil.castShadow = true; G.add(pencil);

  // ── The work already done, kept to the far edge ───────────────────
  let topSheet = null;
  for (let i = 0; i < 4; i++) {
    const m = box(G, M.cream, 0.42, 0.018, 0.3, tx + 0.72, tH + 0.06 + i * 0.018, tz - 0.28);
    m.rotation.y = 0.05 - i * 0.03;
    topSheet = m;
  }
  box(G, M.red, 0.1, 0.008, 0.07, tx + 0.72, tH + 0.134, tz - 0.34);

  // ── A modest task lamp ────────────────────────────────────────────
  box(G, M.ink, 0.14, 0.03, 0.14, tx - 0.62, tH + 0.06, tz - 0.26);     // base
  box(G, M.ink, 0.04, 0.26, 0.04, tx - 0.62, tH + 0.09, tz - 0.26);     // stem
  box(G, M.glassLit, 0.2, 0.07, 0.17, tx - 0.64, tH + 0.35, tz - 0.24);  // the lit shade

  // ── The empty chair: the focal point ──────────────────────────────
  // Viewer-facing side, pulled back from the table so the gap between
  // them is the thing you read first.
  /* The focal point. On the viewer's side of the table and pulled back
     from it, so the clear span between chair and table is the first
     thing read. */
  chair(G, tx + 0.1, tz + 1.02, -0.18);

  /* ── Motion ──────────────────────────────────────────────────────
     One thing is happening, not three: a gust of air through the open
     door. The leaf swings, then the waiting sheet lifts at its near
     corner, then the top of the finished stack stirs — each a beat
     behind the last, which is what makes it read as one cause rather
     than three objects that happen to twitch.

     Nothing sits down in this picture and nothing is produced. The
     scene's whole point is that the chair is empty, and motion that
     contradicted that would be worse than no motion at all.

     Every term is a window that leaves and returns to zero inside the
     loop, so the encoded loop closes by construction. */
  const gust = (p, a, b) => (p <= a || p >= b
    ? 0
    : 0.5 - 0.5 * Math.cos((2 * Math.PI * (p - a)) / (b - a)));

  G.userData.setPhase = function (phase) {
    const p = ((phase % 1) + 1) % 1;
    /* A slow breath under everything, so the room is never completely
       dead between gusts. One-sided on purpose: the leaf only ever
       swings open from rest, never past it. Measured, a negative
       excursion of 0.022 rad was enough to walk the leaf's broad face
       from #670905 onto the next red step, and the ordered dither then
       rendered it as a 50/50 checkerboard — which in motion is a large
       flat surface sparkling rather than turning. */
    const breath = 0.5 - 0.5 * Math.cos(2 * Math.PI * p);

    hinge.rotation.y = 0.15 * gust(p, 0.14, 0.66) + 0.030 * breath;
    paper.rotation.x = -0.24 * gust(p, 0.22, 0.74);
    topSheet.rotation.x = -0.10 * gust(p, 0.30, 0.80);
    topSheet.position.y = tH + 0.06 + 3 * 0.018 + 0.004 * gust(p, 0.30, 0.80);
  };
  G.userData.setPhase(0);

  scene.add(G);
  return G;
}

/* A plain wooden chair. Seat, four legs, a slatted back — nothing that
   could be mistaken for an office chair with a mechanism. */
/* A plain wooden chair, drawn so its silhouette reads at website size:
   a cream seat, dark legs, and a back tall enough to be unmistakable
   against the floor. Nothing that could be read as an office chair. */
function chair(parent, x, z, rotY) {
  const g = new THREE.Group();
  const seatH = 0.5, w = 0.54, d = 0.5, legR = 0.05;
  box(g, M.creamDeep, w, 0.07, d, 0, seatH, 0);
  box(g, M.inkSoft, w + 0.02, 0.03, d + 0.02, 0, seatH - 0.03, 0);     // a lip under it
  for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    box(g, M.inkSoft, legR, seatH, legR,
        lx * (w / 2 - legR / 2 - 0.01), 0, lz * (d / 2 - legR / 2 - 0.01));
  }
  for (const lx of [-1, 1]) {
    box(g, M.inkSoft, legR, 0.62, legR, lx * (w / 2 - legR / 2 - 0.01), seatH + 0.07, -d / 2 + legR / 2 + 0.01);
  }
  box(g, M.creamDeep, w - 0.06, 0.1, 0.05, 0, seatH + 0.36, -d / 2 + legR / 2 + 0.01);
  box(g, M.creamDeep, w, 0.14, 0.055, 0, seatH + 0.55, -d / 2 + legR / 2 + 0.005);  // top rail
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  parent.add(g);
  return g;
}

/* Framed on the furniture rather than on the empty volume: the top of
   the walls is not what anyone is here to look at. */
export function seatFit(THREE_) {
  const V = THREE_.Vector3;
  return [
    new V(-S.w / 2, 0, -S.d / 2), new V(S.w / 2, 0, -S.d / 2),
    new V(-S.w / 2, 0, S.d / 2 + 0.55), new V(S.w / 2, 0, S.d / 2 + 0.55),
    new V(-S.w / 2, S.h * 0.92, -S.d / 2), new V(S.w / 2, S.h * 0.92, -S.d / 2),
    new V(0, 1.2, S.d / 2 + 0.55),
  ];
}
