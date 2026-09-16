'use client';

import { useState } from 'react';
import { ICON_GROUPS, Icon } from '@/components/icons';
import { cx } from '@/lib/cx';

const SIZES = [16, 20, 24, 32, 48];

export function IconGallery() {
  const [size, setSize] = useState(24);
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-text-secondary text-xs font-semibold">Size</span>
        {SIZES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={size === option}
            onClick={() => setSize(option)}
            className={cx(
              'num min-h-10 rounded-[var(--radius-chip)] border px-2.5 text-sm font-semibold transition-colors duration-[var(--duration-tap)]',
              size === option
                ? 'border-forest bg-forest text-text-inverse'
                : 'border-border-subtle bg-surface-card hover:border-border-default',
            )}
          >
            {option}px
          </button>
        ))}
        <span className="text-text-secondary ml-auto text-sm">
          {ICON_GROUPS.reduce((total, group) => total + group.names.length, 0)} icons · 24px box ·
          1.75 stroke · currentColor
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {ICON_GROUPS.map((group) => (
          <section key={group.title}>
            <h3 className="eyebrow border-border-subtle mb-3 border-b pb-2">
              {group.title} · {group.names.length}
            </h3>
            <ul className="grid list-none grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {group.names.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`<Icon name="${name}" />`);
                      setCopied(name);
                      setTimeout(() => setCopied(null), 1400);
                    }}
                    className="border-border-subtle bg-surface-card hover:border-border-default flex min-h-[92px] w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border p-2 transition-colors duration-[var(--duration-tap)]"
                  >
                    <Icon name={name} size={size} />
                    <span className="text-text-secondary w-full truncate text-center text-xs">
                      {copied === name ? 'Copied' : name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
