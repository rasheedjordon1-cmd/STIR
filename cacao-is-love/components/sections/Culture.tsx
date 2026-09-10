'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Utility'
import { CuriosityTellMeMore } from '@/components/cil/CilAssets'
import { SeedChamber, CupRim, CacaoShard } from '@/components/cil/CilMarks'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { founder } from '@/content/founder'
import { fieldNotes } from '@/content/people'
import { faq } from '@/content/faq'
import { site } from '@/content/site'
import s from './sections.module.css'

/* -------- 06 · CURIOSITY / NICOLAS -------------------------------------- */
export function Nicolas() {
  return (
    <Section id="nicolas" field="cream" labelledBy="nicolas-title">
      <div className={s.nicGrid}>
        <div className={s.nicCopy}>
          <Tag>CH. 05 — WORLDVIEW</Tag>
          <h2 id="nicolas-title" className="t-display">
            CURIOSITY IS WHERE IT STARTS.
          </h2>
          {/* The one place the serif is allowed to speak. */}
          <blockquote className={`t-quote ${s.nicQuote}`}>“{founder.quote}”</blockquote>
          {founder.note.map((p, i) => (
            <p key={i} className="t-body measure">
              {p}
            </p>
          ))}
          <p className={`t-meta ${s.nicSign}`}>
            <CacaoShard size={13} />
            {founder.name.toUpperCase()} · {founder.role.toUpperCase()}
          </p>
        </div>
        <div className={s.nicArt}>
          <CuriosityTellMeMore alt="" sizes="(min-width: 900px) 30vw, 70vw" />
        </div>
      </div>
    </Section>
  )
}

/* -------- 07 · POSTER INTERRUPTION -------------------------------------- */
export function Poster() {
  return (
    <div className={`field-red ${s.poster}`}>
      <Image
        src="/poster/one-more-cup.webp"
        alt="Cacao Is Love poster: One more cup? Warning — one cup has a habit of becoming two."
        width={1122}
        height={1402}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  )
}

/* -------- NOTES FROM THE NEIGHBORHOOD ----------------------------------- */
export function FieldNotes() {
  return (
    <Section id="people" field="ink" labelledBy="people-title">
      <Tag>THE NEIGHBORHOOD</Tag>
      <h2 id="people-title" className="t-h1" style={{ marginTop: 'var(--s-4)' }}>
        HOW PEOPLE MAKE IT.
      </h2>
      <ul className={s.notes}>
        {fieldNotes.map((note, i) => (
          <Reveal key={note.id} as="li" delay={i * 70} className={s.noteCard}>
            <blockquote className={s.noteQuote}>“{note.quote}”</blockquote>
            <div>
              <p className="t-label">{note.name}</p>
              <p className="t-meta">{note.location}</p>
            </div>
            <div className={s.theirCup}>
              <CupRim size={13} />
              {note.theirCup.map((c, j) => (
                <span key={j} className={`t-meta ${s.cupChip}`}>
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

/* -------- EMAIL --------------------------------------------------------- */
export function EmailCapture() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  return (
    <Section id="newsletter" field="green" labelledBy="email-title">
      <div className={s.emailGrid}>
        <div>
          <Tag>{site.email.eyebrow}</Tag>
          <h2 id="email-title" className="t-display" style={{ marginTop: 'var(--s-4)' }}>
            {site.email.headline.join(' ')}
          </h2>
        </div>
        <div>
          {done ? (
            <p className="t-lede" role="status">
              You are in. We write when there is something to say.
            </p>
          ) : (
            <form
              className={s.emailForm}
              onSubmit={(e) => {
                e.preventDefault()
                // SWAP POINT — post to your ESP.
                setDone(true)
              }}
            >
              <p className="t-lede" style={{ marginBottom: 'var(--s-3)' }}>
                {site.email.supporting}
              </p>
              <div className={s.emailField}>
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  className={s.emailInput}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="primary" lg>
                  {site.email.cta}
                </Button>
              </div>
              <p className="t-meta">{site.email.note}</p>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}

/* -------- FAQ ----------------------------------------------------------- */
export function Faq() {
  return (
    <Section id="faq" field="cream" labelledBy="faq-title">
      <Tag>QUESTIONS</Tag>
      <h2 id="faq-title" className="t-h1" style={{ marginTop: 'var(--s-4)' }}>
        GOOD QUESTIONS.
      </h2>
      <div className={s.faq}>
        {faq.map((item) => (
          <details key={item.q} className={s.faqItem}>
            <summary className={`t-h3 ${s.faqQ}`}>
              {item.q}
              <span className={s.faqMark} aria-hidden>
                <SeedChamber size={16} />
              </span>
            </summary>
            <p className={s.faqA}>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
