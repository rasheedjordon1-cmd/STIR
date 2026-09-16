import type { Metadata } from 'next';
import { AccountView } from '@/components/account/AccountView';
import { PageHeading } from '@/components/layout/PageHeading';
import { ORDERS, RECENTLY_VIEWED_IDS, SHOPPING_LIST_IDS } from '@/data/orders';
import { commerce } from '@/lib/commerce';

export const metadata: Metadata = { title: 'Account' };

export default async function AccountPage() {
  const orderProductIds = [...new Set(ORDERS.flatMap((o) => o.items.map((i) => i.productId)))];
  const [products, savedProducts, recentProducts] = await Promise.all([
    commerce.getProducts({ ids: orderProductIds }),
    commerce.getProducts({ ids: SHOPPING_LIST_IDS }),
    commerce.getProducts({ ids: RECENTLY_VIEWED_IDS }),
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Account"
        title="Your Spicemart"
        blurb="Where your orders go, what is on the way, what you have saved, and what is coming up at the fair."
        icon="Account"
        breadcrumbs={[{ label: 'Account' }]}
      />
      <div className="shell pb-12">
        <AccountView
          orders={ORDERS}
          products={products}
          savedProducts={savedProducts}
          recentProducts={recentProducts}
        />
      </div>
    </>
  );
}
