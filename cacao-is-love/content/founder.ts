/**
 * FOUNDER NOTE — first person, no "MEET OUR FOUNDER".
 *
 * These are Nicolas's own words and they stay in his voice. The section works
 * because it is testimony, not product copy: "opens creativity, deepens
 * empathy" read as a brand fact would be a structure/function claim, and read
 * as a named founder describing his own experience it is a different thing
 * entirely. Keep it in the note; keep it out of the product copy.
 *
 * ⚠ ONE CLAUSE WAS CUT, AND IT IS THE ONLY EDIT TO HIS WORDS. The second
 *   paragraph ended "...experience the gentle magic that indigenous cultures
 *   have honored for thousands of years." First person does not cover invoking
 *   Indigenous cultures as brand atmosphere, and the sentence carries its
 *   meaning without it. Flagged for his approval — SHOULD CONFIRM.
 */

export const founder = {
  name: 'Nicolas Nuvan',
  role: 'Founder',
  portrait: {
    plate: 'NICOLAS',
    caption: 'At the trees',
    photo: 'founderNicolas',
  },
  /**
   * ⚠ HELD OUT OF THE RENDER, NOT DELETED. The section now runs headline →
   *   quote → name, and the photograph carries the rest. Two things followed
   *   from cutting these paragraphs, and both are improvements:
   *
   *   · "opens creativity, deepens empathy" was the site's last remaining
   *     effect language. It survived on the grounds that first-person
   *     testimony is not a brand claim — a defensible position, but a thinner
   *     one than simply not saying it.
   *   · The Indigenous-cultures clause question is moot while nothing here
   *     renders. It still needs Nicolas's decision before any of this returns.
   *
   *   The words are kept verbatim so restoring them is one line in Culture.tsx.
   */
  note: [
    'I’ve learned that cacao opens creativity, deepens empathy, and connects us to something ancient and beautiful.',
    'This is a gift — it’s an invitation to slow down, connect with yourself, and share something good with the people around you.',
  ],
  /** His closing line, used as the pull quote. */
  quote: 'I’m sharing this with you because good things are meant to be shared, especially among neighbors.',
  signoff: '— Nicolas',
} as const
