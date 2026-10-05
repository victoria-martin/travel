import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import { FilterButton } from './FilterButton';
import { FilterFields } from './FilterFields';

export function FilterMenu() {
  return (
    <ToolbarMenu trigger={<FilterButton />} align="start" wide>
      <div className="filter-panel">
        <FilterFields />
      </div>
    </ToolbarMenu>
  );
}
