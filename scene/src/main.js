import * as THREE from 'three';
import { createCamera, updateCamera, CAMERA, ISO_TRUE, ISO_2_1 } from './scene/camera.js';
import { buildStudio, buildSheet, B, SHEET } from './scene/studio.js';
import { PixelPost } from './kit/post.js';

const COBALT = 0x0451ab;
const LOOP = 14.0;            // brief: a quiet 12-16 s seamless loop

/* ── Fit points ──────────────────────────────────────────────────────
   The pavement pad, the building's top, and the sheet's own corners taken
   through the same screen-plane basis the geometry uses. The sheet is most of
   the frame, so it drives the fit; an axis-aligned guess misses it. */
const FIT = [
  new THREE.Vector3(-4.1, 0, -2.8), new THREE.Vector3(4.1, 0, -2.8),
  new THREE.Vector3(-4.1, 0, 3.8), new THREE.Vector3(4.1, 0, 3.8),
  new THREE.Vector3(-2.3, B.roof + B.parapet + 1.35, -0.9),   // antenna tip
  new THREE.Vector3(2.3, B.roof + B.parapet, 1.7),
];
/* Phone is a reframe, not a shrink: it carries the building and the near
   two-thirds of the sheet at a readable scale, and lets the far end run off
   the edge into the page's own cobalt, which is the same colour. Shrinking
   the desktop fit put the whole composition at thumbnail size. */
const PHONE = new URLSearchParams(location.search).get('frame') === 'phone';
{
  const R = new THREE.Vector3(0.7071, 0, -0.7071);
  const U = new THREE.Vector3(-0.3162, 0.8944, -0.3162);
  const sm = (k) => k * k * (3 - 2 * k);
  /* 0.58 dropped the far third, which was fine when the sheet was blank —
     but the sheet now carries the wordmark at a = 0.45..0.87, and that crop
     cut it to "STI". The phone reframe is vertical now: the same sheet,
     a tighter frame around it. */
  const far = PHONE ? 0.92 : 1.0;
  for (const a of [0.0, far * 0.5, far]) {
    const halfH = SHEET.h0 + (SHEET.h1 - SHEET.h0) * sm(a);
    const lift = SHEET.rise * Math.pow(a, 1.25);
    for (const b of [-1, 1]) {
      FIT.push(SHEET.origin.clone()
        .addScaledVector(R, a * SHEET.len)
        .addScaledVector(U, lift + b * halfH));
    }
  }
}

const canvas = document.getElementById('view');
/* alpha: true is load-bearing. The post pass needs coverage in the alpha
   channel to find the silhouette, fragment its rim and composite the
   diorama onto the cobalt field. With an opaque buffer every pixel reads
   as covered and the cut-out edge disappears. */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
/* Null, not cobalt: the surround is painted by the post pass, after the
   palette snap, so the field is one of the 64 and the fragmented rim can
   write into it. A background set here would be quantised separately and
   band against the page. */
scene.background = null;

/* THE PIXEL PRESENTATION. Everything that makes this a diorama rather than a
   low-poly render happens here: palette snap, ink contour, ordered dither and
   a fragmented silhouette. One target pixel per CSS pixel, which is the kit's
   own ratio — on a 2x display the browser then shows each diorama pixel as a
   crisp 2x2 block, so the art is chunky where it is actually looked at. */
const post = new PixelPost(renderer, 1600, 1, [0.0157, 0.3176, 0.6706]);

const elevParam = new URLSearchParams(location.search).get('elev');
if (elevParam === 'iso') CAMERA.elevation = ISO_TRUE;
if (elevParam === '2:1') CAMERA.elevation = ISO_2_1;
const camera = createCamera(1.6, FIT);

/* Flat tone steps: a strong hemisphere for the ambient step, one key, one
   low fill. A hard key alone crushes the shadow faces to mud. */
/* The bounce colour was a cold blue-grey, which is what turned the cream
   walls to concrete in the first render: every shadow face was lifted by a
   light with no warmth in it. The ground term is the pavement's own colour
   now, so cream in shade stays cream. */
scene.add(new THREE.HemisphereLight(0xd6e6f5, 0x6e6250, 0.56));
/* 1.55 drove the lit faces of the cream past the point where 8% of warmth
   survives, so the palette's nearest entry was a neutral and the building
   came back as concrete. Lower key, saturation restored in the grade. */
const sun = new THREE.DirectionalLight(0xfff4e2, 1.18);
sun.position.set(-13, 18, 15);
sun.target.position.set(0, 1.5, 0);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const sc = sun.shadow.camera;
sc.left = -12; sc.right = 12; sc.top = 14; sc.bottom = -8;
sc.near = 4; sc.far = 70;
sun.shadow.bias = -0.00022;
sc.updateProjectionMatrix();
scene.add(sun, sun.target);
/* A fill from the lens side. The sheet's face points at the camera, so the
   key alone leaves it a muddy dark red wherever the billow tilts away; this
   keeps the red reading as red and the cream graphic reading as cream. */
const fill = new THREE.DirectionalLight(0xdce8f5, 0.62);
fill.position.set(19, 13, 19);
fill.target.position.set(2, 3, 0);
scene.add(fill, fill.target);

const studio = buildStudio(scene);
const sheet = buildSheet(scene);

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (w < 2 || h < 2) return;
  post.setSize(w, h);          /* sets the renderer size itself */
  updateCamera(camera, w / h, FIT);
}

function draw(t) {
  resize();
  /* One travelling wave, phase wrapping 0..1 over the loop, so the final
     frame and the first frame are the same geometry by construction rather
     than by a crossfade. */
  sheet.userData.setPhase((t / LOOP) % 1);
  post.render(scene, camera);
}

const params = new URLSearchParams(location.search);
let frozen = params.has('t') ? parseFloat(params.get('t')) : null;
const t0 = performance.now();

function frame() {
  draw(frozen ?? ((performance.now() - t0) / 1000) % LOOP);
  requestAnimationFrame(frame);
}
addEventListener('resize', resize, { passive: true });
frame();

window.__diorama = {
  THREE, scene, camera, renderer, post, studio, sheet, LOOP,
  freeze(t) { frozen = t; draw(t); },
  play() { frozen = null; },
};
window.__dioramaReady = true;
