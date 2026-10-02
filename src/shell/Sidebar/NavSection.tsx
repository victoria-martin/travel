import { NavButton } from './NavButton';

// Port de navSection (js/render.js). `open` recalculé à chaque rendu mais jamais retouché par
// React tant que la préférence ne change pas ailleurs (même raisonnement que PackingGroup) :
// setNavSectionFold ne déclenche pas de render(), donc le DOM et la pref restent synchronisés par
// le geste natif de l'utilisateur, pas par React.
export function NavSection({ section }: { section: { key: string; title: string; keys: string[] } }) {
  return (
    <details
      className="nav-section"
      open={window.navSectionOpen(section.key)}
      onToggle={(event) => window.setNavSectionFold(section.key, event.currentTarget.open)}
    >
      <summary className="nav-section-title">{section.title}</summary>
      <div className="nav-section-items">
        {section.keys.map((key) => {
          const item = window.navItem(key);
          return item && <NavButton key={key} item={item} />;
        })}
      </div>
    </details>
  );
}
