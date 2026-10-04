import { Fragment } from 'react';

// Rows are dragged by their handle, through the legacy HTML5 drag handlers (js/views/mobile-nav/drag.js).
export function MobileNavReorderList() {
  const primaryCount = window.MOBILE_NAV_PRIMARY_COUNT;
  return (
    <>
      <div className="mobile-nav-sheet-head">
        <span className="mobile-nav-sheet-title">Réorganiser</span>
        <button
          type="button"
          className="mobile-nav-sheet-done"
          onClick={() => window.endMobileNavReorder()}
        >
          Terminé
        </button>
      </div>
      <div className="mobile-nav-reorder-hint">
        Les {primaryCount} premières vont dans la barre du bas, le reste dans Plus.
      </div>
      {window.mobileNavOrder().map((key, index) => {
        const item = window.navItem(key);
        if (!item) return null;
        return (
          <Fragment key={key}>
            {index === primaryCount && <div className="mobile-nav-sheet-sep" />}
            <div
              className="mobile-nav-reorder-row"
              onDragOver={(event) => window.overMobileNavRow(event)}
              onDrop={(event) => window.dropOnMobileNavRow(event, key)}
            >
              <span
                className="mobile-nav-drag-handle"
                draggable
                title="Glisser pour déplacer"
                onDragStart={(event) => window.startMobileNavDrag(event, key)}
                onDragEnd={() => window.endMobileNavDrag()}
              >
                ⠿
              </span>
              <span className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
              <span>{item.label}</span>
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
