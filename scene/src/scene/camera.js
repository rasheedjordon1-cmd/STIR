import * as THREE from 'three';

/**
 * Locked isometric camera — ORTHOGRAPHIC, not the kit's perspective solve.
 *
 * Adapted from diorama/templates/camera.js @ 077f604 (MIT). The kit locks a
 * 20.5 fov perspective and calls it "near-ortho"; it still converges, so
 * verticals lean and diagonals change slope across the frame. The eBoy
 * reference is strict parallel projection: every vertical stays vertical and
 * every diagonal holds one slope. That is a projection difference, not a
 * lens-length difference, so the camera is orthographic here.
 *
 * Azimuth stays at the kit's 45. Elevation is a knob:
 *   ISO_TRUE = 35.264  true isometric, all three axes foreshortened equally
 *   ISO_2_1  = 26.565  classic pixel isometric, 2 across : 1 down, which is
 *                      what gives clean staircase-free diagonals on a pixel grid
 */
export const ISO_TRUE = Math.atan(1 / Math.SQRT2);   // 35.264 deg
export const ISO_2_1 = Math.atan(0.5);               // 26.565 deg

export const CAMERA = {
  azimuth: (45 * Math.PI) / 180,
  elevation: ISO_2_1,
  target: new THREE.Vector3(0, 0.9, 0),
  fill: 0.92,          // fraction of the half-frame the fit points may occupy
  subjectScale: 1.0,
};

export function cameraDirection(out = new THREE.Vector3()) {
  const ce = Math.cos(CAMERA.elevation);
  return out.set(
    ce * Math.cos(CAMERA.azimuth),
    Math.sin(CAMERA.elevation),
    ce * Math.sin(CAMERA.azimuth)
  );
}

/**
 * Half-extents AND the centre offset needed to contain every fit point.
 *
 * The first version measured extents from CAMERA.target and assumed the
 * content was symmetric about it. It is not — the building sits back-left of
 * the slab centre — so the frame came out pushed up-left with a dead corner.
 * Measure min/max in camera axes and recentre on the midpoint instead.
 */
function solveFrame(aspect, points) {
  const dir = cameraDirection();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
  const up = new THREE.Vector3().crossVectors(dir, right).normalize();
  const p = new THREE.Vector3();
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const fit of points) {
    p.subVectors(fit, CAMERA.target);
    const x = p.dot(right), y = p.dot(up);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  let halfW = ((maxX - minX) / 2) / CAMERA.fill;
  let halfH = ((maxY - minY) / 2) / CAMERA.fill;
  if (halfW / halfH < aspect) halfW = halfH * aspect;
  else halfH = halfW / aspect;
  /* Shift the camera along its own right/up so the content centre lands in
     the middle of the frame. */
  const offset = right.clone().multiplyScalar(cx).add(up.clone().multiplyScalar(cy));
  return { halfW, halfH, offset };
}

export function createCamera(aspect, points) {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
  updateCamera(camera, aspect, points);
  return camera;
}

export function updateCamera(camera, aspect, points) {
  const a = Math.max(0.3, aspect);
  const { halfW, halfH, offset } = solveFrame(a, points);
  const s = Math.max(0.1, CAMERA.subjectScale);
  camera.left = -halfW / s;
  camera.right = halfW / s;
  camera.top = halfH / s;
  camera.bottom = -halfH / s;

  const dir = cameraDirection();
  const look = CAMERA.target.clone().add(offset);
  camera.position.copy(look).addScaledVector(dir, 120);
  camera.lookAt(look);
  camera.near = 0.1;
  camera.far = 400;
  camera.updateProjectionMatrix();

  camera.userData.halfW = halfW;
  camera.userData.halfH = halfH;
  camera.userData.subjectScale = s;
  return camera;
}
