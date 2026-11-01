/**
 * The 64 colours the scene is allowed to resolve to.
 *
 * The kit ships a pool/market palette — skin, water, swimwear — which has no
 * entry anywhere near cream #FAF2E6, cobalt #0451AB or red #F21B16. Snapping
 * STIR's scene to it would quietly repaint the brand. So this is built from
 * the three brand colours plus the two neutrals the architecture needs
 * (pavement stone, window dark), each as a ramp wide enough that flat shading
 * has somewhere to land on every face.
 *
 * Exactly 64 entries: the shader declares vec3[64].
 */
export const PALETTE_HEX = [
  // cream — the building. 10 steps generated from cream's own ratio
  // (250:242:230), so a darker step is dimmer cream and not a browner one.
  '#FFF7EB', '#FAF2E6', '#EFE7DC', '#E2DBD0', '#D6CFC5', '#C8C2B8', '#B8B2A9', '#A6A199', '#928E87', '#7D7973',
  // pavement and warm grey
  '#C6BCAA', '#B4A995', '#A29781', '#90856F',
  '#7E735E', '#6C624F', '#5A5141', '#484034',
  // ink — frames, parapet, contour
  '#2E2820', '#241F1A', '#1E1A15', '#161310', '#100E0C', '#0A0908',
  // red — door and campaign sheet
  '#FF6A5C', '#FA4136', '#F21B16', '#DF1510',
  '#C4120D', '#A50F0A', '#860C07', '#670905',
  // cobalt — the field, and anything catching it
  '#2E86E8', '#1E78DC', '#0F69CD', '#0A5CBC', '#0451AB',
  '#044897', '#053F83', '#05356D', '#042B58', '#031F42',
  // glass: blue-black, not grey. Unlit windows are holes with sky in them.
  '#1B3250', '#152942', '#102036', '#0C192B',
  '#081220', '#0E2238', '#17304A', '#223E5C',
  // cream turned by the blue bounce on shadow faces. These were neutral
  // greys, which is what the lit cream was snapping to; they keep their
  // cool cast relative to the cream ramp but are no longer colourless.
  '#DDD5C7', '#C9C0AF', '#B4AA98', '#9E9583', '#88806F', '#72695B',
  // lit glass, brass, metal
  '#F7E7B8', '#E8D08A', '#D4B36A', '#B99650',
  '#8E9AA3', '#73808A', '#5A666F', '#434E56',
];

if (PALETTE_HEX.length !== 64) {
  throw new Error(`palette must be exactly 64 entries, got ${PALETTE_HEX.length}`);
}

export const PALETTE_RGB = PALETTE_HEX.map((hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
});

/** sRGB 0..1 -> linear 0..1, for the pre-gamma composite in the post pass. */
export function toLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
