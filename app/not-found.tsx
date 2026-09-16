import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon="MapArea"
          level={1}
          title="That page is not here"
          body="The link may be old, or the product may have been taken off the shelf. Search is usually the quickest way back."
        >
          <ButtonLink href="/">Back to shopping</ButtonLink>
          <ButtonLink href="/search" intent="secondary">
            Search Spicemart
          </ButtonLink>
        </EmptyState>
      </div>
    </div>
  );
}
