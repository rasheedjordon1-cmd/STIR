import * as THREE from 'three';

/**
 * The STIR studio and its campaign sheet.
 *
 * One standalone cream two-storey building with Brooklyn character, and one
 * oversized red sheet leaving an upper opening for the open cobalt. The sheet
 * is the scene's single controlled impossible event; everything else stays
 * quiet. No shopfront, no awning, no retail activity: that premise is
 * superseded.
 *
 * The sheet is a parametric surface, not a cloth sim. A spine runs out of the
 * opening and rises; a travelling wave displaces the surface along its normal,
 * pinned to zero at the opening so the sheet can never detach. Because the
 * wave is a pure function of a phase that wraps 0..1, the loop is seamless by
 * construction rather than by a crossfade.
 */

const flat = (hex) => new THREE.MeshLambertMaterial({ color: hex, flatShading: true });
/* Surfaces that are their own light source. The studio room is a deep recess
   facing the camera, so the exterior key never reaches into it and Lambert
   alone renders it black — which is exactly what the first pass did to the
   worktable, the lamp and the print that were already modelled in there. */
const lit = (hex, k = 0.55) => new THREE.MeshLambertMaterial({
  color: hex, emissive: hex, emissiveIntensity: k, flatShading: true,
});

export const C = {
  cream: 0xFAF2E6,
  creamMid: 0xE4D8C4,
  creamDeep: 0xC9BBA4,
  ink: 0x161310,
  inkSoft: 0x2A2520,
  red: 0xF21B16,
  redDeep: 0xC4120D,
  pave: 0x9C9488,
  paveEdge: 0x746E64,
  glass: 0x113A6E,
  glassLit: 0xE8C77A,
  room: 0xE8D08A,        // the lit back wall of the studio room
  roomDeep: 0xB99650,    // its floor, a step down in the same ramp
  dark: 0x0C192B,        // an opening with nothing lit behind it
  cobaltSign: 0x0451AB,  // the sign's lettering: the brand blue, not red
};

const M = {};
for (const k of Object.keys(C)) M[k] = flat(C[k]);
M.room = lit(C.room, 0.30);
M.roomDeep = lit(C.roomDeep, 0.24);
M.glassLit = lit(C.glassLit, 0.5);

