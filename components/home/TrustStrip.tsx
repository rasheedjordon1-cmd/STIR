import { Icon, type IconName } from '@/components/icons';
import { TRUST_POINTS } from '@/data/config';

/* ==========================================================================
   Delivery promise strip
   Four claims, each of which is either configurable in data/ or true of the
   platform itself. Nothing here is a slogan we cannot back.
   ========================================================================== */

export function TrustStrip() {
  return (
    <section className="border-ink-line bg-signal-wash border-y-2" aria-label="How Spicemart operates">
      <div className="shell grid gap-x-6 gap-y-4 py-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((point) => (
          <div key={point.title} className="flex gap-2.5">
            <span className="text-leaf-deep border-leaf-deep/35 bg-paper flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] border">
              <Icon name={point.icon as IconName} size={21} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold">{point.title}</h3>
              <p className="text-forest-muted mt-0.5 text-sm">{point.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
