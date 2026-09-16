'use client';

import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSession } from '@/lib/store/session';
import type { IconName } from '@/components/icons';

/* ==========================================================================
   SignedOutPrompt
   The prototype has no authentication, so rather than fabricating a history
   for an anonymous visitor it offers an explicit switch into a sample
   signed-in account, and says that is what it is.
   ========================================================================== */

export function SignedOutPrompt({
  icon = 'Account',
  title,
  body,
  browseHref = '/category/groceries',
  browseLabel = 'Browse groceries',
  level = 2,
}: {
  icon?: IconName;
  title: string;
  body: string;
  browseHref?: string;
  browseLabel?: string;
  level?: 1 | 2 | 3 | 4;
}) {
  const { signIn } = useSession();
  return (
    <EmptyState icon={icon} title={title} body={body} level={level}>
      <Button onClick={signIn}>Preview a signed-in account</Button>
      <ButtonLink href={browseHref} intent="secondary">
        {browseLabel}
      </ButtonLink>
    </EmptyState>
  );
}
