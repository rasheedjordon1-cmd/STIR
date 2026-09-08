import { photo } from './photography'

/** PREPARATION — removes the "I will never actually use it" objection. */

export const making = {
  eyebrow: 'CHAPTER 07',
  headline: ['THREE STEPS.', 'NO CEREMONY REQUIRED.'],
  lede: 'If you can make a cup of tea, you can make this. There is no correct way and nobody is watching.',
  steps: [
    {
      n: '01',
      title: 'CHOP',
      body: 'Take about 25–30 g off the block — roughly a two-finger piece. Chop it small so it melts evenly.',
      meta: '25–30 G PER CUP',
      plate: 'PL. 03',
      src: photo('chop'),
      alt: '',
    },
    {
      n: '02',
      title: 'MELT',
      body: 'Warm 200 ml of water or milk on low heat. Add the cacao and stir until it goes smooth and glossy. Do not boil it.',
      meta: '200 ML · LOW HEAT',
      plate: 'PL. 04',
      src: photo('melt'),
      alt: '',
    },
    {
      n: '03',
      title: 'MAKE IT YOURS',
      body: 'Honey, cinnamon, salt, oat milk, chilli, nothing at all. This is the part where it stops being our drink and becomes yours.',
      meta: 'NO WRONG ANSWERS',
      plate: 'PL. 07',
      src: photo('cupInHands'),
      alt: '',
    },
  ],
  nicolasWay: {
    label: 'NICOLAS’S WAY',
    body: [
      'Placeholder — Nicolas’s own preparation goes here, in his words. Keep it specific and a little bit particular: the pan he uses, the exact thing he adds, the time of day he drinks it.',
      'Specificity is what makes this section believable. Replace this text before launch.',
    ],
  },
}
