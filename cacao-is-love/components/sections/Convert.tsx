'use client'

import { useState } from 'react'
import { site } from '@/content/site'
import { product } from '@/content/product'
import { faq } from '@/content/faq'
import { Section } from '@/components/ui/Section'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { Plate } from '@/components/ui/Plate'
import { Button } from '@/components/ui/Button'
import { BuyModule } from '@/components/commerce/BuyModule'
import s from './sections.module.css'

/* -------- 06 / 12 · BUY CHAPTER ----------------------------------------- */
export function BuyChapter({
  id = 'buy',
  ground = 'paper',
  eyebrow = 'CHAPTER 06',
  lines = ['THE BAG.'],
  withPlate = true,
}: {
  id?: string
  ground?: 'paper' | 'deep'
  eyebrow?: string
  lines?: string[]
  withPlate?: boolean
}) {
  return (
    <Section id={id} ground={ground} labelledBy={`${id}-title`}>
      <ChapterHeader number={eyebrow} eyebrow="PURCHASE" id={`${id}-title`} lines={lines} />
      {withPlate ? (
        <div className={s.buyGrid} style={{ marginTop: 'var(--s-7)' }}>
          <Plate
            plate="PL. 01"
            caption={`${product.weightGrams} g — whole cacao, ${product.originCountry}`}
            src={product.gallery[0].src}
            alt={product.gallery[0].alt}
            ratio="4 / 5"
          />
          <BuyModule id={`${id}-module`} />
        </div>
      ) : (
        /* The closing ask needs no third photograph of the same bag. */
        <div style={{ marginTop: 'var(--s-7)', maxWidth: 560 }}>
          <BuyModule id={`${id}-module`} />
        </div>
      )}
    </Section>
  )
}

/* -------- 13 · EMAIL ---------------------------------------------------- */
export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <Section id="newsletter" ground="ink" tight labelledBy="email-title">
      <div className={s.emailGrid}>
        <ChapterHeader
          number={site.email.eyebrow}
          eyebrow="STAY CLOSE"
          id="email-title"
          lines={site.email.headline}
        />
        <div>
          {done ? (
            <p className="t-serif" role="status" style={{ color: 'var(--fg-2)' }}>
              You are in. We will write when there is something worth saying.
            </p>
          ) : (
            <form
              className={s.emailForm}
              onSubmit={(e) => {
                e.preventDefault()
                // SWAP POINT — post to your ESP.
                setDone(true)
              }}
            >
              <p className="t-serif" style={{ color: 'var(--fg-2)', marginBottom: 'var(--s-3)' }}>
                {site.email.supporting}
              </p>
              <div className={s.emailField}>
                <label className="sr-only" htmlFor="newsletter-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  className={s.emailInput}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="solid" size="lg">
                  {site.email.cta}
                </Button>
              </div>
              <p className="t-meta">{site.email.note}</p>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}

/* -------- FAQ ----------------------------------------------------------- */
export function Faq() {
  return (
    <Section id="faq" ground="paper" labelledBy="faq-title">
      <ChapterHeader number="APPENDIX" eyebrow="QUESTIONS" id="faq-title" lines={['GOOD QUESTIONS.']} />
      <div className={s.faq}>
        {faq.map((item) => (
          <details key={item.q} className={s.faqItem}>
            <summary className={`t-h3 ${s.faqQ}`}>
              {item.q}
              <span className={s.faqSign} aria-hidden>
                +
              </span>
            </summary>
            <p className={s.faqA}>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
