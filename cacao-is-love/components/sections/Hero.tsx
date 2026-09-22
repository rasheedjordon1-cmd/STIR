import { site } from '@/content/site'
import { product, formatPrice } from '@/content/product'
import { MastermarkDisplay } from '@/components/cil/Mastermark'
import { SeedChamber, DoubleSteam } from '@/components/cil/CilMarks'
import { ButtonLink, quietMark } from '@/components/ui/Button'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import s from './sections.module.css'

/**
 * HERO — the opening statement.
 *
 * MASTERMARK ONCE, MESSAGE NEXT. The header already carries the mastermark, so
 * on a phone this section does not repeat it: logo → logo → message is the
 * wrong hierarchy and it was costing most of the first screen. The oversized
 * mastermark stays on the desk, where it is composition rather than repetition.
 *
 * THE PHOTOGRAPH IS GONE, and deliberately. It showed the superseded bag — the
 * hands-and-cup label reading "100% WHOLE CACAO" — so the first image on the
 * site was the wrong product. The current product now arrives immediately
 * below, full bleed, as THE BAG. Removing it also takes a screen off the phone
 * and a request off every device.
 *
 * MOTION — the arrival reads NUDGE then REVEAL: the glyph settles onto the
 * page like an object being placed, then the headline is pushed up line by
 * line from behind its own crop. It resolves in about a second and stops.
 * Nothing here waits on motion: the CTA is in the DOM and clickable from the
 * first paint.
 */
export function Hero() {
  const { hero } = site
  return (
    <section className={`field-cream ${s.hero}`} aria-labelledby="hero-title">
      <div className="shell">
        <div className={s.heroGrid}>
          {/* Desktop composition only, and a CSS background on purpose: it is
              decorative here — the same product arrives immediately below as
              THE BAG with real alt text — and a background declared inside a
              min-width query is never fetched by a phone, which a
              display:none <img> would still be. */}
          <div className={s.heroMedia} aria-hidden />
          <div className={s.heroCopy}>
            <p className={`t-label ${s.heroEyebrow}`}>
              <Reveal as="span" variant="nudge" immediate className={s.heroGlyph}>
                <SeedChamber size={13} />
              </Reveal>
              <Reveal as="span" variant="rise" immediate delay={60}>
                {hero.eyebrow}
              </Reveal>
            </p>

            {/* Desktop only — see the note above. */}
            <MastermarkDisplay tone="ink" priority maxWidth={560} className={s.heroMark} />

            <h1 id="hero-title" className={`t-statement ${s.heroHead}`}>
              <RevealLines lines={hero.headlineLines} start={140} step={90} />
            </h1>

            <Reveal className={s.heroSupport} immediate delay={440}>
              <p className="t-lede">{hero.supporting}</p>
              <p className="t-lede">{hero.secondLine}</p>
            </Reveal>

            <Reveal className={s.heroCtas} immediate delay={560}>
              <ButtonLink href={site.shopHref} variant="primary" lg cut arrow>
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#make" variant="quiet">
                {hero.secondaryCta}
                <DoubleSteam size={16} className={quietMark} />
              </ButtonLink>
            </Reveal>

            {/* Weight and price only. A dispatch window is a promise and this
                one is not confirmed — see site.shipping. */}
            <Reveal as="p" className="t-meta" immediate delay={640}>
              {product.weightGrams} G · {formatPrice(product.price)}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
