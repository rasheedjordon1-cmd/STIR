'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '@/content/site'
import { megaMenus, menuRecord, type MegaMenu } from '@/content/navigation'
import { Mastermark } from '@/components/cil/Mastermark'
import { SeedChamber, DoubleSteam, SplitPodHalf, CupRim } from '@/components/cil/CilMarks'
import { useCart } from '@/lib/cart'
import { useFocusTrap } from '@/lib/useFocusTrap'
import s from './chrome.module.css'

/* ---------------------------------------------------------------------------
   NAVIGATION MICRO-ASSETS

   Each primary item owns a mark. Two sizes, because the marks do not all hold
   at one size — this was measured, not assumed:

     INLINE (17px, appears on hover)   Seed Chamber, Split Pod Half, Double
       Steam and Cup Rim all stay legible down to 13–15px.
     PANEL (large, inside the mega)    the item's full mark, at a size where
       it is the drawing rather than a tick.

   PEOPLE is the exception. Curious Finger — vector or drawn — is an
   unreadable red smudge anywhere near nav scale; it read as a tool, not a
   pointing hand, at every size from 13 to 26px. So PEOPLE carries Cup Rim
   inline and the real drawn Curious Finger artwork in its panel at 92px,
   where it is finally the hand it was drawn as. The item still owns the
   mark; the mark just is not asked to work at a size it cannot work at.
--------------------------------------------------------------------------- */
const INLINE_MARK = {
  cacao: SeedChamber,
  source: SplitPodHalf,
  make: DoubleSteam,
  people: CupRim,
} as const

function PanelMark({ menu }: { menu: MegaMenu }) {
  switch (menu.key) {
    case 'cacao':
      return <SeedChamber size={132} />
    case 'source':
      return <SplitPodHalf size={116} />
    case 'make':
      return <DoubleSteam size={124} />
    case 'people':
      return <CupRim size={124} />
  }
}

/* 17px sits with the desktop nav's 13px type. In the sheet the words are
   ~48px, so the same mark at 17 reads as a speck — it scales with its type. */
function InlineMark({ menu, size = 17 }: { menu: MegaMenu; size?: number }) {
  const Mark = INLINE_MARK[menu.key]
  return <Mark size={size} />
}

/* Hover intent: the panel opens only if the pointer stays. Leaving is given a
   grace window so the diagonal trip from the link down into the panel does not
   close it underneath the cursor. */
const OPEN_DELAY = 100
const CLOSE_DELAY = 160

type Key = MegaMenu['key']

