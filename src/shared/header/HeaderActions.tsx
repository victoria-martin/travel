import type { ReactNode } from 'react';
import { SettingsMenu } from '../toolbar/SettingsMenu';

{
  /* pas sur de cette implem mais laisson spr l instant */
}

const HeaderActions = ({ children }: { children: ReactNode }) => {
  return (
    <div className="view-header-actions">
      {/* <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="cities" columns={columns} /> */}
      {children}
      <SettingsMenu />
    </div>
  );
};

export default HeaderActions;

export const TableHeaderActions = ({ children }: { children: ReactNode }) => {
  return (
    <div className="view-header-actions">
      {/* <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="cities" columns={columns} /> */}
      {children}
      <SettingsMenu />
    </div>
  );
};
