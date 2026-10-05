import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { MAP_KINDS } from '../../domains/carte/MapView/mapKinds';

// Menu d'en-tête (toolbarPanel) — mêmes champs que FilterPanel, voir FilterFields.
export function FilterButton({ ...props }) {
  const hiddenCount = MAP_KINDS.filter((kind) => !window.mapFilters.shown[kind.key]).length;
  const count = hiddenCount + (window.mapFilters.favOnly ? 1 : 0);
  // const showLabels = window.showButtonLabels();

  return <ToolbarButton icon="funnel" label="Filtrer" count={count}></ToolbarButton>;
}

{
  /* <Button {...props}>
        <Icon name="funnel" />
        {/* {showLabels && <span className="toolbar-label">"Affichage</span>}
      </Button> */
}
