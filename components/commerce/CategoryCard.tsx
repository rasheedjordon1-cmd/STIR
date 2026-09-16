import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { Category } from '@/types';

/* ==========================================================================
   CategoryCard
   Tiles are wayfinding, not decoration: a strong icon, a single word, and a
   count. The accent is a flat ground behind the icon so the tiles read as a
   set at a glance without eight competing colour fields.
   ========================================================================== */

const ACCENT: Record<Category['accent'], string> = {
  leaf: 'bg-leaf-wash text-leaf-deep',
  signal: 'bg-signal-wash text-leaf-deep',
  turmeric: 'bg-turmeric-wash text-cocoa',
  nutmeg: 'bg-nutmeg-wash text-nutmeg',
  teal: 'bg-teal-wash text-teal-ink',
  cocoa: 'bg-cocoa-wash text-cocoa',
};

export function CategoryCard({
  category,
  count,
  className,
}: {
  category: Category;
  count?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/category/${category.handle}`}
      className={cx(
        'border-line-strong bg-paper hover:border-forest group flex min-h-[104px] flex-col justify-between gap-2 rounded-[var(--radius-card)] border p-3 transition-colors',
        className,
      )}
    >
      <span
        className={cx(
          'flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)]',
          ACCENT[category.accent],
        )}
      >
        <Icon name={category.icon as IconName} size={24} />
      </span>
      <span>
        <span className="block text-sm leading-tight font-bold">{category.title}</span>
        {count !== undefined ? (
          <span className="text-forest-muted num block text-xs">{count} items</span>
        ) : null}
      </span>
    </Link>
  );
}
