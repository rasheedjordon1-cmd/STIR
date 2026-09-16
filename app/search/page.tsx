import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchExperience } from '@/components/commerce/SearchExperience';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-8">
          <ProductGridSkeleton />
        </div>
      }
    >
      <SearchExperience />
    </Suspense>
  );
}
