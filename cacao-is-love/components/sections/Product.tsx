import { Section } from '@/components/ui/Section'
import { UtilityTable, Tag } from '@/components/ui/Utility'
import { BuyModule } from '@/components/commerce/BuyModule'
import { QuickAdd } from '@/components/commerce/QuickAdd'
import { Photo } from '@/components/ui/Photo'
import { product, formatPrice } from '@/content/product'
import { productTruth } from '@/content/education'
import s from './sections.module.css'

/* -------- 03 · FAST PRODUCT TRUTH — red field --------------------------
   Straight after the hero, because unfamiliarity is the friction. Four facts,
   set as type on a rule — not four rounded feature cards. */
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

/* -------- 04 · THE COUNTER — the first commercial moment ----------------
   The photograph does the selling, so the copy beside it is three facts and
   one sentence. Anything more and the image stops working.

   This is also the earliest add-to-bag on the page: a visitor who already
   knows what they want should never have to reach the buy module. */
export function TheCounter() {
  return (
    <Section id="counter" field="ink" wide labelledBy="counter-title">
      <div className="shell">
        <div className={s.counterGrid}>
          <figure className={s.counterFigure}>
            <Photo name="counter" sizes="(min-width: 900px) 62vw, 100vw" />
          </figure>

          <div className={s.counterCopy}>
            <Tag>PL. 02 — THE COUNTER</Tag>
            <h2 id="counter-title" className={`t-h2 ${s.counterName}`}>
              {product.name}
            </h2>
            <p className={`t-meta ${s.counterMeta}`}>
              {product.weightGrams} G · {formatPrice(product.price)} ·{' '}
              {product.originCountry.toUpperCase()}
            </p>
            <p className={`t-lede ${s.counterLine}`}>One ingredient. Made for the cup.</p>
            <QuickAdd />
          </div>
        </div>
      </div>
    </Section>
  )
}

/* -------- 11 · PURCHASE — the grocery counter --------------------------- */
export function Purchase({
  id = 'buy',
  field = 'cream',
  tag = 'CH. 07 — THE COUNTER',
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
