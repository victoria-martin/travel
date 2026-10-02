import { LegacyMarkup } from '../shared/LegacyMarkup';
import { NavButton } from './Sidebar/NavButton';
import { NavSection } from './Sidebar/NavSection';

/*
  Port de render()/navBtn/navSection (js/render.js) — structure et navigation en React, le
  sélecteur de voyage/statut sync/bouton réglages restent délégués (LegacyMarkup) : des widgets
  autonomes, déjà corrects, pas la cause de la refonte du shell.
*/
export function Sidebar() {
  const accueil = window.navItem('accueil');

  return (
    <div className="sidebar">
      <LegacyMarkup html={window.travelSelector()} />
      {accueil && <NavButton item={accueil} />}
      {window.NAV_SECTIONS.map((section) => (
        <NavSection key={section.key} section={section} />
      ))}
      <div className="sidebar-footer">
        <LegacyMarkup html={window.syncStatusHtml()} />
        <LegacyMarkup html={window.settingsButton()} />
      </div>
    </div>
  );
}
