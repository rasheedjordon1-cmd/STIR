import s from './ui.module.css'

export interface SpecimenEntry {
  label: string
  value: string | null
}

/**
 * The signature device: a hairline margin column of record entries that runs
 * the length of a chapter. An entry with a null value renders as a visible
 * blank line — an unfilled field on a form, not an invented fact.
 */
export function SpecimenRail({
  title,
  entries,
}: {
  title?: string
  entries: SpecimenEntry[]
}) {
  return (
    <div className={s.specimen}>
      {title && <p className={`t-label ${s.specimenTitle}`}>{title}</p>}
      <dl className={s.specimenList}>
        {entries.map((e) => (
          <div key={e.label} className={s.specimenRow}>
            <dt className={`t-label ${s.specimenKey}`}>{e.label}</dt>
            <dd className={`${s.specimenVal} ${e.value ? '' : s.specimenEmpty}`}>
              {e.value ?? '—'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
