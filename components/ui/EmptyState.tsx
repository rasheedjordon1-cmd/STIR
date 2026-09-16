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
  const border =
    tone === 'blocked'
      ? 'border-nutmeg/40 bg-nutmeg-wash'
      : tone === 'caution'
        ? 'border-cocoa/30 bg-turmeric-wash'
        : 'border-line-strong bg-paper';
  const mark =
    tone === 'blocked' ? 'text-nutmeg' : tone === 'caution' ? 'text-cocoa' : 'text-forest-muted';

  return (
    <div className={cx('rounded-[var(--radius-card)] border px-5 py-8 text-center', border, className)}>
      <span
        className={cx(
          'mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full border border-current',
          mark,
        )}
      >
        <Icon name={icon} size={24} />
      </span>
      <Heading className={level <= 2 ? 'text-xl' : 'text-md'}>{title}</Heading>
      <p className="text-forest-muted mx-auto mt-1.5 max-w-sm text-sm">{body}</p>
      {children ? <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}
