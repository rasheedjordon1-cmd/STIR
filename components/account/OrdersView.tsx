'use client';

import { ProductGrid } from '@/components/commerce/ProductGrid';
import { Section, SectionHead } from '@/components/ui/Section';
import { Notice } from '@/components/ui/Notice';
import { OrderCard } from './OrderCard';
import { SignedOutPrompt } from './SignedOutPrompt';
import { useSession } from '@/lib/store/session';
import type { Order, Product } from '@/types';

export function OrdersView({
  orders,
  products,
  repeatProducts,
}: {
  orders: Order[];
  products: Product[];
  repeatProducts: Product[];
}) {
  const { signedIn, hydrated } = useSession();

  if (!hydrated) return null;

  if (!signedIn) {
    return (
      <SignedOutPrompt
        icon="Orders"
        title="Sign in to see your orders"
        body="Past orders, tracking and one-tap reordering appear here once you have an account. The prototype has no real sign-in — the button below loads a sample account so the behaviour can be reviewed."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="label text-forest-muted border-ink-line mb-3 border-b-2 pb-1.5">
          {orders.length} orders
        </h2>
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} products={products} />
          ))}
        </div>
      </section>

      <Section className="py-0">
        <SectionHead
          eyebrow="Buy it again"
          title="Your usuals"
          blurb="Ranked by how often you order something and how recently."
          className="mb-3"
        />
        <ProductGrid products={repeatProducts} dense />
      </Section>

      <Notice tone="prototype">
        Order history is generated sample data, dated relative to today so nothing goes stale. At
        integration this comes from Shopify customer orders.
      </Notice>
    </div>
  );
}
