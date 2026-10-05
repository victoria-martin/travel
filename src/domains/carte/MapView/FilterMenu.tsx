import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import { FilterFields } from './FilterFields';
import { MAP_KINDS } from './mapKinds';

export function FilterMenu() {
  const hiddenCount = MAP_KINDS.filter((kind) => !window.mapFilters.shown[kind.key]).length;
  const count = hiddenCount + (window.mapFilters.favOnly ? 1 : 0);
  return (
    <ToolbarMenu
      trigger={<ToolbarButton icon="funnel" label="Filtrer" count={count} />}
      align="start"
      wide
    >
      <div className="filter-panel">
        <FilterFields />
      </div>
    </ToolbarMenu>
  );
}
