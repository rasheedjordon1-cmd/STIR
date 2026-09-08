import { productTruth, whatIsCacao, coffeeNeighbor, whyPeopleDrinkIt } from '@/content/education'
import { product } from '@/content/product'
import { Section, Chapter } from '@/components/ui/Section'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { SpecimenRail } from '@/components/ui/SpecimenRail'
import { Reveal } from '@/components/ui/Reveal'
import { flowGlyphs, FlowArrow } from '@/components/ui/Diagrams'
import s from './sections.module.css'

/* -------- 02 · PRODUCT TRUTH -------------------------------------------- */
export function ProductTruth() {
  return (
    <Section id="truth" ground="kraft" labelledBy="truth-title">
      <div className={s.truthGrid}>
        <Reveal>
          <p className={`t-h3 ${s.truthKicker}`}>{productTruth.kicker}</p>
          <h2 id="truth-title" className={`t-display ${s.truthBig}`}>
            {productTruth.headline}
          </h2>
          <div className={s.truthLines}>
            {productTruth.lines.map((l) => (
              <p key={l} className="t-lede" style={{ color: 'var(--ink-70)' }}>
                {l}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={s.truthFacts}>
            {productTruth.facts.map((f) => (
              <div key={f.label} className={s.truthFact}>
                <span className="t-label">{f.label}</span>
                <span className="t-meta" style={{ color: 'var(--ink)' }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/* -------- 03 · WHAT IS CACAO -------------------------------------------- */
export function WhatIsCacao() {
  return (
    <Section id="cacao" ground="paper" labelledBy="cacao-title">
      <Chapter
        rail={
          <SpecimenRail
            title="SPECIMEN"
            entries={[
              { label: 'GENUS', value: 'Theobroma' },
              { label: 'SPECIES', value: 'cacao' },
              { label: 'PART USED', value: 'Seed' },
              { label: 'FORM', value: 'Whole, unpressed' },
              { label: 'ADDITIONS', value: 'None' },
            ]}
          />
        }
      >
        <ChapterHeader
          number={whatIsCacao.eyebrow}
          eyebrow="CATEGORY"
          id="cacao-title"
          lines={whatIsCacao.headline}
        />
        <p className="t-lede measure" style={{ marginTop: 'var(--s-5)' }}>
          {whatIsCacao.lede}
        </p>

        <ol className={s.flow}>
          {whatIsCacao.steps.map((step, i) => {
            const Glyph = flowGlyphs[i]
            return (
              <Reveal key={step.n} as="li" delay={i * 70} className={s.flowItem}>
                <div className={s.flowFrame}>
                  <Glyph className={s.flowGlyph} />
                </div>
                {i < whatIsCacao.steps.length - 1 && <FlowArrow className={s.flowArrow} />}
                <div>
                  <p className={`t-meta ${s.flowNum}`}>{step.n}</p>
                  <p className={`t-h3 ${s.flowTerm}`}>{step.term}</p>
                  <p className={s.flowDef}>{step.def}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>

        <p className={`t-serif ${s.flowFootnote} measure`}>{whatIsCacao.footnote}</p>
      </Chapter>
    </Section>
  )
}

/* -------- 04 · CACAO / COFFEE ------------------------------------------- */
export function CoffeeNeighbor() {
  return (
    <Section id="coffee" ground="ink" labelledBy="coffee-title">
      <Chapter side="right" rail={<SpecimenRail title="COMPARISON" entries={[
        { label: 'SUBJECT A', value: 'Coffee' },
        { label: 'SUBJECT B', value: 'Whole cacao' },
        { label: 'VERDICT', value: 'Keep both' },
      ]} />}>
        <ChapterHeader
          number={coffeeNeighbor.eyebrow}
          eyebrow="POSITION"
          id="coffee-title"
          lines={coffeeNeighbor.headline}
        />
        <p className="t-lede measure" style={{ marginTop: 'var(--s-5)', color: 'var(--paper-deep)' }}>
          {coffeeNeighbor.lede}
        </p>

        <table className={s.compare}>
          <thead>
            <tr>
              <th scope="col" className="t-label">
                <span className="t-label">ATTRIBUTE</span>
              </th>
              <th scope="col" className="t-label">COFFEE</th>
              <th scope="col" className={`t-label ${s.compareHeadCacao}`}>CACAO</th>
            </tr>
          </thead>
          <tbody>
            {coffeeNeighbor.rows.map((row) => (
              <tr key={row.attribute}>
                <th scope="row" className={`t-label ${s.compareAttr}`}>{row.attribute}</th>
                <td data-label="COFFEE" className={s.compareCell}>{row.coffee}</td>
                <td data-label="CACAO" className={s.compareCacao}>{row.cacao}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={`t-serif ${s.compareClosing} measure`} style={{ color: 'var(--paper-deep)' }}>
          {coffeeNeighbor.closing}
        </p>
      </Chapter>
    </Section>
  )
}

/* -------- 05 · WHY PEOPLE DRINK IT -------------------------------------- */
export function WhyPeopleDrink() {
  return (
    <Section id="why" ground="deep" labelledBy="why-title">
      <ChapterHeader
        number={whyPeopleDrinkIt.eyebrow}
        eyebrow="REASONS"
        id="why-title"
        lines={whyPeopleDrinkIt.headline}
      />
      <ul className={s.why}>
        {whyPeopleDrinkIt.blocks.map((b, i) => (
          <Reveal key={b.n} as="li" delay={i * 70} className={s.whyItem}>
            <p className={`t-meta ${s.whyNum}`}>{b.n}</p>
            <h3 className="t-h3">{b.title}</h3>
            <p className={s.whyBody}>{b.body}</p>
          </Reveal>
        ))}
      </ul>
      <p className={`t-meta ${s.disclaimer}`}>
        {whyPeopleDrinkIt.disclaimer} Contains {product.ingredients.join(', ').toLowerCase()} only.
      </p>
    </Section>
  )
}
