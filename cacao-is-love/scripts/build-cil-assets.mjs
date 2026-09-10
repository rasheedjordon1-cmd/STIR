/** Regenerates every lifted CIL illustration from the supplied source art. */
import { lift, emit, gutter } from './lift-cil-art.mjs'

const U = process.env.CIL_SRC || '/root/.claude/uploads/fa35ff4d-10f9-58c7-89f5-ed8bbed50bae'
const src = (id) => `${U}/${id}-image.png`

const SINGLES = [
  ['provenance-hand-pod',    'ca065129', 900],
  ['curiosity-tell-me-more', '40f26d47', 900],
  ['prep-break',             'f45deeb0', 820],
  ['micro-curious-finger',   '5b56697e', 300],
  ['micro-split-pod-half',   '8e279749', 420],
  ['micro-double-steam',     'b475fb49', 420],
]

console.log('CIL artwork:')
for (const [name, id, maxW] of SINGLES) {
  await emit(await lift(src(id)), `public/cil/${name}.webp`, maxW)
}

// EDU 001 ships as one plate holding both panels; split on the widest gutter.
const edu = await lift(src('f9ed6e30'))
const x = gutter(edu)
await emit(edu, 'public/cil/edu-whole-cacao.webp', 760, { left: 0, top: 0, width: x, height: edu.height })
await emit(edu, 'public/cil/edu-cocoa-powder.webp', 760, { left: x, top: 0, width: edu.width - x, height: edu.height })
