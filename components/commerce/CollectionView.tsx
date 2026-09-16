'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Field';
import { ProductGrid } from './ProductGrid';
import { CATEGORIES } from '@/data/categories';
import { SORT_OPTIONS, sortProducts } from '@/lib/search';
import { pluralise } from '@/lib/format';
import { cx } from '@/lib/cx';
import type { Product, SortKey } from '@/types';

/* ==========================================================================
   CollectionView
   The shared listing surface for a category and for search results. Filters
   are the four questions people actually ask of a grocery shelf — is it
   local, is it fresh, is it reduced, can I get it today — plus a category
   filter when the list spans more than one aisle.
   ========================================================================== */

type Refinement = 'local' | 'fresh' | 'deals' | 'in-stock';

const REFINEMENTS: { key: Refinement; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { key: 'local', label: 'Local', icon: 'LocalVendors' },
  { key: 'fresh', label: 'Fresh', icon: 'FreshProduce' },
  { key: 'deals', label: 'On offer', icon: 'Discount' },
  { key: 'in-stock', label: 'In stock', icon: 'Check' },
];

export function CollectionView({
  products,
  defaultSort = 'relevance',
  showCategoryFilter = false,
  emptyTitle = 'Nothing here yet',
  emptyBody = 'Try removing a filter.',
}: {
  products: Product[];
  defaultSort?: SortKey;
  showCategoryFilter?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const [sort, setSort] = useState<SortKey>(defaultSort);
  const [refinements, setRefinements] = useState<Refinement[]>([]);
  const [category, setCategory] = useState<string>('all');

  const toggle = (key: Refinement) =>
    setRefinements((current) =>
      current.includes(key) ? current.filter((r) => r !== key) : [...current, key],
    );

  const visible = useMemo(() => {
    let out = products;
    if (category !== 'all') out = out.filter((p) => p.category === category);
    if (refinements.includes('local')) out = out.filter((p) => p.local);
    if (refinements.includes('fresh')) out = out.filter((p) => p.fresh);
    if (refinements.includes('deals')) out = out.filter((p) => p.compareAtPrice || p.multibuy);
    if (refinements.includes('in-stock'))
      out = out.filter((p) => p.inventoryStatus !== 'out-of-stock');
    return sortProducts(out, sort);
  }, [products, category, refinements, sort]);

  const categoriesPresent = useMemo(() => {
    const handles = new Set(products.map((p) => p.category));
    return CATEGORIES.filter((c) => handles.has(c.handle));
  }, [products]);

  const filtered = refinements.length > 0 || category !== 'all';

  return (
    <div>
      <div className="border-border-subtle bg-surface-page sticky top-[var(--header-h-compact)] z-30 -mx-[var(--shell-gutter)] mb-5 border-b px-[var(--shell-gutter)] py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="num text-sm font-semibold" aria-live="polite">
            {pluralise(visible.length, 'product')}
          </p>

          <ul className="flex list-none flex-wrap items-center gap-1.5">
            {REFINEMENTS.map((refinement) => {
              const on = refinements.includes(refinement.key);
              return (
                <li key={refinement.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(refinement.key)}
                    className={cx(
                      'flex min-h-10 items-center gap-1.5 rounded-[var(--radius-chip)] border px-2.5 text-sm font-semibold transition-colors',
                      on
                        ? 'border-leaf bg-surface-green-soft text-state-success'
                        : 'border-border-subtle bg-surface-card hover:border-border-default',
                    )}
                  >
                    <Icon name={refinement.icon} size={15} />
                    {refinement.label}
                  </button>
                </li>
              );
            })}
            {filtered ? (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setRefinements([]);
                    setCategory('all');
                  }}
                  className="text-text-secondary hover:text-forest inline-flex min-h-10 items-center gap-1 px-1 text-sm font-semibold underline underline-offset-4"
                >
                  <Icon name="Close" size={14} />
                  Clear
                </button>
              </li>
            ) : null}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            {showCategoryFilter && categoriesPresent.length > 1 ? (
              <label className="flex items-center gap-1.5 text-sm">
                <span className="text-text-secondary text-xs whitespace-nowrap">Aisle</span>
                <Select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="min-h-10 w-auto py-0 text-sm"
                  aria-label="Filter by aisle"
                >
                  <option value="all">All aisles</option>
                  {categoriesPresent.map((c) => (
                    <option key={c.handle} value={c.handle}>
                      {c.title}
                    </option>
                  ))}
                </Select>
              </label>
            ) : null}

            <label className="flex items-center gap-1.5 text-sm">
              <span className="text-text-secondary text-xs whitespace-nowrap">Sort</span>
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="min-h-10 w-auto py-0 text-sm"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        </div>
      </div>

      <h2 className="sr-only">Products</h2>

      {visible.length === 0 ? (
        <EmptyState icon="Search" title={emptyTitle} body={emptyBody} tone="caution" level={3}>
          <button
            type="button"
            onClick={() => {
              setRefinements([]);
              setCategory('all');
            }}
            className="border-forest bg-surface-card hover:bg-surface-page inline-flex min-h-11 items-center rounded-[var(--radius-control)] border px-4 text-base font-semibold"
          >
            Clear filters
          </button>
        </EmptyState>
      ) : (
        <ProductGrid products={visible} />
      )}
    </div>
  );
}
