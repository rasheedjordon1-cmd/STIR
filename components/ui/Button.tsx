import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Button — V2
   Four intents on a single geometry. The secondary button no longer carries a
   heavy second outline: it is a warm surface with a hairline, so a primary and
   a secondary sitting side by side read as a clear hierarchy rather than two
   competing rectangles.

   Every intent shares the same press behaviour — a 1px settle — so the whole
   interface feels like one piece of hardware.
   ========================================================================== */

type Intent = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const INTENT: Record<Intent, string> = {
  // Leaf on warm light clears 4.9:1. Signal Green is never a text ground.
  primary: 'bg-leaf text-surface-card border-leaf hover:bg-leaf-deep hover:border-leaf-deep',
  secondary:
    'bg-surface-card text-text-primary border-border-default hover:border-border-strong hover:bg-surface-page',
  tertiary:
    'bg-transparent text-text-primary border-transparent hover:bg-forest/6 underline-offset-4',
  accent: 'bg-turmeric text-forest border-turmeric hover:bg-turmeric/88',
  inverse: 'bg-surface-page text-forest border-breadfruit hover:bg-surface-raised',
};

const SIZE: Record<Size, string> = {
  sm: 'min-h-10 px-3 text-sm gap-1.5',
  md: 'min-h-11 px-4 text-base gap-2',
  lg: 'min-h-12 px-5 text-md gap-2.5',
};

const BASE =
  'inline-flex items-center justify-center rounded-[var(--radius-control)] border font-semibold ' +
  'transition-[background-color,border-color,color,transform] duration-[var(--duration-tap)] ' +
  'ease-[var(--ease-out-quint)] active:translate-y-px ' +
  'disabled:opacity-45 disabled:pointer-events-none text-center leading-tight';

interface Common {
  intent?: Intent;
  size?: Size;
  icon?: IconName;
  iconAfter?: IconName;
  block?: boolean;
  children: ReactNode;
  className?: string;
}

const iconSize = (size: Size) => (size === 'sm' ? 16 : size === 'lg' ? 20 : 18);

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
    <button className={cx(BASE, INTENT[intent], SIZE[size], block && 'w-full', className)} {...rest}>
      {icon ? <Icon name={icon} size={iconSize(size)} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={iconSize(size)} /> : null}
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
      {icon ? <Icon name={icon} size={iconSize(size)} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={iconSize(size)} /> : null}
    </Link>
  );
}

/**
 * Tertiary action: text plus an icon, with no surrounding box. Used where an
 * action supports the page rather than driving it — "see all", "change area".
 */
export function TextAction({
  href,
  icon,
  iconAfter = 'ChevronRight',
  children,
  className,
  onClick,
}: {
  href?: string;
  icon?: IconName;
  iconAfter?: IconName | null;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      {icon ? <Icon name={icon} size={16} /> : null}
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      {iconAfter ? (
        <Icon
          name={iconAfter}
          size={15}
          className="transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  const classes = cx(
    'group inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-state-success',
    className,
  );

  return href ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
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
        'text-text-primary transition-colors duration-[var(--duration-tap)] hover:bg-forest/8',
        className,
      )}
      {...rest}
    >
      <Icon name={name} size={size} />
    </button>
  );
}
