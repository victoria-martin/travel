import { FilterFields } from './FilterFields';
import { SidePanel } from './SidePanel';

// Colonne fixe — mêmes champs que FilterButton, voir FilterFields.
export function MapFilterPanel() {
  return (
    <SidePanel title="Filtres">
      <FilterFields />
    </SidePanel>
  );
}
