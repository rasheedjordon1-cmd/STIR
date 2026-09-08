/**
 * NOTES FROM THE NEIGHBORHOOD — human social proof.
 *
 * ⚠⚠ SAMPLE DATA. These are structural placeholders, NOT real customers.
 *    Publishing invented testimonials is a legal and trust problem.
 *    Replace every entry below with a real, permissioned quote before launch,
 *    and delete any entry still marked `placeholder: true`.
 */

export interface FieldNote {
  id: string
  name: string
  location: string
  quote: string
  theirCup: string[]
  placeholder: boolean
}

export const makeTwo = {
  eyebrow: 'CHAPTER 10',
  headline: ['MAKE TWO CUPS.'],
  lines: ['One for you.', 'One for somebody else.'],
  body:
    'The second cup is the whole point. It is the difference between a thing you consume and a thing you share. Buy two bags and the second one has somebody’s name on it.',
}

export const fieldNotes: FieldNote[] = [
  {
    id: 'fn1',
    name: 'AMIR + JUNE',
    location: 'JACKSON HEIGHTS, NY',
    quote: 'Placeholder quote — replace with a real, permissioned customer note.',
    theirCup: ['oat milk', 'cinnamon', 'honey'],
    placeholder: true,
  },
  {
    id: 'fn2',
    name: 'NAME',
    location: 'CITY, STATE',
    quote: 'Placeholder quote — replace with a real, permissioned customer note.',
    theirCup: ['—', '—'],
    placeholder: true,
  },
  {
    id: 'fn3',
    name: 'NAME',
    location: 'CITY, STATE',
    quote: 'Placeholder quote — replace with a real, permissioned customer note.',
    theirCup: ['—', '—'],
    placeholder: true,
  },
]
