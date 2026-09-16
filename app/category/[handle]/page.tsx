import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CollectionView } from '@/components/commerce/CollectionView';
import { PageHeading } from '@/components/layout/PageHeading';
import { Notice } from '@/components/ui/Notice';
import { CATEGORIES, getCategory, isShelf } from '@/data/categories';
import { commerce } from '@/lib/commerce';
import type { IconName } from '@/components/icons';
import type { SortKey } from '@/types';

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ handle: category.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const category = getCategory(handle);
  if (!category) return { title: 'Category not found' };
  return { title: category.title, description: category.blurb };
}

export default async function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const category = getCategory(handle);
  if (!category) notFound();

  const shelf = isShelf(handle) ? (handle as 'local' | 'deals') : undefined;
  const products = await commerce.getProducts(
    shelf ? { shelf } : { category: handle },
  );

  const defaultSort: SortKey = shelf === 'deals' ? 'price-asc' : 'local-first';

  return (
    <>
      <PageHeading
        eyebrow={shelf ? 'Merchandising shelf' : 'Aisle'}
        title={category.title}
        blurb={category.blurb}
        icon={category.icon as IconName}
        breadcrumbs={[{ label: category.title }]}
      />

      <div className="shell pb-10">
        {shelf === 'local' ? (
          <Notice tone="info" className="mb-4" title="The Local shelf">
            Everything here is grown, made or packed in Grenada by a named producer. Most of these
            makers also hold a stall at the Spice Fair.
          </Notice>
        ) : null}
        {shelf === 'deals' ? (
          <Notice tone="info" className="mb-4" title="How our deals work">
            Reductions show the previous price, and multibuys apply automatically once you reach the
            quantity. No countdown timers, no fake urgency.
          </Notice>
        ) : null}
        {handle === 'frozen-chilled' ? (
          <Notice tone="caution" className="mb-4" title="Cold chain">
            Chilled and frozen items travel on delivery and counter-collection routes only — they
            cannot be collected at a Spice Fair.
          </Notice>
        ) : null}

        <CollectionView
          products={products}
          defaultSort={defaultSort}
          showCategoryFilter={Boolean(shelf)}
          emptyTitle="Nothing matches those filters"
          emptyBody={`There are ${products.length} products in ${category.title.toLowerCase()}, but none of them match every filter you have on.`}
        />
      </div>
    </>
  );
}
