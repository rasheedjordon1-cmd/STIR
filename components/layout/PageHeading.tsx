import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { cx } from '@/lib/cx';

/* Page-level heading with a breadcrumb trail. One pattern for every route. */
export function PageHeading({
  eyebrow,
  title,
  blurb,
  icon,
  breadcrumbs,
  children,
  tone = 'default',
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  icon?: IconName;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
  tone?: 'default' | 'dark';
}) {
  return (
    <div className={cx(tone === 'dark' && 'bg-forest text-breadfruit on-dark')}>
      <div className="shell py-5 md:py-7">
        {breadcrumbs ? (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="text-text-secondary flex list-none flex-wrap items-center gap-1 text-sm">
              <li>
                <Link href="/" className="hover:text-forest hover:underline">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  <Icon name="ChevronRight" size={13} />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-forest hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-forest font-semibold">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="flex items-start gap-3">
          {icon ? (
            <span className="border-border-subtle bg-surface-card text-state-success mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-control)] border">
              <Icon name={icon} size={26} />
            </span>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? <p className="eyebrow text-text-secondary mb-1.5">{eyebrow}</p> : null}
            <h1 className="text-2xl md:text-3xl">{title}</h1>
            {blurb ? <p className="text-text-secondary mt-2 max-w-2xl text-md">{blurb}</p> : null}
          </div>
        </div>

        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}
