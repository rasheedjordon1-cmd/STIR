import Link from 'next/link';
import { Icon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { Vendor } from '@/types';

const ACCENT: Record<Vendor['accent'], string> = {
  leaf: 'border-leaf-deep/30 bg-leaf-wash',
  signal: 'border-leaf-deep/30 bg-signal-wash',
  turmeric: 'border-cocoa/30 bg-turmeric-wash',
  nutmeg: 'border-nutmeg/30 bg-nutmeg-wash',
  teal: 'border-teal-ink/30 bg-teal-wash',
  cocoa: 'border-cocoa/30 bg-cocoa-wash',
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
                <span className="label text-forest-muted">Stall only</span>
              )}
            </div>
            <h3 className="text-md leading-tight">{vendor.name}</h3>
            <p className="label text-forest-muted mt-1">
              {vendor.parish} · {vendor.category}
            </p>
            <p className="text-forest-muted mt-1.5 text-sm">{vendor.blurb}</p>
            {vendor.sellsOnline ? (
              <p className="text-leaf-deep mt-2 flex items-center gap-1 text-sm font-semibold">
                Shop their products
                <Icon name="ChevronRight" size={14} />
              </p>
            ) : null}
          </>
        );

        const className = cx(
          'block h-full rounded-[var(--radius-card)] border p-3.5 transition-colors',
          ACCENT[vendor.accent],
          vendor.sellsOnline && 'hover:border-forest',
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
