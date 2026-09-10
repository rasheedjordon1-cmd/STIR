'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { site } from '@/content/site'
import { Mastermark } from '@/components/cil/Mastermark'
import { SeedChamber } from '@/components/cil/CilMarks'
import { useCart } from '@/lib/cart'
import { useFocusTrap } from '@/lib/useFocusTrap'
import s from './chrome.module.css'

/** Grocery package header × editorial masthead. */
export function SiteHeader() {
  const { count, open } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  useFocusTrap(sheetRef, menuOpen)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className={s.header}>
        <div className={`shell ${s.headerInner}`}>
          <Link href="/" className={s.brandLink} aria-label={`${site.brand} — home`}>
            <Mastermark height={30} tone="ink" priority />
          </Link>

          <nav className={s.nav} aria-label="Primary">
            {site.nav.map((item) => (
              <Link key={item.label} href={item.href} className={`t-label ${s.navLink}`}>
                <span className={s.navMark} aria-hidden>
                  <SeedChamber size={13} />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={s.headerRight}>
            <Link href={site.shopHref} className={`t-label ${s.shopLink}`}>
              SHOP
            </Link>
            <button
              type="button"
              className={`t-label ${s.cartBtn}`}
              onClick={open}
              aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
            >
              BAG
              <span className={`${s.cartCount} ${count === 0 ? s.cartCountZero : ''}`}>{count}</span>
            </button>
            <button
              type="button"
              className={`t-label ${s.menuBtn}`}
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              MENU
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div ref={sheetRef} className={s.sheet} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className={s.sheetTop}>
            <Mastermark height={28} tone="ink" />
            <button type="button" className="t-label" onClick={() => setMenuOpen(false)} autoFocus style={{ minHeight: 44, paddingInline: 8 }}>
              CLOSE
            </button>
          </div>

          <nav className={s.sheetNav} aria-label="Primary">
            {[...site.nav, { label: 'SHOP', href: site.shopHref }].map((item) => (
              <Link key={item.label} href={item.href} className={s.sheetLink} onClick={() => setMenuOpen(false)}>
                <span className={s.sheetNum} aria-hidden>
                  <SeedChamber size={16} />
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={s.sheetFoot}>
            <div className={`t-label ${s.sheetSecondary}`}>
              {site.secondaryNav.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="t-meta">{site.tagline}</p>
          </div>
        </div>
      )}
    </>
  )
}
