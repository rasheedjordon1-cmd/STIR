import * as THREE from 'three';
import { C, M, box, flat, lit } from './studio.js';
import { buildFounder } from './founder.js';

/**
 * THE WORKING ROOM — a room inside the cream STIR building, seen as an
 * open-front cutaway from the same three-quarter direction as the hero.
 *
 * The exterior introduces the studio; this shows where the work comes
 * together. Deliberately quieter and smaller than the hero: five or six
 * meaningful objects, generous clear floor and wall, no second giant
 * banner. The red campaign material is the thread between the scenes —
 * outside it is the oversized sheet, here it is a working proof pinned
 * to the back wall at a fraction of the size.
 *
 * Occupied by one figure: the founder, at the table, reviewing a proof.
 * His appearance comes from the supplied photograph and nothing else.
 * No second figure, and nothing that would imply a larger team.
 */

const R = { w: 5.6, d: 4.2, h: 2.9, wall: 0.18 };

export function buildRoom(scene) {
  const G = new THREE.Group();
  const hw = R.w / 2, hd = R.d / 2;

  // Interior shells use the lit materials so the room reads as warm
  // inside rather than as a dark box the key light never reaches.
  /* Interiors are lit from inside, not by the exterior key. At 0.16 the
   walls came back grey: the only thing reaching them was the cool
   hemisphere. These carry their own warmth. */
  const wallMat = lit(C.cream, 0.58);
  const floorMat = lit(C.creamDeep, 0.48);
  const backMat = lit(C.creamMid, 0.56);

  // ── Shell: floor, back wall (-Z), left wall (-X), and a shallow
  //    base so the room sits on something, like the hero's pavement.
  box(G, floorMat, R.w, 0.12, R.d, 0, -0.12, 0);
  box(G, M.creamDeep, R.w + 0.3, 0.14, R.d + 0.3, 0, -0.26, 0);      // base
  box(G, backMat, R.w, R.h, R.wall, 0, 0, -hd + R.wall / 2);          // back wall
  box(G, wallMat, R.wall, R.h, R.d, -hw + R.wall / 2, 0, 0);          // left wall
  // Dark trim: skirting and a picture rail, the hero's two horizontals
  box(G, M.inkSoft, R.w, 0.12, 0.06, 0, 0, -hd + R.wall + 0.01);
  box(G, M.inkSoft, 0.06, 0.12, R.d, -hw + R.wall + 0.01, 0, 0);
  box(G, M.creamDeep, R.w, 0.07, 0.05, 0, R.h - 0.5, -hd + R.wall + 0.01);

  // ── The familiar red door, at the left edge, standing open ────────
  const doorW = 0.9, doorH = 2.0;
  /* Jambs and a lintel around a dark opening, with the leaf swung into
     the room — the same construction as the entrance on the building,
     so it reads as a way through rather than a painted rectangle. */
  box(G, M.ink, 0.12, doorH + 0.1, 0.1, -hw + 0.06, 0, 1.1 - doorW / 2);
  box(G, M.ink, 0.12, doorH + 0.1, 0.1, -hw + 0.06, 0, 1.1 + doorW / 2);
  box(G, M.ink, 0.12, 0.1, doorW + 0.2, -hw + 0.06, doorH, 1.1);
  box(G, M.dark, 0.05, doorH, doorW, -hw + R.wall + 0.005, 0, 1.1);   // on the inner face
  box(G, M.red, 0.66, doorH - 0.05, 0.09, -hw + 0.44, 0.02, 1.1 - doorW / 2 - 0.05);
  box(G, M.inkSoft, 0.05, 0.09, 0.09, -hw + 0.74, 1.02, 1.1 - doorW / 2 - 0.05);

  // ── The red campaign proof on the back wall ───────────────────────
  // The hero's banner, reduced to something you would actually pin up:
  // the same red field and the same cream mark, at working size.
  const px = 1.45, py = 1.42;
  box(G, M.ink, 1.32, 0.94, 0.03, px, py, -hd + R.wall + 0.015);
  box(G, M.red, 1.22, 0.84, 0.02, px, py + 0.05, -hd + R.wall + 0.03);
  stirBars(G, px, py + 0.47, -hd + R.wall + 0.05, 0.062);
  // a second, smaller pinned sheet so the wall reads as a working one
  box(G, M.cream, 0.5, 0.64, 0.02, px + 1.0, py + 0.1, -hd + R.wall + 0.02);
  box(G, M.red, 0.2, 0.08, 0.01, px + 1.0, py + 0.52, -hd + R.wall + 0.035);

  // ── The worktable ─────────────────────────────────────────────────
  const tW = 2.9, tD = 1.15, tH = 0.76, tx = 0.25, tz = 0.15;
  box(G, M.creamDeep, tW, 0.07, tD, tx, tH, tz);                      // top
  for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    box(G, M.ink, 0.08, tH, 0.08,
        tx + lx * (tW / 2 - 0.12), 0, tz + lz * (tD / 2 - 0.12));
  }

  // group 1 — paper layouts, slightly out of square
  const sheets = [[-0.95, 0.02, 0.06], [-0.78, 0.1, -0.09], [-1.02, -0.06, 0.2]];
  sheets.forEach(([ox, oz, rot], i) => {
    const m = box(G, M.cream, 0.52, 0.012, 0.38, tx + ox, tH + 0.07 + i * 0.012, tz + oz);
    m.rotation.y = rot;
  });
  box(G, M.red, 0.16, 0.008, 0.1, tx - 0.95, tH + 0.112, tz + 0.02);  // one red mark

  // group 2 — a compact camera
  const cx = tx + 0.16, cz = tz + 0.2;
  box(G, M.ink, 0.42, 0.26, 0.22, cx, tH + 0.07, cz);                 // body
  box(G, M.inkSoft, 0.16, 0.08, 0.2, cx + 0.02, tH + 0.33, cz);       // viewfinder
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 10), M.inkSoft);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(cx, tH + 0.2, cz + 0.2);
  lens.castShadow = true; G.add(lens);
  box(G, M.glassLit, 0.13, 0.09, 0.02, cx, tH + 0.155, cz + 0.3);     // the glass
  box(G, M.red, 0.08, 0.03, 0.01, cx - 0.14, tH + 0.26, cz - 0.115);  // one red mark

  // group 3 — a monitor showing a cream-and-cobalt page
  const mx = tx + 1.05, my = tH + 0.07, mz = tz - 0.22;
  box(G, M.ink, 0.1, 0.26, 0.12, mx, my, mz);                          // stand
  box(G, M.ink, 1.0, 0.64, 0.06, mx, my + 0.26, mz);                   // bezel
  box(G, M.pageLit, 0.9, 0.54, 0.02, mx, my + 0.31, mz + 0.04);        // page
  box(G, M.cobaltSign, 0.9, 0.16, 0.012, mx, my + 0.69, mz + 0.055);   // its cobalt band
  box(G, M.red, 0.14, 0.05, 0.01, mx - 0.32, my + 0.4, mz + 0.06);     // its red mark

  // ── The printer, and the print it has just made ───────────────────
  const prx = tx + 1.32, prz = tz + 0.46;
  box(G, M.inkSoft, 0.46, 0.22, 0.34, prx, tH + 0.07, prz);
  box(G, M.ink, 0.4, 0.04, 0.06, prx, tH + 0.29, prz + 0.14);
  const print = box(G, M.cream, 0.34, 0.01, 0.26, prx, tH + 0.3, prz + 0.3);
  print.name = 'print';

  // ── A task lamp, the warm source the hero's window also has ───────
  box(G, M.ink, 0.1, 0.03, 0.1, tx - 1.22, tH + 0.07, tz - 0.3);
  box(G, M.ink, 0.04, 0.5, 0.04, tx - 1.22, tH + 0.1, tz - 0.3);
  box(G, M.glassLit, 0.24, 0.09, 0.2, tx - 1.26, tH + 0.58, tz - 0.28);   // the lit shade

  /* The founder, at the far long side of the table, facing back into
     the room. Placed after the furniture so his contact shadow falls on
     the floor that is already there. */
  buildFounder(G, tx - 0.42, 0, tz - 0.82, 0.20);

  /* The proof he is reading: a cream sheet with one red mark, square
     to him rather than to the table. */
  const proof = box(G, M.cream, 0.44, 0.012, 0.32, tx - 0.46, tH + 0.07, tz - 0.22);
  proof.rotation.y = -0.34;
  const mark = box(G, M.red, 0.14, 0.008, 0.09, tx - 0.54, tH + 0.082, tz - 0.26);
  mark.rotation.y = -0.34;

  scene.add(G);
  G.userData.print = print;
  return G;
}

