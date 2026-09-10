import Image from 'next/image'
import { site } from '@/content/site'
import { product, formatPrice } from '@/content/product'
import { MastermarkDisplay } from '@/components/cil/Mastermark'
import { SeedChamber, CuriousFinger } from '@/components/cil/CilMarks'
import { ButtonLink, quietMark } from '@/components/ui/Button'
import s from './sections.module.css'

/**
 * HERO — CIL HERO 001, THE PASS.
 *
 * 40 / 60. Copy left, photograph right, bleeding off the viewport edge. The
 * mastermark is the brand statement; the live headline sits under it in the
 * heavy grotesk. Text never crosses the busy part of the photograph.
 */
export function Hero() {
  const { hero } = site
  return (
    <section className={`field-cream ${s.hero}`} aria-labelledby="hero-title">
      <div className="shell">
        <div className={s.heroGrid}>
          <div className={s.heroCopy}>
            <p className={`t-label ${s.heroEyebrow}`}>
              <SeedChamber size={13} />
              {hero.eyebrow}
            </p>

            <MastermarkDisplay tone="ink" priority maxWidth={560} className={s.heroMark} />

            <h1 id="hero-title" className={`t-statement ${s.heroHead}`}>
              {hero.headline}
            </h1>

            <div className={s.heroSupport}>
              <p className="t-lede">{hero.supporting}</p>
              <p className="t-lede">{hero.secondLine}</p>
            </div>

            <div className={s.heroCtas}>
              <ButtonLink href={site.shopHref} variant="primary" lg cut>
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#cacao" variant="quiet">
                {hero.secondaryCta}
                <CuriousFinger size={16} className={quietMark} />
              </ButtonLink>
            </div>

            <p className="t-meta">
              {product.weightGrams} G · {formatPrice(product.price)} · SHIPS IN 1–2 DAYS
            </p>
          </div>

          <div className={s.heroMedia}>
            <div className={s.heroMediaInner}>
              <Image
                src="/photo/hero-pass.webp"
                alt="One person passing a mug of cacao to another across a sunlit table, beside a bag of Cacao Is Love."
                fill
                priority
                sizes="(min-width: 900px) 62vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: '66% 45%' }}
              />
            </div>
            <p className={`t-meta ${s.heroCaption}`}>PL. 01 — THE PASS</p>
          </div>
        </div>
      </div>
    </section>
  )
}
