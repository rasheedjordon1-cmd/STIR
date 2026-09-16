import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Badge — V2
   Merchandising and status labels. V1 set every badge in uppercase, which made
   a product grid read as texture rather than information. Badges are now
   sentence case at a comfortable weight; only the true status chips
   (availability) keep the uppercase infrastructure treatment.

   Product cards show at most two, in the priority order defined by
   badgesFor() in components/commerce/badges.ts.
   ========================================================================== */

type Tone = 'local' | 'fresh' | 'deal' | 'multibuy' | 'low' | 'out' | 'neutral' | 'fair' | 'new';

const TONE: Record<Tone, string> = {
  local: 'bg-surface-green-soft text-state-success',
  fresh: 'bg-surface-green-soft text-state-success',
  deal: 'bg-nutmeg text-surface-card',
  multibuy: 'bg-surface-yellow-soft text-state-warning',
  low: 'bg-surface-yellow-soft text-state-warning',
  out: 'bg-surface-sunk text-text-secondary',
  neutral: 'bg-surface-sunk text-text-secondary',
  fair: 'bg-turmeric text-forest',
  new: 'bg-surface-teal-soft text-state-info',
};

export function Badge({
  tone = 'neutral',
  icon,
  uppercase = false,
  children,
  className,
}: {
  tone?: Tone;
  icon?: IconName;
  /** Reserve for status chips that behave like signage. */
  uppercase?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-[var(--radius-chip)] px-1.5 py-[3px] leading-none',
        uppercase ? 'label' : 'text-xs font-semibold',
        TONE[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}
