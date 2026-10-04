import { Icon } from '@/shared/Icon';
import { MobileNavPlusList } from './MobileNav/MobileNavPlusList';
import { MobileNavReorderList } from './MobileNav/MobileNavReorderList';
import { MobileNavTab } from './MobileNav/MobileNavTab';

// Below 640px: the first pages of the chosen order in the bar, the rest in the "Plus" drawer.
export function MobileNav() {
  const view = window.getCurrentView();
  const activeKey = view === 'scenario-detail' ? 'scenarios' : view;
  const plusActive =
    window.mobileNavPlusOpen || window.mobileNavSecondaryKeys().includes(activeKey);
  return (
    <>
      <nav className="mobile-nav-bar">
        {window.mobileNavPrimaryKeys().map((key) => {
          const item = window.navItem(key);
          return item ? <MobileNavTab key={key} item={item} active={activeKey === key} /> : null;
        })}
        <button
          type="button"
          className={`mobile-nav-tab ${plusActive ? 'active' : ''}`}
          aria-label="Plus"
          onClick={() => window.toggleMobileNavPlus()}
        >
          <span className="nav-icon">
            <Icon name="ellipsis" />
          </span>
          <span className="mobile-nav-tab-label">Plus</span>
        </button>
      </nav>
      {window.mobileNavPlusOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => window.closeMobileNavPlus()} />
          <div className="mobile-nav-sheet">
            {window.mobileNavReordering ? (
              <MobileNavReorderList />
            ) : (
              <MobileNavPlusList activeKey={activeKey} />
            )}
          </div>
        </>
      )}
    </>
  );
}
