import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Badge
   Merchandising and status labels. Product cards show at most two, in the
   priority order defined by badgesFor() in components/commerce/badges.ts.
   ========================================================================== */

type Tone = 'local' | 'fresh' | 'deal' | 'multibuy' | 'low' | 'out' | 'neutral' | 'fair' | 'new';

const TONE: Record<Tone, string> = {
  local: 'bg-leaf-wash text-leaf-deep border-leaf-deep/30',
  fresh: 'bg-signal-wash text-leaf-deep border-leaf-deep/30',
  deal: 'bg-nutmeg text-paper border-nutmeg',
  multibuy: 'bg-turmeric-wash text-cocoa border-cocoa/30',
  low: 'bg-turmeric-wash text-cocoa border-cocoa/40',
  out: 'bg-paper-sunk text-forest-muted border-line-strong',
  neutral: 'bg-paper-sunk text-forest border-line-strong',
  fair: 'bg-turmeric text-forest border-forest',
  new: 'bg-teal-wash text-teal-ink border-teal-ink/30',
};

export function Badge({
  tone = 'neutral',
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: IconName;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'label inline-flex items-center gap-1 rounded-[var(--radius-chip)] border px-1.5 py-[3px]',
        TONE[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={12} /> : null}
      {children}
    </span>
  );
}
