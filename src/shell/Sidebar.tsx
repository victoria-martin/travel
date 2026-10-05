import { NavButton } from './Sidebar/NavButton';
import { NavSection } from './Sidebar/NavSection';
import { SettingsNavButton } from './Sidebar/SettingsNavButton';
import { SyncStatusButton } from './Sidebar/SyncStatusButton';
import { TravelSelector } from './Sidebar/TravelSelector';

// Port de render()/navBtn/navSection (js/render.js).
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
        <SettingsNavButton />
      </div>
    </div>
  );
}
