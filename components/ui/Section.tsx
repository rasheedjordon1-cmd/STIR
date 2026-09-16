import Link from 'next/link';
import { Icon } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Section + SectionHead
   The homepage rhythm: a rule, an eyebrow, a title, an optional link out.
   Consistent spacing here is what stops the page reading as stacked widgets.
   ========================================================================== */

export function Section({
  children,
  className,
  id,
  tone = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: 'default' | 'sunk';
}) {
  return (
    <section
      id={id}
      className={cx(
        'py-9 md:py-12',
        tone === 'sunk' && 'bg-paper-sunk border-y border-line',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  blurb,
  href,
  linkLabel = 'See all',
  className,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cx('mb-4 border-t-2 border-ink-line pt-3 md:mb-5', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          {eyebrow ? <p className="label text-forest-muted mb-1.5">{eyebrow}</p> : null}
          <h2 className="text-xl md:text-2xl">{title}</h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex min-h-11 shrink-0 items-center gap-1 py-1 text-sm font-semibold text-leaf-deep underline-offset-4 hover:underline"
          >
            {linkLabel}
            <Icon name="ChevronRight" size={15} />
          </Link>
        ) : null}
      </div>
      {blurb ? <p className="text-forest-muted mt-1.5 max-w-prose text-sm">{blurb}</p> : null}
    </div>
  );
}
