import * as THREE from 'three';
import { SLAB, PAVE_Y } from '../config.js';

/**
 * Grey blockout. Masses only. The point is to settle the composition against
 * the real headline before anything is modelled.
 *
 * At azimuth 45 an axis-aligned block shows both street faces equally, which is
 * the corner-shop three-quarter the brief asks for. So the corner block sits
 * back-left with its +Z and +X faces open to the camera, the neighbour runs
 * back along -Z rather than sideways, and the pavement wraps those two faces.
 * The first pass gave the slab an 18 m span for 7 m of building and the whole
 * foreground came back as dead grey apron.
 */
const grey = (v) => new THREE.MeshStandardMaterial({ color: v, roughness: 0.92, metalness: 0 });

function box(parent, mat, w, h, d, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

export const ANCHOR = {
  door: new THREE.Vector3(-0.5, PAVE_Y, 1.2),     // shop doorway, kept clear
  display: new THREE.Vector3(-3.3, PAVE_Y, 1.45), // pavement produce display
  kerb: 2.35,                                      // z of the kerb line
};

export function buildBlock(scene) {
  const G = new THREE.Group();
  const deck = grey(0x8e8b87);
  const pave = grey(0xb4b2ad);
  const mass = grey(0xcfcbc3);
  const mass2 = grey(0xbdb9b1);
  const dark = grey(0x6e6b66);

  const hx = SLAB.w / 2, hz = SLAB.d / 2;

  const slab = new THREE.Mesh(new THREE.BoxGeometry(SLAB.w, SLAB.h, SLAB.d), deck);
  slab.position.set(0, -SLAB.h / 2, 0);
  slab.receiveShadow = true;
  G.add(slab);

  // Pavement wraps the two open faces: a band across the front and down the
  // right flank. The kerb lane is the remaining deck at +Z and +X.
  const paveFrontD = hz + ANCHOR.kerb;                 // -hz .. +3.05
  box(G, pave, SLAB.w, PAVE_Y, paveFrontD, 0, 0, -hz + paveFrontD / 2);

  // Corner block: market at ground, STIR studio above. Back-left.
  const bx = -2.4, bz = -1.35, bw = 7.2, bd = 5.0;
  box(G, mass, bw, 3.25, bd, bx, PAVE_Y, bz);              // ground storey
  box(G, mass, bw - 0.3, 3.05, bd - 0.3, bx, PAVE_Y + 3.25, bz); // studio storey
  box(G, dark, bw + 0.3, 0.3, bd + 0.3, bx, PAVE_Y + 6.3, bz);   // cornice

  // Neighbour: attached, runs back along -Z, lower, its own frontage.
  box(G, mass2, 4.4, 4.3, 4.6, bx + bw / 2 + 2.2, PAVE_Y, bz - 0.6);
  box(G, dark, 4.6, 0.26, 4.8, bx + bw / 2 + 2.2, PAVE_Y + 4.3, bz - 0.6);

  // Awning band across the market front, over the +Z face.
  box(G, dark, bw - 0.6, 0.44, 1.6, bx, PAVE_Y + 2.5, bz + bd / 2 + 0.6);

  // Foreground: two crate stacks at the display.
  box(G, mass2, 1.25, 0.56, 0.9, ANCHOR.display.x - 0.7, PAVE_Y, ANCHOR.display.z);
  box(G, mass2, 1.25, 0.48, 0.9, ANCHOR.display.x + 0.65, PAVE_Y, ANCHOR.display.z + 0.15);

  // A-board, mid-ground, leading to the door.
  box(G, mass2, 0.64, 0.98, 0.52, 2.6, PAVE_Y, 1.6);

  // Hand truck, parked clear of the 2 m threshold pocket.
  box(G, dark, 0.48, 1.18, 0.42, 3.4, PAVE_Y, 0.35);

  // Four figure stand-ins at 1.69 m.
  const fig = grey(0x8e8a84);
  ANCHOR.cast = {
    owner: new THREE.Vector3(-2.1, PAVE_Y, 1.9),
    courier: new THREE.Vector3(-0.6, PAVE_Y, 2.0),
    camera: new THREE.Vector3(-4.9, PAVE_Y, 2.15),
    visitor: new THREE.Vector3(1.6, PAVE_Y, 1.8),
  };
  for (const key of Object.keys(ANCHOR.cast)) {
    const p = ANCHOR.cast[key];
    const m = box(G, fig, 0.44, 1.69, 0.3, p.x, PAVE_Y, p.z);
    m.userData.figure = key;
  }

  scene.add(G);
  return G;
}
