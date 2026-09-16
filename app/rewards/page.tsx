import type { Metadata } from 'next';
import { RewardsView } from '@/components/account/RewardsView';
import { PageHeading } from '@/components/layout/PageHeading';
import { REWARDS } from '@/data/config';

export const metadata: Metadata = { title: 'Rewards' };

export default function RewardsPage() {
  return (
    <>
      <PageHeading
        eyebrow="Rewards"
        title={REWARDS.programName}
        blurb="A point for every EC$1, earned when an order actually arrives. The rest of the programme is still being designed — this page says which parts are settled and which are not."
        icon="Rewards"
        breadcrumbs={[{ label: 'Rewards' }]}
      />
      <div className="shell pb-12">
        <RewardsView />
      </div>
    </>
  );
}
