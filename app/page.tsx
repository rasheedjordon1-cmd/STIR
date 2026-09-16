import { BuyItAgain } from '@/components/home/BuyItAgain';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { DealsModule } from '@/components/home/DealsModule';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { LocalShelf } from '@/components/home/LocalShelf';
import { ProductModule } from '@/components/home/ProductModule';
import { SpiceFairFeature } from '@/components/home/SpiceFairFeature';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Icon } from '@/components/icons';
import { HOME_CATEGORY_ORDER, getCategory } from '@/data/categories';
import { PROTOTYPE_NOTICE } from '@/data/config';
import { getUpcomingEvents } from '@/data/events';
import { buyItAgainProductIds } from '@/data/orders';
import { VENDORS, getVendor } from '@/data/vendors';
import { commerce } from '@/lib/commerce';
import type { Category } from '@/types';

export default async function HomePage() {
  const now = new Date();
  const upcoming = getUpcomingEvents(now, 4);
  const next = upcoming[0] ?? null;

  const [all, essentials, fresh, local, deals, repeat] = await Promise.all([
    commerce.getProducts(),
    commerce.getProducts({
      tags: ['staple', 'breakfast', 'everyday', 'bulk'],
      limit: 10,
      sort: 'title-asc',
    }),
    commerce.getProducts({ shelf: 'fresh', limit: 10, sort: 'local-first' }),
    commerce.getProducts({ shelf: 'local', limit: 12, sort: 'title-asc' }),
    commerce.getProducts({ shelf: 'deals', limit: 9 }),
    commerce.getProducts({ ids: buyItAgainProductIds(10) }),
  ]);

  const categories = HOME_CATEGORY_ORDER.map((handle) => {
    const category = getCategory(handle) as Category;
    const count =
      handle === 'local'
        ? all.filter((p) => p.local).length
        : handle === 'deals'
          ? all.filter((p) => p.compareAtPrice || p.multibuy).length
          : all.filter((p) => p.category === handle).length;
    return { category, count };
  });

  const fairVendors = next
    ? next.vendorIds.map(getVendor).filter((v): v is NonNullable<typeof v> => Boolean(v)).slice(0, 8)
    : [];

  const localVendors = VENDORS.filter((v) => v.sellsOnline).slice(0, 8);

  return (
    <>
      <Hero />

      {/* Disclosure, integrated as a seam between the hero and the shop rather
          than a floating warning box. */}
      <div className="bg-surface-sunk border-border-subtle border-y">
        <p className="shell text-text-secondary flex items-center gap-2 py-2.5 text-xs">
          <Icon name="Info" size={14} className="shrink-0" />
          {PROTOTYPE_NOTICE}
        </p>
      </div>

      <CategoryTiles categories={categories} />

      <TrustStrip />

      <ProductModule
        id="essentials"
        eyebrow="Everyday essentials"
        title="The weekly shop"
        blurb="The lines that repeat in almost every basket — priced per kilo and litre so the big bag is easy to judge."
        href="/category/groceries"
        linkLabel="All groceries"
        products={essentials}
      />

      <BuyItAgain products={repeat} />

      <ProductModule
        id="fresh"
        eyebrow="Fresh in Grenada"
        title="Cut and picked this week"
        blurb="Produce and perishables from Grenadian growers, bought to order rather than held in a cold room."
        href="/category/fresh-produce"
        linkLabel="All fresh produce"
        products={fresh}
        tone="sunk"
      />

      <LocalShelf products={local} vendors={localVendors} />

      <DealsModule products={deals} />

      <SpiceFairFeature next={next} upcoming={upcoming.slice(1)} vendors={fairVendors} />

      <HowItWorks />
    </>
  );
}
