import { Hero } from '@/components/sections/Hero'
import {
  ProductTruth,
  WhatIsCacao,
  CoffeeNeighbor,
  WhyPeopleDrink,
} from '@/components/sections/Education'
import {
  HowToMake,
  FounderNote,
  Source,
  MakeTwoCups,
  FieldNotes,
} from '@/components/sections/Story'
import { BuyChapter, EmailCapture } from '@/components/sections/Convert'

/**
 * HOMEPAGE — the canonical conversion surface.
 *
 * The order follows the brand thesis: curiosity → question → discovery →
 * person/place → understanding → taste → connection → purchase.
 *
 * Two deliberate departures from a conventional DTC homepage:
 *  1. CACAO / COFFEE sits before the benefits grid. The biggest barrier is not
 *     "is this good for me" but "where does this fit in my day" — coffee is the
 *     slot everyone already has, so give them the slot before the reasons.
 *  2. The first purchase ask arrives at chapter 06, after the education, not in
 *     the hero. The hero invites; the ask is earned.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductTruth />
      <WhatIsCacao />
      <CoffeeNeighbor />
      <WhyPeopleDrink />
      <BuyChapter id="buy" ground="paper" eyebrow="CHAPTER 06" lines={['THE BAG.']} />
      <HowToMake />
      <FounderNote />
      <Source />
      <MakeTwoCups buyHref="#buy" />
      <FieldNotes />
      <BuyChapter
        id="buy-final"
        ground="deep"
        eyebrow="CHAPTER 12"
        lines={['ONE BAG.', 'ABOUT EIGHT CUPS.']}
        withPlate={false}
      />
      <EmailCapture />
    </>
  )
}
