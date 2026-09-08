'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import s from './ui.module.css'

/**
 * The site's only scroll effect: an 8px rise and fade, once, on entry.
 * Falls back to fully visible when IntersectionObserver is unavailable and is
 * disabled outright by prefers-reduced-motion (handled in CSS).
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article'
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
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
  }, [])

  const Component = Tag as React.ElementType

  return (
    <Component
      ref={ref}
      className={[s.reveal, shown ? s.revealIn : '', className].filter(Boolean).join(' ')}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}