/* The hero's wordmark, built from the same 5x7 block alphabet, at the
   size a pinned proof would actually carry it. */
const GLYPH = {
  S: ['01110', '10001', '10000', '01110', '00001', '10001', '01110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
};
function stirBars(parent, cx, cy, z, cell) {
  const word = 'STIR';
  const cols = word.length * 5 + (word.length - 1);
  const x0 = cx - (cols * cell) / 2 + cell / 2;
  const y0 = cy;
  word.split('').forEach((ch, n) => {
    const rows = GLYPH[ch];
    const ox = n * 6 * cell;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (rows[r][c] !== '1') continue;
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(cell * 1.04, cell * 1.04, cell * 0.4), M.cream);
        m.position.set(x0 + ox + c * cell, y0 - r * cell, z);
        m.castShadow = false;
        parent.add(m);
      }
    }
  });
}

/* Fit points: the room's corners plus the table, so the frame holds the
   whole cutaway with the hero's own margin. */
export function roomFit(THREE_) {
  const V = THREE_.Vector3;
  return [
    new V(-R.w / 2, 0, -R.d / 2), new V(R.w / 2, 0, -R.d / 2),
    new V(-R.w / 2, 0, R.d / 2), new V(R.w / 2, 0, R.d / 2),
    new V(-R.w / 2, R.h, -R.d / 2), new V(R.w / 2, R.h, -R.d / 2),
    new V(-R.w / 2, R.h, R.d / 2),
  ];
}
