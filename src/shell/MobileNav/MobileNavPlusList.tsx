import { Icon } from '@/shared/Icon';

export function MobileNavPlusList({ activeKey }: { activeKey: string }) {
  return (
    <>
      <div className="mobile-nav-sheet-head">
        <span className="mobile-nav-sheet-title">Plus</span>
        <button
          type="button"
          className="mobile-nav-sheet-close"
          aria-label="Fermer"
          onClick={() => window.closeMobileNavPlus()}
        >
          <Icon name="x" />
        </button>
      </div>
      {window.mobileNavSecondaryKeys().map((key) => {
        const item = window.navItem(key);
        if (!item) return null;
        const active = activeKey === key;
        return (
          <button
            type="button"
            key={key}
            className="mobile-nav-sheet-row"
            style={active ? { color: 'var(--stone-dark)', fontWeight: 600 } : undefined}
            onClick={() => window.goToFromMobileNav(key)}
          >
            <span className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
            {item.label}
          </button>
        );
      })}
      <div className="mobile-nav-sheet-sep" />
      <button
        type="button"
        className="mobile-nav-sheet-row"
        onClick={() => window.startMobileNavReorder()}
      >
        <span className="nav-icon">
          <Icon name="arrow-up-down" />
        </span>
        Réorganiser
      </button>
    </>
  );
}
