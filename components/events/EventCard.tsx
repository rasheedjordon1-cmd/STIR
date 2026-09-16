import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { formatEventDate, formatTimeRange, relativeDay } from '@/lib/format';
import { cx } from '@/lib/cx';
import type { SpiceFairEvent } from '@/types';

/* ==========================================================================
   EventCard — V2
   The date is the subject, set at display scale. V1 gave the edition number,
   the date, the venue and the time four near-equal rows, which made an event
   read like a product. Here the date leads, the venue supports it, and
   collection status — the thing that connects the fair back to the shop — is
   the only badge.
   ========================================================================== */

export function EventCard({
  event,
  tone = 'light',
  className,
}: {
  event: SpiceFairEvent;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const past = event.status === 'past';

  return (
    <article
      className={cx(
        'group flex h-full flex-col rounded-[var(--radius-card)] p-4 transition-colors duration-[var(--duration-ui)]',
        tone === 'dark'
          ? 'border-border-inverse hover:border-turmeric/60 border'
          : 'bg-surface-card border-border-subtle hover:border-border-default border',
        past && 'opacity-70',
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold opacity-70">Edition {event.edition}</p>
          <p className="font-display mt-1 text-xl leading-[1.05] font-bold tracking-[-0.035em]">
            {formatEventDate(event.date)}
          </p>
        </div>
        {past ? (
          <Badge tone="neutral">Past</Badge>
        ) : event.pickupEnabled ? (
          <Badge tone={event.status === 'on-sale' ? 'fair' : 'neutral'}>
            {event.status === 'on-sale' ? 'Collection open' : 'Collection closed'}
          </Badge>
        ) : (
          <Badge tone="neutral">Market only</Badge>
        )}
      </div>

      <dl className="flex flex-col gap-1.5 text-sm">
        <div className="flex items-start gap-2">
          <dt className="sr-only">Venue</dt>
          <Icon name="LocationPin" size={16} className="mt-0.5 shrink-0 opacity-60" />
          <dd>
            {event.venue}
            <span className="block opacity-70">
              {event.area}, {event.parish}
            </span>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Time</dt>
          <Icon name="Clock" size={16} className="shrink-0 opacity-60" />
          <dd className="num">{formatTimeRange(event.startTime, event.endTime)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="text-xs font-semibold opacity-70">{relativeDay(event.date)}</span>
        <Link
          href={`/spice-fair/${event.id}`}
          className={cx(
            'inline-flex min-h-9 items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline',
            tone === 'dark' ? 'text-turmeric' : 'text-state-success',
          )}
        >
          {past ? 'See what happened' : 'Event details'}
          <Icon
            name="ChevronRight"
            size={15}
            className="transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
