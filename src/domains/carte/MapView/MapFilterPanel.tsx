import { FilterFields } from './FilterFields';
import { SidePanel } from './SidePanel';

// Colonne fixe — mêmes champs que FilterMenu, voir FilterFields.
export function MapFilterPanel() {
  return (
    <SidePanel title="Filtres">
      <FilterFields />
    </SidePanel>
  );
}
