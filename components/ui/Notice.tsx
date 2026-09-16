import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Notice
   Inline messaging. Tone is carried by an icon and a word as well as colour,
   so nothing depends on colour alone (WCAG 1.4.1).
   ========================================================================== */

type Tone = 'info' | 'ok' | 'caution' | 'error' | 'prototype';

const TONE: Record<Tone, { className: string; icon: IconName; word: string }> = {
  info: { className: 'border-teal-ink/30 bg-teal-wash text-forest', icon: 'Info', word: 'Note' },
  ok: { className: 'border-leaf-deep/30 bg-leaf-wash text-forest', icon: 'Check', word: 'Confirmed' },
  caution: { className: 'border-cocoa/35 bg-turmeric-wash text-forest', icon: 'Alert', word: 'Heads up' },
  error: { className: 'border-nutmeg/45 bg-nutmeg-wash text-forest', icon: 'Alert', word: 'Problem' },
  prototype: {
    className: 'border-line-strong bg-paper-sunk text-forest-muted',
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
        'flex gap-2.5 rounded-[var(--radius-control)] border px-3 py-2.5 text-sm',
        config.className,
        className,
      )}
    >
      <span className="mt-px shrink-0">
        <Icon name={config.icon} size={17} />
      </span>
      <p className="min-w-0">
        <span className="label mr-1.5 align-[1px]">{title ?? config.word}</span>
        {children}
      </p>
    </div>
  );
}
