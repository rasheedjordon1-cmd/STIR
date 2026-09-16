'use client';

import { ProductRail } from '@/components/commerce/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section, SectionHead } from '@/components/ui/Section';
import { useSession } from '@/lib/store/session';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

/* ==========================================================================
   Buy it again
   The single strongest repeat-purchase surface in a grocery product. Signed
   out, it does NOT invent a history: it explains what it would do and offers
   the prototype's sign-in switch.
   ========================================================================== */

export function BuyItAgain({ products }: { products: Product[] }) {
  const { signedIn, hydrated, signIn } = useSession();

  return (
    <Section id="buy-it-again">
      <div className="shell">
        <SectionHead
          eyebrow="Buy it again"
          title="Your usuals, one tap away"
          blurb="Ranked by how often you buy something and how recently — the two things that actually predict a weekly grocery basket."
          href={signedIn ? '/account/orders' : undefined}
          linkLabel="All past orders"
        />
        {hydrated && signedIn ? (
          <ProductRail products={products} label="Products you have ordered before" />
        ) : (
          <EmptyState
            icon="Reorder"
            title="Sign in to see your usuals"
            body="Once you have ordered, this row fills with the things you buy most — rice, milk, bread, produce — so a weekly shop takes under a minute."
          >
            <Button onClick={signIn}>Preview a signed-in account</Button>
            <ButtonLink href="/category/groceries" intent="secondary">
              Browse groceries instead
            </ButtonLink>
          </EmptyState>
        )}
      </div>
    </Section>
  );
}
