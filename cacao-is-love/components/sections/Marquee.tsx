import { SeedChamber } from '@/components/cil/CilMarks'
import s from './sections.module.css'

/**
 * The product-truth strip. Immediately after the hero it gives the page
 * commercial rhythm before a single word of education.
 * Motion stops entirely under prefers-reduced-motion and on hover.
 */
export function Marquee({
  items,
  field = 'ink',
}: {
  items: string[]
  field?: 'ink' | 'green' | 'red'
}) {
  const group = (
    <div className={s.marqueeGroup} aria-hidden>
      {items.map((t, i) => (
        <span key={i} className={s.marqueeItem}>
          <SeedChamber size={12} />
          <span>{t}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`field-${field} ${s.marquee}`}>
      <p className="sr-only">{items.join('. ')}.</p>
      <div className={s.marqueeTrack}>
        {group}
        {group}
      </div>
    </div>
  )
}
