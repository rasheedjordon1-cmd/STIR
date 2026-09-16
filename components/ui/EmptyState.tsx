import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   EmptyState
   Used for every empty, error and unavailable case in the product. An empty
   state has to do three things: say what happened, say why, and offer the
   next useful action. No shrugging illustrations.
   ========================================================================== */

export function EmptyState({
  icon,
  title,
  body,
  tone = 'neutral',
  /** Heading level, so the state slots into the page outline without a jump. */
  level = 3,
  children,
  className,
}: {
  icon: IconName;
  title: string;
  body: string;
  tone?: 'neutral' | 'caution' | 'blocked';
  level?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
  className?: string;
}) {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  // V2: an empty state is a surface, not an outlined box. Only the icon well
  // carries a hairline, which keeps the focal point without a second rectangle.
  const surface =
    tone === 'blocked'
      ? 'bg-surface-nutmeg-soft'
      : tone === 'caution'
        ? 'bg-surface-yellow-soft'
        : 'bg-surface-card';
  const mark =
    tone === 'blocked'
      ? 'text-state-danger'
      : tone === 'caution'
        ? 'text-state-warning'
        : 'text-text-secondary';

  return (
    <div
      className={cx(
        'rounded-[var(--radius-module)] px-5 py-10 text-center',
        surface,
        tone === 'neutral' && 'border border-border-subtle',
        className,
      )}
    >
      <span
        className={cx(
          'bg-surface-card/70 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full',
          mark,
        )}
      >
        <Icon name={icon} size={24} />
      </span>
      <Heading className={level <= 2 ? 'text-xl' : 'text-lg'}>{title}</Heading>
      <p className="text-text-secondary mx-auto mt-2 max-w-[46ch] text-base">{body}</p>
      {children ? <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
