'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CollectionView } from '@/components/commerce/CollectionView';
import { SearchField } from '@/components/layout/SearchField';
import { PageHeading } from '@/components/layout/PageHeading';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { CATEGORIES } from '@/data/categories';
import { commerce } from '@/lib/commerce';
import { pluralise } from '@/lib/format';
import type { Product } from '@/types';

/* ==========================================================================
   SearchExperience
   Search reads its query from the URL on the client rather than from server
   `searchParams`. Two reasons:

   · a result page has no SEO value, so it loses nothing by hydrating
   · it keeps the whole app statically exportable, so the prototype can be
     dropped on any static host as well as run on a Node server

   The adapter call is the same one the header's combobox already makes. When
   the Shopify adapter lands, this should call a route handler instead, so the
   Storefront token stays server-side.
   ========================================================================== */

const SUGGESTED = ['rice', 'callaloo', 'coconut oil', 'nutmeg', 'toilet tissue', 'chicken', 'sorrel'];

export function SearchExperience() {
  const params = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const [results, setResults] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    (async () => {
      const found = await commerce.searchProducts(query);
      if (!cancelled) setResults(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const loading = Boolean(query) && results === null;

  return (
    <>
      <PageHeading
        eyebrow="Search"
        title={query ? `Results for “${query}”` : 'Search Spicemart'}
        blurb={
          query
            ? loading
              ? 'Searching title, vendor, aisle and tags…'
              : `${pluralise(results?.length ?? 0, 'product')} matching title, vendor, aisle and tags.`
            : 'Search by product, brand, aisle or the word you would use in the shop.'
        }
        icon="Search"
        breadcrumbs={[{ label: 'Search' }]}
      >
        <SearchField defaultValue={query} size="lg" className="max-w-2xl" />
      </PageHeading>

      <div className="shell pb-10">
        {loading ? <ProductGridSkeleton /> : null}

        {query && results?.length === 0 ? (
          <EmptyState
            icon="Search"
            level={2}
            title={`Nothing matched “${query}”`}
            body="Spicemart carries a focused assortment, so some brands will not be here. Try a plainer word — “rice” rather than a brand name — or browse the aisle."
            tone="caution"
          >
            <ButtonLink href="/category/groceries">Browse groceries</ButtonLink>
            <ButtonLink href="/category/local" intent="secondary">
              Shop the Local shelf
            </ButtonLink>
          </EmptyState>
        ) : null}

        {query && results && results.length > 0 ? (
          <CollectionView
            products={results}
            showCategoryFilter
            emptyTitle="No results with those filters"
            emptyBody={`“${query}” returned ${results.length} products, but none match every filter you have on.`}
          />
        ) : null}

        {!query ? (
          <div className="grid gap-6 pt-2 md:grid-cols-2">
            <section>
              <h2 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
                People search for
              </h2>
              <ul className="flex list-none flex-wrap gap-2">
                {SUGGESTED.map((term) => (
                  <li key={term}>
                    <Link
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="border-line-strong bg-paper hover:border-forest inline-flex min-h-11 items-center rounded-[var(--radius-control)] border px-3.5 text-base font-semibold"
                    >
                      {term}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
                Or browse an aisle
              </h2>
              <ul className="flex list-none flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <li key={category.handle}>
                    <Link
                      href={`/category/${category.handle}`}
                      className="border-line-strong bg-paper hover:border-forest inline-flex min-h-11 items-center rounded-[var(--radius-control)] border px-3.5 text-base font-semibold"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
}
