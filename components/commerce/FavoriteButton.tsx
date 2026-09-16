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
        'border-line-strong bg-paper/90 hover:border-forest flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-[1px] transition-colors',
        saved ? 'text-nutmeg border-nutmeg/50' : 'text-forest-muted',
        className,
      )}
    >
      <Icon name="Favorite" size={17} className={saved ? 'fill-current' : undefined} />
    </button>
  );
}
