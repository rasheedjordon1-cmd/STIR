/* Scene constants. Every number that a reader might want to change lives here
   and is named in DESIGN.md. */
export const SLAB = { w: 12.0, d: 8.0, h: 0.42 };
export const PAVE_Y = 0.16;          // pavement slab above the kerb lane
export const LOOP = 24.0;            // seconds, per the brief's beat table
export const DT = 1 / 40;

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (k) => k * k * (3 - 2 * k);
export const win = (t, t0, dur) => clamp((t - t0) / dur, 0, 1);
export const bell = (t, t0, dur) => {
  const u = win(t, t0, dur);
  return Math.sin(u * Math.PI);
};
/* Deterministic hash. No Math.random anywhere in this scene: a frozen frame
   must reproduce exactly, which is what makes every QA shot evidence. */
export const hash = (n) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};
