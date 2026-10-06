import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { MAP_KINDS } from './mapKinds';

// A hidden collection counts like a filtered column: it is something no longer shown.
export function FilterButton(props: React.ComponentProps<'button'>) {
  const hiddenCount = MAP_KINDS.filter((kind) => !window.mapFilters.shown[kind.key]).length;
  const levelCount = MAP_KINDS.reduce(
    (total, kind) => total + window.activeFilterCount(window.mapScope(kind.key)),
    0,
  );
  const count = hiddenCount + levelCount + (window.mapFilters.favOnly ? 1 : 0);
  return <ToolbarButton {...props} icon="funnel" label="Filtrer" count={count} />;
}
