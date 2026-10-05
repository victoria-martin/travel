import { Icon } from '@/shared/Icon';
import { SortOrderWords } from './SortOrderWords';

export function SortLevelRow({
  kind,
  criterion,
  index,
  total,
}: {
  kind: string;
  criterion: { key: string; dir: 'asc' | 'desc' };
  index: number;
  total: number;
}) {
  const column = window.columnsFor(kind).find((candidate) => candidate.key === criterion.key);
  return (
    <>
      <div className="sort-row">
        <span className="sort-rank">{index === 0 ? 'Trier par' : 'puis par'}</span>
        <select
          className="inline-select"
          value={criterion.key}
          onChange={(event) => window.setSortKey(kind, index, event.target.value)}
        >
          {window.sortableColumns(kind).map((option) => (
            <option key={option.key} value={option.key}>
              {window.columnLabel(option)}
            </option>
          ))}
        </select>
        {!column?.sortOrder && (
          <select
            className="inline-select"
            value={criterion.dir}
            onChange={(event) => window.setSortDir(kind, index, event.target.value)}
          >
            <option value="asc">{window.directionLabel(column, 'asc')}</option>
            <option value="desc">{window.directionLabel(column, 'desc')}</option>
          </select>
        )}
        <button
          type="button"
          className="icon-btn"
          title="Monter ce niveau"
          disabled={index === 0}
          onClick={() => window.moveSortLevel(kind, index, -1)}
        >
          <Icon name="arrow-up" />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Descendre ce niveau"
          disabled={index === total - 1}
          onClick={() => window.moveSortLevel(kind, index, 1)}
        >
          <Icon name="arrow-down" />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Retirer"
          onClick={() => window.removeSortLevel(kind, index)}
        >
          <Icon name="x" />
        </button>
      </div>
      {column?.sortOrder && <SortOrderWords kind={kind} column={column} />}
    </>
  );
}
