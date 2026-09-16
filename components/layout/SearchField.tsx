'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { commerce } from '@/lib/commerce';
import { cx } from '@/lib/cx';
import type { Product } from '@/types';

/* ==========================================================================
   SearchField
   A combobox over the catalogue. Search is the primary way people find a
   known item in a grocery shop, so it is the widest control in the header and
   is reachable from every view.

   Suggestions come from the commerce adapter, so the same component works
   against the Storefront API's predictive search later.
   ========================================================================== */

export function SearchField({
  defaultValue = '',
  size = 'md',
  autoFocus,
  className,
}: {
  defaultValue?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const query = value.trim();
  const hasQuery = query.length >= 2;

  useEffect(() => {
    if (!hasQuery) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const found = await commerce.searchProducts(query, { limit: 6 });
      if (!cancelled) {
        setResults(found);
        setActive(-1);
      }
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hasQuery, query]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const go = (query: string) => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const options = hasQuery ? results : [];
    if (!open || options.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      router.push(`/product/${options[active].handle}`);
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  // Below two characters there is nothing to suggest, so the list is derived
  // away rather than cleared through state.
  const suggestions = hasQuery ? results : [];
  const showList = open && suggestions.length > 0;

  return (
    <div ref={containerRef} className={cx('relative', className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (value.trim()) go(value.trim());
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search Spicemart products
        </label>
        <div
          className={cx(
            'border-forest bg-paper flex items-center gap-2 rounded-[var(--radius-control)] border-2 pr-1 pl-3',
            'focus-within:outline-forest focus-within:outline-2 focus-within:outline-offset-2',
            size === 'lg' ? 'min-h-12' : 'min-h-11',
          )}
        >
          <Icon name="Search" size={19} className="text-forest-muted shrink-0" />
          <input
            id={`${listId}-input`}
            type="search"
            value={value}
            autoFocus={autoFocus}
            onChange={(event) => {
              setValue(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search rice, callaloo, coconut oil…"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-option-${active}` : undefined}
            className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="submit"
            className="bg-leaf text-paper hover:bg-leaf-deep inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[4px] px-3 text-sm font-semibold"
          >
            <Icon name="Search" size={16} />
            <span className="sr-only sm:not-sr-only">Search</span>
          </button>
        </div>
      </form>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Product suggestions"
          className="border-ink-line bg-paper absolute top-[calc(100%+6px)] right-0 left-0 z-50 overflow-hidden rounded-[var(--radius-control)] border-2 shadow-[var(--shadow-pop)]"
        >
          {suggestions.map((product, index) => (
            <li key={product.id} role="none">
              <button
                type="button"
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => {
                  router.push(`/product/${product.handle}`);
                  setOpen(false);
                }}
                className={cx(
                  'border-line flex w-full items-baseline gap-2 border-b px-3 py-2.5 text-left last:border-b-0',
                  index === active ? 'bg-leaf-wash' : 'bg-paper',
                )}
              >
                <span className="truncate text-sm font-semibold">{product.title}</span>
                <span className="text-forest-muted ml-auto shrink-0 text-xs">{product.vendor}</span>
              </button>
            </li>
          ))}
          <li role="none">
            <button
              type="button"
              onClick={() => go(value.trim())}
              className="bg-paper-sunk hover:bg-breadfruit w-full px-3 py-2.5 text-left text-sm font-semibold"
            >
              See all results for “{value.trim()}”
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
