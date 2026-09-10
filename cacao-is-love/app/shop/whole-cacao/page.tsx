import type { Metadata } from 'next'
import { Marquee } from '@/components/sections/Marquee'
import { ProductField, ProductImage, Purchase } from '@/components/sections/Product'
import {
  WhatIsCacao,
  Composition,
  Provenance,
  Preparation,
  CoffeeNeighbor,
  WhyPeopleDrink,
} from '@/components/sections/Learn'
import { Nicolas, Poster, FieldNotes, Faq } from '@/components/sections/Culture'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: '100% Whole Cacao — 250 g',
  description:
    'One ingredient. Whole cacao, grown in Colombia. 250 g. Made simply, shared freely.',
}

/**
 * PRODUCT DETAIL PAGE
 *
 * The purchase counter comes first and carries the page's h1. Everything below
 * it is the same education the homepage uses — one source of truth per claim —
 * plus the reference material that does not earn homepage space.
 */
export default function ProductPage() {
  return (
    <>
      <Purchase id="pdp-buy" tag="PL. 03 — THE BAG" as="h1" />
      <Marquee items={site.marquee} field="ink" />
      <ProductField />
      <FieldNotes />
      <ProductImage />
      <WhatIsCacao />
      <Composition />
      <Preparation />
      <Provenance />
      <CoffeeNeighbor />
      <WhyPeopleDrink />
      <Nicolas />
      <Poster />
      <Faq />
      <Purchase id="pdp-final" field="ink" tag="READY WHEN YOU ARE" />
    </>
  )
}
