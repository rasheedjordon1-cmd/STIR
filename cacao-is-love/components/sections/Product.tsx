import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Utility'
import { BuyModule } from '@/components/commerce/BuyModule'
import { QuickAdd } from '@/components/commerce/QuickAdd'
import { SplitPodHalfMark } from '@/components/cil/CilAssets'
import { Photo } from '@/components/ui/Photo'
import { Reveal, RevealLines } from '@/components/ui/Reveal'
import { product, formatPrice } from '@/content/product'
import { productTruth } from '@/content/education'
import s from './sections.module.css'

/* -------- WHAT IT IS · THE PRODUCT — red field --------------------------
   A typographic poster, not a product database. The spec table that used to
   sit under the headline is gone; see productTruth for why.

   MOTION — the chapter code resolves, then the two headline lines are pushed
   up from behind their crops, then the negatives, then the four verbs in
   sequence. Supermarket typography being set into place, one decision at a
   time. It runs once on entry and stops. */
export function ProductField() {
  return (
    <Section id="truth" field="red" labelledBy="truth-title">
      <div className={s.truthPoster}>
        <Reveal as="p" className={`t-label ${s.truthKicker}`}>
          WHAT IT IS
        </Reveal>

        <h2 id="truth-title" className={s.truthMega}>
          <RevealLines lines={[productTruth.kicker, productTruth.headline]} step={110} />
        </h2>

        <div className={s.truthNegatives}>
          {productTruth.lines.map((l, i) => (
            <Reveal key={l} as="p" className="t-h3" delay={320 + i * 90}>
              {l}
            </Reveal>
          ))}
        </div>

        <ul className={s.truthVerbs}>
          {productTruth.verbs.map((v, i) => (
            <Reveal key={v} as="li" variant="reveal" delay={560 + i * 80} className={s.truthVerb}>
              {v}
            </Reveal>
          ))}
        </ul>

        <Reveal as="p" className={`t-meta ${s.truthFoot}`} delay={920}>
          {productTruth.foot}
        </Reveal>
      </div>
    </Section>
  )
}

/* -------- 02 · PRODUCT IMAGE — near full bleed --------------------------
   The original composition, unchanged: a 78vw frame bleeding off the right
   edge, the Split Pod Half cropped against it, and the plate caption offset on
   a rule beneath. Only the photograph inside it is new.

   THE COUNTER replaces the wood-table shot here rather than arriving as its
   own section — the frame was already the right home for the definitive
   product photograph, and building a second one around it was redesign.

   It is also the page's first add-to-bag: a visitor who already knows what
   they want should not have to scroll past the education to reach a button. */
export function ProductImage() {
  return (
    <Section id="counter" field="ink" wide>
      <div className="shell">
        <div className={s.packWrap}>
          <SplitPodHalfMark size={200} className={s.podCrop} />
          <Reveal variant="break" className={s.packMedia}>
            <Photo
              name="counter"
              sizes="(min-width: 900px) 78vw, 100vw"
              /* height must be inline: <Photo> sets height:auto inline, and an
                 inline style beats the module rule that caps this frame. */
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </Reveal>
          {/* Labelled after the photograph was put down — 620ms behind the
              BREAK, so the annotation reads as a second action. */}
          <Reveal className={s.packCap} delay={620}>
            <span className="t-meta">THE BAG</span>
            <span className="t-meta">
              {product.weightGrams} G / {product.originCountry.toUpperCase()}
            </span>
          </Reveal>
          <div className={s.packBuy}>
            <p className={`t-lede ${s.packLine}`}>One ingredient. Made for the cup.</p>
            <QuickAdd />
          </div>
        </div>
      </div>
    </Section>
  )
}

/* -------- 08 · PURCHASE — the grocery counter --------------------------- */
export function Purchase({
  id = 'buy',
  field = 'cream',
  tag = 'THE COUNTER',
  as = 'h2',
}: {
  id?: string
  field?: 'cream' | 'ink'
  tag?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <Section id={id} field={field} labelledBy={`${id}-title`}>
      <Tag>{tag}</Tag>
      <div className={s.buyGrid} style={{ marginTop: 'var(--s-6)' }}>
        <figure className={s.buyFigure}>
          <Photo name="packStudio" sizes="(min-width: 900px) 46vw, 100vw" />
          <figcaption className={`t-meta ${s.buyCap}`}>
            <span>THE BAG</span>
            <span>
              {product.weightGrams} G / {product.originCountry.toUpperCase()}
            </span>
          </figcaption>
        </figure>
        <BuyModule id={`${id}-module`} as={as} />
      </div>
    </Section>
  )
}