function box(parent, mat, w, h, d, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/* Building footprint. Camera is 2:1 iso at azimuth 45, so +X reads as screen
   right and +Z as screen down: the entrance and the big studio window go on
   +Z, and the sheet leaves the +X face so it travels up and right, away from
   the headline territory on the page's left. */
export const B = {
  w: 4.6, d: 3.4,
  ground: 3.0,       // ground storey height
  upper: 2.9,        // upper storey height
  parapet: 0.46,
  paveY: 0.16,
};
B.roof = B.paveY + B.ground + B.upper;

export function buildStudio(scene) {
  const G = new THREE.Group();
  const hw = B.w / 2, hd = B.d / 2;

  // ── Pavement fragment: shallow, chamfered, grounds the building ──────
  const padW = 8.2, padD = 6.6;
  box(G, M.paveEdge, padW, 0.16, padD, 0, 0, 0.5);
  box(G, M.pave, padW - 0.34, 0.03, padD - 0.34, 0, 0.16, 0.5);
  // two pavement seams, 0.085 wide — thinner than this rasterises to noise
  for (const sx of [-1.9, 1.9]) box(G, M.paveEdge, 0.085, 0.012, padD - 0.4, sx, 0.19, 0.5);

  // ── Massing ─────────────────────────────────────────────────────────
  /* The ground floor is a shell, not a solid block. A solid one puts the
     front face in front of everything, so the worktable, the lamp and the
     print that were already modelled inside were never visible — the window
     rendered as a flat amber rectangle. The mass is set back by REC and a
     front skin is built around the openings, which makes the room real. */
  const REC = 1.05;                       // depth of the room you can see into
  box(G, M.cream, B.w, B.ground, B.d - REC, 0, B.paveY, -REC / 2);
  box(G, M.cream, B.w, B.upper, B.d, 0, B.paveY + B.ground, 0);
  // storey band and cornice: the two horizontals that say "building"
  box(G, M.creamDeep, B.w + 0.14, 0.14, B.d + 0.14, 0, B.paveY + B.ground - 0.07, 0);
  box(G, M.inkSoft, B.w + 0.22, 0.2, B.d + 0.22, 0, B.roof, 0);
  box(G, M.cream, B.w + 0.1, B.parapet - 0.2, B.d + 0.1, 0, B.roof + 0.2, 0);

  // ── The front skin, with the two openings cut out of it ──────────────
  const doorW = 0.92, doorH = 1.95, doorX = -1.15;
  const winW = 2.1, winH = 1.5, winX = 0.75;
  const sillY = B.paveY + 0.85, headY = sillY + winH;
  const dL = doorX - doorW / 2 - 0.08, dR = doorX + doorW / 2 + 0.08;
  const wL = winX - winW / 2, wR = winX + winW / 2;
  const skinZ = hd - REC / 2;             // centre of the skin in depth
  /* piece(x0, x1, y0, y1) — a panel of the front wall between two openings.
     Writing it this way keeps the openings as gaps in a list of panels, which
     is the only description of this wall that cannot drift out of register. */
  const piece = (x0, x1, y0, y1) =>
    box(G, M.cream, x1 - x0, y1 - y0, REC, (x0 + x1) / 2, y0, skinZ);
  piece(-hw, dL, B.paveY, B.paveY + B.ground);            // left of the door
  piece(dL, dR, B.paveY + doorH, B.paveY + B.ground);     // over the door
  piece(dR, wL, B.paveY, B.paveY + B.ground);             // pier between them
  piece(wL, wR, B.paveY, sillY);                          // under the window
  piece(wL, wR, headY, B.paveY + B.ground);               // over the window
  piece(wR, hw, B.paveY, B.paveY + B.ground);             // right of the window

  // ── The room behind the window ───────────────────────────────────────
  box(G, M.roomDeep, winW + 0.3, 0.05, REC, winX, B.paveY, skinZ);        // floor
  box(G, M.room, winW + 0.3, winH + 0.5, 0.06, winX, sillY - 0.4, hd - REC);  // lit wall
  /* Four members, not a slab. The previous "frame" was a solid 2.3 x 1.7 box
     sitting in the opening, which is why the window rendered as a black
     rectangle with a lit room behind it that nobody could see. */
  const jamb = 0.1;
  box(G, M.ink, jamb, winH + jamb * 2, 0.12, wL - jamb / 2, sillY - jamb, hd - 0.03);
  box(G, M.ink, jamb, winH + jamb * 2, 0.12, wR + jamb / 2, sillY - jamb, hd - 0.03);
  box(G, M.ink, winW + jamb * 2, jamb, 0.12, winX, headY, hd - 0.03);
  box(G, M.ink, winW + jamb * 2, jamb, 0.12, winX, sillY - jamb, hd - 0.03);
  box(G, M.ink, 0.07, winH, 0.1, winX, sillY, hd - 0.05);                     // mullion
  box(G, M.creamDeep, winW + 0.26, 0.1, 0.22, winX, sillY - 0.1, hd + 0.02);  // sill
  // What the window is for: a worktable, a lamp, and one print on the wall.
  box(G, M.inkSoft, 1.5, 0.07, 0.46, winX - 0.1, B.paveY + 0.92, hd - 0.46);
  box(G, M.inkSoft, 0.06, 0.3, 0.06, winX - 0.66, B.paveY + 0.99, hd - 0.46);
  box(G, M.cream, 0.24, 0.08, 0.18, winX - 0.66, B.paveY + 1.29, hd - 0.46);
  box(G, M.red, 0.4, 0.54, 0.04, winX + 0.62, B.paveY + 1.5, hd - REC + 0.05);

  /* The lamp is an actual light, not a painted highlight: it is what puts a
     gradient across the table and an edge on anyone standing at it. Kept low:
     at 2.6 it blew the back wall to white and the palette snapped the falloff
     into concentric rings, which is the bloom the brief rules out. */
  const bulb = new THREE.PointLight(0xFFE3A8, 0.95, 2.9, 1.9);
  bulb.position.set(winX - 0.66, B.paveY + 1.22, hd - 0.46);
  G.add(bulb);

  // ── The entrance, standing open ──────────────────────────────────────
  /* The leaf is swung out against the jamb rather than closed. A closed door
     is a red rectangle; an open one is a way in, which is the whole point of
     a figure walking up to it, and it gives the façade a second plane. */
  // Same again for the entrance: jambs and a lintel, so the opening is an
  // opening and the figure can be seen stepping into the dark of it.
  box(G, M.ink, 0.12, doorH + 0.12, 0.14, dL + 0.02, B.paveY, hd - 0.04);
  box(G, M.ink, 0.12, doorH + 0.12, 0.14, dR - 0.02, B.paveY, hd - 0.04);
  box(G, M.ink, doorW + 0.28, 0.12, 0.14, doorX, B.paveY + doorH, hd - 0.04);
  box(G, M.dark, doorW, doorH - 0.06, 0.08, doorX, B.paveY, hd - REC + 0.04);  // the way in
  box(G, M.red, 0.09, doorH - 0.04, 0.86, dL + 0.02, B.paveY + 0.02, hd + 0.44); // open leaf
  box(G, M.inkSoft, 0.04, 0.1, 0.1, dL + 0.09, B.paveY + 1.04, hd + 0.78);       // handle
  box(G, M.creamDeep, doorW + 0.5, 0.12, 0.42, doorX, B.paveY - 0.12, hd + 0.2); // step
  // A bracket lamp over the entrance, which is how these fronts are lit.
  box(G, M.ink, 0.06, 0.06, 0.26, doorX, B.paveY + doorH + 0.22, hd + 0.14);
  box(G, M.room, 0.3, 0.1, 0.3, doorX, B.paveY + doorH + 0.14, hd + 0.3);

  // ── Upper floor, +Z face: two dark-framed windows ────────────────────
  for (const wx of [-1.25, 0.55]) {
    box(G, M.ink, 1.0, 1.35, 0.13, wx, B.paveY + B.ground + 0.72, hd - 0.01);
    box(G, M.glass, 0.84, 1.19, 0.05, wx, B.paveY + B.ground + 0.8, hd + 0.03);
  }

  // ── +X face: the upper opening the sheet leaves from ─────────────────
  const openW = 1.5, openH = 1.7;
  const openY = B.paveY + B.ground + 0.62;
  box(G, M.ink, 0.14, openH + 0.22, openW + 0.22, hw - 0.01, openY - 0.11, -0.2);
  box(G, M.inkSoft, 0.06, openH, openW, hw + 0.02, openY, -0.2);     // the dark opening
  // a ground-floor window on this face too, so the flank is not blank
  box(G, M.ink, 0.12, 1.3, 1.0, hw - 0.01, B.paveY + 0.8, 0.6);
  box(G, M.glass, 0.05, 1.14, 0.84, hw + 0.03, B.paveY + 0.88, 0.6);

  // ── STIR sign ───────────────────────────────────────────────────────
  // Real letterforms, built from blocks on a 5x7 grid. The first pass used
  // four abstract red bars, which read as nothing: the brief asks for an
  // unmistakable STIR sign, and the in-scene sign is the one place the brief
  // allows constructed lettering. The interface wordmark stays a sharp HTML
  // asset; this is its pixel-scale cousin, not a substitute.
  /* The 1 Nov revision makes the sign a shared construction: one stepped
     ivory board with cobalt lettering and two small square mounting details,
     repeated as the header brand cell and the closing invitation. So the
     lettering is cobalt on ivory here, not red on cream — the scene's red is
     the door and the sheet, and the sign belongs to the interface's family. */
  const signY = B.paveY + B.ground + 0.02;
  const signW = 1.96, signH = 0.70;
  box(G, M.inkSoft, signW, signH, 0.08, 0.38, signY - 0.04, hd + 0.03);   // shadow plate
  box(G, M.cream, signW - 0.1, signH - 0.1, 0.07, 0.38, signY + 0.01, hd + 0.07);
  // the two steps: one square lifted out of each opposing corner
  const stepN = 0.1;
  box(G, M.inkSoft, stepN, stepN, 0.09, 0.38 - (signW - 0.1) / 2 + stepN / 2,
      signY + signH - 0.1 - stepN / 2 + 0.01, hd + 0.08);
  box(G, M.inkSoft, stepN, stepN, 0.09, 0.38 + (signW - 0.1) / 2 - stepN / 2,
      signY + 0.01, hd + 0.08);
  // two mounting squares, the detail the header cell repeats
  for (const mx of [-0.78, 0.78]) {
    box(G, M.cobaltSign, 0.07, 0.07, 0.04, 0.38 + mx, signY + signH / 2 - 0.07, hd + 0.1);
  }
  stirSign(G, 0.38, signY + 0.31, hd + 0.11, 0.072);

  // ── On the pavement ─────────────────────────────────────────────────
  /* A bike against the pier and a bin at the kerb. Two objects, both
     ordinary: the brief asks for a few observed details, not a street set. */
  const bikeX = 1.0, bikeZ = hd + 0.62;
  for (const bz of [bikeZ - 0.52, bikeZ + 0.52]) {
    const w = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.035, 5, 12),
      new THREE.MeshLambertMaterial({ color: C.ink, flatShading: true }));
    w.position.set(bikeX, B.paveY + 0.31, bz);
    w.castShadow = true;
    G.add(w);
  }
  box(G, M.inkSoft, 0.05, 0.05, 1.0, bikeX, B.paveY + 0.52, bikeZ);   // down tube
  box(G, M.inkSoft, 0.05, 0.34, 0.05, bikeX, B.paveY + 0.5, bikeZ - 0.4); // seat post
  box(G, M.inkSoft, 0.05, 0.3, 0.05, bikeX, B.paveY + 0.56, bikeZ + 0.44); // steerer
  box(G, M.inkSoft, 0.28, 0.04, 0.05, bikeX, B.paveY + 0.86, bikeZ + 0.44); // bars
  box(G, M.creamDeep, 0.2, 0.05, 0.1, bikeX, B.paveY + 0.84, bikeZ - 0.4);  // saddle

  box(G, M.inkSoft, 0.44, 0.62, 0.44, 2.45, B.paveY, hd + 0.5);      // bin
  box(G, M.ink, 0.5, 0.06, 0.5, 2.45, B.paveY + 0.62, hd + 0.5);     // its lid

  // ── Roof: an aerial and a vent, the two Brooklyn tells ──────────────
  // The first version was a mast with one centred crossbar, which at this
  // size is a crucifix on a roof — it read as a church. A Yagi's spars are
  // asymmetric, several, and all on one side of the boom, so the silhouette
  // can only be an aerial.
  const my = B.roof + B.parapet;
  box(G, M.ink, 0.07, 1.4, 0.07, -1.5, my, -0.9);
  [[0.46, 0.72], [0.38, 0.95], [0.3, 1.14]].forEach(([len, h]) => {
    box(G, M.ink, len, 0.05, 0.05, -1.5 + len / 2 + 0.03, my + h, -0.9);
  });
  box(G, M.ink, 0.3, 0.44, 0.3, 1.5, my, -0.6);

  scene.add(G);
  return G;
}

