/*
  Délégué au HTML legacy (routeBuilderPanel, js/views/map/route-builder.js), pas réimplémenté :
  état dans une globale du module (routeBuilder), glisser-déposer HTML5 pour réordonner les points
  (sur le patron de step-drag.js), fetch OSRM asynchrone pour le tracé. Réécrire tout ça en React
  maintenant dupliquerait une logique entière pour un gain nul tant que ce mode n'est pas une
  priorité à part — les onclick/ondragstart legacy fonctionnent tels quels dans du HTML injecté,
  `window.render()` (déclenché par les mutations du module) régénère ce bloc comme le reste.
*/
export function RouteBuilderPanel() {
  if (!window.routeBuilder.active) return null;
  return <div dangerouslySetInnerHTML={{ __html: window.routeBuilderPanel() }} />;
}
