import { making } from '@/content/making'
import { founder } from '@/content/founder'
import { origin } from '@/content/origin'
import { makeTwo, fieldNotes } from '@/content/people'
import { Section, Chapter } from '@/components/ui/Section'
import { ChapterHeader } from '@/components/ui/ChapterHeader'
import { SpecimenRail } from '@/components/ui/SpecimenRail'
import { Plate } from '@/components/ui/Plate'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import s from './sections.module.css'

/* -------- 07 · HOW TO MAKE IT ------------------------------------------- */
export function HowToMake() {
  return (
    <Section id="make" ground="deep" labelledBy="make-title">
      <ChapterHeader
        number={making.eyebrow}
        eyebrow="PREPARATION"
        id="make-title"
        lines={making.headline}
      />
      <p className="t-lede measure" style={{ marginTop: 'var(--s-5)' }}>
        {making.lede}
      </p>

      <ol className={s.steps}>
        {making.steps.map((step, i) => (
          <Reveal key={step.n} as="li" delay={i * 80} className={s.step}>
            <div className={s.stepHead}>
              <span className={`t-meta ${s.stepNum}`}>{step.n}</span>
              <h3 className="t-h3">{step.title}</h3>
            </div>
            <Plate ratio="3 / 2" plate={step.plate} caption={step.meta} src={null} />
            <p className={s.stepBody}>{step.body}</p>
          </Reveal>
        ))}
      </ol>

      <details className={s.disclosure}>
        <summary className={`t-label ${s.summary}`}>
          {making.nicolasWay.label}
          <span className={s.summarySign} aria-hidden>
            +
          </span>
        </summary>
        <div className={s.disclosureBody}>
          {making.nicolasWay.body.map((p, i) => (
            <p key={i} className="t-serif">
              {p}
            </p>
          ))}
        </div>
      </details>
    </Section>
  )
}

/* -------- 08 · NICOLAS -------------------------------------------------- */
export function FounderNote() {
  return (
    <Section id="nicolas" ground="paper" labelledBy="nicolas-title">
      <div className={s.founderGrid}>
        <Plate
          plate={founder.portrait.plate}
          caption={founder.portrait.caption}
          src={founder.portrait.src}
          alt={founder.portrait.alt}
          ratio="4 / 5"
        />
        <div>
          <ChapterHeader
            number={founder.eyebrow}
            eyebrow="A NOTE"
            id="nicolas-title"
            lines={[founder.headline]}
          />
          <div className={s.note} style={{ marginTop: 'var(--s-6)' }}>
            {founder.note.map((p, i) => (
              <p key={i} className={s.noteBody}>
                {p}
              </p>
            ))}
            <p className={s.signoff}>{founder.signoff}</p>
            <p className="t-meta">
              {founder.name.toUpperCase()} · {founder.role.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* -------- 09 · SOURCE --------------------------------------------------- */
export function Source() {
  return (
    <Section id="source" ground="ink" labelledBy="source-title">
      <Chapter
        side="right"
        rail={<SpecimenRail title="ORIGIN RECORD" entries={origin.records} />}
      >
        <ChapterHeader number="CHAPTER 09" eyebrow="PROVENANCE" id="source-title" lines={origin.headline} />
        <div className="measure" style={{ marginTop: 'var(--s-6)', display: 'grid', gap: 'var(--s-4)' }}>
          {origin.body.map((p, i) => (
            <p key={i} className="t-serif" style={{ color: 'var(--paper-deep)' }}>
              {p}
            </p>
          ))}
        </div>
        <div className={s.sourcePlates} style={{ marginTop: 'var(--s-8)' }}>
          {origin.plates.map((p) => (
            <Plate key={p.plate} plate={p.plate} caption={p.caption} src={p.src} alt={p.alt} ratio="1 / 1" />
          ))}
        </div>
      </Chapter>
    </Section>
  )
}

/* -------- 10 · MAKE TWO CUPS -------------------------------------------- */
export function MakeTwoCups({ buyHref = '#buy' }: { buyHref?: string }) {
  return (
    <Section id="maketwo" ground="kraft" labelledBy="maketwo-title">
      <div className={s.makeTwoGrid}>
        <div>
          <ChapterHeader
            number={makeTwo.eyebrow}
            eyebrow="THE SECOND CUP"
            id="maketwo-title"
            lines={makeTwo.headline}
          />
          <div className={s.truthLines} style={{ marginTop: 'var(--s-5)' }}>
            {makeTwo.lines.map((l) => (
              <p key={l} className="t-h3">
                {l}
              </p>
            ))}
          </div>
          <p className="t-serif measure" style={{ marginTop: 'var(--s-5)', color: 'var(--ink-70)' }}>
            {makeTwo.body}
          </p>
          <div style={{ marginTop: 'var(--s-6)' }}>
            <ButtonLink href={buyHref} variant="solid" size="lg">
              MAKE TWO
            </ButtonLink>
          </div>
        </div>
        <div className={s.pair}>
          <Plate plate="PL. 12" caption="One for you" src={null} ratio="3 / 4" />
          <Plate plate="PL. 13" caption="One to share" src={null} ratio="3 / 4" />
        </div>
      </div>
    </Section>
  )
}

/* -------- 11 · NOTES FROM THE NEIGHBORHOOD ------------------------------ */
export function FieldNotes() {
  return (
    <Section id="people" ground="paper" labelledBy="people-title">
      <ChapterHeader
        number="CHAPTER 11"
        eyebrow="SOCIAL"
        id="people-title"
        lines={['NOTES FROM', 'THE NEIGHBORHOOD.']}
      />
      <ul className={s.notes}>
        {fieldNotes.map((note, i) => (
          <Reveal key={note.id} as="li" delay={i * 70} className={s.noteCard}>
            <blockquote className={s.noteQuote}>“{note.quote}”</blockquote>
            <div>
              <p className="t-label">{note.name}</p>
              <p className={`t-meta ${s.noteWho}`}>{note.location}</p>
            </div>
            <div>
              <p className="t-label" style={{ color: 'var(--green)' }}>
                THEIR CUP
              </p>
              <div className={s.theirCup}>
                {note.theirCup.map((c, j) => (
                  <span key={j} className={`t-meta ${s.cupChip}`}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
