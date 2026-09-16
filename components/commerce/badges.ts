import type { IconName } from '@/components/icons';
import { savingsPercent } from '@/lib/format';
import type { Product } from '@/types';

/* ==========================================================================
   Badge priority
   A card shows at most TWO merchandising badges. Price mechanics outrank
   provenance, because a shopper scanning a shelf reads value first and story
   second. Availability is deliberately NOT a badge — it is a status line,
   so it can never be crowded out by merchandising.
   ========================================================================== */

export type BadgeTone = 'local' | 'fresh' | 'deal' | 'multibuy';

export interface ProductBadge {
  tone: BadgeTone;
  label: string;
  icon?: IconName;
}

export function badgesFor(product: Product, limit = 2): ProductBadge[] {
  const badges: ProductBadge[] = [];

  const saving = savingsPercent(product.price, product.compareAtPrice);
  if (saving) badges.push({ tone: 'deal', label: `Save ${saving}%`, icon: 'Discount' });
  if (product.multibuy) badges.push({ tone: 'multibuy', label: product.multibuy.label });
  if (product.local) badges.push({ tone: 'local', label: 'Local', icon: 'LocalVendors' });
  if (product.fresh) badges.push({ tone: 'fresh', label: 'Fresh', icon: 'FreshProduce' });

  return badges.slice(0, limit);
}

export const STOCK_COPY: Record<Product['inventoryStatus'], { label: string; icon: IconName } | null> = {
  'in-stock': null,
  'low-stock': { label: 'Low stock', icon: 'LowStock' },
  'out-of-stock': { label: 'Out of stock', icon: 'OutOfStock' },
};
