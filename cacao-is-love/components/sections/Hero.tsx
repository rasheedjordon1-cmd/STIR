import { site } from '@/content/site'
import { product, formatPrice } from '@/content/product'
import { Mastermark } from '@/components/ui/Mastermark'
import { Plate } from '@/components/ui/Plate'
import { ButtonLink } from '@/components/ui/Button'
import s from './sections.module.css'

/**
 * HERO — orientation in 5–8 seconds: what it is, where it is from, why to care.
 * The handwritten mastermark is the h1. It is never typeset in a substitute face.
 */
export function Hero() {
  const { hero } = site
  return (
    <section className={`ground-paper ${s.hero}`} aria-labelledby="hero-title">
      <div className="shell">
        <div className={s.heroGrid}>
          <div>
            <p className={`t-label ${s.heroEyebrow}`}>{hero.eyebrow}</p>

            <h1 id="hero-title" className={s.heroMark}>
              <Mastermark variant="display" label={site.brand} />
            </h1>

            <div className={s.heroLines}>
              <p className="t-lede" style={{ color: 'var(--fg)' }}>
                {hero.supporting}
              </p>
              <p className="t-lede">{hero.secondLine}</p>
            </div>

            <div className={s.heroCtas}>
              <ButtonLink href={site.shopHref} variant="solid" size="lg">
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#cacao" variant="quiet">
                {hero.secondaryCta}
              </ButtonLink>
            </div>

            <p className={`t-meta ${s.heroMeta}`}>
              <span>ONE INGREDIENT</span>
              <span>{product.weightGrams} G</span>
              <span>{product.originCountry.toUpperCase()}</span>
              <span>{formatPrice(product.price)}</span>
            </p>
          </div>

          <Plate
            plate={hero.plate.plate}
            caption={hero.plate.caption}
            src={hero.plate.src}
            alt={hero.plate.alt}
            ratio="4 / 5"
            priority
            sizes="(min-width: 900px) 40vw, 100vw"
          />
        </div>

        <Contents />
      </div>
    </section>
  )
}

/** The CONTENTS rail: a publication's table of contents, and a jump menu. */
function Contents() {
  return (
    <nav className={s.contents} aria-label="Contents">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <p className={`t-label ${s.contentsTitle}`}>CONTENTS</p>
        <p className={`t-label ${s.contentsTitle}`}>
          {product.weightGrams} G · {formatPrice(product.price)}
        </p>
      </div>
      <ul className={s.contentsList}>
        {site.contents.map((item) => (
          <li key={item.n}>
            <a href={item.href} className={s.contentsRow}>
              <span className={`t-meta ${s.contentsNum}`}>{item.n}</span>
              <span className={s.contentsLead} aria-hidden />
              <span className={`t-label ${s.contentsLabel}`}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
