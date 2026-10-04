export function MobileNavTab({
  item,
  active,
}: {
  item: { key: string; label: string; icon: string };
  active: boolean;
}) {
  return (
    <button
      type="button"
      className={`mobile-nav-tab ${active ? 'active' : ''}`}
      onClick={() => window.goToFromMobileNav(item.key)}
    >
      <span className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
      <span className="mobile-nav-tab-label">{item.label}</span>
    </button>
  );
}
