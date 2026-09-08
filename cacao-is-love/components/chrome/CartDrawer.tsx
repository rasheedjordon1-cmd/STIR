'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { formatPrice, product } from '@/content/product'
import { Button } from '@/components/ui/Button'
import s from './chrome.module.css'

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity, subtotal } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  useFocusTrap(panelRef, isOpen)

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  if (!isOpen) return null

  return (
    <>
      <div className={s.scrim} onClick={close} aria-hidden="true" />
      <aside ref={panelRef} className={s.drawer} role="dialog" aria-modal="true" aria-label="Your bag">
        <div className={s.drawerTop}>
          <p className="t-label">YOUR BAG</p>
          <button ref={closeRef} type="button" className="t-label" onClick={close} style={{ minHeight: 44 }}>
            CLOSE
          </button>
        </div>

        <div className={s.drawerBody}>
          {lines.length === 0 ? (
            <p className={`t-serif ${s.drawerEmpty}`}>
              Nothing here yet. One bag makes about eight cups.
            </p>
          ) : (
            <ul>
              {lines.map((line) => (
                <li key={line.id} className={s.line}>
                  <div className={s.lineTop}>
                    <div>
                      <p className="t-h3">{line.title}</p>
                      <p className="t-meta">{line.subtitle}</p>
                    </div>
                    <p className="t-meta">{formatPrice(line.unitPrice * line.quantity)}</p>
                  </div>

                  {line.giftNote && (
                    <div className={s.lineNote}>
                      <p className="t-label" style={{ color: 'var(--green)' }}>
                        SECOND BAG — FOR {line.giftNote.to.toUpperCase()}
                      </p>
                      {line.giftNote.message && (
                        <p className="t-meta" style={{ color: 'var(--ink-70)' }}>
                          “{line.giftNote.message}”
                        </p>
                      )}
                    </div>
                  )}

                  <div className={s.lineControls}>
                    <QtyControl
                      value={line.quantity}
                      onChange={(n) => setQuantity(line.id, n)}
                      label={line.title}
                    />
                    <button type="button" className={`t-meta ${s.remove}`} onClick={() => remove(line.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className={s.drawerFoot}>
            <div className={s.subtotal}>
              <span className="t-label">SUBTOTAL</span>
              <span className="t-h3">{formatPrice(subtotal)}</span>
            </div>
            <p className="t-meta">Shipping and taxes calculated at checkout.</p>
            {/* SWAP POINT — wire to Shopify Storefront API checkout / Stripe. */}
            <Button variant="solid" block size="lg">
              CHECKOUT
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}

export function QtyControl({
  value,
  onChange,
  label,
  min = 1,
  max = 12,
}: {
  value: number
  onChange: (n: number) => void
  label: string
  min?: number
  max?: number
}) {
  const box: React.CSSProperties = {
    minWidth: 40,
    minHeight: 40,
    display: 'grid',
    placeItems: 'center',
    border: '1px solid var(--rule-strong)',
    fontFamily: 'var(--font-mono)',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <button
        type="button"
        style={{ ...box, borderRight: 0 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease quantity of ${label}`}
      >
        −
      </button>
      <span style={{ ...box, borderInline: 0, paddingInline: 8 }} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        style={{ ...box, borderLeft: 0 }}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        +
      </button>
    </div>
  )
}

export const cartProduct = product
