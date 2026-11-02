import * as THREE from 'three';
import { buildPerson, setPose } from '../kit/peopleModel-street.js';
import { mixPose } from '../kit/poses.js';
import { flat, lit } from './studio.js';

/**
 * The founder, in the working room.
 *
 * Everything about his appearance comes from the supplied photograph
 * and nothing else: deep brown skin, hair cropped close with a clean
 * line, a full beard, a sage-green crew-neck top. The photograph is a
 * head-and-shoulders frame, so it does not show what he is wearing
 * below the waist — that is kept to a neutral dark rather than
 * invented, and the table covers most of it anyway.
 *
 * The brief asks for a tall figure, so the kit's 1.69 m skeleton is
 * scaled up a tenth against the room's own furniture — a proportion,
 * not a claim about his height, which nothing here knows. The scale
 * goes on the group so the pixel treatment, the palette snap and the
 * ink contour all land on him the same way they land on the walls.
 *
 * The pose is absorbed rather than posed: weight settled, a slight
 * lean in, head down over the proof on the table. The face is a few
 * pixels at this size and is not asked to carry anything; the
 * silhouette and the action do that.
 */

/* The room is a deep recess facing the camera and the exterior key never
   reaches into it — which is why the walls, the table and the lamp are all
   built with lit() rather than flat(). The figure needs the same treatment
   or he renders on ambient alone: measured, a flat sage top came back as
   warm grey and the skin bottomed out on the two darkest steps of its own
   ramp. The emissive term holds each surface near its own colour and lets
   Lambert spread the rest of the ramp across the shaded faces. */
/* Low albedo, high emissive. The warm key (0xfff4e2) still reaches the
   front of this figure even though the room is a recess, and at a normal
   albedo the facets it catches lost their green: measured, the lit band
   across his chest came back #7E735E against #7E8B6C everywhere else —
   the same luminance, 24 points less green. Holding most of the surface
   in the emissive term and leaving the albedo low means the key varies
   the facets without repainting their hue. */
const cloth = (hex, albedo = 0.34, k = 0.82) => new THREE.MeshLambertMaterial({
  color: new THREE.Color(hex).multiplyScalar(albedo),
  emissive: hex,
  emissiveIntensity: k,
  flatShading: true,
});

const SKIN = ['#8B6446', '#6E4B34', '#4F3425', '#352318']
  .map((h) => cloth(parseInt(h.slice(1), 16)));
const SAGE = cloth(0x8E9B7B);
const SAGE_SHADE = cloth(0x76835F);
const NEUTRAL = lit(0x241A12, 0.30);   // not visible in the reference; kept dark and plain

const MATS = {
  cloth: { navy: SAGE, charcoal: NEUTRAL, coral: SAGE_SHADE, rose: SAGE_SHADE },
  skinTones: SKIN,
  hair: [lit(0x241E18, 0.34), lit(0x15110D, 0.34)],
  leather: NEUTRAL,
  steelDark: flat(0x434E56),
  ink: flat(0x161310),
  eye: flat(0x100E0C),
  mouth: lit(0x4F3425, 0.4),
  glass: flat(0x17304A),
  chrome: flat(0x8E9AA3),
  bone: flat(0xEFE7DC),
  paper: flat(0xFAF2E6),
  roseDeep: SAGE_SHADE,
  rust: flat(0xB99650),
  rustLight: flat(0xD4B36A),
};

const TALL = 1.10;

/* He works from the far side of the table, facing back into the room,
   so the table separates him from the floor and the key light reaches
   his face instead of the back of his head. Both poses are built off
   STAND, so what moves is a working posture rather than a performance.

   ABSORBED: head down over the sheets, both hands planted.
   LOOKING:  he straightens and looks across at the monitor, his near
             hand staying on the paper so he is checking one against
             the other rather than simply standing up. */
