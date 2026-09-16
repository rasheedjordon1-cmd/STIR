import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { Category } from '@/types';

/* ==========================================================================
   CategoryCard — V2
   Aisle markers translated into digital form.

   V1 put a small tinted square inside a white bordered box, which made eight
   categories read as eight identical containers. V2 lets the tint own the
   whole card, drops the border to a hairline of the accent itself, and gives
   the icon real presence — it is the thing you navigate by, so it leads.

   A directional cue slides in on hover and focus. Nothing moves at rest.
   ========================================================================== */

const ACCENT: Record<Category['accent'], { surface: string; ink: string; edge: string }> = {
  leaf: {
    surface: 'bg-surface-green-soft',
    ink: 'text-state-success',
    edge: 'border-leaf-deep/18 hover:border-leaf-deep/45',
  },
  signal: {
    surface: 'bg-surface-green-soft',
    ink: 'text-state-success',
    edge: 'border-leaf-deep/18 hover:border-leaf-deep/45',
  },
  turmeric: {
    surface: 'bg-surface-yellow-soft',
    ink: 'text-state-warning',
    edge: 'border-cocoa/18 hover:border-cocoa/45',
  },
  nutmeg: {
    surface: 'bg-surface-nutmeg-soft',
    ink: 'text-state-danger',
    edge: 'border-nutmeg/18 hover:border-nutmeg/45',
  },
  teal: {
    surface: 'bg-surface-teal-soft',
    ink: 'text-state-info',
    edge: 'border-teal-ink/18 hover:border-teal-ink/45',
  },
  cocoa: {
    surface: 'bg-surface-cocoa-soft',
    ink: 'text-cocoa',
    edge: 'border-cocoa/18 hover:border-cocoa/45',
  },
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
  const accent = ACCENT[category.accent];

  return (
    <Link
      href={`/category/${category.handle}`}
      className={cx(
        'group relative flex min-h-[132px] flex-col justify-between gap-3 overflow-hidden rounded-[var(--radius-card)] border p-3.5',
        'transition-[border-color,transform] duration-[var(--duration-ui)] ease-[var(--ease-out-quint)]',
        accent.surface,
        accent.edge,
        className,
      )}
    >
      <span className={cx('block', accent.ink)}>
        <Icon
          name={category.icon as IconName}
          size={30}
          className="transition-transform duration-[var(--duration-ui)] ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5"
        />
      </span>

      <span className="flex items-end justify-between gap-2">
        <span className="min-w-0">
          <span className="font-display block text-md leading-[1.15] font-bold tracking-[-0.02em] text-balance">
            {category.title}
          </span>
          {count !== undefined ? (
            <span className="text-text-secondary num mt-0.5 block text-xs">{count} items</span>
          ) : null}
        </span>
        <span
          aria-hidden
          className={cx(
            'shrink-0 translate-x-[-3px] opacity-0 transition-[opacity,transform] duration-[var(--duration-ui)] ease-[var(--ease-out-quint)]',
            'group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
            accent.ink,
          )}
        >
          <Icon name="ChevronRight" size={18} />
        </span>
      </span>
    </Link>
  );
}
