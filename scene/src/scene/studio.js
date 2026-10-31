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

export const C = {
  cream: 0xFAF2E6,
  creamMid: 0xE4D8C4,
  creamDeep: 0xC9BBA4,
  ink: 0x161310,
  inkSoft: 0x2A2520,
  red: 0xF21B16,
  redDeep: 0xC4120D,
  pave: 0xB9AE9B,
  paveEdge: 0x8E8475,
  glass: 0x113A6E,
  glassLit: 0xE8C77A,
};

const M = {};
for (const k of Object.keys(C)) M[k] = flat(C[k]);

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
  box(G, M.cream, B.w, B.ground, B.d, 0, B.paveY, 0);
  box(G, M.cream, B.w, B.upper, B.d, 0, B.paveY + B.ground, 0);
  // storey band and cornice: the two horizontals that say "building"
  box(G, M.creamDeep, B.w + 0.14, 0.14, B.d + 0.14, 0, B.paveY + B.ground - 0.07, 0);
  box(G, M.inkSoft, B.w + 0.22, 0.2, B.d + 0.22, 0, B.roof, 0);
  box(G, M.cream, B.w + 0.1, B.parapet - 0.2, B.d + 0.1, 0, B.roof + 0.2, 0);

  // ── Ground floor, +Z face: red entrance, recessed with a threshold ───
  const doorW = 0.92, doorH = 1.9;
  box(G, M.ink, doorW + 0.22, doorH + 0.2, 0.16, -1.15, B.paveY, hd - 0.02);  // reveal
  box(G, M.red, doorW, doorH, 0.1, -1.15, B.paveY + 0.06, hd + 0.02);          // leaf
  box(G, M.creamDeep, doorW + 0.5, 0.12, 0.44, -1.15, B.paveY - 0.12, hd + 0.2); // step

  // ── Ground floor, +Z face: the large studio window ───────────────────
  const winW = 2.1, winH = 1.5;
  box(G, M.ink, winW + 0.2, winH + 0.2, 0.14, 0.75, B.paveY + 0.75, hd - 0.01);
  box(G, M.glassLit, winW, winH, 0.06, 0.75, B.paveY + 0.85, hd + 0.03);
  box(G, M.ink, 0.07, winH, 0.09, 0.75, B.paveY + 0.85, hd + 0.06);           // mullion
  // Working details read through the glass: a table, a lamp, one print.
  box(G, M.inkSoft, 1.25, 0.08, 0.5, 0.75, B.paveY + 0.95, hd - 0.42);        // worktable
  box(G, M.inkSoft, 0.07, 0.34, 0.07, 0.3, B.paveY + 1.03, hd - 0.42);        // lamp stem
  box(G, M.cream, 0.26, 0.09, 0.2, 0.3, B.paveY + 1.37, hd - 0.42);           // lamp shade
  box(G, M.red, 0.42, 0.56, 0.05, 1.28, B.paveY + 1.18, hd - 0.56);           // one print

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

  // ── STIR sign: a cream board on the +Z face, between the storeys ─────
  box(G, M.ink, 2.0, 0.5, 0.1, 0.4, B.paveY + B.ground + 0.04, hd + 0.04);
  box(G, M.cream, 1.88, 0.38, 0.06, 0.4, B.paveY + B.ground + 0.1, hd + 0.08);
  // four red blocks standing in for the wordmark at this scale; the real
  // wordmark is an interface asset and stays sharp in HTML, not pixelated here
  for (let i = 0; i < 4; i++) {
    box(G, M.red, 0.26, 0.2, 0.04, -0.22 + i * 0.42, B.paveY + B.ground + 0.19, hd + 0.11);
  }

  // ── Roof: antenna and a vent, the two Brooklyn tells ────────────────
  box(G, M.ink, 0.07, 1.35, 0.07, -1.5, B.roof + B.parapet, -0.9);
  box(G, M.ink, 0.52, 0.06, 0.06, -1.5, B.roof + B.parapet + 1.05, -0.9);
  box(G, M.ink, 0.3, 0.44, 0.3, 1.5, B.roof + B.parapet, -0.6);

  scene.add(G);
  return G;
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

const SHEET = {
  origin: new THREE.Vector3(B.w / 2 - 0.1, B.paveY + B.ground + 0.62, -0.2),
  len: 9.2,          // travel along screen right
  h0: 0.85,          // half-height at the opening
  h1: 3.5,           // half-height at the far edge
  rise: 2.3,         // how far the centreline climbs
  amp: 0.42,         // billow depth along N
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

  patch(0.30, 0.44, -0.74, 0.74);    // broad bar across the sheet
  patch(0.54, 0.63, -0.74, 0.02);    // short bar, offset
  patch(0.70, 0.93, -0.26, 0.62);    // block at the far end

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
