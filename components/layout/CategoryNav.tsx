'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { CATEGORIES } from '@/data/categories';
import { cx } from '@/lib/cx';

/* ==========================================================================
   CategoryNav — V2
   The aisle bar. V1 gave every category a border-bottom slot of equal weight,
   which read as eight buttons. V2 sets them as plain wayfinding: one icon
   scale, one weight, and a single marker under the active aisle.

   The Spice Fair sits at the end, separated by a hairline and marked in
   Turmeric — related to the system, distinct in purpose.
   ========================================================================== */

export function CategoryNav() {
  const pathname = usePathname();
  const items = CATEGORIES.filter((c) => c.inMainNav);
  const fairActive = pathname.startsWith('/spice-fair');

  return (
    <nav
      aria-label="Shop by category"
      className="border-border-subtle hidden border-t lg:block"
    >
      <div className="shell">
        <ul className="flex list-none items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((category) => {
            const href = `/category/${category.handle}`;
            const active = pathname === href;
            return (
              <li key={category.handle} className="shrink-0">
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'relative flex min-h-11 items-center gap-2 px-2.5 text-sm font-semibold',
                    'transition-colors duration-[var(--duration-tap)]',
                    active ? 'text-state-success' : 'text-text-primary hover:text-state-success',
                  )}
                >
                  <Icon name={category.icon as IconName} size={18} />
                  {category.title}
                  <span
                    aria-hidden
                    className={cx(
                      'bg-leaf absolute inset-x-2.5 bottom-0 h-[2px] rounded-t-full transition-opacity duration-[var(--duration-tap)]',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </Link>
              </li>
            );
          })}

          <li className="border-border-subtle ml-auto shrink-0 border-l pl-2">
            <Link
              href="/spice-fair"
              aria-current={fairActive ? 'page' : undefined}
              className={cx(
                'relative flex min-h-11 items-center gap-2 px-2.5 text-sm font-bold',
                'transition-colors duration-[var(--duration-tap)]',
                fairActive ? 'text-state-warning' : 'text-text-primary hover:text-state-warning',
              )}
            >
              <Icon name="MarketStall" size={18} />
              The Spice Fair
              <span
                aria-hidden
                className={cx(
                  'bg-turmeric absolute inset-x-2.5 bottom-0 h-[2px] rounded-t-full transition-opacity duration-[var(--duration-tap)]',
                  fairActive ? 'opacity-100' : 'opacity-0',
                )}
              />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
