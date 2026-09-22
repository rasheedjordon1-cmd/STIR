'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Tag } from '@/components/ui/Utility'
import { CuriosityTellMeMore } from '@/components/cil/CilAssets'
import { Figure } from '@/components/ui/Figure'
import { SeedChamber, CupRim, CacaoShard } from '@/components/cil/CilMarks'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { founder } from '@/content/founder'
import { people } from '@/content/people'
import { canSignup } from '@/content/commerce'
import { SignupForm } from '@/components/commerce/SignupForm'
import { faq } from '@/content/faq'
import { site } from '@/content/site'
import { Photo } from '@/components/ui/Photo'
import s from './sections.module.css'

/* -------- 06 · CURIOSITY / NICOLAS -------------------------------------- */
export function Nicolas() {
  return (
    <Section id="nicolas" field="cream" labelledBy="nicolas-title">
      <div className={s.nicGrid}>
        <div className={s.nicCopy}>
          <Tag>WHO MADE IT</Tag>
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
          <figure className={s.nicFigure}>
            <Photo name="founderNicolas" sizes="(min-width: 900px) 40vw, 100vw" />
            <figcaption className={`t-meta ${s.nicCap}`}>
              <span>{founder.portrait.plate}</span>
              <span>{founder.portrait.caption}</span>
            </figcaption>
          </figure>
          <CuriosityTellMeMore alt="" sizes="(min-width: 900px) 22vw, 55vw" className={s.nicMark} />
        </div>
      </div>
    </Section>
  )
}

/* -------- 07 · POSTER INTERRUPTION -------------------------------------- */
export function Poster() {
  /* A printed poster dropped into the page. Full bleed, no card, no frame, and
     the headline is not repeated in live text beside it — the artwork already
     carries its own typography, and setting it twice reads as a mistake. */
  return (
    <div className={`field-red ${s.poster}`}>
      <Photo name="oneMoreCup" sizes="100vw" />
    </div>
  )
}

/* -------- 09 · PEOPLE / THE WAIT ---------------------------------------
   This replaced a testimonial carousel that was rendering three cards reading
   "NAME / CITY, STATE / Placeholder quote". Nothing here describes the people
   in the photograph, because there are none in it — the second person is
   outside the frame and the viewer finishes the story.

   Both cups and the bag survive every crop; that is the whole picture. */
export function TheWait() {
  return (
    <Section id="people" field="ink" flush wide labelledBy="people-title">
      <figure className={s.waitFigure}>
        <Photo name="theWait" sizes="100vw" />
        <figcaption className={s.waitCopy}>
          <span className={`t-meta ${s.waitEyebrow}`}>{people.eyebrow}</span>
          <h2 id="people-title" className={`t-display ${s.waitHead}`}>
            {people.headline}
          </h2>
          <p className={`t-lede ${s.waitBody}`}>{people.body}</p>
          <span className={`t-meta ${s.waitPlate}`}>{people.caption}</span>
        </figcaption>
      </figure>
    </Section>
  )
}

/* -------- EMAIL --------------------------------------------------------- */
export function EmailCapture() {
  /* The whole section is conditional on a configured endpoint. A capture form
     that cannot deliver is not a smaller version of a working one. */
  if (!canSignup) return null
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
          <SignupForm />
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
