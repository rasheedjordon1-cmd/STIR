import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import { Icon, type IconName } from '@/components/icons';
import { FulfillmentCard } from './FulfillmentCard';

/* ==========================================================================
   Commerce hero — V2
   Still not a banner. Three jobs: say what this is, get people into an aisle,
   and state what can actually be delivered to them.

   V2 tightens the vertical rhythm, narrows the supporting paragraph to a
   comfortable measure, and turns the category shortcuts into fast pathways —
   a row of tinted icons with labels — rather than four miniature bordered
   cards competing with the real buttons above them.
   ========================================================================== */

const SHORTCUTS: { handle: string; icon: IconName; title: string }[] = CATEGORIES.filter((c) =>
  ['groceries', 'fresh-produce', 'household', 'drinks'].includes(c.handle),
).map((c) => ({ handle: c.handle, icon: c.icon as IconName, title: c.title }));

export function Hero() {
  return (
    <section className="pt-5 pb-7 md:pt-9 md:pb-12">
      <div className="shell grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14">
        {/* Measure is capped so the column composes at 1440 and 1920 rather
            than stretching with the grid. */}
        <div className="flex max-w-[620px] flex-col justify-center">
          <p className="text-state-success mb-3.5 flex items-center gap-2 text-sm font-semibold">
            <span className="bg-signal h-2 w-2 rounded-full" aria-hidden />
            Grenada&rsquo;s homegrown commerce platform
          </p>

          <h1 className="display text-[clamp(2.75rem,10.5vw,4.5rem)] uppercase">Live easy.</h1>

          <p className="font-display mt-3 max-w-[17ch] text-[clamp(1.25rem,4.6vw,1.75rem)] leading-[1.08] font-semibold tracking-[-0.03em]">
            Everyday essentials, delivered across Grenada.
          </p>

          <p className="text-text-secondary mt-3 max-w-[46ch] text-base md:text-md">
            Groceries, fresh produce, household goods and more — from a platform built here, for
            here.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-6">
            <ButtonLink href="/category/groceries" size="lg" icon="Groceries">
              Shop essentials
            </ButtonLink>
            <ButtonLink href="/delivery" size="lg" intent="tertiary" icon="MapArea">
              Choose delivery area
            </ButtonLink>
          </div>

          <nav aria-label="Popular categories" className="border-border-subtle mt-6 border-t pt-4 md:mt-7 md:pt-5">
            <ul className="flex list-none flex-wrap gap-x-5 gap-y-1 md:gap-x-6 md:gap-y-3">
              {SHORTCUTS.map((shortcut) => (
                <li key={shortcut.handle}>
                  <Link
                    href={`/category/${shortcut.handle}`}
                    className="group text-text-primary flex min-h-11 items-center gap-2 text-sm font-semibold"
                  >
                    <span className="bg-surface-green-soft text-state-success flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5">
                      <Icon name={shortcut.icon} size={20} />
                    </span>
                    <span className="underline-offset-4 group-hover:underline">{shortcut.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <FulfillmentCard className="lg:self-center" />
      </div>
    </section>
  );
}
