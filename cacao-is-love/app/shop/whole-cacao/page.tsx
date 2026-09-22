import type { Metadata } from 'next'
import { Marquee } from '@/components/sections/Marquee'
import { ProductField, ProductImage, Purchase } from '@/components/sections/Product'
import {
  WhatIsCacao,
  Composition,
  Provenance,
  OriginPlates,
  Preparation,
  CoffeeNeighbor,
  WhyPeopleDrink,
} from '@/components/sections/Learn'
import { Nicolas, Poster, TheWait, Faq } from '@/components/sections/Culture'
import { site } from '@/content/site'
import { product, formatPrice } from '@/content/product'

export const metadata: Metadata = {
  title: `${product.descriptor} — ${product.weightGrams} g`,
  description:
    'One ingredient: cacao, grown in Colombia. 250 g of pieces you break apart and melt into a cup.',
  alternates: { canonical: '/shop/whole-cacao/' },
  openGraph: {
    title: `${product.name} — ${product.descriptor}`,
    description: `${product.weightGrams} g · ${formatPrice(product.price)} · Grown in Colombia.`,
    type: 'website',
  },
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
      <Purchase id="pdp-buy" as="h1" />
      <Marquee items={site.marquee} field="ink" />
      <ProductField />
      <TheWait />
      <ProductImage />
      <WhatIsCacao />
      <Composition />
      <Preparation />
      <Provenance />
      <OriginPlates />
      <CoffeeNeighbor />
      <WhyPeopleDrink />
      <Nicolas />
      <Poster />
      <Faq />
      <Purchase id="pdp-final" field="ink" tag="READY WHEN YOU ARE" />
    </>
  )
}
