// Délègue à js/icons.js (svgIcon) : une seule collection d'icônes, pas de duplication SVG.
export function Icon({ name, fill }: { name: string; fill?: boolean }) {
  return <span dangerouslySetInnerHTML={{ __html: window.svgIcon(name, { fill }) }} />;
}
