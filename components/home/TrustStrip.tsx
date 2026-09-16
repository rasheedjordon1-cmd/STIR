import { Icon, type IconName } from '@/components/icons';
import { TRUST_POINTS } from '@/data/config';

/* ==========================================================================
   Delivery promise strip
   Four claims, each of which is either configurable in data/ or true of the
   platform itself. Nothing here is a slogan we cannot back.
   ========================================================================== */

export function TrustStrip() {
  return (
    <section className="bg-surface-green-soft" aria-label="How Spicemart operates">
      <div className="shell grid gap-x-8 gap-y-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((point) => (
          <div key={point.title} className="flex gap-2.5">
            <span className="text-state-success flex h-10 w-10 shrink-0 items-center justify-center">
              <Icon name={point.icon as IconName} size={24} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-md leading-tight font-bold">{point.title}</h3>
              <p className="text-text-secondary mt-1 text-sm">{point.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
