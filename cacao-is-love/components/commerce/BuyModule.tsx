'use client'

import { useId, useState } from 'react'
import { formatPrice, product, type Availability } from '@/content/product'
import { site } from '@/content/site'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/Button'
import { QtyControl } from '@/components/chrome/CartDrawer'
import s from './buy.module.css'

/**
 * BUY MODULE — a state machine, not a button.
 *
 * `product.availability` selects the entire purchase experience:
 *   in_stock  → option toggle + quantity + ADD TO BAG
 *   low_stock → the same, plus a harvest-anchored count. Structurally true
 *               scarcity only; fabricated urgency would undo the trust the
 *               rest of the site exists to build.
 *   sold_out  → JOIN THE NEXT DROP. Never a disabled button, never a dead end.
 *               The surrounding page keeps all of its education intact.
 */
export function BuyModule({
  id,
  compact = false,
  as = 'h2',
}: {
  id?: string
  compact?: boolean
  /** The PDP's buy module carries the page's h1; elsewhere it is an h2. */
  as?: 'h1' | 'h2'
}) {
  const availability: Availability = product.availability
  if (availability === 'sold_out') return <WaitlistBlock id={id ?? 'waitlist'} as={as} />
  return <PurchaseBlock id={id} compact={compact} availability={availability} as={as} />
}

/* -------------------------------------------------------------------------- */

function AvailabilityLine({ availability }: { availability: Availability }) {
  if (availability === 'sold_out') {
    return (
      <p className={`t-label ${s.status}`}>
        <span className={`${s.dot} ${s.dotOut}`} aria-hidden />
        BETWEEN HARVESTS
      </p>
    )
  }
  if (availability === 'low_stock' && product.unitsRemaining) {
    return (
      <p className={`t-label ${s.status}`} style={{ color: 'var(--accent)' }}>
        <span className={`${s.dot} ${s.dotLow}`} aria-hidden />
        LAST {product.unitsRemaining} BAGS OF THIS HARVEST
      </p>
    )
  }
  return (
    <p className={`t-label ${s.status}`}>
      <span className={`${s.dot} ${s.dotIn}`} aria-hidden />
      IN STOCK — SHIPS IN 1–2 DAYS
    </p>
  )
}

