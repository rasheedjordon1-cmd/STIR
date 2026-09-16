import Link from 'next/link';
import { Icon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { Vendor } from '@/types';

const ACCENT: Record<Vendor['accent'], string> = {
  leaf: 'border-leaf-deep/30 bg-surface-green-soft',
  signal: 'border-leaf-deep/30 bg-surface-green-soft',
  turmeric: 'border-cocoa/30 bg-surface-yellow-soft',
  nutmeg: 'border-nutmeg/30 bg-surface-nutmeg-soft',
  teal: 'border-teal-ink/30 bg-surface-teal-soft',
  cocoa: 'border-cocoa/30 bg-surface-cocoa-soft',
};

/** Vendor line-up. Makers who also sell online link into the catalogue. */
export function VendorGrid({ vendors }: { vendors: Vendor[] }) {
  return (
    <ul className="grid list-none gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => {
        const body = (
          <>
            <div className="mb-2 flex items-start justify-between gap-2">
              <Icon name="Vendor" size={22} />
              {vendor.sellsOnline ? (
                <span className="label border-forest/25 rounded-[var(--radius-chip)] border px-1.5 py-0.5">
                  Also online
                </span>
              ) : (
                <span className="text-text-secondary text-xs font-semibold">Stall only</span>
              )}
            </div>
            <h3 className="text-md leading-tight">{vendor.name}</h3>
            <p className="label text-text-secondary mt-1">
              {vendor.parish} · {vendor.category}
            </p>
            <p className="text-text-secondary mt-1.5 text-sm">{vendor.blurb}</p>
            {vendor.sellsOnline ? (
              <p className="text-state-success mt-2 flex items-center gap-1 text-sm font-semibold">
                Shop their products
                <Icon name="ChevronRight" size={14} />
              </p>
            ) : null}
          </>
        );

        const className = cx(
          'block h-full rounded-[var(--radius-card)] border p-3.5 transition-colors',
          ACCENT[vendor.accent],
          vendor.sellsOnline && 'hover:border-border-default',
        );

        return (
          <li key={vendor.id} className="flex">
            {vendor.sellsOnline ? (
              <Link href={`/search?q=${encodeURIComponent(vendor.name)}`} className={className}>
                {body}
              </Link>
            ) : (
              <div className={className}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
