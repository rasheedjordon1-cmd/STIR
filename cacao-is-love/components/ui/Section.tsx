import type { ReactNode } from 'react'
import s from './ui.module.css'

export type Field = 'cream' | 'red' | 'green' | 'ink'

const fields: Record<Field, string> = {
  cream: 'field-cream',
  red: 'field-red',
  green: 'field-green',
  ink: 'field-ink',
}

/**
 * A field of colour. Every major section makes a colour decision — the rhythm
 * of those decisions is part of the storytelling, not decoration.
 */
export function Section({
  id,
  field = 'cream',
  tight = false,
  flush = false,
  wide = false,
  labelledBy,
  children,
}: {
  id?: string
  field?: Field
  tight?: boolean
  flush?: boolean
  /** Full-width sections that manage their own inset. */
  wide?: boolean
  labelledBy?: string
  children: ReactNode
}) {
  const pad = flush ? s.fieldFlush : tight ? `${s.field} ${s.fieldTight}` : s.field
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${fields[field]} ${pad}`}>
      {wide ? children : <div className="shell">{children}</div>}
    </section>
  )
}
