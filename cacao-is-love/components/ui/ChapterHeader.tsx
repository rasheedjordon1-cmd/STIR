import s from './ui.module.css'

export function ChapterHeader({
  eyebrow,
  number,
  id,
  lines,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  number?: string
  id?: string
  lines: string[]
  as?: 'h1' | 'h2'
}) {
  return (
    <header>
      {(eyebrow || number) && (
        <div className={s.chapterHead}>
          {number && <span className={`t-meta ${s.chapterNum}`}>{number}</span>}
          {eyebrow && <span className={`t-label ${s.chapterEyebrow}`}>{eyebrow}</span>}
        </div>
      )}
      <Tag id={id} className={Tag === 'h1' ? 't-h1' : 't-h2'}>
        {lines.map((line, i) => (
          <span key={line + i} style={{ display: 'block' }}>
            {line}
          </span>
        ))}
      </Tag>
    </header>
  )
}
