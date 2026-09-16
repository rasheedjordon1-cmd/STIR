'use client';

import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

/* Connection / render failure. Says what happened and offers a real retry. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell py-16">
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon="Alert"
          tone="blocked"
          level={1}
          title="Something went wrong loading this page"
          body="The catalogue did not come back. Your basket is safe on this device — nothing has been lost."
        >
          <Button onClick={reset} icon="Reorder">
            Try again
          </Button>
          <ButtonLink href="/" intent="secondary">
            Back to shopping
          </ButtonLink>
        </EmptyState>
      </div>
    </div>
  );
}
