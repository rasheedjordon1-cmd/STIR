import { Section } from '@/components/ui/Section'
import { UtilityTable, Tag } from '@/components/ui/Utility'
import { SplitPodHalf } from '@/components/cil/CilMarks'
import { BuyModule } from '@/components/commerce/BuyModule'
import { Figure } from '@/components/ui/Figure'
import { product, formatPrice } from '@/content/product'
import { productTruth } from '@/content/education'
import Image from 'next/image'
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
            { key: 'CONTENTS', value: '100% WHOLE CACAO' },
            { key: 'GROWN', value: product.originCountry.toUpperCase() },
            { key: 'WEIGHT', value: `${product.weightGrams} G` },
            { key: 'PRICE', value: formatPrice(product.price) },
          ]}
        />
      </div>
    </Section>
  )
}

/* -------- 02 · PRODUCT IMAGE — near full bleed -------------------------- */
export function ProductImage() {
  return (
    <Section field="cream" wide>
      <div className="shell">
        <div className={s.packWrap}>
          <SplitPodHalf size={168} className={s.podCrop} />
          <div className={s.packMedia}>
            <Image
              src="/photo/pack-wood.webp"
              alt="A bag of Cacao Is Love and a mug of cacao on a sunlit wooden table."
              width={1122}
              height={1402}
              sizes="(min-width: 900px) 78vw, 100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className={`${s.packCap}`}>
            <span className="t-meta">PL. 02</span>
            <span className="t-meta">
              CACAO IS LOVE / {product.weightGrams} G / {product.originCountry.toUpperCase()}
            </span>
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
  tag = 'CH. 08 — THE COUNTER',
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
        <Figure
          src="/photo/pack-studio.webp"
          alt="The Cacao Is Love bag beside a mug of cacao, broken cacao and a wooden spoon."
          ratio="4 / 5"
          plate="PL. 03"
          caption={`${product.weightGrams} G / ${product.originCountry.toUpperCase()}`}
          sizes="(min-width: 900px) 46vw, 100vw"
          cut
        />
        <BuyModule id={`${id}-module`} as={as} />
      </div>
    </Section>
  )
}
