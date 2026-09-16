'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   BottomNav
   Five destinations, mobile only. The basket is deliberately not here — it
   lives in the sticky header, so browsing, ordering and account access each
   keep a permanent slot.
   ========================================================================== */

const ITEMS: { href: string; label: string; icon: IconName; match: (path: string) => boolean }[] = [
  { href: '/', label: 'Home', icon: 'Home', match: (p) => p === '/' },
  {
    href: '/category/groceries',
    label: 'Categories',
    icon: 'Categories',
    match: (p) => p.startsWith('/category') || p.startsWith('/search'),
  },
  { href: '/account/orders', label: 'Orders', icon: 'Orders', match: (p) => p.startsWith('/account/orders') },
  { href: '/rewards', label: 'Rewards', icon: 'Rewards', match: (p) => p.startsWith('/rewards') },
  { href: '/account', label: 'Account', icon: 'Account', match: (p) => p === '/account' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="border-border-subtle bg-surface-raised safe-bottom fixed inset-x-0 bottom-0 z-50 border-t shadow-[var(--shadow-sticky)] lg:hidden"
    >
      <ul className="grid list-none grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex min-h-[60px] flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-center',
                  'transition-colors duration-[var(--duration-tap)]',
                  active ? 'text-state-success' : 'text-text-secondary',
                )}
              >
                <Icon name={item.icon} size={22} />
                <span className="text-[11px] font-semibold">{item.label}</span>
                <span
                  aria-hidden
                  className={cx('h-[2px] w-6 rounded-full', active ? 'bg-leaf' : 'bg-transparent')}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
