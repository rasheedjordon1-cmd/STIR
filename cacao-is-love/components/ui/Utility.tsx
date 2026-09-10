import { SeedChamber } from '@/components/cil/CilMarks'
import s from './ui.module.css'

export interface UtilityRow {
  key: string
  value: string
}

/**
 * The product information system: shelf-edge label, public-information sign,
 * warehouse tag. Seed Chamber marks the rows.
 */
export function UtilityTable({ rows, className }: { rows: UtilityRow[]; className?: string }) {
  return (
    <dl className={`${s.utility} ${className ?? ''}`}>
      {rows.map((r) => (
        <div key={r.key} className={s.utilityRow}>
          <dt className={s.utilityMark} aria-hidden>
            <SeedChamber size={13} />
          </dt>
          <dd className={`t-label ${s.utilityKey}`} style={{ gridColumn: 2 }}>
            {r.key}
          </dd>
          <dd className={`t-meta ${s.utilityVal}`}>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** CH. 01 / PL. 02 notation — seasoning, never the structure. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className={`t-meta ${s.chapterTag}`}>
      <SeedChamber size={11} />
      {children}
    </span>
  )
}
