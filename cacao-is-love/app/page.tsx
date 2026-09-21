import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { ProductField, ProductImage, Purchase } from '@/components/sections/Product'
import {
  WhatIsCacao,
  Composition,
  Provenance,
  OriginPlates,
  Preparation,
} from '@/components/sections/Learn'
import { Nicolas, Poster, TheWait, EmailCapture } from '@/components/sections/Culture'
import { site } from '@/content/site'

/**
 * HOMEPAGE
 *
 * The colour rhythm is the storytelling:
 *   CREAM → INK → RED → CREAM → GREEN → CREAM → RED(poster) → CREAM → GREEN
 *
 * Someone makes a cup, someone shares it, a conversation starts — the page is
 * built in that order, and the commerce is never more than one screen away.
 *
 * The sequence is the original one. THE WAIT occupies the slot the placeholder
 * testimonials held; nothing else moved.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} field="ink" />
      {/* The photograph comes before the chapter. A visitor should meet the
          real object before they are told anything about it — CH. 01's job is
          to make the simplicity interesting, which only lands once they have
          seen what they are being asked to buy. */}
      <ProductImage />
      <ProductField />
      <WhatIsCacao />
      <Composition />
      <Provenance />
      <OriginPlates />
      <Preparation />
      <Nicolas />
      <Poster />
      <Purchase />
      <TheWait />
      <EmailCapture />
    </>
  )
}
