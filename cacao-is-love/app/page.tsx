import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { ProductField, ProductImage, Purchase } from '@/components/sections/Product'
import { WhatIsCacao, Composition, Provenance, Preparation } from '@/components/sections/Learn'
import { Nicolas, Poster, FieldNotes, EmailCapture } from '@/components/sections/Culture'
import { site } from '@/content/site'

/**
 * HOMEPAGE
 *
 * The colour rhythm is the storytelling:
 *   CREAM → INK → RED → CREAM → GREEN → CREAM → RED(poster) → CREAM → GREEN
 *
 * Someone makes a cup, someone shares it, a conversation starts — the page is
 * built in that order, and the commerce is never more than one screen away.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} field="ink" />
      <ProductField />
      <ProductImage />
      <WhatIsCacao />
      <Composition />
      <Provenance />
      <Preparation />
      <Nicolas />
      <Poster />
      <Purchase />
      <FieldNotes />
      <EmailCapture />
    </>
  )
}
