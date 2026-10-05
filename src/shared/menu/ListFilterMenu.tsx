import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { FilterColumnsList } from '@/shared/menu/ListFilterMenu/FilterColumnsList';
import { FilterValuesList } from '@/shared/menu/ListFilterMenu/FilterValuesList';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import { useTravelStore } from '@/store/useTravelStore';

// Port de filterPanel (js/views/filters/): the same prefs.filters[kind], so a saved filter still applies.
export function ListFilterMenu({ kind }: { kind: string }) {
  useTravelStore();
  if (!window.filterableColumns(kind).length) return null;
  return (
    <ToolbarMenu
      trigger={
        <ToolbarButton icon="funnel" label="Filtrer" count={window.activeFilterCount(kind)} />
      }
      align="start"
      wide
    >
      <div className="filter-panel">
        <FilterColumnsList kind={kind} />
        <FilterValuesList kind={kind} />
      </div>
    </ToolbarMenu>
  );
}
