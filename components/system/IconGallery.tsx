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
        <span className="label text-forest-muted">Size</span>
        {SIZES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={size === option}
            onClick={() => setSize(option)}
            className={cx(
              'num min-h-9 rounded-[var(--radius-chip)] border px-2.5 text-sm font-semibold',
              size === option
                ? 'border-forest bg-forest text-breadfruit'
                : 'border-line-strong bg-paper hover:border-forest',
            )}
          >
            {option}px
          </button>
        ))}
        <span className="text-forest-muted ml-auto text-sm">
          {ICON_GROUPS.reduce((total, group) => total + group.names.length, 0)} icons · 24px box ·
          1.75 stroke · currentColor
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {ICON_GROUPS.map((group) => (
          <section key={group.title}>
            <h3 className="label text-forest-muted border-line mb-2.5 border-b pb-1.5">
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
                    className="border-line-strong bg-paper hover:border-forest flex min-h-[92px] w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border p-2 transition-colors"
                  >
                    <Icon name={name} size={size} />
                    <span className="text-forest-muted w-full truncate text-center text-xs">
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
