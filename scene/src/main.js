import * as THREE from 'three';
import { createCamera, updateCamera, CAMERA, ISO_TRUE, ISO_2_1 } from './scene/camera.js';
import { SLAB } from './config.js';
import { buildBlock } from './scene/block.js';

/* Fit points: slab corners top and bottom, plus the tallest mass, so the
   framing holds at every aspect. */
const H = { x: SLAB.w / 2, z: SLAB.d / 2 };
const FIT = [];
for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  FIT.push(new THREE.Vector3(sx * H.x, 0, sz * H.z));
  FIT.push(new THREE.Vector3(sx * H.x, -SLAB.h, sz * H.z));
}
FIT.push(new THREE.Vector3(-2.4, 6.75, -1.35)); // corner block cornice top

const COBALT = 0x0451ab;

const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
/* The brief puts the scene in a cobalt page, so the surround is cobalt from
   the first render. Testing outlines and the pavement edge against white and
   switching to blue at the end is not the art direction. */
scene.background = new THREE.Color(COBALT);

/* ?elev=iso|2:1 switches the projection elevation for the A/B. */
const elevParam = new URLSearchParams(location.search).get('elev');
if (elevParam === 'iso') CAMERA.elevation = ISO_TRUE;
if (elevParam === '2:1') CAMERA.elevation = ISO_2_1;
const camera = createCamera(1.6, FIT);

/* Daylight rig from the kit's numbers; the palette pass comes later. */
const hemi = new THREE.HemisphereLight(0xcfe3f2, 0x4a5a6b, 0.52);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff8ee, 1.55);
sun.position.set(-15, 19.5, 17);
sun.target.position.set(0, -0.4, 0);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera;
sc.left = -13; sc.right = 13; sc.top = 13; sc.bottom = -13;
sc.near = 4; sc.far = 70;
sun.shadow.bias = -0.00022;
sc.updateProjectionMatrix();
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight(0xbcd0e8, 0.22);
fill.position.set(14, 9, -10);
scene.add(fill);

const block = buildBlock(scene);

/* The slab is a window: four world clip planes on its edges. */
const CLIP = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), H.x + 0.05),
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), H.x + 0.05),
  new THREE.Plane(new THREE.Vector3(0, 0, 1), H.z + 0.05),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), H.z + 0.05),
];

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (w < 2 || h < 2) return;
  renderer.setSize(w, h, false);
  updateCamera(camera, w / h, FIT);
}

function draw(t) {
  resize();
  renderer.clippingPlanes = CLIP;
  renderer.render(scene, camera);
  renderer.clippingPlanes = [];
}

const params = new URLSearchParams(location.search);
let frozen = params.has('t') ? parseFloat(params.get('t')) : null;
const t0 = performance.now();

function frame() {
  draw(frozen ?? ((performance.now() - t0) / 1000) % 24);
  requestAnimationFrame(frame);
}
addEventListener('resize', resize, { passive: true });
frame();

window.__diorama = {
  THREE, scene, camera, renderer, block, CLIP,
  freeze(t) { frozen = t; draw(t); },
  play() { frozen = null; },
};
window.__dioramaReady = true;
