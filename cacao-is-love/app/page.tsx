import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { ProductField, TheCounter, Purchase } from '@/components/sections/Product'
import { WhatIsCacao, Provenance, OriginPlates, Preparation } from '@/components/sections/Learn'
import { Nicolas, Poster, TheWait, EmailCapture, Faq } from '@/components/sections/Culture'
import { site } from '@/content/site'

/**
 * HOMEPAGE — an editorial-commerce narrative, not four database categories
 * stacked on each other.
 *
 * The order is an argument:
 *   what it is → what is in it → where it is from → what you do with it →
 *   a poster in the face → who it is for → why it exists → buy it
 *
 * The colour rhythm carries the pacing:
 *   CREAM · INK · CREAM · GREEN · INK · CREAM · RED · CREAM · CREAM · INK
 *
 * Commerce never sits more than one screen away: the hero CTA, the counter's
 * add-to-bag and the sticky bar all reach it long before the buy module.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={site.marquee} field="ink" />
      <ProductField />
      <TheCounter />
      <WhatIsCacao />
      <Provenance />
      <OriginPlates />
      <Preparation />
      <Poster />
      <TheWait />
      <Nicolas />
      <Purchase />
      <Faq />
      <EmailCapture />
    </>
  )
}
