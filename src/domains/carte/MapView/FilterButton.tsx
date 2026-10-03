import { ToolbarPanel } from '@/shared/toolbar/ToolbarPanel';
import { FilterFields } from './FilterFields';
import { MAP_KINDS } from './mapKinds';

// Menu d'en-tête (toolbarPanel) — mêmes champs que FilterPanel, voir FilterFields.
export function FilterButton() {
  const hiddenCount = MAP_KINDS.filter((kind) => !window.mapFilters.shown[kind.key]).length;
  const count = hiddenCount + (window.mapFilters.favOnly ? 1 : 0);
  return (
    <ToolbarPanel icon="funnel" label="Filtrer" count={count}>
      <div className="filter-panel">
        <FilterFields />
      </div>
    </ToolbarPanel>
  );
}
