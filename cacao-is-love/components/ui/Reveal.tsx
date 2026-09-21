'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import s from './ui.module.css'

/**
 * CIL MOTION — four verbs, and nothing outside them.
 *
 *   PASS    something arrives from beside the frame        → 'pass'
 *   BREAK   a covering shape retracts and lets you see     → 'break'
 *   REVEAL  a line rises from behind its own crop          → 'reveal'
 *   NUDGE   an object settles onto the page                → 'nudge'
 *
 * The default 'rise' is the site's original 8px lift and stays, because most
 * of the page already uses it and the back half is meant to get calmer, not
 * busier.
 *
 * If a movement cannot be named with one of the four verbs it does not belong
 * on this site. That rule is the whole point: motion here is punctuation for
 * an idea, not evidence that someone knows how to animate.
 *
 * One IntersectionObserver per element, transform/opacity/clip-path only, no
 * scroll listener, no rAF loop, no library. Reduced motion is handled in CSS
 * and lands every variant in its final state immediately — no content is ever
 * left masked off-screen.
 */
export type MotionVerb = 'rise' | 'pass' | 'break' | 'reveal' | 'nudge'

const VARIANT: Record<MotionVerb, string> = {
  rise: '',
  pass: s.mPass,
  break: s.mBreak,
  reveal: s.mReveal,
  nudge: s.mNudge,
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  variant = 'rise',
  /** Fire as soon as it mounts rather than on entry — for above-the-fold copy. */
  immediate = false,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article' | 'span' | 'p' | 'figure' | 'figcaption'
  className?: string
  variant?: MotionVerb
  immediate?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (immediate) {
      /* One frame, so the browser paints the start state before it moves. */
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [immediate])

  const Component = Tag as React.ElementType

  return (
    <Component
      ref={ref}
      className={[s.reveal, VARIANT[variant], shown ? s.revealIn : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}

/**
 * A headline that rises line by line from behind its own crop. Each line is a
 * block with overflow hidden and the text inside translated down — so the
 * letters appear to be pushed up onto the page rather than faded in.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  step = 90,
  start = 0,
}: {
  lines: string[]
  className?: string
  lineClassName?: string
  /** 70–120ms reads as authored; below that it looks simultaneous. */
  step?: number
  start?: number
}) {
  return (
    <span className={[s.lines, className].filter(Boolean).join(' ')}>
      {lines.map((line, i) => (
        <span key={line + i} className={s.lineCrop}>
          <Reveal
            as="span"
            variant="reveal"
            immediate
            delay={start + i * step}
            className={[s.lineInner, lineClassName].filter(Boolean).join(' ')}
          >
            {line}
          </Reveal>
        </span>
      ))}
    </span>
  )
}
