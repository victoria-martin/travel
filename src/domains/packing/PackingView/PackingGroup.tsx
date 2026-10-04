import type { PackingItem } from '@/store/types';
import type { PackingGroup as PackingGroupType } from '../group';
import { PackingRow } from './PackingRow';

/*
  Port de packingCatalogGroup (js/views/packing/catalog-list.js). Le repli est un geste de session,
  jamais persisté (même en legacy) : un <details> non contrôlé suffit, pas besoin de réimplémenter
  packingClosedGroups.
*/
export function PackingGroup({ group }: { group: PackingGroupType<PackingItem> }) {
  return (
    <details className="packing-group" open>
      <summary>
        {group.category} <span className="packing-group-count">{group.items.length}</span>
      </summary>
      {group.items.map((item) => (
        <PackingRow key={item.id} item={item} />
      ))}
    </details>
  );
}
