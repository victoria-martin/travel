import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/toolbar/ColumnPicker';
import { TableHeaderActions } from '@/shared/header/TableHeaderActions';
import { columns } from '../cities-table/columns';

export const CitiesHeaderActions = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  return (
    <TableHeaderActions>
      <SearchInput value={query} onChange={setQuery} />
      <ColumnPicker kind="cities" columns={columns} />
    </TableHeaderActions>
  );
};
