import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="shell py-8">
      <Skeleton className="mb-3 h-4 w-40" />
      <Skeleton className="mb-2 h-9 w-72 max-w-full" />
      <Skeleton className="mb-8 h-4 w-96 max-w-full" />
      <ProductGridSkeleton />
    </div>
  );
}
