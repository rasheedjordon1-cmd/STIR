import { Icon, type IconName } from '@/components/icons';
import { serviceCopy } from '@/lib/fulfillment';
import { cx } from '@/lib/cx';
import type { DeliveryZone } from '@/types';

/* ==========================================================================
   ServiceStatusPill
   The single visual answer to "will you actually bring this to me?".
   Tone is carried by an icon and a word as well as colour.
   ========================================================================== */

const TONE: Record<string, { className: string; icon: IconName }> = {
  ok: { className: 'bg-leaf-wash text-leaf-deep border-leaf-deep/35', icon: 'DeliveryVan' },
  caution: { className: 'bg-turmeric-wash text-cocoa border-cocoa/40', icon: 'StorePickup' },
  blocked: { className: 'bg-nutmeg-wash text-nutmeg border-nutmeg/40', icon: 'OutOfStock' },
};

export function ServiceStatusPill({
  zone,
  withDetail = false,
  className,
}: {
  zone: DeliveryZone;
  withDetail?: boolean;
  className?: string;
}) {
  const copy = serviceCopy(zone);
  const tone = TONE[copy.tone];
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] border px-2 py-1',
        tone.className,
        className,
      )}
    >
      <Icon name={tone.icon} size={14} />
      <span className="label">{copy.label}</span>
      {withDetail ? <span className="text-sm font-medium normal-case">· {copy.detail}</span> : null}
    </span>
  );
}