const ABSORBED = {
  torso: [0.19, 0.03, 0],
  head: [0.20, -0.05, 0],
  shoulderL: [-0.56, 0, -0.26],
  shoulderR: [-0.52, 0, 0.21],
  elbowL: [-0.18, 0, 0],
  elbowR: [-0.24, 0, 0],
  wristL: [0.26, 0, 0],
  wristR: [0.22, 0, 0],
  hipL: [0.06, 0, 0.03],
  hipR: [-0.06, 0, -0.03],
  kneeL: [0.05, 0, 0],
  kneeR: [0.13, 0, 0],
  ankleL: [-0.02, 0, 0],
  ankleR: [-0.07, 0, 0],
};

const LOOKING = {
  torso: [0.05, -0.10, 0],
  head: [-0.04, -0.30, 0],
  shoulderL: [-0.30, 0, -0.18],
  shoulderR: [-0.46, 0, 0.19],
  elbowL: [-0.46, 0, 0],
  elbowR: [-0.22, 0, 0],
  wristL: [0.04, 0, 0],
  wristR: [0.20, 0, 0],
  hipL: [0.02, 0, 0.03],
  hipR: [-0.02, 0, -0.03],
  kneeL: [0.03, 0, 0],
  kneeR: [0.07, 0, 0],
  ankleL: [-0.01, 0, 0],
  ankleR: [-0.04, 0, 0],
};

/* A window that leaves and returns to zero inside the loop, so the
   last frame is the first frame by construction rather than by a
   crossfade. Outside [a, b] it is flat zero; inside it is a raised
   cosine, which has zero slope at both ends — he settles into the
   look and out of it instead of snapping. */
function window01(p, a, b) {
  if (p <= a || p >= b) return 0;
  return 0.5 - 0.5 * Math.cos((2 * Math.PI * (p - a)) / (b - a));
}

export function buildFounder(parent, x, y, z, rotY) {
  const p = buildPerson(MATS, {
    skin: SKIN[0],
    hair: MATS.hair[0],
    top: SAGE,
    bottom: NEUTRAL,
    shoe: NEUTRAL,
    sleeve: 'long',          // the reference is a long-sleeve crew
  });
  const g = p.group;
  g.scale.setScalar(TALL);
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  setFounderPhase(p, 0);

  parent.add(g);
  return p;
}

/**
 * Drive the figure from loop phase (0..1). Three rhythms at different
 * periods, so the result never reads as a metronome:
 *
 *   look     once per loop, inside a window, he straightens and checks
 *            the monitor, then goes back to the paper
 *   sway     one slow weight shift across the whole loop
 *   breathe  three shallow cycles, a couple of hundredths of a radian
 *
 * Every term is a function of phase alone and every one of them is
 * equal at phase 0 and phase 1, so the encoded loop closes exactly.
 */
export function setFounderPhase(person, phase) {
  const p = ((phase % 1) + 1) % 1;
  const look = window01(p, 0.30, 0.62);
  const pose = mixPose(ABSORBED, LOOKING, look);

  const sway = Math.sin(2 * Math.PI * p);
  const breathe = Math.sin(2 * Math.PI * 3 * p);

  /* Weight moves between the legs rather than the whole body sliding:
     a figure that translates is skating, a figure whose hips take
     turns carrying it is standing. */
  pose.hipL[0] += 0.022 * sway;
  pose.hipR[0] -= 0.022 * sway;
  pose.kneeL[0] -= 0.030 * sway;
  pose.kneeR[0] += 0.030 * sway;
  pose.torso[2] += 0.012 * sway;

  pose.torso[0] += 0.016 * breathe;
  pose.shoulderL[2] -= 0.014 * breathe;
  pose.shoulderR[2] += 0.014 * breathe;

  /* The planted hand keeps contact with the paper through the look,
     which is what stops the straighten reading as him walking away. */
  pose.wristR[0] += 0.05 * look;

  setPose(person, pose);
  return { look, sway };
}
