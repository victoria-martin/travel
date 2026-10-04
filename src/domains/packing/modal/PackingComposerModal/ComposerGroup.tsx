import type { PackingGroup } from '@/domains/packing/group';
import type { PackingItem } from '@/store/types';

export function ComposerGroup({
  group,
  travelCatalogIds,
}: {
  group: PackingGroup<PackingItem>;
  travelCatalogIds: Set<string>;
}) {
  const inTravel = group.items.filter((item) => travelCatalogIds.has(item.id)).length;
  return (
    <details
      className="packing-group"
      open={window.isPackingGroupOpen(group.category)}
      onToggle={(event) => window.setPackingGroupOpen(group.category, event.currentTarget.open)}
    >
      <summary>
        {group.category}
        <span className="packing-group-count">
          {inTravel}/{group.items.length}
        </span>
      </summary>
      {group.items.map((item) => (
        <label key={item.id} className="filter-option packing-compose-row">
          <input
            type="checkbox"
            checked={travelCatalogIds.has(item.id)}
            onChange={() => window.toggleCatalogItemInTravel(item.id)}
          />
          {item.label}
        </label>
      ))}
    </details>
  );
}
