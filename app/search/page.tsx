import type { Metadata } from 'next';
import Link from 'next/link';
import { CollectionView } from '@/components/commerce/CollectionView';
import { SearchField } from '@/components/layout/SearchField';
import { PageHeading } from '@/components/layout/PageHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import { commerce } from '@/lib/commerce';
import { pluralise } from '@/lib/format';

export const metadata: Metadata = { title: 'Search' };

const SUGGESTED = ['rice', 'callaloo', 'coconut oil', 'nutmeg', 'toilet tissue', 'chicken', 'sorrel'];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const results = query ? await commerce.searchProducts(query) : [];

  return (
    <>
      <PageHeading
        eyebrow="Search"
        title={query ? `Results for “${query}”` : 'Search Spicemart'}
        blurb={
          query
            ? `${pluralise(results.length, 'product')} matching title, vendor, aisle and tags.`
            : 'Search by product, brand, aisle or the word you would use in the shop.'
        }
        icon="Search"
        breadcrumbs={[{ label: 'Search' }]}
      >
        <SearchField defaultValue={query} size="lg" className="max-w-2xl" />
      </PageHeading>

      <div className="shell pb-10">
        {query && results.length === 0 ? (
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

        {query && results.length > 0 ? (
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