/* ── Constructed lettering ──────────────────────────────────────────
   A 5x7 block alphabet, enough for S T I R. Tested a second "STUDIO" line
   beneath it and cut it: at the scale the building renders on the page a
   0.022 m cell is about one screen pixel, which is noise, not a word. */
const WORD = 'STIR';
const GLYPH = {
  S: ['01110', '10001', '10000', '01110', '00001', '10001', '01110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
};

/** Centre "STIR" at (cx, cy, z) on the +Z face, one block per lit cell. */
function stirSign(parent, cx, cy, z, cell) {
  const word = 'STIR';
  const cols = word.length * 5 + (word.length - 1);     // 1-cell letterspace
  const x0 = cx - (cols * cell) / 2 + cell / 2;
  const y0 = cy + (7 * cell) / 2 - cell / 2;
  word.split('').forEach((ch, n) => {
    const rows = GLYPH[ch];
    const ox = n * 6 * cell;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (rows[r][c] !== '1') continue;
        /* Blocks are a hair over one cell so adjacent cells fuse into a
           stroke instead of showing seams at the palette snap. */
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(cell * 1.04, cell * 1.04, cell * 0.55),
          M.cobaltSign
        );
        m.position.set(x0 + ox + c * cell, y0 - r * cell, z);
        m.castShadow = false;
        parent.add(m);
      }
    }
  });
}

