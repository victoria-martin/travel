// Port de linkCell/externalLink (js/views/cells/link-cell.js, js/views/external-link.js).
export function LinkCell({ link, label = 'Voir' }: { link: string; label?: string }) {
  if (!link) return <>—</>;
  return (
    <a href={link} target="_blank" rel="noreferrer" className="external-link">
      {label}
    </a>
  );
}
