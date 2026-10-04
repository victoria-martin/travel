import { LegacyMarkup } from '../shared/LegacyMarkup';
import { NavButton } from './Sidebar/NavButton';
import { NavSection } from './Sidebar/NavSection';
import { SyncStatusButton } from './Sidebar/SyncStatusButton';
import { TravelSelector } from './Sidebar/TravelSelector';

// Port de render()/navBtn/navSection (js/render.js). Le bouton Réglages reste délégué tant que la
// modale `settings` n'est pas portée (react-migration-panels-plan.md § 1).
export function Sidebar() {
  const accueil = window.navItem('accueil');

  return (
    <div className="sidebar">
      <TravelSelector />
      {accueil && <NavButton item={accueil} />}
      {window.NAV_SECTIONS.map((section) => (
        <NavSection key={section.key} section={section} />
      ))}
      <div className="sidebar-footer">
        <SyncStatusButton />
        <LegacyMarkup html={window.settingsButton()} />
      </div>
    </div>
  );
}
