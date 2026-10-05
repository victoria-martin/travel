import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/menu/ColumnPicker';
import { SortMenu } from '@/shared/menu/SortMenu';
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
      <SortMenu kind="cities" />
      <ColumnPicker kind="cities" columns={columns} />
    </TableHeaderActions>
  );
};
