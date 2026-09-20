'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPrice, product } from '@/content/product'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/Button'
import s from './chrome.module.css'

/**
 * Mobile-only persistent buy affordance. Quiet by design: it appears only once
 * the hero has scrolled away, so the first screen is never crowded by an ask.
 */
export function StickyCta({ waitlistHref = '#waitlist' }: { waitlistHref?: string }) {
  const [shown, setShown] = useState(false)
  const visible = useRef<Map<Element, boolean>>(new Map())
  const { add } = useCart()
  const soldOut = product.availability === 'sold_out'

  const [buyInView, setBuyInView] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Stand down while a real buy module is on screen. Two identical asks in one
     viewport is noise, and the sticky bar covers the module's own controls on a
     short phone. Watches every purchase block, not just the homepage's. */
  useEffect(() => {
    /* Observe the CTAs themselves, not their sections. Watching #counter stood
       the bar down for the whole height of a full-bleed photograph, which meant
       it effectively never appeared. */
    const targets = Array.from(document.querySelectorAll('[data-buy-cta]'))
    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const seen = new Map(visible.current)
        entries.forEach((e) => seen.set(e.target, e.isIntersecting))
        visible.current = seen
        setBuyInView(Array.from(seen.values()).some(Boolean))
      },
      { threshold: 0.2 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const visibleNow = shown && !buyInView

  return (
    <div className={`${s.sticky} ${visibleNow ? s.stickyIn : ''}`} aria-hidden={!visibleNow}>
      <div className={s.stickyMeta}>
        <span className={`t-label ${s.stickyName}`}>{product.descriptor}</span>
        <span className="t-meta">
          {product.weightGrams} G · {soldOut ? 'SOLD OUT' : formatPrice(product.price)}
        </span>
      </div>
      {soldOut ? (
        <a href={waitlistHref} className="t-label" style={{ display: 'contents' }}>
          <Button variant="primary" tabIndex={visibleNow ? 0 : -1}>
            JOIN THE NEXT DROP
          </Button>
        </a>
      ) : (
        <Button
          variant="primary"
          tabIndex={visibleNow ? 0 : -1}
          onClick={() =>
            add({
              optionId: 'one-bag',
              title: product.name,
              subtitle: `${product.descriptor} · ${product.weightGrams} g`,
              quantity: 1,
              unitPrice: product.price,
            })
          }
        >
          ADD TO BAG
        </Button>
      )}
    </div>
  )
}
