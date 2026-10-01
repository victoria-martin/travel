import { Icon } from '../Icon';

// Port de favoriteStar (js/views/favorite-star.js).
export function FavoriteCell({ favorite, onToggle }: { favorite: boolean; onToggle: () => void }) {
  return (
    <button
      className="icon-btn"
      style={{
        border: 'none',
        fontSize: 16,
        flexShrink: 0,
        color: favorite ? '#C98A3E' : 'var(--line)',
      }}
      onClick={onToggle}
      title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Icon name="star" fill={favorite} />
    </button>
  );
}
