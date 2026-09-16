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
        'hover:border-forest border-line-strong bg-paper flex min-h-11 min-w-0 items-center gap-2 rounded-[var(--radius-control)] border px-2.5 text-left transition-colors',
        className,
      )}
    >
      <Icon name="LocationPin" size={19} className="shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="label text-forest-muted block whitespace-nowrap">
          {hydrated && confirmed ? 'Deliver to' : 'Set your area'}
        </span>
        <span className="block truncate text-sm leading-tight font-bold">
          {zone.area}
          <span className="hidden sm:inline">, {zone.parish}</span>
        </span>
      </span>
      <span
        className={cx(
          'hidden h-2 w-2 shrink-0 rounded-full sm:block',
          copy.tone === 'ok' && 'bg-leaf',
          copy.tone === 'caution' && 'bg-turmeric',
          copy.tone === 'blocked' && 'bg-nutmeg',
        )}
      >
        <span className="sr-only">{copy.label}</span>
      </span>
      <Icon name="ChevronDown" size={16} className="shrink-0" />
    </button>
  );
}
