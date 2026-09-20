import { Section } from '@/components/ui/Section'
import { UtilityTable, Tag } from '@/components/ui/Utility'
import { BuyModule } from '@/components/commerce/BuyModule'
import { QuickAdd } from '@/components/commerce/QuickAdd'
import { SplitPodHalfMark } from '@/components/cil/CilAssets'
import { Photo } from '@/components/ui/Photo'
import { product, formatPrice } from '@/content/product'
import { productTruth } from '@/content/education'
import s from './sections.module.css'

/* -------- 01 · THE PRODUCT — red field ---------------------------------- */
export function ProductField() {
  return (
    <Section id="truth" field="red" labelledBy="truth-title">
      <div className={s.truthGrid}>
        <div>
          <p className={`t-label ${s.truthKicker}`}>CH. 01 — THE CACAO</p>
          {/* Packaging enlarged to architectural scale. */}
          <h2 id="truth-title" className={s.truthMega}>
            <span>{productTruth.kicker}</span>
            <span>{productTruth.headline}</span>
          </h2>
          <div className={s.truthTail}>
            {productTruth.lines.map((l) => (
              <p key={l} className="t-h3">
                {l}
              </p>
            ))}
          </div>
        </div>

        <UtilityTable
          rows={[
            { key: 'CONTENTS', value: '100% CACAO' },
            { key: 'GROWN', value: product.originCountry.toUpperCase() },
            { key: 'WEIGHT', value: `${product.weightGrams} G` },
            { key: 'PRICE', value: formatPrice(product.price) },
          ]}
        />
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
          <div className={s.packMedia}>
            <Photo
              name="counter"
              sizes="(min-width: 900px) 78vw, 100vw"
              /* height must be inline: <Photo> sets height:auto inline, and an
                 inline style beats the module rule that caps this frame. */
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className={s.packCap}>
            <span className="t-meta">PL. 02</span>
            <span className="t-meta">
              CACAO IS LOVE / {product.weightGrams} G / {product.originCountry.toUpperCase()}
            </span>
          </div>
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
  tag = 'CH. 06 — THE COUNTER',
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
            <span>PL. 03</span>
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