/* ── The campaign sheet ───────────────────────────────────────────────
   Composed in the camera's own plane, not in world axes.

   Two earlier constructions failed for the same reason: a spine swept with a
   width taken from world up, then from the view vector, puts a large part of
   the breadth along the view axis or along -Y, so the sheet either
   foreshortens into a ribbon or drapes onto the pavement. The camera is
   locked, so the honest move is to compose in screen space: R and U span the
   plane the lens sees, N is the depth the billow travels along.

   The sheet is narrow where it leaves the opening and fans wide as it
   travels. That is the metaphor as geometry — work leaving a small studio and
   taking a much larger place outside it.                                    */
const R = new THREE.Vector3(0.7071, 0, -0.7071);              // screen right
const U = new THREE.Vector3(-0.3162, 0.8944, -0.3162);        // screen up
const N = new THREE.Vector3(0.6325, 0.4472, 0.6325);          // toward the lens

/* h0 -> h1 was 0.85 -> 3.5, a 4:1 taper. That is a windsock, not a sheet: a
   printed sheet holds its width, and only appears to widen because the far
   end is nearer the lens. 1.5 -> 2.6 is that much and no more, and it leaves
   the wordmark sitting on a flat enough span to stay readable. */
const SHEET = {
  origin: new THREE.Vector3(B.w / 2 - 0.1, B.paveY + B.ground + 0.62, -0.2),
  len: 8.6,          // travel along screen right
  h0: 1.5,           // half-height at the opening
  h1: 2.6,           // half-height at the far edge
  rise: 1.95,        // how far the centreline climbs
  amp: 0.46,         // billow depth along N
  thick: 0.09,
  segU: 46,
  segV: 26,
};

