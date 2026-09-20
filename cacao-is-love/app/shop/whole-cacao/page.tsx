import type { Metadata } from 'next'
import { Marquee } from '@/components/sections/Marquee'
import { ProductField, TheCounter, Purchase } from '@/components/sections/Product'
import {
  WhatIsCacao,
  Provenance,
  OriginPlates,
  Preparation,
  CoffeeNeighbor,
} from '@/components/sections/Learn'
import { Nicolas, Poster, Faq } from '@/components/sections/Culture'
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
 * is the same education the homepage uses — one source of truth per claim —
 * plus the coffee comparison, which does not earn homepage space.
 */
export default function ProductPage() {
  return (
    <>
      <Purchase id="pdp-buy" tag="PL. 03 — THE BAG" as="h1" />
      <Marquee items={site.marquee} field="ink" />
      <ProductField />
      <TheCounter />
      <WhatIsCacao />
      <Preparation />
      <Provenance />
      <OriginPlates />
      <CoffeeNeighbor />
      <Nicolas />
      <Poster />
      <Faq />
      <Purchase id="pdp-final" field="ink" tag="READY WHEN YOU ARE" />
    </>
  )
}
