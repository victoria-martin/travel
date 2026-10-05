import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { SortLevelRow } from '@/shared/menu/SortMenu/SortLevelRow';
import { ToolbarMenu } from '@/shared/menu/ToolbarMenu';
import { useTravelStore } from '@/store/useTravelStore';

// Port de sortPanel (js/sort.js): ordered levels, the first one that separates two rows wins.
export function SortMenu({ kind }: { kind: string }) {
  useTravelStore();
  const criteria = window.sortCriteria(kind);
  const canAdd = criteria.length < window.sortableColumns(kind).length;
  return (
    <ToolbarMenu
      trigger={<ToolbarButton icon="arrow-up-down" label="Trier" count={criteria.length} />}
      align="start"
    >
      <div className="sort-panel">
        {criteria.length ? (
          criteria.map((criterion, index) => (
            <SortLevelRow
              key={`${criterion.key}-${index}`}
              kind={kind}
              criterion={criterion}
              index={index}
              total={criteria.length}
            />
          ))
        ) : (
          <p className="sort-empty">Aucun tri — la liste garde son ordre d&apos;origine.</p>
        )}
        {canAdd && (
          <button
            type="button"
            className="btn-secondary btn sort-add"
            onClick={() => window.addSortLevel(kind)}
          >
            + Ajouter un niveau
          </button>
        )}
      </div>
    </ToolbarMenu>
  );
}
