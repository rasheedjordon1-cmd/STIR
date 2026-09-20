import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Utility'
import { CacaoShard, SeedChamber } from '@/components/cil/CilMarks'
import {
  EduWholeCacao,
  EduCocoaPowder,
  ProvenanceHandPod,
  DoubleSteamMark,
  CuriousFingerMark,
} from '@/components/cil/CilAssets'
import { Reveal } from '@/components/ui/Reveal'
import { Photo } from '@/components/ui/Photo'
import { whatIsCacao, coffeeNeighbor } from '@/content/education'
import { origin } from '@/content/origin'
import { making } from '@/content/making'
import { product } from '@/content/product'
import s from './sections.module.css'

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
            /* "WHOLE CACAO" was the left label. The teaching point is that
               nothing was pressed out — not that the bag holds a whole bean —
               so the label says what the pieces actually are. */
            { Art: EduWholeCacao, name: 'CACAO', sub: 'Everything the bean had, still in it.' },
            { Art: EduCocoaPowder, name: 'COCOA POWDER', sub: 'Cocoa butter pressed out.' },
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
            <Tag>CH. 03 — ORIGIN</Tag>
            <h2 id="source-title" className="t-display">
              GROWN IN COLOMBIA.
            </h2>
            <p className="t-lede">{origin.subhead}</p>
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
                <span className="t-label">PRODUCT</span>
                <span className="t-meta">100% CACAO</span>
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
  const plates = origin.plates
  if (!plates.length) return null
  return (
    <Section field="ink" flush wide>
      <ul className={s.plateStrip}>
        {plates.map((p, i) => (
          <Reveal key={p.plate} as="li" delay={i * 80} className={s.plateItem}>
            <div className={s.plateMedia}>
              <Photo name={p.photo} sizes="(min-width: 900px) 33vw, 100vw" />
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

/* -------- 05 · MAKE / THE BREAK — cream --------------------------------
   The photograph carries behaviour, the list carries method. Deliberately NOT
   one illustration per step: a literal four-panel recipe strip turns the page
   into a food blog, and the interim step vectors it replaced never matched the
   drawn artwork they sat beside.

   THE BREAK has motion blur on the reaching hand and a resolved room behind
   it. That is the photograph. Nothing is laid over the board, and no crop
   removes the hand. */
export function Preparation() {
  return (
    <Section id="make" field="cream" labelledBy="make-title">
      <div className={s.makeGrid}>
        <div className={s.makeCopy}>
          <Tag>CH. 04 — MAKE</Tag>
          <div className={s.prepHead} style={{ marginTop: 'var(--s-4)' }}>
            <DoubleSteamMark size={44} />
            <h2 id="make-title" className="t-display">
              {making.headline}
            </h2>
          </div>
          <p className="t-lede measure" style={{ marginTop: 'var(--s-4)' }}>
            {making.lede}
          </p>
        </div>

        <figure className={s.makeFigure}>
          <Photo name="theBreak" sizes="(min-width: 900px) 58vw, 100vw" />
          <figcaption className={`t-meta ${s.makeCaption}`}>PL. 05 — THE BREAK</figcaption>
        </figure>
      </div>

      <ol className={s.method}>
        {making.steps.map((step, i) => (
          <Reveal key={step.n} as="li" delay={i * 80} className={s.methodStep}>
            <span className={`t-meta ${s.methodNum}`}>{step.n}</span>
            <h3 className={`t-h3 ${s.methodTitle}`}>{step.title}</h3>
            <p className={s.methodBody}>{step.body}</p>
            <span className={`t-meta ${s.methodMeta}`}>{step.meta}</span>
          </Reveal>
        ))}
      </ol>
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

