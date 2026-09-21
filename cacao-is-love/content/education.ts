/**
 * EDUCATION — category explanation. Plainspoken, no health claims.
 *
 * ⚠ THE RULE IN THIS FILE: a loose claim is rewritten, never used as a reason
 *   to delete the answer. `composition`, `whyPeopleDrinkIt` and the coffee
 *   comparison were all removed once on claims grounds and all three are back.
 *   A customer asking "why cacao?" deserves an answer; what they do not
 *   deserve is a promise about what it will do to them.
 *
 *   So: naming a compound that is in the bean is composition, and stays.
 *   Telling a reader how that compound will make them feel is a structure/
 *   function claim, and does not. Every line below is on the first side of
 *   that boundary — see the notes on the three that were rewritten.
 *
 * PRODUCT TRUTH: the bag holds short broken pieces. Nothing here says "block"
 * or "whole bean", because the photographs would contradict it.
 */

export const whatIsCacao = {
  headline: 'WHAT ARE YOU ACTUALLY DRINKING?',
  lede:
    'Chocolate starts as a fruit. Cacao is that fruit, before anybody adds sugar to it. That is the whole idea.',
  steps: [
    { n: '01', term: 'CACAO POD',  def: 'A fruit the size of a football, growing straight off the trunk of the tree.' },
    { n: '02', term: 'CACAO BEAN', def: 'The seeds inside. Fermented and dried on the farm, which is where the flavour is made.' },
    { n: '03', term: 'THE PIECES', def: 'The beans, ground and set. Nothing removed, nothing added. They come as pieces you break apart.' },
    { n: '04', term: 'YOUR CUP',   def: 'Broken small, melted into hot water or milk, and made however you like it.' },
  ],
  footnote: 'Not cocoa powder. Not a chocolate bar. Just cacao.',
}

export const coffeeNeighbor = {
  headline: ['YOUR COFFEE HAS A NEIGHBOR.'],
  lede:
    'We are not asking you to break up with coffee. We drink coffee. This just sits in a different part of the day.',
  rows: [
    /* Restored. The original read "Theobromine, with a little caffeine. Slower
       on, slower off" — the second sentence describes an effect on the body,
       so it is gone and the compounds stay. */
    { attribute: 'THE LIFT',   coffee: 'Caffeine.',                                 cacao: 'Theobromine, and a little caffeine.' },
    { attribute: 'THE TASTE',  coffee: 'Roasted, bitter, bright.',                  cacao: 'Deeply chocolate. Fruity underneath. Not sweet.' },
    { attribute: 'THE MAKING', coffee: 'Grind, brew, pour. Two minutes.',           cacao: 'Break, melt, stir. Five minutes.' },
    { attribute: 'THE PACE',   coffee: 'Something you drink on the way somewhere.', cacao: 'Something you sit down for.' },
  ],
  closing:
    'Most people we know keep both. One for the morning, one for the part of the day that needs slowing down.',
}

/**
 * WHY PEOPLE DRINK IT — purchase justification and differentiation.
 *
 * Restored whole. Only block 01 changed: it was "GENTLE ENERGY — It lifts, but
 * it does not shove. Most people describe it as steady rather than sharp",
 * which is a structure/function claim wearing a hedge. The other three are
 * taste, form and behaviour, which are observable and stay exactly as written.
 */
export const whyPeopleDrinkIt = {
  headline: ['WHY PEOPLE DRINK IT.'],
  blocks: [
    { n: '01', title: 'ONE THING, WHOLE',     body: 'Cacao, and nothing else in the bag. No sugar, no milk powder, no filler.' },
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
 * ⚠ READ BEFORE CHANGING. Nicolas's original site described these compounds as
 *   "a gentle, heart-opening stimulant", "for relaxation" and "the bliss
 *   molecule". Those tell a reader what the product will do to them, which is
 *   regulated for food in the US and is the wellness register the brand rules
 *   out.
 *
 *   `note` describes each compound or its name instead. Every compound from
 *   his list is kept, nothing is invented, and no effect is promised.
 *   `originalNote` is his wording, verbatim, so it can be restored in one edit
 *   if it clears review. Do not ship `originalNote` without that review.
 *
 *   THEOBROMINE's note used to end "Slower on than caffeine, and slower off."
 *   That is the same claim in quieter clothes, so it now says what the
 *   compound is and stops.
 */
export const composition = {
  headline: 'WHAT’S IN IT.',
  lede: 'Simply ground cacao beans, with nothing added.',
  rows: [
    {
      compound: 'THEOBROMINE',
      note: 'Cacao’s own stimulant, and the one it has most of.',
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
      note: 'Also naturally present in the bean.',
      originalNote: 'Iron and antioxidants.',
    },
  ],
  footnote:
    'This is a food, not a supplement. We list what is in the bean and leave the claims to somebody qualified to make them.',
}

/**
 * CH. 01 — the red poster.
 *
 * ⚠ THE SPEC TABLE IS GONE. This chapter used to restate CONTENTS / GROWN /
 *   WEIGHT / PRICE directly under the headline — four facts the visitor had
 *   already read in the hero, and would read again in the buy module. On a
 *   phone it ate a whole viewport to say nothing new.
 *
 *   The chapter's job is not to list the SKU. It is to answer why the
 *   simplicity is interesting. So the space now goes to the negative space and
 *   the four verbs, and the two facts worth repeating sit as one quiet line.
 *
 * ⚠ CLAIM CHECK. "NO SUGAR / NO MILK POWDER / NO FLAVORING" is not used.
 *   product.ingredients is ['Cacao'], which supports "nothing added" — it does
 *   not independently confirm an absence list, and an absence list is the kind
 *   of claim a label has to back. NOTHING ADDED. JUST CACAO. says the same
 *   thing and is supported by the ingredient statement itself.
 */
export const productTruth = {
  kicker: 'ONE INGREDIENT.',
  headline: '100% CACAO.',
  lines: ['Nothing added.', 'Just cacao.'],
  /* The four verbs. This is the product's whole method, and it is short enough
     to be the point rather than an instruction. */
  verbs: ['BREAK IT.', 'MELT IT.', 'STIR IT.', 'SHARE IT.'],
  foot: '250 G · GROWN IN COLOMBIA',
}
