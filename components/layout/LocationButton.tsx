'use client';

import { Icon } from '@/components/icons';
import { serviceCopy } from '@/lib/fulfillment';
import { useLocation } from '@/lib/store/location';
import { useUI } from '@/lib/store/ui';
import { cx } from '@/lib/cx';

/* ==========================================================================
   LocationButton
   "Deliver to" is the first thing the header states, because every promise
   the platform makes downstream depends on it.
   ========================================================================== */

export function LocationButton({ className }: { className?: string }) {
  const { zone, confirmed, hydrated } = useLocation();
  const { openLocation } = useUI();
  const copy = serviceCopy(zone);

  return (
    <button
      type="button"
      onClick={openLocation}
      className={cx(
        'border-border-subtle bg-surface-card hover:border-border-default flex min-h-11 min-w-0 items-center gap-2.5 rounded-[var(--radius-control)] border px-3 text-left',
        'transition-colors duration-[var(--duration-tap)]',
        className,
      )}
    >
      <span className="relative shrink-0">
        <Icon name="LocationPin" size={20} />
        <span
          className={cx(
            'border-surface-card absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2',
            copy.tone === 'ok' && 'bg-leaf',
            copy.tone === 'caution' && 'bg-turmeric',
            copy.tone === 'blocked' && 'bg-nutmeg',
          )}
        >
          <span className="sr-only">{copy.label}</span>
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-text-secondary block text-xs whitespace-nowrap">
          {hydrated && confirmed ? 'Deliver to' : 'Set your area'}
        </span>
        <span className="block truncate text-sm leading-tight font-semibold">
          {zone.area}
          <span className="hidden sm:inline">, {zone.parish}</span>
        </span>
      </span>
      <Icon name="ChevronDown" size={16} className="text-text-secondary shrink-0" />
    </button>
  );
}
