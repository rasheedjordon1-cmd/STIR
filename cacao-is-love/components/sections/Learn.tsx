import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Utility'
import { CacaoShard, SeedChamber } from '@/components/cil/CilMarks'
import {
  EduWholeCacao,
  EduCocoaPowder,
  ProvenanceHandPod,
  DoubleSteamMark,
  PrepBreakArt,
  CuriousFingerMark,
} from '@/components/cil/CilAssets'
import { PrepMelt, PrepMake } from '@/components/cil/CilArt'
import { Reveal } from '@/components/ui/Reveal'
import { whatIsCacao, coffeeNeighbor, whyPeopleDrinkIt, composition } from '@/content/education'
import { origin } from '@/content/origin'
import { making } from '@/content/making'
import { product } from '@/content/product'
import s from './sections.module.css'

/* Step 01 is the supplied artwork; 02 and 03 are still interim vectors, so the
   art box below is a fixed height and each piece is centred in it — otherwise
   the drawn landscape asset and the square vectors put their captions on three
   different baselines. */
const PREP_ART = [
  (p: { title: string }) => <PrepBreakArt alt="" sizes="(min-width: 860px) 28vw, 80vw" />,
  PrepMelt,
  PrepMake,
]

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
          <CuriousFingerMark size={64} className={s.eduCue} />
        </div>

        {/* CIL EDU 001 — let the artwork breathe, no card around it. */}
        <div className={s.eduArt}>
          {[
            { Art: EduWholeCacao, name: 'WHOLE CACAO', sub: 'Solid cacao mass.' },
            { Art: EduCocoaPowder, name: 'COCOA POWDER', sub: 'Processed powder form.' },
          ].map(({ Art, name, sub }, i) => (
            <Reveal key={name} delay={i * 80} className={s.eduPanel}>
              <Art alt="" sizes="(min-width: 900px) 26vw, 42vw" />
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

/* -------- 03 · COMPOSITION — ink field ---------------------------------
   Type and data only. The utility table is the section, which is the whole
   point of a shelf-edge information system: the facts are the design. */
export function Composition() {
  return (
    <Section id="composition" field="ink" labelledBy="composition-title">
      <div className={s.compGrid}>
        <div>
          <Tag>CH. 03 — COMPOSITION</Tag>
          <h2 id="composition-title" className="t-h1" style={{ marginTop: 'var(--s-4)' }}>
            {composition.headline}
          </h2>
          <p className="t-lede measure" style={{ marginTop: 'var(--s-4)' }}>
            {composition.lede}
          </p>
          <p className={`t-meta ${s.compFootnote}`}>{composition.footnote}</p>
        </div>

        <dl className={s.compList}>
          {composition.rows.map((r, i) => (
            <Reveal key={r.compound} delay={i * 60} className={s.compRow}>
              <dt className={s.compMark} aria-hidden>
                <SeedChamber size={14} />
              </dt>
              <dt className={`t-h3 ${s.compName}`}>{r.compound}</dt>
              <dd className={`t-body ${s.compNote}`}>{r.note}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  )
}

/* -------- 04 · PROVENANCE — a cream / green split field -----------------
   The supplied artwork's hands are MARKET GREEN, so the illustration cannot sit
   on a green field without disappearing, and recolouring it either erases the
   cut lines that separate the fingers or drops the red seeds onto green at
   1.36:1. Splitting the field keeps the green, keeps the red pod as the
   chromatic focal point, and leaves the artwork exactly as drawn. */
export function Provenance() {
  return (
    <Section id="source" field="green" flush wide labelledBy="source-title">
      <div className={s.provSplit}>
        <div className={s.provArtSide}>
          <ProvenanceHandPod alt="" sizes="(min-width: 900px) 38vw, 78vw" />
        </div>
        <div className={s.provCopySide}>
          <div className={s.provCopyInner}>
            <Tag>CH. 04 — ORIGIN</Tag>
            <h2 id="source-title" className="t-display">
              GROWN IN COLOMBIA.
            </h2>
            <p className="t-lede">Where the cacao begins.</p>
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
      </div>
    </Section>
  )
}

/* -------- 04b · ORIGIN, DOCUMENTED -------------------------------------
   The evidence for the chapter above. Full bleed, butted edges, captions in
   utility type — a contact strip, not a gallery. */
export function OriginPlates() {
  const plates = origin.plates.filter((p) => p.src)
  if (!plates.length) return null
  return (
    <Section field="ink" flush wide>
      <ul className={s.plateStrip}>
        {plates.map((p, i) => (
          <Reveal key={p.plate} as="li" delay={i * 80} className={s.plateItem}>
            <div className={s.plateMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src as string} alt={p.alt} loading="lazy" />
            </div>
            <div className={s.plateCap}>
              <span className="t-meta">{p.plate}</span>
              <span className="t-meta">{p.caption}</span>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

/* -------- 05 · PREPARATION — cream -------------------------------------- */
export function Preparation() {
  return (
    <Section id="make" field="cream" labelledBy="make-title">
      <div className={s.prepHead}>
        <DoubleSteamMark size={44} />
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
