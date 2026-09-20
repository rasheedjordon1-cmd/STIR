/**
 * BUILD PHOTOS — responsive variants for a static export.
 *
 * The site ships with `images: { unoptimized: true }` because it is a static
 * export, so next/image will NOT resize anything: whatever file we reference is
 * the file a phone downloads. Before this script that meant a 1536px, 218KB
 * hero on a 390px screen.
 *
 * So the variants are generated here, at build time, and <Photo> emits a real
 * srcset over them. Three widths is the right number: 640 covers phones at 1x
 * and small phones at 2x, 1024 covers tablets and phones at 2x, 1600 covers
 * desktop. Beyond that the grain starts costing more bytes than it returns.
 *
 * QUALITY NOTE: the brief is explicit that grain must not turn to compression
 * mush. webp q=82 with `effort: 6` holds the Kodak-Gold grain; q=75 visibly
 * smears it in the cup highlights. Do not lower this to save a few KB.
 *
 *   node scripts/build-photos.mjs <source-dir>
 */
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync, statSync, rmSync } from 'node:fs'
import path from 'node:path'

const WIDTHS = [640, 1024, 1600]
const OUT = 'public/photo'
const SRC = process.argv[2]

/* Source file -> semantic name. The narrative role is the filename, so a
   component never references "3.jpg" and nobody has to remember which is which. */
const MAP = {
  '1.jpg': 'break-kitchen',
  '2.jpg': 'counter-green',
  '3.jpg': 'wait-two-cups',
  '5.jpg': 'pack-studio',
}
const POSTER = { '4.jpg': ['public/poster', 'one-more-cup'] }

mkdirSync(OUT, { recursive: true })

async function emit(file, dir, name) {
  const img = sharp(file)
  const { width, height } = await img.metadata()
  const rows = []
  for (const w of WIDTHS) {
    if (w > width) continue
    const dest = path.join(dir, `${name}-${w}.webp`)
    await sharp(file).resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 }).toFile(dest)
    rows.push(`${w}w ${(statSync(dest).size / 1024).toFixed(0)}KB`)
  }
  console.log(`${name.padEnd(20)} ${width}x${height}  ${rows.join('  ')}`)
  return { width, height }
}

/* New sources replace same-named originals, so clear those FIRST — otherwise
   the re-emit pass below reads the stale original back over the new variants,
   which is exactly what happened the first time this ran. */
if (SRC) {
  for (const name of Object.values(MAP)) {
    const stale = path.join(OUT, `${name}.webp`)
    if (existsSync(stale)) rmSync(stale)
  }
  for (const [f, name] of Object.entries(MAP)) {
    const p = path.join(SRC, f)
    if (existsSync(p)) await emit(p, OUT, name)
  }
  for (const [f, [dir, name]] of Object.entries(POSTER)) {
    const p = path.join(SRC, f)
    if (existsSync(p)) { mkdirSync(dir, { recursive: true }); await emit(p, dir, name) }
  }
}

/* Re-emit the photographs that were already in the repo at a single size,
   then retire the originals: every reference goes through <Photo>, which only
   ever asks for a variant, so shipping the unsized file again is dead weight. */
for (const f of readdirSync(OUT)) {
  if (!/\.webp$/.test(f) || /-\d+\.webp$/.test(f)) continue
  await emit(path.join(OUT, f), OUT, f.replace(/\.webp$/, ''))
  rmSync(path.join(OUT, f))
}
for (const f of readdirSync('public/poster')) {
  if (!/\.webp$/.test(f) || /-\d+\.webp$/.test(f)) continue
  rmSync(path.join('public/poster', f))
}
