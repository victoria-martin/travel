// Délégué au HTML legacy (newCityPanel, js/views/map/new-city.js), même raison que
// RouteBuilderPanel : brouillon + géocodage asynchrone dans une globale du module.
export function NewCityButton() {
  return <div dangerouslySetInnerHTML={{ __html: window.newCityPanel() }} />;
}
