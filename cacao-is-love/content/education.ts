/** EDUCATION — category explanation. Plainspoken, no health claims. */

export const whatIsCacao = {
  headline: 'WHAT ARE YOU ACTUALLY DRINKING?',
  lede:
    'Chocolate starts as a fruit. Cacao is that fruit, before anybody adds sugar to it. That is the whole idea.',
  steps: [
    { n: '01', term: 'CACAO POD',   def: 'A fruit the size of a football, growing straight off the trunk of the tree.' },
    { n: '02', term: 'CACAO BEAN',  def: 'The seeds inside. Fermented and dried on the farm, which is where the flavour is made.' },
    { n: '03', term: 'WHOLE CACAO', def: 'The bean, ground down. Nothing removed, nothing added. It sets into a solid block.' },
    { n: '04', term: 'YOUR CUP',    def: 'Chopped, melted into hot water or milk, and made however you like it.' },
  ],
  footnote: 'Not cocoa powder. Not a chocolate bar. The whole bean, still whole.',
}

export const coffeeNeighbor = {
  headline: ['YOUR COFFEE HAS A NEIGHBOR.'],
  lede: 'We are not asking you to break up with coffee. We drink coffee. This just sits in a different part of the day.',
  rows: [
    { attribute: 'THE LIFT',   coffee: 'Caffeine. Fast up, and a floor to it later.',   cacao: 'Theobromine, with a little caffeine. Slower on, slower off.' },
    { attribute: 'THE TASTE',  coffee: 'Roasted, bitter, bright.',                       cacao: 'Deeply chocolate. Fruity underneath. Not sweet.' },
    { attribute: 'THE MAKING', coffee: 'Grind, brew, pour. Two minutes.',                cacao: 'Chop, melt, stir. Five minutes.' },
    { attribute: 'THE PACE',   coffee: 'Something you drink on the way somewhere.',      cacao: 'Something you sit down for.' },
  ],
  closing: 'Most people we know keep both. One for the morning, one for the part of the day that needs slowing down.',
}

export const whyPeopleDrinkIt = {
  headline: ['WHY PEOPLE DRINK IT.'],
  blocks: [
    { n: '01', title: 'GENTLE ENERGY',        body: 'It lifts, but it does not shove. Most people describe it as steady rather than sharp.' },
    { n: '02', title: 'WHOLE FOOD',           body: 'One ingredient, in the form it came in. Nothing stripped out to make it cheaper.' },
    { n: '03', title: 'DEEPLY CHOCOLATE',     body: 'This is what chocolate tastes like before sugar gets to it. Richer, and a little wilder.' },
    { n: '04', title: 'A REASON TO SIT DOWN', body: 'It takes five minutes to make and it is too good to drink standing up.' },
  ],
  disclaimer:
    'We do not make health claims. Cacao is a food. If you are pregnant, on medication, or sensitive to caffeine, ask someone qualified.',
}

/**
 * COMPOSITION — what is in the bean.
 *
 * ⚠ READ BEFORE CHANGING. Nicolas's original site describes these compounds as
 *   "a gentle, heart-opening stimulant", "for relaxation" and "the bliss
 *   molecule". Those are structure/function claims: they tell a reader what the
 *   product will do to them, which is regulated for food in the US and is also
 *   the exact wellness register the brand brief rules out.
 *
 *   `note` below describes each compound or its name instead — every compound
 *   from his list is kept, nothing is invented, and no effect is promised.
 *   `originalNote` is his wording, verbatim, so it can be restored in one edit
 *   if it clears review. Do not ship `originalNote` without that review.
 */
export const composition = {
  headline: 'WHAT’S IN IT.',
  lede: 'Simply ground cacao beans, with nothing added.',
  rows: [
    {
      compound: 'THEOBROMINE',
      note: 'Cacao’s own stimulant. Slower on than caffeine, and slower off.',
      originalNote: 'A gentle, heart-opening stimulant.',
    },
    {
      compound: 'MAGNESIUM',
      note: 'A mineral cacao is naturally rich in.',
      originalNote: 'For relaxation.',
    },
    {
      compound: 'ANANDAMIDE',
      note: 'Named from ānanda, the Sanskrit for joy.',
      originalNote: 'The “bliss molecule”.',
    },
    {
      compound: 'IRON + ANTIOXIDANTS',
      note: 'Also naturally present in the whole bean.',
      originalNote: 'Iron and antioxidants.',
    },
  ],
  footnote:
    'This is a food, not a supplement. We list what is in the bean and leave the claims to somebody qualified to make them.',
}

export const productTruth = {
  kicker: 'ONE INGREDIENT.',
  headline: 'WHOLE CACAO.',
  lines: ['Nothing added.', 'Nothing taken away.'],
  facts: [
    { label: 'CONTENTS', value: '100% whole cacao' },
    { label: 'ORIGIN',   value: 'Colombia' },
    { label: 'WEIGHT',   value: '250 g' },
  ],
}
