import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Button
   Four intents, three sizes. Every interactive size is at least 44px tall on
   the sizes used for real actions; `sm` is reserved for inline controls that
   sit inside a larger tap target.
   ========================================================================== */

type Intent = 'primary' | 'secondary' | 'quiet' | 'accent' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const INTENT: Record<Intent, string> = {
  // Leaf on white clears 5.2:1 — Signal Green never carries white text.
  primary: 'bg-leaf text-paper border-leaf hover:bg-leaf-deep hover:border-leaf-deep',
  secondary: 'bg-paper text-forest border-forest hover:bg-breadfruit',
  quiet: 'bg-transparent text-forest border-transparent hover:bg-forest/8 underline-offset-4',
  accent: 'bg-turmeric text-forest border-forest hover:bg-turmeric/85',
  inverse: 'bg-breadfruit text-forest border-breadfruit hover:bg-paper',
};

const SIZE: Record<Size, string> = {
  sm: 'min-h-10 px-3 text-sm gap-1.5',
  md: 'min-h-11 px-4 text-base gap-2',
  lg: 'min-h-12 px-5 text-md gap-2.5',
};

const BASE =
  'inline-flex items-center justify-center rounded-[var(--radius-control)] border font-semibold ' +
  'transition-colors duration-[var(--duration-tap)] disabled:opacity-45 disabled:pointer-events-none ' +
  'text-center leading-tight';

interface Common {
  intent?: Intent;
  size?: Size;
  icon?: IconName;
  iconAfter?: IconName;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  intent = 'primary',
  size = 'md',
  icon,
  iconAfter,
  block,
  className,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(BASE, INTENT[intent], SIZE[size], block && 'w-full', className)}
      {...rest}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 19} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={size === 'sm' ? 16 : 19} /> : null}
    </button>
  );
}

export function ButtonLink({
  intent = 'primary',
  size = 'md',
  icon,
  iconAfter,
  block,
  className,
  children,
  href,
  ...rest
}: Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <Link
      href={href}
      className={cx(BASE, INTENT[intent], SIZE[size], block && 'w-full', className)}
      {...rest}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 19} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={size === 'sm' ? 16 : 19} /> : null}
    </Link>
  );
}

/** Square icon-only control. Always needs a label for assistive technology. */
export function IconButton({
  name,
  label,
  size = 22,
  className,
  ...rest
}: { name: IconName; label: string; size?: number } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)]',
        'text-forest transition-colors duration-[var(--duration-tap)] hover:bg-forest/8',
        className,
      )}
      {...rest}
    >
      <Icon name={name} size={size} />
    </button>
  );
}
