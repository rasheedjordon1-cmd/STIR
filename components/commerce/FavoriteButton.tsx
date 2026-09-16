'use client';

import { Icon } from '@/components/icons';
import { useSession } from '@/lib/store/session';
import { cx } from '@/lib/cx';

/** Saved-list control. Signed-out shoppers are sent to the account preview. */
export function FavoriteButton({
  productId,
  title,
  className,
}: {
  productId: string;
  title: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useSession();
  const saved = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(productId)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from your list` : `Save ${title} to your list`}
      className={cx(
        'bg-surface-card/85 flex h-9 w-9 items-center justify-center rounded-full',
        'transition-[color,background-color,transform] duration-[var(--duration-tap)] ease-[var(--ease-out-quint)] active:scale-95',
        saved ? 'text-state-danger' : 'text-text-secondary hover:text-text-primary',
        className,
      )}
    >
      <Icon name="Favorite" size={17} className={saved ? 'fill-current' : undefined} />
    </button>
  );
}
