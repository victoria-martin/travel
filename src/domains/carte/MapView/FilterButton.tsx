import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { MAP_KINDS } from './mapKinds';

// The map filter's trigger: its count says how many collections are hidden, plus favourites only.
export function FilterButton(props: React.ComponentProps<'button'>) {
  const hiddenCount = MAP_KINDS.filter((kind) => !window.mapFilters.shown[kind.key]).length;
  const count = hiddenCount + (window.mapFilters.favOnly ? 1 : 0);
  return <ToolbarButton {...props} icon="funnel" label="Filtrer" count={count} />;
}
