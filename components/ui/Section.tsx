import { TextAction } from './Button';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Section + SectionHead — V2
   V1 opened every section with a full-width 2px rule, which gave the homepage
   one repeating drumbeat and made all sections weigh the same. V2 replaces the
   rule with a short accent marker and lets surface, spacing and composition
   carry the rhythm instead.

   `tone` is how a section changes energy without changing its structure.
   ========================================================================== */

type Tone = 'default' | 'sunk' | 'inverse';

const TONE: Record<Tone, string> = {
  default: '',
  sunk: 'bg-surface-sunk',
  inverse: 'bg-surface-inverse text-text-inverse on-dark',
};

export function Section({
  children,
  className,
  id,
  tone = 'default',
  /** Tighter vertical rhythm, for modules that sit close to their neighbour. */
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: Tone;
  compact?: boolean;
}) {
  return (
    <section
      id={id}
      className={cx(
        compact ? 'py-[calc(var(--section-gap)*0.3)]' : 'section-y',
        TONE[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

const MARKER: Record<string, string> = {
  leaf: 'bg-leaf',
  turmeric: 'bg-turmeric',
  nutmeg: 'bg-nutmeg',
  teal: 'bg-teal',
  cocoa: 'bg-cocoa',
  inverse: 'bg-turmeric',
};

export function SectionHead({
  eyebrow,
  title,
  blurb,
  href,
  linkLabel = 'See all',
  /** The accent marker is how a section signals which part of the system it belongs to. */
  accent = 'leaf',
  className,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  href?: string;
  linkLabel?: string;
  accent?: keyof typeof MARKER;
  className?: string;
}) {
  return (
    <div className={cx('mb-[var(--section-head-gap)]', className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? (
            <p className="mb-2 flex items-center gap-2">
              <span className={cx('h-[3px] w-7 rounded-full', MARKER[accent])} aria-hidden />
              <span className="eyebrow text-text-secondary">{eyebrow}</span>
            </p>
          ) : null}
          <h2 className="text-xl md:text-2xl">{title}</h2>
          {blurb ? (
            <p className="text-text-secondary mt-2 max-w-[54ch] text-base">{blurb}</p>
          ) : null}
        </div>
        {href ? (
          <TextAction href={href} className="shrink-0">
            {linkLabel}
          </TextAction>
        ) : null}
      </div>
    </div>
  );
}
