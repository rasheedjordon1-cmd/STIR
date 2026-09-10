'use client'

import { useEffect, useState } from 'react'
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
  const { add } = useCart()
  const soldOut = product.availability === 'sold_out'

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`${s.sticky} ${shown ? s.stickyIn : ''}`} aria-hidden={!shown}>
      <div className={s.stickyMeta}>
        <span className={`t-label ${s.stickyName}`}>{product.descriptor}</span>
        <span className="t-meta">
          {product.weightGrams} G · {soldOut ? 'SOLD OUT' : formatPrice(product.price)}
        </span>
      </div>
      {soldOut ? (
        <a href={waitlistHref} className="t-label" style={{ display: 'contents' }}>
          <Button variant="primary" tabIndex={shown ? 0 : -1}>
            JOIN THE NEXT DROP
          </Button>
        </a>
      ) : (
        <Button
          variant="primary"
          tabIndex={shown ? 0 : -1}
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
