/*
  Quatre écrans posaient une question par-dessus l'écran en cours sans repasser par render() —
  dismissAsk (modal.js), askNewWord, askNewProvider, openRouteAccommodationChoice — chacun créant
  et appendant son propre noeud DOM à la main (document.getElementById('app').appendChild(...)).
  Depuis la Phase 4, #app appartient entièrement à React (src/shell/AppShell.tsx) : un appendChild
  manuel dessus n'est plus sûr, React ignore ce noeud dans sa réconciliation. Une seule ask active
  à la fois, peinte par AskOverlayHost (src/shell/AskOverlayHost.tsx) via dangerouslySetInnerHTML.
*/
var activeAsk = null; // { html, onKeydown?, after?, onClose } | null

// `onClose` couvre le clic hors de la boîte (backdrop) — par défaut closeAskOverlay(), mais
// certaines asks ont un état en plus à nettoyer (routeAccommodationPoints) et passent leur propre
// closeXxx() ici pour ne pas le court-circuiter.
function showAskOverlay(html, { onKeydown, after, onClose } = {}) {
  activeAsk = { html, onKeydown, after, onClose: onClose || closeAskOverlay };
  render();
}

function closeAskOverlay() {
  activeAsk = null;
  render();
}
