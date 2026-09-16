import { cx } from '@/lib/cx';

/** Loading placeholders. Shapes match the real component so nothing jumps. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton rounded-[var(--radius-chip)]', className)} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border p-2.5">
      <Skeleton className="mb-3 aspect-square w-full rounded-[6px]" />
      <Skeleton className="mb-2 h-3 w-1/2" />
      <Skeleton className="mb-1.5 h-3.5 w-full" />
      <Skeleton className="mb-3 h-3.5 w-2/3" />
      <Skeleton className="h-9 w-full rounded-[var(--radius-control)]" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading products</span>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
