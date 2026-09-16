'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { IconButton } from './Button';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Overlay
   The shared dialog behaviour for the cart drawer and the location sheet:
   labelled dialog role, Escape to close, click-outside to close, initial
   focus moved inside, Tab cycled within, and focus returned to whatever
   opened it. Both overlays are therefore fully keyboard operable.
   ========================================================================== */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Overlay({
  open,
  onClose,
  title,
  description,
  side = 'right',
  children,
  footer,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: 'right' | 'bottom';
  children: React.ReactNode;
  footer?: React.ReactNode;
  labelledBy?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const headingId = useId();
  const descriptionId = useId();

  const focusables = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    [],
  );

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    // Focus the panel itself, so a screen reader announces the dialog name
    // before its contents rather than jumping to the first control.
    const id = window.requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(id);
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [focusables, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label={`Close ${title.toLowerCase()}`}
        onClick={onClose}
        className="anim-fade absolute inset-0 h-full w-full cursor-default bg-forest/50"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? headingId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx(
          'bg-surface-page absolute flex flex-col outline-none',
          side === 'right'
            ? 'anim-drawer top-0 right-0 h-full w-full max-w-[27rem] border-l border-border-subtle shadow-[var(--shadow-overlay)]'
            : 'anim-rise inset-x-0 bottom-0 max-h-[88vh] rounded-t-[var(--radius-module)] border-t border-border-subtle shadow-[var(--shadow-overlay)] sm:inset-x-auto sm:top-0 sm:right-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-[30rem] sm:rounded-none sm:border-t-0 sm:border-l',
        )}
      >
        <header className="border-border-subtle flex items-start justify-between gap-3 border-b border-border-subtle px-4 py-3">
          <div className="min-w-0 pt-1">
            <h2 id={headingId} className="text-lg">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-text-secondary mt-0.5 text-sm">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton name="Close" label={`Close ${title.toLowerCase()}`} onClick={onClose} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">{children}</div>

        {footer ? (
          <footer className="border-border-subtle bg-surface-card safe-bottom border-t px-4 py-3">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
}
