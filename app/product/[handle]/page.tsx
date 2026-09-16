import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FrequentlyBought } from '@/components/commerce/FrequentlyBought';
import { PriceBlock } from '@/components/commerce/PriceBlock';
import { ProductBuyBox } from '@/components/commerce/ProductBuyBox';
import { ProductFulfillment } from '@/components/commerce/ProductFulfillment';
import { ProductGallery } from '@/components/commerce/ProductGallery';
import { ProductRail } from '@/components/commerce/ProductGrid';
import { StickyBuyBar } from '@/components/commerce/StickyBuyBar';
import { STOCK_COPY, badgesFor } from '@/components/commerce/badges';
import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { Section, SectionHead } from '@/components/ui/Section';
import { getCategory } from '@/data/categories';
import { PRODUCTS } from '@/data/products';
import { getVendorByName } from '@/data/vendors';
import { commerce } from '@/lib/commerce';
import { formatMoney } from '@/lib/format';

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) return { title: 'Product not found' };
  return {
    title: `${product.title} — ${product.unit}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) notFound();

  const category = getCategory(product.category);
  const vendor = getVendorByName(product.vendor);
  const badges = badgesFor(product, 3);
  const stock = STOCK_COPY[product.inventoryStatus];

  const [related, partners] = await Promise.all([
    commerce.getProducts({ category: product.category, excludeHandles: [handle], limit: 10 }),
    commerce.getProducts({ tags: product.tags, excludeHandles: [handle], limit: 2 }),
  ]);

  const details: { label: string; value: string }[] = [
    { label: 'Size', value: product.unit },
    { label: 'Vendor', value: product.vendor },
    { label: 'Aisle', value: category?.title ?? product.category },
    ...(product.unitPrice
      ? [{ label: 'Unit price', value: `${formatMoney(product.unitPrice)} / ${product.unitPrice.per}` }]
      : []),
    { label: 'Origin', value: product.local ? 'Grenada' : 'Imported / regional' },
  ];

  return (
    <>
      <div className="shell">
        <nav aria-label="Breadcrumb" className="py-3">
          <ol className="text-forest-muted flex list-none flex-wrap items-center gap-1 text-sm">
            <li>
              <Link href="/" className="hover:text-forest hover:underline">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <Icon name="ChevronRight" size={13} />
              <Link href={`/category/${product.category}`} className="hover:text-forest hover:underline">
                {category?.title}
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <Icon name="ChevronRight" size={13} />
              <span className="text-forest truncate font-semibold">{product.title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              {badges.length > 0 ? (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {badges.map((badge) => (
                    <Badge key={badge.label} tone={badge.tone} icon={badge.icon}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {vendor ? (
                <Link
                  href={`/search?q=${encodeURIComponent(vendor.name)}`}
                  className="text-leaf-deep inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
                >
                  <Icon name="Vendor" size={15} />
                  {product.vendor}
                </Link>
              ) : (
                <p className="text-forest-muted text-sm font-semibold">{product.vendor}</p>
              )}

              <h1 className="mt-1 text-2xl md:text-3xl">{product.title}</h1>

              <div className="mt-3">
                <PriceBlock product={product} size="lg" />
              </div>

              {product.multibuy ? (
                <p className="bg-turmeric-wash border-cocoa/30 num mt-2.5 inline-flex items-center gap-2 rounded-[var(--radius-chip)] border px-2.5 py-1.5 text-sm font-bold">
                  <Icon name="Discount" size={15} />
                  {product.multibuy.label} — applied automatically in the basket
                </p>
              ) : null}

              <p
                className={`mt-2.5 flex items-center gap-1.5 text-sm font-semibold ${
                  stock ? (product.inventoryStatus === 'out-of-stock' ? 'text-nutmeg' : 'text-cocoa') : 'text-leaf-deep'
                }`}
              >
                <Icon name={stock?.icon ?? 'Check'} size={16} />
                {stock?.label ?? 'In stock'}
              </p>
            </div>

            <ProductBuyBox product={product} />

            <ProductFulfillment product={product} />

            <p className="text-md">{product.description}</p>

            <dl className="border-line-strong grid grid-cols-2 gap-x-4 rounded-[var(--radius-card)] border p-3 text-sm sm:grid-cols-3">
              {details.map((detail) => (
                <div key={detail.label} className="border-line border-b py-1.5 last:border-b-0 sm:border-b-0">
                  <dt className="label text-forest-muted">{detail.label}</dt>
                  <dd className="font-semibold">{detail.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-2.5">
              <Detail title="Ingredients and details">
                {product.details ??
                  'Full ingredient and allergen information will be published from the supplier’s pack data before launch. This prototype does not carry it.'}
              </Detail>
              {product.storage ? <Detail title="Storage">{product.storage}</Detail> : null}
              {vendor ? (
                <Detail title={`About ${vendor.name}`}>
                  {vendor.blurb} Based in {vendor.parish}. {vendor.category}.
                </Detail>
              ) : null}
            </div>

            <FrequentlyBought anchor={product} partners={partners} />

            <Notice tone="prototype">
              Prototype product record. Prices, pack sizes, stock levels and vendor details are
              sample data and are not a commercial offer.
            </Notice>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <Section tone="sunk">
          <div className="shell">
            <SectionHead
              eyebrow="More in this aisle"
              title={category?.title ?? 'Related products'}
              href={`/category/${product.category}`}
              linkLabel="See the aisle"
            />
            <ProductRail products={related} label={`More in ${category?.title}`} />
          </div>
        </Section>
      ) : null}

      <StickyBuyBar product={product} />
    </>
  );
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="border-line-strong bg-paper group rounded-[var(--radius-card)] border">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm font-bold">
        {title}
        <Icon
          name="ChevronDown"
          size={17}
          className="shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>
      <p className="text-forest-muted border-line border-t px-3 py-2.5 text-sm">{children}</p>
    </details>
  );
}
