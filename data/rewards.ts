import { REWARDS } from './config';
import type { RewardsSummary } from '@/types';

/* ==========================================================================
   SPICEMART REWARDS — prototype
   The programme is NOT signed off. Everything here is illustrative, and every
   reward carries a status: "confirmed" items are rules the business has
   committed to, "concept" items are proposals shown for shape only.
   No paid membership tier exists and none should be invented.
   ========================================================================== */

const DAY_MS = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString().slice(0, 10);

export const REWARDS_SUMMARY: RewardsSummary = {
  points: 1840,
  tierLabel: 'Everyday basket',
  nextRewardAt: REWARDS.nextRewardAt,
  activity: [
    { id: 'ra-1', date: daysAgo(1), label: 'Order SM-24818', points: 168, kind: 'earned' },
    { id: 'ra-2', date: daysAgo(4), label: 'Order SM-24755', points: 72, kind: 'earned' },
    { id: 'ra-3', date: daysAgo(11), label: 'Order SM-24702', points: 214, kind: 'earned' },
    { id: 'ra-4', date: daysAgo(24), label: 'Spice Fair collection bonus', points: 150, kind: 'bonus' },
    { id: 'ra-5', date: daysAgo(24), label: 'Order SM-24588', points: 131, kind: 'earned' },
    { id: 'ra-6', date: daysAgo(31), label: 'Redeemed — EC$10 off delivery', points: -500, kind: 'redeemed' },
    { id: 'ra-7', date: daysAgo(39), label: 'Order SM-24455', points: 189, kind: 'earned' },
  ],
  possibleRewards: [
    {
      id: 'rw-delivery',
      title: 'EC$10 off a delivery',
      detail: 'Applied at checkout on any order to a serviced area.',
      points: 500,
      status: 'confirmed',
    },
    {
      id: 'rw-local',
      title: 'EC$25 off the Local shelf',
      detail: 'Spend it with Grenadian growers and makers only.',
      points: 1200,
      status: 'confirmed',
    },
    {
      id: 'rw-fair',
      title: 'Spice Fair market credit',
      detail: 'Credit to spend with vendors at a fair. Under discussion with the vendor committee.',
      points: 2000,
      status: 'concept',
    },
    {
      id: 'rw-basket',
      title: 'Free produce basket',
      detail: 'A weekly produce box from a rotating partner farm.',
      points: 2500,
      status: 'concept',
    },
  ],
};

export const REWARDS_RULES = {
  confirmed: [
    `You earn ${REWARDS.pointsPerDollar} point for every EC$1 spent, on every order.`,
    'Points appear once an order is delivered or collected, not when it is placed.',
    'Rewards are applied at checkout and cannot be exchanged for cash.',
  ],
  concept: [
    'Bonus points for collecting an order at a Spice Fair.',
    'Bonus points for buying from the Local shelf.',
    'Points expiry after a period of inactivity.',
    'Household accounts that pool points across one delivery address.',
  ],
};
