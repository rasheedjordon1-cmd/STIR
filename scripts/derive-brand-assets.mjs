/**
 * Derives SPICEMART brand asset variants from the single supplied logo artwork.
 *
 *   public/brand/spicemart-logo-source.jpg  (authoritative supplied asset)
 *
 * Nothing here redraws, distorts, italicises, outlines or shadows the mark.
 * It only (a) crops to the artwork's own clear-space, and (b) separates the ink
 * from its green ground so the same drawing can sit on light and dark surfaces.
 *
 * Run:  node scripts/derive-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'public/brand/spicemart-logo-source.jpg';
const OUT = 'public/brand';

// Geometry measured from the supplied file (1536x1024).
const SYMBOL = { x: 148, y: 349, w: 193, h: 311 };
const LOCKUP = { x: 148, y: 349, w: 1208, h: 311 };
const PAD = Math.round(SYMBOL.h * 0.25); // clear space = 1/4 symbol height

// Colours sampled from the supplied file.
const GROUND = { r: 0x5d, g: 0xae, b: 0x35 }; // Spicemart Signal Green
const INK = { r: 0x10, g: 0x25, b: 0x15 };    // Forest (matches sampled wordmark ink)
const KNOCKOUT = { r: 0xf7, g: 0xf2, b: 0xe6 }; // Breadfruit, for dark surfaces

const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const GROUND_L = lum(GROUND.r, GROUND.g, GROUND.b);
const INK_L = 28;

const box = (rect, pad = PAD) => ({
  left: rect.x - pad,
  top: rect.y - pad,
  width: rect.w + pad * 2,
  height: rect.h + pad * 2,
});

// The symbol sits 63px from the wordmark, so a centred square crop would clip
// the wordmark's S. Extract the symbol tightly, then extend the canvas instead.
const tight = (r) => ({ left: r.x, top: r.y, width: r.w, height: r.h });
const SQUARE = SYMBOL.h + PAD * 2;
const extendToSquare = (background) => ({
  top: PAD,
  bottom: SQUARE - SYMBOL.h - PAD,
  left: Math.round((SQUARE - SYMBOL.w) / 2),
  right: SQUARE - SYMBOL.w - Math.round((SQUARE - SYMBOL.w) / 2),
  background,
});

/** Separate ink from the green ground into a straight alpha mask. */
async function extract(rect, colour, file, extend) {
  const { data, info } = await sharp(SRC)
    .extract(rect)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 4) {
    const l = lum(data[i], data[i + 1], data[i + 2]);
    const a = Math.max(0, Math.min(1, (GROUND_L - l) / (GROUND_L - INK_L)));
    out[o] = colour.r;
    out[o + 1] = colour.g;
    out[o + 2] = colour.b;
    out[o + 3] = Math.round(a * 255);
  }
  let pipe = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
  if (extend) pipe = pipe.extend(extend);
  const m = await pipe.png().toFile(`${OUT}/${file}`);
  return `${file} ${m.width}x${m.height}`;
}

async function crop(rect, file, extend) {
  let pipe = sharp(SRC).extract(rect);
  if (extend) pipe = pipe.extend(extend);
  const m = await pipe.png().toFile(`${OUT}/${file}`);
  return `${file} ${m.width}x${m.height}`;
}

await mkdir(OUT, { recursive: true });
const made = [
  // As supplied: ink on its own Signal Green ground.
  await crop(box(LOCKUP), 'spicemart-lockup-green.png'),
  await crop(tight(SYMBOL), 'spicemart-symbol-green.png', extendToSquare(GROUND)),
  // Light surfaces: Forest ink, transparent ground.
  await extract(box(LOCKUP), INK, 'spicemart-lockup-ink.png'),
  await extract(tight(SYMBOL), INK, 'spicemart-symbol-ink.png', extendToSquare({ ...INK, alpha: 0 })),
  // Dark surfaces: Breadfruit knockout, transparent ground.
  await extract(box(LOCKUP), KNOCKOUT, 'spicemart-lockup-knockout.png'),
  await extract(tight(SYMBOL), KNOCKOUT, 'spicemart-symbol-knockout.png', extendToSquare({ ...KNOCKOUT, alpha: 0 })),
];
console.log(made.join('\n'));
