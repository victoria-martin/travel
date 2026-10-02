// Port de navBtn (js/render.js). `icon` est déjà une chaîne SVG construite par svgIcon() au
// chargement de NAV_ITEMS — pas un nom, donc pas <Icon name=…> ici (la barre mobile, encore
// legacy, consomme la même table telle quelle).
export function NavButton({ item }: { item: { key: string; label: string; icon: string } }) {
  const view = window.getCurrentView();
  const isActive = view === item.key || (item.key === 'scenarios' && view === 'scenario-detail');

  return (
    <button
      type="button"
      className={`nav-btn ${isActive ? 'active' : ''}`}
      title={item.label}
      aria-label={item.label}
      onClick={() => window.goTo(item.key)}
    >
      <span className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
      <span className="nav-label">{item.label}</span>
    </button>
  );
}
