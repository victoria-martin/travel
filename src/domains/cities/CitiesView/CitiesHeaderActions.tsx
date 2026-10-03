import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/toolbar/ColumnPicker';
import { SettingsMenu } from '@/shared/toolbar/SettingsMenu';
import { columns } from '../cities-table/columns';

export const CitiesHeaderActions = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  return (
    <div className="view-header-actions">
      <SearchInput value={query} onChange={setQuery} />
      <ColumnPicker kind="cities" columns={columns} />
      <SettingsMenu />
    </div>
  );
};
