import { FilterFields } from './FilterFields';
import { SidePanel } from './SidePanel';

// Colonne fixe — mêmes champs que FilterButton, voir FilterFields.
export function FilterPanel() {
  return (
    <SidePanel title="Filtres">
      <span>coucou</span>
      <FilterFields />
    </SidePanel>
  );
}
