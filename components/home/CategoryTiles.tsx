import { CategoryCard } from '@/components/commerce/CategoryCard';
import { Section, SectionHead } from '@/components/ui/Section';
import type { Category } from '@/types';

export function CategoryTiles({ categories }: { categories: { category: Category; count: number }[] }) {
  return (
    <Section>
      <div className="shell">
        <SectionHead
          eyebrow="Shop by category"
          title="Everything Grenada, in eight aisles"
          blurb="Local is a shelf, not a badge: growers and makers are merchandised together so they are as easy to find as any imported staple."
        />
        <ul className="grid list-none grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {categories.map(({ category, count }) => (
            <li key={category.handle} className="flex">
              <CategoryCard category={category} count={count} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
