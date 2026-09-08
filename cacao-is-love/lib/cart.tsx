'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface GiftNote {
  to: string
  message: string
}

export interface CartLine {
  id: string
  optionId: string
  title: string
  subtitle: string
  quantity: number
  unitPrice: number
  giftNote?: GiftNote
}

interface CartState {
  lines: CartLine[]
  isOpen: boolean
  count: number
  subtotal: number
  add: (line: Omit<CartLine, 'id'>) => void
  remove: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  open: () => void
  close: () => void
}

const CartContext = createContext<CartState | null>(null)
const STORAGE_KEY = 'cil.cart.v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Read after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setLines(JSON.parse(raw) as CartLine[])
    } catch {
      /* private mode, cleared storage, quota — an empty cart is a valid state */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* non-fatal */
    }
  }, [lines, hydrated])

  const add = useCallback((line: Omit<CartLine, 'id'>) => {
    setLines((prev) => {
      // A line carrying a gift note is unique — it is addressed to someone.
      const mergeable = !line.giftNote
      const existing = mergeable
        ? prev.find((l) => l.optionId === line.optionId && !l.giftNote)
        : undefined
      if (existing) {
        return prev.map((l) =>
          l.id === existing.id ? { ...l, quantity: l.quantity + line.quantity } : l,
        )
      }
      return [...prev, { ...line, id: `${line.optionId}-${Date.now()}` }]
    })
    setIsOpen(true)
  }, [])

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, quantity } : l)),
    )
  }, [])

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0)
    const subtotal = lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0)
    return {
      lines,
      isOpen,
      count,
      subtotal,
      add,
      remove,
      setQuantity,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }
  }, [lines, isOpen, add, remove, setQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
