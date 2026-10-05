/*
  Une question posée par-dessus l'écran en cours, une seule à la fois, peinte par AskOverlayHost
  (src/shell/AskOverlayHost.tsx) selon son `kind` : word, provider, routeAccommodation.
*/
var activeAsk = null;

function closeAskOverlay() {
  activeAsk = null;
  render();
}