export function SiteHeader() {
  const { count, open } = useCart()
  const pathname = usePathname()

  const [openKey, setOpenKey] = useState<Key | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState<Key | null>(null)

  const sheetRef = useRef<HTMLDivElement>(null)
  const navZoneRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Partial<Record<Key, HTMLAnchorElement | null>>>({})
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /* Escape hands focus back to the trigger — and the trigger's own focus
     handler would immediately reopen the panel the user just dismissed.
     This suppresses exactly that one focus event. */
  const suppressFocusOpen = useRef(false)

  useFocusTrap(sheetRef, menuOpen)

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => clearTimer, [])

  const scheduleOpen = (key: Key) => {
    clearTimer()
    timer.current = setTimeout(() => setOpenKey(key), OPEN_DELAY)
  }
  const scheduleClose = () => {
    clearTimer()
    timer.current = setTimeout(() => setOpenKey(null), CLOSE_DELAY)
  }
  const closeNow = useCallback((returnFocusTo?: Key | null) => {
    clearTimer()
    setOpenKey(null)
    if (returnFocusTo) {
      suppressFocusOpen.current = true
      triggerRefs.current[returnFocusTo]?.focus()
      requestAnimationFrame(() => {
        suppressFocusOpen.current = false
      })
    }
  }, [])

  /* Any navigation closes everything. Hash links do not remount the tree. */
  useEffect(() => {
    setOpenKey(null)
    setMenuOpen(false)
  }, [pathname])

  /* Escape closes the mega from anywhere and hands focus back to its trigger. */
  useEffect(() => {
    if (!openKey) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNow(openKey)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openKey, closeNow])

  /* Mobile sheet: Escape, and the page underneath must not scroll. */
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

  /* Tabbing out of the navigation zone entirely closes the panel. */
  const onZoneBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null
    if (!next || !navZoneRef.current?.contains(next)) closeNow()
  }

  const onTriggerKey = (e: React.KeyboardEvent, key: Key) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpenKey(key)
      requestAnimationFrame(() => {
        document.querySelector<HTMLAnchorElement>(`#mega-${key} a`)?.focus()
      })
    }
  }

  return (
    <>
      <div
        ref={navZoneRef}
        className={s.navZone}
        onBlur={onZoneBlur}
        onMouseLeave={scheduleClose}
        onMouseEnter={clearTimer}
      >
        <header className={s.header}>
          <div className={`shell ${s.headerInner}`}>
            <Link href="/" className={s.brandLink} aria-label={`${site.brand} — home`}>
              <Mastermark height={30} tone="ink" priority />
            </Link>

            <nav className={s.nav} aria-label="Primary">
              {megaMenus.map((menu) => {
                const isOpen = openKey === menu.key
                return (
                  <Link
                    key={menu.key}
                    href={menu.href}
                    ref={(el) => {
                      triggerRefs.current[menu.key] = el
                    }}
                    className={`${s.navLink} ${isOpen ? s.navLinkOpen : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={`mega-${menu.key}`}
                    onMouseEnter={() => scheduleOpen(menu.key)}
                    onFocus={() => {
                      if (suppressFocusOpen.current) return
                      clearTimer()
                      setOpenKey(menu.key)
                    }}
                    onKeyDown={(e) => onTriggerKey(e, menu.key)}
                    onClick={() => closeNow()}
                  >
                    <span className={s.navMark} aria-hidden>
                      <InlineMark menu={menu} />
                    </span>
                    <span className={s.navWord}>{menu.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className={s.headerRight}>
              <Link href={site.shopHref} className={s.shopBlock} onClick={() => closeNow()}>
                SHOP
              </Link>
              <button
                type="button"
                className={s.bagBtn}
                onClick={open}
                aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
              >
                <span className={s.bagWord}>BAG</span>
                <span className={`${s.cartCount} ${count === 0 ? s.cartCountZero : ''}`}>{count}</span>
              </button>
              <button
                type="button"
                className={s.menuBtn}
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                MENU
              </button>
            </div>
          </div>
        </header>

        {/* ---- MEGA MENUS ----
            One wrapper carries the reveal so switching between items swaps
            content without replaying the animation. Each menu keeps its own
            element and id so aria-controls points somewhere real. */}
        <div className={s.megaWrap} data-open={openKey ? 'true' : 'false'}>
          {megaMenus.map((menu, i) => (
            <div
              key={menu.key}
              id={`mega-${menu.key}`}
              className={s.mega}
              hidden={openKey !== menu.key}
              aria-label={`${menu.label} menu`}
            >
              <div className={`${s.megaBrand} field-${menu.field}`}>
                {/* INFORMATION voice, anchoring the top edge — a plate number,
                    the same device the chapters use. Derived, so it cannot
                    drift out of true. */}
                <p className={`t-meta ${s.megaPlate}`}>
                  {String(i + 1).padStart(2, '0')} / {String(megaMenus.length).padStart(2, '0')}
                  <span aria-hidden> · </span>
                  {menu.label}
                </p>
                <div className={s.megaBrandCopy}>
                  <p className={`t-brandline ${s.megaBrandline}`}>{menu.brandline}</p>
                  <p className={s.megaBrandNote}>{menu.brandNote}</p>
                </div>
                <div className={s.megaBrandMark} aria-hidden>
                  <PanelMark menu={menu} />
                </div>
              </div>

              <div className={s.megaBody}>
                <p className={`t-meta ${s.megaRecord}`}>{menuRecord(menu)}</p>
                <ul className={s.megaList}>
                  {menu.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className={s.megaLink} onClick={() => closeNow()}>
                        <span className={s.megaCh}>{link.ch ?? '—'}</span>
                        <span className={s.megaLinkMain}>
                          <span className={s.megaLabel}>{link.label}</span>
                          <span className={s.megaNote}>{link.note}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- MOBILE ---- full viewport, one thumb, SHOP never scrolls away. */}
      {menuOpen && (
        <div
          ref={sheetRef}
          className={s.sheet}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={s.sheetTop}>
            <Mastermark height={26} tone="ink" />
            <button type="button" className={s.sheetClose} onClick={() => setMenuOpen(false)} autoFocus>
              CLOSE
            </button>
          </div>

          <div className={s.sheetScroll}>
            <nav aria-label="Primary">
              <ul className={s.sheetNav}>
                {megaMenus.map((menu) => {
                  const isOpen = expanded === menu.key
                  return (
                    <li key={menu.key} className={s.sheetGroup}>
                      <button
                        type="button"
                        className={`${s.sheetLink} ${isOpen ? s.sheetLinkOpen : ''}`}
                        aria-expanded={isOpen}
                        aria-controls={`sheet-${menu.key}`}
                        onClick={() => setExpanded(isOpen ? null : menu.key)}
                      >
                        <span className={s.sheetMark} aria-hidden>
                          <InlineMark menu={menu} size={26} />
                        </span>
                        <span className={s.sheetWord}>{menu.label}</span>
                        <span className={s.sheetSign} aria-hidden>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>

                      <ul id={`sheet-${menu.key}`} className={s.sheetSub} hidden={!isOpen}>
                        <li>
                          <Link
                            href={menu.href}
                            className={s.sheetSubLink}
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className={s.sheetSubCh}>—</span>
                            <span>OVERVIEW</span>
                          </Link>
                        </li>
                        {menu.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className={s.sheetSubLink}
                              onClick={() => setMenuOpen(false)}
                            >
                              <span className={s.sheetSubCh}>{link.ch ?? '—'}</span>
                              <span>{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className={s.sheetSecondary}>
              {site.secondaryNav.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={s.sheetFoot}>
            <Link href={site.shopHref} className={s.sheetShop} onClick={() => setMenuOpen(false)}>
              SHOP WHOLE CACAO
            </Link>
            <p className={`t-meta ${s.sheetTagline}`}>{site.tagline}</p>
          </div>
        </div>
      )}
    </>
  )
}
