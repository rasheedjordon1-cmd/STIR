import { cx } from '@/lib/cx';

/* ==========================================================================
   SpecimenCompare
   Static before/after specimens for the V1 → V2 documentation. These are
   deliberately NOT duplicated production components — they are inert markup
   showing the old and new treatment side by side, so the design system can be
   read without keeping a dead copy of every component alive in the codebase.
   ========================================================================== */

export function Compare({
  label,
  before,
  after,
  note,
}: {
  label: string;
  before: React.ReactNode;
  after: React.ReactNode;
  note: string;
}) {
  return (
    <div className="border-border-subtle border-t pt-4">
      <p className="eyebrow mb-3">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ['V1', before, 'text-text-tertiary'],
            ['V2', after, 'text-state-success'],
          ] as const
        ).map(([version, node, ink]) => (
          <div key={version}>
            <p className={cx('mb-2 text-xs font-semibold', ink)}>{version}</p>
            <div className="bg-surface-page flex min-h-[132px] items-center justify-center rounded-[var(--radius-card)] p-4">
              {node}
            </div>
          </div>
        ))}
      </div>
      <p className="text-text-secondary mt-2.5 text-sm">{note}</p>
    </div>
  );
}
