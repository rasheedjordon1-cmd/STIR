/**
 * FOUNDER NOTE — first person, no "MEET OUR FOUNDER".
 *
 * These are Nicolas's own words, carried close to verbatim from his original
 * site. They are deliberately NOT rewritten: the section works because it is
 * testimony in his voice, and the typography does the elevating.
 *
 * Note the register. In brand voice, "gentle magic" and "something ancient and
 * beautiful" would land in the ceremonial-wellness lane the brief rules out.
 * In a named founder's first person they read as personal experience, which is
 * a different claim entirely. Keep them in the note; keep them out of the
 * product copy.
 */

import { photo } from './photography'

export const founder = {
  name: 'Nicolas Nuvan',
  role: 'Founder',
  /* Interim image only — a stand-in kitchen scene, never presented as Nicolas.
     Replace with a real photograph of him before launch. */
  portrait: {
    plate: 'PL. 11',
    caption: 'Portrait pending',
    src: photo('kitchen'),
    alt: 'A kitchen counter with cacao being poured into a mug.',
  },
  note: [
    'I’ve learned that cacao opens creativity, deepens empathy, and connects us to something ancient and beautiful.',
    'This is a gift — it’s an invitation to slow down, connect with yourself, and experience the gentle magic that indigenous cultures have honored for thousands of years.',
  ],
  /** His closing line, used as the pull quote. */
  quote: 'I’m sharing this with you because good things are meant to be shared, especially among neighbors.',
  signoff: '— Nicolas',
}
