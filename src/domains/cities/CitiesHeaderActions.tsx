import { SearchField } from '../../shared/SearchField';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import { columns } from './columns';

export const CitiesHeaderActions = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  return (
    <div className="view-header-actions">
      <SearchField value={query} onChange={setQuery} />
      <ColumnPicker kind="cities" columns={columns} />
    </div>
  );
};