import { useId } from 'react';
import { Icon } from '@/components/icons';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Form fields
   Labels are always visible and always associated. Errors are announced and
   carry an icon and words, never colour alone.
   ========================================================================== */

/* Calm by default, unmistakable on focus. Labels are always visible — nothing
   in this interface is labelled by placeholder alone. */
const CONTROL =
  'w-full min-h-11 rounded-[var(--radius-control)] border border-border-subtle bg-surface-card px-3.5 ' +
  'text-base text-text-primary placeholder:text-text-tertiary ' +
  'transition-[border-color,box-shadow] duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] ' +
  'hover:border-border-default ' +
  'focus:border-forest focus:outline-none focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2 ' +
  'aria-[invalid=true]:border-nutmeg';

export function Field({
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: { id: string; 'aria-describedby': string | undefined; 'aria-invalid': boolean }) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-semibold">
        {label}
        {optional ? <span className="text-text-tertiary font-normal">Optional</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-text-secondary text-sm">
          {hint}
        </p>
      ) : null}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) })}
      {error ? (
        <p id={errorId} className="text-state-danger flex items-center gap-1.5 text-sm font-semibold">
          <Icon name="Alert" size={15} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(CONTROL, className)} {...rest} />;
}

export function TextArea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(CONTROL, 'min-h-20 py-2.5', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(CONTROL, 'appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <span className="text-text-secondary pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
        <Icon name="ChevronDown" size={17} />
      </span>
    </div>
  );
}
