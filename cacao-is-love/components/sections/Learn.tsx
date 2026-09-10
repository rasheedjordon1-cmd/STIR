import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Utility'
import { DoubleSteam, CacaoShard, SeedChamber } from '@/components/cil/CilMarks'
import {
  EduWholeCacao,
  EduCocoaPowder,
  ProvenanceHandPod,
  PrepBreak,
  PrepMelt,
  PrepMake,
} from '@/components/cil/CilArt'
import { Reveal } from '@/components/ui/Reveal'
import { whatIsCacao, coffeeNeighbor, whyPeopleDrinkIt } from '@/content/education'
import { origin } from '@/content/origin'
import { making } from '@/content/making'
import { product } from '@/content/product'
import s from './sections.module.css'

const PREP_ART = [PrepBreak, PrepMelt, PrepMake]

/* -------- 03 · WHAT IS CACAO — cream, 5 / 7 ----------------------------- */
export function WhatIsCacao() {
  return (
    <Section id="cacao" field="cream" labelledBy="cacao-title">
      <div className={s.eduGrid}>
        <div>
          <Tag>CH. 02 — THE CATEGORY</Tag>
          <h2 id="cacao-title" className="t-h1" style={{ marginTop: 'var(--s-5)' }}>
            {whatIsCacao.headline}
          </h2>
          <p className="t-lede measure" style={{ marginTop: 'var(--s-5)' }}>
            {whatIsCacao.lede}
          </p>
          <p className="t-body measure" style={{ marginTop: 'var(--s-4)' }}>
            {whatIsCacao.footnote}
          </p>
        </div>

        {/* CIL EDU 001 — let the artwork breathe, no card around it. */}
        <div className={s.eduArt}>
          {[
            { Art: EduWholeCacao, name: 'WHOLE CACAO', sub: 'Solid cacao mass.' },
            { Art: EduCocoaPowder, name: 'COCOA POWDER', sub: 'Processed powder form.' },
          ].map(({ Art, name, sub }, i) => (
            <Reveal key={name} delay={i * 80} className={s.eduPanel}>
              <Art title={name} />
              <div className={s.eduPanelLabel}>
                <span className="t-h3">{name}</span>
                <span className={`t-meta ${s.eduPanelSub}`}>{sub}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* -------- 04 · PROVENANCE — green field --------------------------------- */
export function Provenance() {
  return (
    <Section id="source" field="green" labelledBy="source-title">
      <div className={s.provGrid}>
        <div className={s.provArt}>
          <ProvenanceHandPod title="A hand holding a cacao pod" />
        </div>
        <div className={s.provCopy}>
          <Tag>CH. 03 — ORIGIN</Tag>
          <h2 id="source-title" className="t-display">
            GROWN IN COLOMBIA.
          </h2>
          <p className="t-lede measure">Where the cacao begins.</p>
          <div className={s.provMeta}>
            {origin.records
              .filter((r) => r.value)
              .map((r) => (
                <div key={r.label} className={s.provMetaItem}>
                  <span className="t-label">{r.label}</span>
                  <span className="t-meta">{r.value}</span>
                </div>
              ))}
            <div className={s.provMetaItem}>
              <span className="t-label">FORM</span>
              <span className="t-meta">WHOLE CACAO</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* -------- 05 · PREPARATION — cream -------------------------------------- */
export function Preparation() {
  return (
    <Section id="make" field="cream" labelledBy="make-title">
      <div className={s.prepHead}>
        <DoubleSteam size={30} />
        <h2 id="make-title" className="t-display">
          MAKE CACAO.
        </h2>
      </div>
      <p className="t-lede measure" style={{ marginTop: 'var(--s-4)' }}>
        {making.lede}
      </p>

      <ol className={s.prepSteps}>
        {making.steps.map((step, i) => {
          const Art = PREP_ART[i]
          return (
            <Reveal key={step.n} as="li" delay={i * 90} className={s.prepStep}>
              <div className={s.prepArt}>
                <Art title={step.title} />
              </div>
              <div className={s.prepNum}>
                <span className="t-meta">{step.n}</span>
                <h3 className="t-h3">{step.title}</h3>
              </div>
              <p className={s.prepBody}>{step.body}</p>
            </Reveal>
          )
        })}
      </ol>

      <div className={s.prepDivider}>
        <CacaoShard size={16} />
        <span />
        <span className="t-meta">{making.nicolasWay.label}</span>
      </div>
    </Section>
  )
}

/* -------- PDP only · CACAO / COFFEE ------------------------------------- */
export function CoffeeNeighbor() {
  return (
    <Section id="coffee" field="ink" labelledBy="coffee-title">
      <Tag>REFERENCE</Tag>
      <h2 id="coffee-title" className="t-h1" style={{ marginTop: 'var(--s-4)' }}>
        {coffeeNeighbor.headline.join(' ')}
      </h2>
      <p className="t-lede measure" style={{ marginTop: 'var(--s-4)' }}>
        {coffeeNeighbor.lede}
      </p>
      <table className={s.compare}>
        <thead>
          <tr>
            <th scope="col" className="t-label">ATTRIBUTE</th>
            <th scope="col" className="t-label">COFFEE</th>
            <th scope="col" className="t-label">CACAO</th>
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
    </Section>
  )
}

/* -------- PDP only · WHY ------------------------------------------------ */
export function WhyPeopleDrink() {
  return (
    <Section id="why" field="cream" labelledBy="why-title">
      <Tag>REASONS</Tag>
      <h2 id="why-title" className="t-h1" style={{ marginTop: 'var(--s-4)' }}>
        {whyPeopleDrinkIt.headline.join(' ')}
      </h2>
      <ul className={s.why}>
        {whyPeopleDrinkIt.blocks.map((b, i) => (
          <Reveal key={b.n} as="li" delay={i * 70} className={s.whyItem}>
            <span className="t-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SeedChamber size={11} />
              {b.n}
            </span>
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
