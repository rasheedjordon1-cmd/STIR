'use client';

import { Icon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Notice';
import { SignedOutPrompt } from './SignedOutPrompt';
import { REWARDS } from '@/data/config';
import { REWARDS_RULES, REWARDS_SUMMARY } from '@/data/rewards';
import { formatShortDate } from '@/lib/format';
import { useSession } from '@/lib/store/session';
import { cx } from '@/lib/cx';

/* ==========================================================================
   Rewards
   Deliberately modest. The programme's economics are not signed off, so the
   interface separates confirmed rules from concepts and never implies a paid
   membership tier — none has been approved.
   ========================================================================== */

export function RewardsView() {
  const { signedIn, hydrated } = useSession();
  if (!hydrated) return null;

  const { points, nextRewardAt, activity, possibleRewards } = REWARDS_SUMMARY;
  const progress = Math.min(100, Math.round((points / nextRewardAt) * 100));

  return (
    <div className="flex flex-col gap-8">
      {!signedIn ? (
        <SignedOutPrompt
          icon="Rewards"
          title="Rewards need an account"
          body="Points are earned on delivered and collected orders. Sign in to see a balance — the prototype loads a sample account so the programme can be reviewed."
        />
      ) : (
        <section
          aria-labelledby="balance-heading"
          className="border-border-subtle bg-surface-card rounded-[var(--radius-card)] border p-4 md:p-5"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="balance-heading" className="text-text-secondary text-xs font-semibold">
                Points balance
              </h2>
              <p className="num font-display mt-1 text-[clamp(2.5rem,9vw,3.5rem)] leading-none font-extrabold tracking-tight">
                {points.toLocaleString('en-US')}
              </p>
              <p className="text-text-secondary mt-1 text-sm">{REWARDS_SUMMARY.tierLabel}</p>
            </div>
            <div className="min-w-[200px] flex-1">
              <div className="mb-1.5 flex justify-between text-sm font-semibold">
                <span>Next reward</span>
                <span className="num">
                  {points.toLocaleString('en-US')} / {nextRewardAt.toLocaleString('en-US')}
                </span>
              </div>
              <div
                className="bg-surface-sunk border-border-subtle h-3 overflow-hidden rounded-full border"
                role="progressbar"
                aria-valuenow={points}
                aria-valuemin={0}
                aria-valuemax={nextRewardAt}
                aria-label="Progress to next reward"
              >
                <div className="bg-leaf h-full rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-text-secondary mt-1.5 text-sm">
                {(nextRewardAt - points).toLocaleString('en-US')} points to go — about{' '}
                {Math.ceil((nextRewardAt - points) / 200)} more weekly shops.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-labelledby="possible-heading">
          <h2 id="possible-heading" className="label text-text-secondary border-border-subtle mb-3 border-b pb-2">
            What points could get you
          </h2>
          <ul className="flex list-none flex-col gap-2">
            {possibleRewards.map((reward) => {
              const reachable = points >= reward.points;
              return (
                <li
                  key={reward.id}
                  className={cx(
                    'rounded-[var(--radius-card)] border p-3.5',
                    reachable && signedIn
                      ? 'border-leaf-deep/40 bg-surface-green-soft'
                      : 'border-border-subtle bg-surface-card',
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-md">{reward.title}</h3>
                      <p className="text-text-secondary mt-0.5 text-sm">{reward.detail}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p className="num font-display text-md font-bold">
                        {reward.points.toLocaleString('en-US')}
                      </p>
                      <Badge tone={reward.status === 'confirmed' ? 'local' : 'neutral'}>
                        {reward.status === 'confirmed' ? 'Confirmed' : 'Concept'}
                      </Badge>
                    </div>
                  </div>
                  {signedIn ? (
                    <p
                      className={cx(
                        'mt-2 flex items-center gap-1.5 text-sm font-semibold',
                        reachable ? 'text-state-success' : 'text-text-secondary',
                      )}
                    >
                      <Icon name={reachable ? 'Check' : 'Clock'} size={15} />
                      {reachable
                        ? 'Available now'
                        : `${(reward.points - points).toLocaleString('en-US')} points away`}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          {signedIn ? (
            <section aria-labelledby="activity-heading">
              <h2 id="activity-heading" className="label text-text-secondary border-border-subtle mb-3 border-b pb-2">
                Recent activity
              </h2>
              <ul className="border-border-subtle bg-surface-card list-none rounded-[var(--radius-card)] border">
                {activity.map((entry) => (
                  <li
                    key={entry.id}
                    className="border-border-subtle flex items-center justify-between gap-3 border-b px-3.5 py-2.5 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{entry.label}</p>
                      <p className="text-text-secondary num text-xs">{formatShortDate(entry.date)}</p>
                    </div>
                    <p
                      className={cx(
                        'num shrink-0 text-sm font-bold',
                        entry.points < 0 ? 'text-state-danger' : 'text-state-success',
                      )}
                    >
                      {entry.points > 0 ? '+' : ''}
                      {entry.points.toLocaleString('en-US')}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="rules-heading">
            <h2 id="rules-heading" className="label text-text-secondary border-border-subtle mb-3 border-b pb-2">
              How it works
            </h2>
            <div className="border-leaf-deep/30 bg-surface-green-soft rounded-[var(--radius-card)] border p-3.5">
              <p className="label text-state-success mb-2 flex items-center gap-1.5">
                <Icon name="Check" size={14} />
                Confirmed rules
              </p>
              <ul className="list-none space-y-1.5 text-sm">
                {REWARDS_RULES.confirmed.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span className="bg-leaf-deep mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-border-subtle bg-surface-card mt-2.5 rounded-[var(--radius-card)] border p-3.5">
              <p className="label text-text-secondary mb-2 flex items-center gap-1.5">
                <Icon name="Info" size={14} />
                Under discussion — not committed
              </p>
              <ul className="text-text-secondary list-none space-y-1.5 text-sm">
                {REWARDS_RULES.concept.map((rule) => (
                  <li key={rule} className="flex gap-2">
                    <span className="bg-line-strong mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <Notice tone="prototype">
        {REWARDS.programName} is a prototype. Earn rates, reward values and expiry are illustrative
        and need commercial sign-off. There is no paid membership tier, and none is proposed.
      </Notice>
    </div>
  );
}
