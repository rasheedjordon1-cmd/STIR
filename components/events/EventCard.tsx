import Link from 'next/link';
import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { formatEventDate, formatTimeRange, relativeDay } from '@/lib/format';
import { cx } from '@/lib/cx';
import type { SpiceFairEvent } from '@/types';

/* ==========================================================================
   EventCard
   One edition of the fair. Collection status is stated on every card,
   because "can I collect my order here?" is the question that connects the
   event back to the shop.
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
        'flex h-full flex-col rounded-[var(--radius-card)] border p-3.5 transition-colors',
        tone === 'dark'
          ? 'border-breadfruit/25 bg-forest text-breadfruit hover:border-turmeric'
          : 'border-line-strong bg-paper hover:border-forest',
        past && 'opacity-75',
        className,
      )}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <p className="label opacity-70">Edition {event.edition}</p>
          <p className="font-display mt-0.5 text-lg leading-tight font-bold tracking-tight">
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
          <Icon name="LocationPin" size={16} className="mt-0.5 shrink-0 opacity-70" />
          <dd>
            {event.venue}
            <span className="block opacity-70">
              {event.area}, {event.parish}
            </span>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Time</dt>
          <Icon name="Clock" size={16} className="shrink-0 opacity-70" />
          <dd className="num">{formatTimeRange(event.startTime, event.endTime)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="label opacity-70">{relativeDay(event.date)}</span>
        <Link
          href={`/spice-fair/${event.id}`}
          className={cx(
            'inline-flex min-h-9 items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline',
            tone === 'dark' ? 'text-turmeric' : 'text-leaf-deep',
          )}
        >
          {past ? 'See what happened' : 'Event details'}
          <Icon name="ChevronRight" size={15} />
        </Link>
      </div>
    </article>
  );
}
