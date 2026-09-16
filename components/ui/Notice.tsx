import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Notice — V2
   An accent rail on a soft surface, rather than a full outlined rectangle.
   That removes one border from every notice on the site and lets a notice sit
   inside a module without looking like a nested box.

   Tone is carried by an icon and a word as well as colour (WCAG 1.4.1). The
   prototype tone is deliberately the quietest of the five: a disclaimer must
   stay visible without reading as an error.
   ========================================================================== */

type Tone = 'info' | 'ok' | 'caution' | 'error' | 'prototype';

const TONE: Record<Tone, { surface: string; rail: string; ink: string; icon: IconName; word: string }> = {
  info: {
    surface: 'bg-surface-teal-soft',
    rail: 'bg-teal',
    ink: 'text-state-info',
    icon: 'Info',
    word: 'Note',
  },
  ok: {
    surface: 'bg-surface-green-soft',
    rail: 'bg-leaf',
    ink: 'text-state-success',
    icon: 'Check',
    word: 'Confirmed',
  },
  caution: {
    surface: 'bg-surface-yellow-soft',
    rail: 'bg-turmeric',
    ink: 'text-state-warning',
    icon: 'Alert',
    word: 'Heads up',
  },
  error: {
    surface: 'bg-surface-nutmeg-soft',
    rail: 'bg-nutmeg',
    ink: 'text-state-danger',
    icon: 'Alert',
    word: 'Problem',
  },
  prototype: {
    surface: 'bg-surface-sunk',
    rail: 'bg-border-default',
    ink: 'text-text-secondary',
    icon: 'Info',
    word: 'Prototype',
  },
};

export function Notice({
  tone = 'info',
  title,
  children,
  className,
  role,
}: {
  tone?: Tone;
  title?: string;
  children: React.ReactNode;
  className?: string;
  role?: 'status' | 'alert';
}) {
  const config = TONE[tone];
  return (
    <div
      role={role}
      className={cx(
        'flex gap-3 overflow-hidden rounded-[var(--radius-control)] py-2.5 pr-3.5 pl-3 text-sm',
        'relative before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:content-[""]',
        config.surface,
        className,
      )}
    >
      <span aria-hidden className={cx('absolute inset-y-0 left-0 w-[3px]', config.rail)} />
      <span className={cx('mt-px shrink-0', config.ink)}>
        <Icon name={config.icon} size={16} />
      </span>
      <p className="min-w-0 text-text-primary">
        <span className={cx('mr-1.5 font-semibold', config.ink)}>{title ?? config.word}</span>
        {children}
      </p>
    </div>
  );
}
