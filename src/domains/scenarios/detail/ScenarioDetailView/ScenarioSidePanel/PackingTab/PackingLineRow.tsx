import { Icon } from '@/shared/Icon';
import { PackingQuantityDropdown } from '@/shared/select/PackingQuantityDropdown';
import type { PackingListItem } from '@/store/types';

export function PackingLineRow({ item }: { item: PackingListItem }) {
  return (
    <div className={`pack-row ${item.checked ? '' : 'unpacked'}`}>
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => window.togglePackingChecked(item.id)}
      />
      <span className="pack-label">
        {window.packingLineLabel(item)}
        {item.packingItemId ? (
          <span className="pack-link-icon" title="Depuis le catalogue">
            <Icon name="link" />
          </span>
        ) : (
          <span className="pack-voyage-badge" title="Propre à ce voyage">
            voyage
          </span>
        )}
      </span>
      <PackingQuantityDropdown item={item} />
      <button
        type="button"
        className="icon-btn"
        title="Retirer de la valise"
        onClick={() => window.removeFromTravelPacking(item.id)}
      >
        <Icon name="x" />
      </button>
    </div>
  );
}
