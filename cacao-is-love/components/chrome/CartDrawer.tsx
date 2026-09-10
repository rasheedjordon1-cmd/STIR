'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { formatPrice, product } from '@/content/product'
import { Button } from '@/components/ui/Button'
import { SeedChamber } from '@/components/cil/CilMarks'
import s from './chrome.module.css'

/**
 * THE BAG — a printed order slip, not a Shopify drawer.
 * Cream stock, utility type, dashed tear-rules, one red action.
 */
export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity, subtotal, add, count } = useCart()
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

  const hasPair = lines.some((l) => l.optionId === 'make-two')

  return (
    <>
      <div className={s.scrim} onClick={close} aria-hidden="true" />
      <aside ref={panelRef} className={s.drawer} role="dialog" aria-modal="true" aria-label="Your bag">
        <div className={s.slipHead}>
          <div className={s.slipHeadTop}>
            <p className="t-label">CACAO IS LOVE — ORDER SLIP</p>
            <button ref={closeRef} type="button" className="t-label" onClick={close} style={{ minHeight: 44 }}>
              CLOSE
            </button>
          </div>
          <p className="t-meta">
            {count} {count === 1 ? 'ITEM' : 'ITEMS'} · SHIPS IN 1–2 DAYS
          </p>
        </div>

        <div className={s.drawerBody}>
          {lines.length === 0 ? (
            <p className={`t-lede ${s.drawerEmpty}`}>Nothing here yet. One bag makes about eight cups.</p>
          ) : (
            <>
              <ul>
                {lines.map((line) => (
                  <li key={line.id} className={s.line}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/photo/pack-studio.webp" alt="" className={s.lineThumb} />
                    <div className={s.lineMain}>
                      <div className={s.lineTop}>
                        <div>
                          <p className="t-h3">{line.title}</p>
                          <p className="t-meta">{line.subtitle}</p>
                        </div>
                        <p className="t-meta" style={{ color: 'var(--cil-ink)' }}>
                          {formatPrice(line.unitPrice * line.quantity)}
                        </p>
                      </div>

                      {line.giftNote && (
                        <div className={s.lineNote}>
                          <p className="t-label" style={{ color: 'var(--cil-green)' }}>
                            SECOND BAG — FOR {line.giftNote.to.toUpperCase()}
                          </p>
                          {line.giftNote.message && <p className="t-meta">“{line.giftNote.message}”</p>}
                        </div>
                      )}

                      <div className={s.lineControls}>
                        <QtyControl value={line.quantity} onChange={(n) => setQuantity(line.id, n)} label={line.title} />
                        <button type="button" className={`t-meta ${s.remove}`} onClick={() => remove(line.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {!hasPair && (
                <div className={s.upsell}>
                  <div className={s.upsellCopy}>
                    <span className="t-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <SeedChamber size={12} /> MAKE TWO?
                    </span>
                    <span className="t-meta">One for you. One to share.</span>
                  </div>
                  <button
                    type="button"
                    className={s.upsellBtn}
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
                    ADD ONE — {formatPrice(product.price)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className={s.drawerFoot}>
            <hr className={s.slipRule} />
            <div className={s.subtotal}>
              <span className="t-label">SUBTOTAL</span>
              <span className="t-h3">{formatPrice(subtotal)}</span>
            </div>
            <p className="t-meta">Shipping and taxes calculated at checkout.</p>
            {/* SWAP POINT — wire to Shopify Storefront API checkout / Stripe. */}
            <Button variant="primary" block lg cut>
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
    border: '2px solid var(--rule-strong)',
    fontFamily: 'var(--font-mono)',
    color: 'var(--fg)',
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button type="button" style={{ ...box, borderRight: 0 }} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease quantity of ${label}`}>
        −
      </button>
      <span style={{ ...box, borderInline: 0, paddingInline: 8 }} aria-live="polite">
        {value}
      </span>
      <button type="button" style={{ ...box, borderLeft: 0 }} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase quantity of ${label}`}>
        +
      </button>
    </div>
  )
}

export const cartProduct = product
