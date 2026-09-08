import Link from 'next/link'
import { site } from '@/content/site'
import { Mastermark } from '@/components/ui/Mastermark'
import s from './chrome.module.css'

export function SiteFooter() {
  return (
    <footer className={`ground-ink ${s.footer}`}>
      <div className="shell">
        <div className={s.footerGrid}>
          <div className={s.footerCol}>
            <Mastermark height={28} />
            <p className="t-serif" style={{ color: 'var(--fg-2)', maxWidth: '30ch' }}>
              {site.tagline}
            </p>
          </div>

          <nav className={s.footerCol} aria-label="Footer — sections">
            <p className="t-label" style={{ color: 'var(--fg-meta)' }}>
              READ
            </p>
            {site.nav.map((item) => (
              <Link key={item.label} href={item.href} className={`t-label ${s.footerLink}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className={s.footerCol} aria-label="Footer — information">
            <p className="t-label" style={{ color: 'var(--fg-meta)' }}>
              INFORMATION
            </p>
            <Link href={site.shopHref} className={`t-label ${s.footerLink}`}>
              SHOP
            </Link>
            {site.secondaryNav.map((item) => (
              <Link key={item.label} href={item.href} className={`t-label ${s.footerLink}`}>
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
