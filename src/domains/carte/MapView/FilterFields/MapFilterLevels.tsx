import { FilterColumnsList } from '@/shared/menu/FilterColumnsList';
import { FilterValuesList } from '@/shared/menu/FilterValuesList';

// Folded by default: the switches stay readable, the column filters open on demand.
export function MapFilterLevels({ scope }: { scope: string }) {
  const count = window.activeFilterCount(scope);
  return (
    <details className="map-filter-levels">
      <summary className="filter-title">
        Colonnes et valeurs{count > 0 && ` · ${count} filtrée${count > 1 ? 's' : ''}`}
      </summary>
      <FilterColumnsList scope={scope} />
      <FilterValuesList scope={scope} />
    </details>
  );
}
