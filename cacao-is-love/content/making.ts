/**
 * PREPARATION — removes the "I will never actually use it" objection.
 *
 * ⚠ PRODUCT TRUTH. The photographs show short, broken pieces, not a moulded
 *   block. Every instruction here has to match what is in the bag, so the
 *   old "take 25–30 g off the block — roughly a two-finger piece" is gone.
 *   Quantities are kept because they are existing approved product guidance;
 *   the physical description around them is corrected.
 */

export const making = {
  headline: 'MAKE CACAO.',
  lede: 'If you can make a cup of tea, you can make this. There is no correct way and nobody is watching.',
  steps: [
    {
      n: '01',
      title: 'BREAK',
      body: 'Start with about 25–30 g of cacao. Break or chop the pieces smaller so they melt evenly.',
      meta: '25–30 G PER CUP',
    },
    {
      n: '02',
      title: 'WARM',
      body: 'Warm about 200 ml of water or milk over low heat. Do not let it boil.',
      meta: '200 ML · LOW HEAT',
    },
    {
      n: '03',
      title: 'MIX',
      body: 'Add the cacao and stir until it goes smooth and glossy.',
      meta: 'STIR UNTIL SMOOTH',
    },
    {
      n: '04',
      title: 'MAKE IT YOURS',
      body: 'Honey, cinnamon, salt, oat milk, chilli, or nothing at all. This is the part where it stops being our drink and becomes yours.',
      meta: 'NO WRONG ANSWERS',
    },
  ],
} as const
