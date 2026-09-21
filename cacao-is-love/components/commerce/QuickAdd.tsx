'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { product, formatPrice } from '@/content/product'
import { Button } from '@/components/ui/Button'

/**
 * QUICK ADD — one bag, one tap, from the first product moment.
 *
 * The full buy module (options, quantity, gift note) lives further down the
 * page. This exists so a visitor who already knows what they want is never
 * made to scroll past the education to reach a button.
 *
 * It adds a single bag deliberately. Offering the whole option matrix twice
 * duplicates state, and a second quantity control this early is a decision the
 * visitor has not been given enough to make.
 */
export function QuickAdd() {
  const { add, open } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd() {
    add({
      optionId: 'one-bag',
      title: product.name,
      subtitle: `${product.descriptor} · ${product.weightGrams} g`,
      quantity: 1,
      unitPrice: product.price,
    })
    open()
    /* The label confirms in place as well as opening the drawer, so the action
       still reads as completed for anyone who dismisses the drawer quickly.
       The cart state is already updated by this point — the label is feedback,
       never a gate on the transaction. */
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2200)
  }

  if (product.availability === 'sold_out') return null

  /* Uses the shared Button rather than a local class: the counter's CTA and
     the buy module's CTA are the same promise and must not drift apart. */
  return (
    <Button variant="primary" lg cut onClick={handleAdd} data-buy-cta>
      <span aria-live="polite">
        {justAdded ? 'IN THE BAG ◊' : `ADD TO BAG — ${formatPrice(product.price)}`}
      </span>
    </Button>
  )
}
