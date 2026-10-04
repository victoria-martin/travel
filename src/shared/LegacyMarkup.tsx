/*
  Échappatoire délibérée pour un fragment legacy complexe/stateful qu'on ne réimplémente pas tout
  de suite (docs/en-cours/react-migration-plan.md § 4) : `display: contents` pour ne rien ajouter à la mise
  en page, les onclick du HTML injecté appellent des globales legacy toujours chargées.
*/
export function LegacyMarkup({ html }: { html: string }) {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
