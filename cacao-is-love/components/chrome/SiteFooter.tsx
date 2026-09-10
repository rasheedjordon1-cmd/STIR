import Link from 'next/link'
import { site } from '@/content/site'
import { Mastermark } from '@/components/cil/Mastermark'
import { SeedChamber } from '@/components/cil/CilMarks'
import s from './chrome.module.css'

export function SiteFooter() {
  return (
    <footer className={`field-ink ${s.footer}`}>
      <div className="shell">
        <div className={s.footerGrid}>
          <div className={s.footerCol}>
            <Mastermark height={44} tone="cream" />
            <p className="t-lede" style={{ maxWidth: '26ch', marginTop: 'var(--s-2)' }}>
              {site.tagline}
            </p>
          </div>

          <nav className={s.footerCol} aria-label="Footer — sections">
            <p className="t-label">READ</p>
            {site.nav.map((item) => (
              <Link key={item.label} href={item.href} className={`t-label ${s.footerLink}`}>
                <SeedChamber size={11} />
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className={s.footerCol} aria-label="Footer — information">
            <p className="t-label">INFORMATION</p>
            <Link href={site.shopHref} className={`t-label ${s.footerLink}`}>
              <SeedChamber size={11} />
              SHOP
            </Link>
            {site.secondaryNav.map((item) => (
              <Link key={item.label} href={item.href} className={`t-label ${s.footerLink}`}>
                <SeedChamber size={11} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`t-meta ${s.footerBottom}`}>
          <span>{site.footer.lines.join(' · ')}</span>
          <span>{site.footer.legal}</span>
        </div>
      </div>
    </footer>
  )
}
