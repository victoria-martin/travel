// Port de linkCell/externalLink (js/views/cells/link-cell.js, js/views/external-link.js).
export function LinkCell({ link }: { link: string }) {
  if (!link) return <>—</>;
  return (
    <a href={link} target="_blank" rel="noreferrer" className="external-link">
      Voir
    </a>
  );
}
