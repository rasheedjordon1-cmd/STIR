import type { ReactNode } from 'react'
import s from './ui.module.css'

export type Ground = 'paper' | 'deep' | 'kraft' | 'ink'

const grounds: Record<Ground, string> = {
  paper: 'ground-paper',
  deep: 'ground-deep',
  kraft: 'ground-kraft',
  ink: 'ground-ink',
}

/**
 * A chapter of the site. `ground` remaps every semantic colour token to a
 * contrast-validated pairing, so colour sequences the narrative rather than
 * decorating it.
 */
export function Section({
  id,
  ground = 'paper',
  tight = false,
  children,
  labelledBy,
}: {
  id?: string
  ground?: Ground
  tight?: boolean
  children: ReactNode
  labelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${grounds[ground]} ${s.section} ${tight ? s.sectionTight : ''}`}
    >
      <div className="shell">{children}</div>
    </section>
  )
}

/** Two-column chapter: specimen rail + body. Rail side alternates for asymmetry. */
export function Chapter({
  rail,
  side = 'left',
  children,
}: {
  rail?: ReactNode
  side?: 'left' | 'right'
  children: ReactNode
}) {
  return (
    <div className={`${s.chapterGrid} ${side === 'right' ? s.railRight : ''}`}>
      {rail ? <div className={s.rail}>{rail}</div> : <div className={s.rail} aria-hidden />}
      <div className={s.body}>{children}</div>
    </div>
  )
}
