import type { Metadata } from 'next';
import { OrdersView } from '@/components/account/OrdersView';
import { PageHeading } from '@/components/layout/PageHeading';
import { ORDERS, buyItAgainProductIds } from '@/data/orders';
import { commerce } from '@/lib/commerce';

export const metadata: Metadata = { title: 'Past orders' };

export default async function OrdersPage() {
  const orderProductIds = [...new Set(ORDERS.flatMap((o) => o.items.map((i) => i.productId)))];
  const [products, repeatProducts] = await Promise.all([
    commerce.getProducts({ ids: orderProductIds }),
    commerce.getProducts({ ids: buyItAgainProductIds(12) }),
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Orders"
        title="Past orders and reorder"
        blurb="Every order you have placed, with tracking on anything still moving and one-tap reordering on the rest."
        icon="Orders"
        breadcrumbs={[{ label: 'Account', href: '/account' }, { label: 'Orders' }]}
      />
      <div className="shell pb-12">
        <OrdersView orders={ORDERS} products={products} repeatProducts={repeatProducts} />
      </div>
    </>
  );
}
