import { useEffect } from 'react';

/*
  Port du patron dismissAsk/wordAsk/providerAsk/routeAccommodationAsk (js/views/ask-overlay.js) :
  une question posée par-dessus l'écran en cours, une seule à la fois. Le clic hors de la boîte
  appelle onClose (closeAskOverlay par défaut, ou le nettoyage propre à l'ask qui en a un de plus).
*/
export function AskOverlayHost() {
  const ask = window.activeAsk;

  useEffect(() => {
    if (ask?.after) ask.after();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ask?.html]);

  if (!ask) return null;

  return (
    <div
      className="overlay overlay-ask"
      onClick={(event) => {
        if (event.target === event.currentTarget) ask.onClose();
      }}
      onKeyDown={(event) => ask.onKeydown?.(event.nativeEvent)}
      dangerouslySetInnerHTML={{ __html: ask.html }}
    />
  );
}