const smooth01 = (k) => k * k * (3 - 2 * k);

function surfacePoint(a, b, phase, out, nOut) {
  const halfH = SHEET.h0 + (SHEET.h1 - SHEET.h0) * smooth01(a);
  const lift = SHEET.rise * Math.pow(a, 1.25);
  /* Pinned at the opening so the sheet can never detach from the building. */
  const ramp = Math.min(1, Math.pow(a / 0.18, 2));
  const wave = Math.sin(2 * Math.PI * (a * 1.15 - phase)) * Math.cos(b * 1.05);
  const fold = 0.42 * Math.sin(Math.PI * smooth01(Math.min(1, a / 0.75)));
  const d = SHEET.amp * ramp * wave + fold * ramp;

  out.copy(SHEET.origin)
    .addScaledVector(R, a * SHEET.len)
    .addScaledVector(U, lift + b * halfH)
    .addScaledVector(N, d);

  if (nOut) {
    /* Surface normal from two finite differences on the same function. */
    const e = 0.004;
    const pa = new THREE.Vector3(), pb = new THREE.Vector3();
    surfaceRaw(Math.min(1, a + e), b, phase, pa);
    surfaceRaw(a, Math.min(1, b + e), phase, pb);
    const base = new THREE.Vector3();
    surfaceRaw(a, b, phase, base);
    nOut.crossVectors(pa.sub(base), pb.sub(base)).normalize();
    if (nOut.dot(N) < 0) nOut.negate();
  }
  return out;
}

/* Same surface without the normal recursion. */
function surfaceRaw(a, b, phase, out) {
  const halfH = SHEET.h0 + (SHEET.h1 - SHEET.h0) * smooth01(a);
  const lift = SHEET.rise * Math.pow(a, 1.25);
  const ramp = Math.min(1, Math.pow(a / 0.18, 2));
  const wave = Math.sin(2 * Math.PI * (a * 1.15 - phase)) * Math.cos(b * 1.05);
  const fold = 0.42 * Math.sin(Math.PI * smooth01(Math.min(1, a / 0.75)));
  const d = SHEET.amp * ramp * wave + fold * ramp;
  return out.copy(SHEET.origin)
    .addScaledVector(R, a * SHEET.len)
    .addScaledVector(U, lift + b * halfH)
    .addScaledVector(N, d);
}

