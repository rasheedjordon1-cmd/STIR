import type { Metadata } from 'next'
import { product } from '@/content/product'
import { Section, Chapter } from '@/components/ui/Section'
import { SpecimenRail } from '@/components/ui/SpecimenRail'
import { ProductGallery } from '@/components/sections/Gallery'
import { BuyModule } from '@/components/commerce/BuyModule'
import {
  ProductTruth,
  WhatIsCacao,
  CoffeeNeighbor,
  WhyPeopleDrink,
} from '@/components/sections/Education'
import { HowToMake, FounderNote, Source, FieldNotes } from '@/components/sections/Story'
import { BuyChapter, Faq } from '@/components/sections/Convert'
import { origin } from '@/content/origin'
import s from '@/components/sections/sections.module.css'

export const metadata: Metadata = {
  title: '100% Whole Cacao — 250 g',
  description:
    'One ingredient. Whole cacao from Colombia, 250 g. Nothing added, nothing taken away.',
}

/**
 * PRODUCT DETAIL PAGE — the deep cut.
 *
 * It reuses the homepage's education components rather than re-authoring them,
 * so there is one source of truth for every claim. What is unique to this page
 * is the top: a gallery that teaches, the full origin record, the spec table,
 * and the FAQ that closes out remaining objections.
 */
export default function ProductPage() {
  return (
    <>
      <Section ground="paper" tight>
        <Chapter
          rail={
            <SpecimenRail
              title="RECORD"
              entries={[
                { label: 'PRODUCT', value: product.descriptor },
                { label: 'NET WEIGHT', value: `${product.weightGrams} g` },
                { label: 'INGREDIENTS', value: product.ingredients.join(', ') },
                { label: 'ORIGIN', value: product.originCountry },
                /* The rest of the origin record is deliberately unfilled until
                   confirmed — a blank line is honest, a guess is not. */
                ...origin.records.filter((r) => r.label !== 'COUNTRY'),
              ]}
            />
          }
        >
          <div className={s.buyGrid}>
            <ProductGallery />
            <div style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)' }}>
              <BuyModule id="pdp-buy" as="h1" />
            </div>
          </div>
        </Chapter>
      </Section>

      <ProductTruth />
      <WhatIsCacao />
      <HowToMake />
      <WhyPeopleDrink />
      <CoffeeNeighbor />
      <Source />
      <FounderNote />
      <FieldNotes />
      <Faq />
      <BuyChapter
        id="pdp-final"
        ground="deep"
        eyebrow="CHAPTER 12"
        lines={['READY WHEN', 'YOU ARE.']}
      />
    </>
  )
}
