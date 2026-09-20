/**
 * FOUNDER NOTE — first person, no "MEET OUR FOUNDER".
 *
 * ⚠ WHAT WAS REMOVED, AND WHY.
 *   Nicolas's original site said cacao "opens creativity, deepens empathy, and
 *   connects us to something ancient and beautiful", and described "the gentle
 *   magic that indigenous cultures have honored for thousands of years".
 *
 *   The first is a structure/function claim: it tells a reader what the product
 *   will do to them, which is regulated for food in the US. The second invokes
 *   Indigenous cultures as atmosphere. Neither belongs on a product page, and
 *   putting them in a founder's mouth does not make them safer — it makes them
 *   harder to spot.
 *
 *   His closing line is kept verbatim and attributed, because it is a personal
 *   statement about sharing rather than a claim about what cacao does.
 */

export const founder = {
  name: 'Nicolas Nuvan',
  role: 'Founder',
  portrait: {
    plate: 'PL. 07',
    caption: 'Nicolas, at the trees',
    photo: 'founderNicolas',
  },
  /** Verbatim, and presented as his words. Never restated as a brand fact. */
  quote: 'Good things are meant to be shared, especially among neighbors.',
  /** Supporting copy. States the brand's premise; invents no biography. */
  note: [
    'Cacao Is Love started with a simple idea: when you find something good, you share it.',
    'The cacao comes from Colombia. It arrives as pieces you break apart, and it is meant for a cup you make for somebody else as often as you make it for yourself.',
  ],
  signoff: '— Nicolas',
} as const
