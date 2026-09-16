import { ButtonLink } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/categories';
import { Icon, type IconName } from '@/components/icons';
import Link from 'next/link';
import { FulfillmentCard } from './FulfillmentCard';

/* ==========================================================================
   Commerce hero
   Deliberately not a banner. Three jobs: say what this is, get people into a
   category, and state what can actually be delivered to them. Everything
   below the type is a working control.
   ========================================================================== */

const SHORTCUTS: { handle: string; icon: IconName; title: string }[] = CATEGORIES.filter((c) =>
  ['groceries', 'fresh-produce', 'household', 'drinks'].includes(c.handle),
).map((c) => ({ handle: c.handle, icon: c.icon as IconName, title: c.title }));

export function Hero() {
  return (
    <section className="border-line border-b">
      <div className="shell grid gap-6 py-5 md:py-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <div className="flex flex-col justify-center">
          <p className="label text-leaf-deep mb-3 flex items-center gap-2">
            <span className="bg-signal h-2.5 w-2.5 rounded-full" aria-hidden />
            Grenada&rsquo;s homegrown commerce platform
          </p>

          <h1 className="display text-[clamp(2.25rem,10.5vw,4.25rem)]">Live easy.</h1>

          <p className="font-display mt-2 max-w-md text-[clamp(1.0625rem,4vw,1.5rem)] leading-tight font-semibold tracking-tight text-balance">
            Everyday essentials, delivered across Grenada.
          </p>

          <p className="text-forest-muted mt-2.5 max-w-md text-base md:text-md">
            Groceries, fresh produce, household goods and more — from a platform built here, for
            here.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <ButtonLink href="/category/groceries" size="lg" icon="Groceries">
              Shop essentials
            </ButtonLink>
            <ButtonLink href="/delivery" size="lg" intent="secondary" icon="MapArea">
              Choose delivery area
            </ButtonLink>
          </div>

          <nav aria-label="Popular categories" className="mt-5">
            <p className="label text-forest-muted mb-2">Jump straight in</p>
            <ul className="flex list-none flex-wrap gap-2">
              {SHORTCUTS.map((shortcut) => (
                <li key={shortcut.handle}>
                  <Link
                    href={`/category/${shortcut.handle}`}
                    className="border-line-strong bg-paper hover:border-forest flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border px-3 text-sm font-semibold transition-colors"
                  >
                    <Icon name={shortcut.icon} size={18} />
                    {shortcut.title}
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
