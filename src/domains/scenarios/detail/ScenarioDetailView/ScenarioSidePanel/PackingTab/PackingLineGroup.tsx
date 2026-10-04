import type { PackingGroup } from '@/domains/packing/group';
import type { PackingListItem } from '@/store/types';
import { PackingLineRow } from './PackingLineRow';

// The fold is a session gesture shared with the legacy composer, kept in isPackingGroupOpen.
export function PackingLineGroup({ group }: { group: PackingGroup<PackingListItem> }) {
  const done = group.items.filter((item) => item.checked).length;
  return (
    <details
      className="packing-group"
      open={window.isPackingGroupOpen(group.category)}
      onToggle={(event) => window.setPackingGroupOpen(group.category, event.currentTarget.open)}
    >
      <summary>
        {group.category}
        <span className="packing-group-count">
          {done}/{group.items.length}
        </span>
      </summary>
      {group.items.map((item) => (
        <PackingLineRow key={item.id} item={item} />
      ))}
    </details>
  );
}
