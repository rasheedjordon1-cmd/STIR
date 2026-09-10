/**
 * Lifts supplied CIL artwork off its ground onto an alpha channel and snaps the
 * colours to the canonical palette.
 *
 * Two refinements over a naive threshold, both needed in practice:
 *
 * 1. The ground is estimated from the MEDIAN of all border pixels, not the
 *    corner. One delivery had a faint vignette, so a corner sample left a
 *    visible rectangular halo once the art was composited on PAPER CREAM.
 * 2. A dead-zone sits before the alpha ramp, so near-ground pixels go fully
 *    transparent instead of carrying a few percent of alpha across the frame.
 *
 * Edges survive because each pixel is treated as a blend of ground and one flat
 * ink: recover coverage, un-blend to get the ink, classify that, re-emit with
 * the coverage as alpha. Classifying the blended colour directly jags edges.
 *
 *   node scripts/lift-cil-art.mjs
 */
import sharp from 'sharp'
import { statSync } from 'node:fs'

const CIL = { red: [182, 58, 34], green: [35, 92, 54], ink: [23, 19, 15] }
const SRC = { red: [193, 26, 26], green: [42, 102, 54], brown: [74, 42, 24] }
const MAP = { red: CIL.red, green: CIL.green, brown: CIL.ink }

const DEAD = 26 // below this distance from the ground, treat as ground
const RAMP = 66 // width of the antialiasing ramp above the dead-zone

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const smooth = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t) }
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1]

function groundColour(data, width, height, channels) {
  const r = [], g = [], b = []
  const sample = (x, y) => { const i = (y * width + x) * channels; r.push(data[i]); g.push(data[i + 1]); b.push(data[i + 2]) }
  for (let x = 0; x < width; x += 2) { sample(x, 0); sample(x, height - 1) }
  for (let y = 0; y < height; y += 2) { sample(0, y); sample(width - 1, y) }
  return [median(r), median(g), median(b)]
}

export async function lift(srcPath) {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const BG = groundColour(data, width, height, channels)
  const out = Buffer.alloc(width * height * 4)
  for (let p = 0; p < width * height; p++) {
    const i = p * channels, o = p * 4
    const px = [data[i], data[i + 1], data[i + 2]]
    const a = smooth((dist(px, BG) - DEAD) / RAMP)
    if (a <= 0.004) { out[o + 3] = 0; continue }
    const ink = px.map((v, k) => Math.max(0, Math.min(255, (v - (1 - a) * BG[k]) / a)))
    let best = null, bd = Infinity
    for (const [n, ref] of Object.entries(SRC)) { const d = dist(ink, ref); if (d < bd) { bd = d; best = n } }
    const t = MAP[best]
    out[o] = t[0]; out[o + 1] = t[1]; out[o + 2] = t[2]; out[o + 3] = Math.round(a * 255)
  }
  return { buf: out, width, height, ground: BG }
}

export function alphaBox({ buf, width, height }, region) {
  const x0 = region ? region.left : 0
  const x1 = region ? region.left + region.width : width
  let minX = x1, minY = height, maxX = x0 - 1, maxY = -1
  for (let y = 0; y < height; y++) for (let x = x0; x < x1; x++) {
    if (buf[(y * width + x) * 4 + 3] > 16) {
      if (x < minX) minX = x; if (x > maxX) maxX = x
      if (y < minY) minY = y; if (y > maxY) maxY = y
    }
  }
  const pad = 2
  return { left: Math.max(0, minX - pad), top: Math.max(0, minY - pad),
    width: Math.min(width, maxX + pad) - Math.max(0, minX - pad) + 1,
    height: Math.min(height, maxY + pad) - Math.max(0, minY - pad) + 1 }
}

export async function emit(lifted, dest, maxW, region) {
  const box = alphaBox(lifted, region)
  await sharp(lifted.buf, { raw: { width: lifted.width, height: lifted.height, channels: 4 } })
    .extract(box)
    .resize({ width: Math.min(maxW, box.width), withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(dest)
  const m = await sharp(dest).metadata()
  console.log(`  ${dest.split('/').pop().padEnd(27)} ${String(m.width).padStart(4)}x${String(m.height).padStart(4)}  ${(statSync(dest).size / 1024).toFixed(0).padStart(4)}KB  ground rgb(${lifted.ground.join(',')})`)
}

/** Widest fully-empty column run inside the middle of the frame. */
export function gutter(lifted, lo = 0.3, hi = 0.7) {
  const { buf, width, height } = lifted
  const cov = new Array(width).fill(0)
  for (let x = 0; x < width; x++) { let n = 0; for (let y = 0; y < height; y++) if (buf[(y * width + x) * 4 + 3] > 24) n++; cov[x] = n }
  let run = 0, best = 0, end = 0
  for (let x = Math.floor(width * lo); x < Math.floor(width * hi); x++) {
    if (cov[x] === 0) { run++; if (run > best) { best = run; end = x } } else run = 0
  }
  return best ? end - (best >> 1) : width >> 1
}
