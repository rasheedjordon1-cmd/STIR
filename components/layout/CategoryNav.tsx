'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { CATEGORIES } from '@/data/categories';
import { cx } from '@/lib/cx';

/** Desktop aisle bar. The Spice Fair sits at the end, visually separated. */
export function CategoryNav() {
  const pathname = usePathname();
  const items = CATEGORIES.filter((c) => c.inMainNav);

  return (
    <nav aria-label="Shop by category" className="border-line hidden border-t lg:block">
      <div className="shell">
        <ul className="flex list-none items-center gap-0.5">
          {items.map((category) => {
            const href = `/category/${category.handle}`;
            const active = pathname === href;
            return (
              <li key={category.handle}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'flex min-h-10 items-center gap-1.5 border-b-2 px-2.5 text-sm font-semibold transition-colors',
                    active
                      ? 'border-leaf-deep text-leaf-deep'
                      : 'hover:border-forest border-transparent',
                  )}
                >
                  <Icon name={category.icon as IconName} size={17} />
                  {category.title}
                </Link>
              </li>
            );
          })}
          <li className="ml-auto">
            <Link
              href="/spice-fair"
              aria-current={pathname.startsWith('/spice-fair') ? 'page' : undefined}
              className={cx(
                'flex min-h-10 items-center gap-1.5 border-b-2 px-2.5 text-sm font-bold transition-colors',
                pathname.startsWith('/spice-fair')
                  ? 'border-turmeric text-cocoa'
                  : 'hover:border-turmeric border-transparent',
              )}
            >
              <Icon name="MarketStall" size={17} />
              The Spice Fair
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
