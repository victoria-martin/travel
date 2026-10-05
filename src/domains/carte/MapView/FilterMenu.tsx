import { ToolbarButton } from '@/shared/buttons/Button';
import { DropdownContent } from '@/shared/dropdown/dropdown';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FilterFields } from './FilterFields';
import { MAP_KINDS } from './mapKinds';

export function FilterMenu() {
  const hiddenCount = MAP_KINDS.filter((kind) => !window.mapFilters.shown[kind.key]).length;
  const count = hiddenCount + (window.mapFilters.favOnly ? 1 : 0);
  return (
    // <ToolbarPanel icon="funnel" label="Filtrer" count={count}>
    //   <div className="filter-panel">
    //     <FilterFields />
    //   </div>
    // </ToolbarPanel>
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        {/* <FilterButton /> */}
        <ToolbarButton icon="funnel" label="Filtrer" count={count} />
        {/* <SettingsButton label="Filtrer" /> */}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownContent>
          <div className="filter-panel">
            <FilterFields />
          </div>
        </DropdownContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