function sheetGeometry(phase) {
  const { segU, segV, thick } = SHEET;
  const pos = [], idx = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3();
  const rows = segU + 1, cols = segV + 1;

  for (let side = 0; side < 2; side++) {
    for (let i = 0; i < rows; i++) {
      const a = i / segU;
      for (let j = 0; j < cols; j++) {
        const b = -1 + (2 * j) / segV;
        surfacePoint(a, b, phase, p, n);
        if (side === 1) p.addScaledVector(n, -thick);
        pos.push(p.x, p.y, p.z);
      }
    }
  }
  const base = rows * cols;
  for (let side = 0; side < 2; side++) {
    const o = side * base;
    for (let i = 0; i < segU; i++) {
      for (let j = 0; j < segV; j++) {
        const a = o + i * cols + j, b2 = a + 1, c = a + cols, d = c + 1;
        if (side === 0) idx.push(a, c, b2, b2, c, d);
        else idx.push(a, b2, c, b2, d, c);
      }
    }
  }
  const seam = (ai, bi) => idx.push(ai, bi, ai + base, bi, bi + base, ai + base);
  for (let i = 0; i < segU; i++) {
    seam(i * cols, (i + 1) * cols);
    seam((i + 1) * cols + segV, i * cols + segV);
  }
  for (let j = 0; j < segV; j++) seam(segU * cols + j + 1, segU * cols + j);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* Restrained cream graphic, riding the same surface a little proud of it so
   it bends with the sheet. Geometry, not a texture: a painted texture would
   fight the palette snap. */
function graphicGeometry(phase) {
  const pos = [], idx = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3();
  const lift = 0.014;
  let base = 0;

  const patch = (a0, a1, b0, b1, nu = 12, nv = 8) => {
    const rows = nu + 1, cols = nv + 1;
    for (let i = 0; i < rows; i++) {
      const a = a0 + ((a1 - a0) * i) / nu;
      for (let j = 0; j < cols; j++) {
        const b = b0 + ((b1 - b0) * j) / nv;
        surfacePoint(a, b, phase, p, n);
        p.addScaledVector(n, lift);
        pos.push(p.x, p.y, p.z);
      }
    }
    for (let i = 0; i < nu; i++) {
      for (let j = 0; j < nv; j++) {
        const a = base + i * cols + j, b2 = a + 1, c = a + cols, d = c + 1;
        idx.push(a, c, b2, b2, c, d);
      }
    }
    base += rows * cols;
  };

  /* Three plain rectangles read as windows punched through the sheet —
     the eye takes any pale rectangle on a dark field as an opening. A
     wordmark cannot be misread as a hole, and it is the true subject:
     the work leaving the studio carries the studio's name. Same 5x7
     alphabet as the sign, so the two agree. */
  const cw = 0.155;                                  // world units per cell
  const aMid = 0.66;
  const halfH = SHEET.h0 + (SHEET.h1 - SHEET.h0) * smooth01(aMid);
  const da = cw / SHEET.len;
  const db = cw / halfH;
  const cols = WORD.length * 5 + (WORD.length - 1);
  const a0 = aMid - (cols * da) / 2;
  const bTop = (7 * db) / 2;

  WORD.split('').forEach((ch, n) => {
    const rows = GLYPH[ch];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 5; c++) {
        if (rows[r][c] !== '1') continue;
        const aa = a0 + (n * 6 + c) * da;
        const bb = bTop - r * db;
        // 1.02 so neighbouring cells fuse into a stroke instead of
        // showing a seam once the palette snaps them.
        patch(aa, aa + da * 1.02, bb - db, bb + db * 0.02, 2, 2);
      }
    }
  });
  // The rule under it: the sheet's own baseline, and the one element
  // that shows the surface curving away from the type.
  patch(a0, a0 + cols * da, bTop - 7 * db - db * 1.5, bTop - 7 * db - db * 0.7, 14, 2);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function buildSheet(scene) {
  const G = new THREE.Group();
  const sheet = new THREE.Mesh(sheetGeometry(0), new THREE.MeshLambertMaterial({
    color: C.red, flatShading: true, side: THREE.DoubleSide,
  }));
  sheet.castShadow = true;
  sheet.receiveShadow = true;
  const art = new THREE.Mesh(graphicGeometry(0), new THREE.MeshLambertMaterial({
    color: C.cream, flatShading: true, side: THREE.DoubleSide,
  }));
  G.add(sheet, art);
  scene.add(G);

  /* One pure function of phase. Rebuilding two small buffers per frame is
     cheaper than a vertex shader we would then have to duplicate for the
     shadow pass, and it keeps the whole scene a function of t. */
  G.userData.setPhase = (phase) => {
    sheet.geometry.dispose();
    sheet.geometry = sheetGeometry(phase);
    art.geometry.dispose();
    art.geometry = graphicGeometry(phase);
  };
  G.userData.SHEET = SHEET;
  return G;
}

export { SHEET };