function PurchaseBlock({
  id,
  compact,
  availability,
  as: Heading,
}: {
  id?: string
  compact: boolean
  availability: Availability
  as: 'h1' | 'h2'
}) {
  const uid = useId()
  const { add } = useCart()
  const [optionId, setOptionId] = useState(product.options[0].id)
  const [quantity, setQuantity] = useState(1)
  const [giftTo, setGiftTo] = useState('')
  const [giftMessage, setGiftMessage] = useState('')
  const [announcement, setAnnouncement] = useState('')

  const option = product.options.find((o) => o.id === optionId) ?? product.options[0]
  const unitPrice = product.price * option.quantity
  const total = unitPrice * quantity

  function handleAdd() {
    add({
      optionId: option.id,
      title: product.name,
      subtitle:
        option.quantity > 1
          ? `${option.label} · ${option.quantity} × ${product.weightGrams} g`
          : `${product.descriptor} · ${product.weightGrams} g`,
      quantity,
      unitPrice,
      giftNote:
        option.allowsGiftNote && giftTo.trim()
          ? { to: giftTo.trim(), message: giftMessage.trim() }
          : undefined,
    })
    setAnnouncement(`${option.label} added to your bag.`)
  }

  return (
    <div className={s.module} id={id}>
      <div className={s.head}>
        <p className="t-label" style={{ color: 'var(--marker)' }}>
          {product.descriptor.toUpperCase()}
        </p>
        <Heading className={compact ? 't-h3' : 't-h2'}>{product.name}</Heading>
      </div>

      <div className={s.priceRow}>
        <span className="t-h3">{formatPrice(product.price)}</span>
        <span className="t-meta">
          {product.weightGrams} G · {product.originCountry.toUpperCase()}
        </span>
      </div>

      <AvailabilityLine availability={availability} />

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className={s.srOnly}>Choose how many bags</legend>
        <div className={s.options}>
          {product.options.map((o) => (
            <div key={o.id} style={{ position: 'relative', display: 'grid' }}>
              <input
                className={s.optionInput}
                type="radio"
                name={`${uid}-option`}
                id={`${uid}-${o.id}`}
                value={o.id}
                checked={optionId === o.id}
                onChange={() => setOptionId(o.id)}
              />
              <label className={s.option} htmlFor={`${uid}-${o.id}`}>
                <span className="t-h3">{o.label}</span>
                <span className={`t-meta ${s.optionSub}`}>{o.sublabel}</span>
                <span className={`t-meta ${s.optionSub}`}>
                  {formatPrice(product.price * o.quantity)}
                </span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* The gift mechanic: the second bag is addressed to a person, which is
          what separates this from a quantity discount. */}
      {option.allowsGiftNote && (
        <div className={s.gift}>
          <p className="t-label" style={{ color: 'var(--marker)' }}>
            THE SECOND BAG — OPTIONAL
          </p>
          <p className="t-meta">
            Tell us who it is for and we will write it on the bag.
          </p>
          <div className={s.field}>
            <label className="t-label" htmlFor={`${uid}-giftto`}>
              THEIR NAME
            </label>
            <input
              id={`${uid}-giftto`}
              className={s.input}
              value={giftTo}
              onChange={(e) => setGiftTo(e.target.value.slice(0, 40))}
              placeholder="Who is the second cup for?"
              autoComplete="off"
            />
          </div>
          <div className={s.field}>
            <label className="t-label" htmlFor={`${uid}-giftmsg`}>
              A LINE FROM YOU
            </label>
            <textarea
              id={`${uid}-giftmsg`}
              className={s.textarea}
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value.slice(0, 140))}
              placeholder="Short is better."
              maxLength={140}
            />
            <span className={`t-meta ${s.counter}`}>{giftMessage.length}/140</span>
          </div>
        </div>
      )}

      <div className={s.actions}>
        <QtyControl value={quantity} onChange={setQuantity} label={option.label} />
        <Button variant="solid" size="lg" onClick={handleAdd}>
          ADD TO BAG — {formatPrice(total)}
        </Button>
      </div>

      <p aria-live="polite" className={s.srOnly}>
        {announcement}
      </p>

      <div className={`t-meta ${s.micro}`}>
        {site.shipping.map((row) => (
          <span key={row.label}>
            {row.label}: {row.value}
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/** Sold-out is a capture moment, not an error state. */
export function WaitlistBlock({ id = 'waitlist', as: Heading = 'h2' }: { id?: string; as?: 'h1' | 'h2' }) {
  const uid = useId()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [done, setDone] = useState(false)

  return (
    <div className={s.module} id={id}>
      <div className={s.head}>
        <p className="t-label" style={{ color: 'var(--marker)' }}>
          {product.descriptor.toUpperCase()}
        </p>
        <Heading className="t-h2">{product.name}</Heading>
      </div>

      <div className={s.priceRow}>
        <span className="t-h3">{formatPrice(product.price)}</span>
        <span className="t-meta">
          {product.weightGrams} G · {product.originCountry.toUpperCase()}
        </span>
      </div>

      <AvailabilityLine availability="sold_out" />

      {product.nextDropLabel && (
        <p className="t-serif">
          Next bags land <strong>{product.nextDropLabel}</strong>.
        </p>
      )}

      {done ? (
        <div className={s.success} role="status">
          <p className="t-label" style={{ color: 'var(--marker)' }}>
            YOU ARE ON THE LIST
          </p>
          <p className="t-serif">
            We will write to you before anybody else hears about it. In the meantime,
            everything below still holds — the cacao, where it comes from, and how to make it.
          </p>
        </div>
      ) : (
        <form
          className={s.waitlist}
          onSubmit={(e) => {
            e.preventDefault()
            // SWAP POINT — post to Klaviyo / Shopify / your ESP.
            setDone(true)
          }}
        >
          <div className={s.waitRow}>
            <div className={s.field}>
              <label className="t-label" htmlFor={`${uid}-email`}>
                EMAIL
              </label>
              <input
                id={`${uid}-email`}
                className={s.input}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className={s.field}>
              <label className="t-label" htmlFor={`${uid}-phone`}>
                MOBILE <span className={s.optional}>— OPTIONAL</span>
              </label>
              <input
                id={`${uid}-phone`}
                className={s.input}
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="For the drop text only"
              />
            </div>
          </div>
          <Button type="submit" variant="solid" size="lg" block>
            JOIN THE NEXT DROP
          </Button>
          <p className="t-meta">
            One message when the cacao lands. Nothing else, and you can leave any time.
          </p>
        </form>
      )}
    </div>
  )
}
