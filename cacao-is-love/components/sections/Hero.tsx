import { site } from '@/content/site'
import { product, formatPrice } from '@/content/product'
import { MastermarkDisplay } from '@/components/cil/Mastermark'
import { SeedChamber, CuriousFinger } from '@/components/cil/CilMarks'
import { ButtonLink, quietMark } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
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
              <p className="t-lede">{hero.thirdLine}</p>
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

            {/* Weight and price only. "SHIPS IN 1–2 DAYS" was here and is not
                confirmed fulfilment — a dispatch window is a promise, and this
                is the first screen a customer reads it on. */}
            <p className="t-meta">
              {product.weightGrams} G · {formatPrice(product.price)}
            </p>
          </div>

          <div className={s.heroMedia}>
            <div className={s.heroMediaInner}>
              <Photo
                name="heroPass"
                priority
                sizes="(min-width: 900px) 62vw, 100vw"
                className={s.heroImg}
              />
            </div>
            <p className={`t-meta ${s.heroCaption}`}>PL. 01 — THE PASS</p>
          </div>
        </div>
      </div>
    </section>
  )
}
