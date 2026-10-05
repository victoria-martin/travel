import { OverlayHost } from '@/shell/OverlayHost';
import { ProviderAskForm } from './AskOverlayHost/ProviderAskForm';
import { WordAskForm } from './AskOverlayHost/WordAskForm';

/*
  Une question posée par-dessus l'écran en cours, une seule à la fois (window.activeAsk). Les
  questions portées en React se déclarent par `kind` ; celles encore en HTML legacy passent par
  `html` (js/ask-overlay.js). Le clic hors de la boîte appelle onClose.
*/
export function AskOverlayHost() {
  const ask = window.activeAsk;
  if (!ask) return null;

  if (ask.kind === 'word')
    return (
      <OverlayHost
        onClose={ask.onClose}
        onOpened={() => document.getElementById('new-word-label')?.focus()}
      >
        <WordAskForm bank={ask.bank} onCreate={ask.onCreate} onClose={ask.onClose} />
      </OverlayHost>
    );
  if (ask.kind === 'provider')
    return (
      <OverlayHost onClose={ask.onClose}>
        <ProviderAskForm mode={ask.mode} onCreate={ask.onCreate} onClose={ask.onClose} />
      </OverlayHost>
    );
  return (
    <OverlayHost
      onClose={ask.onClose}
      onKeyDown={(event) => ask.onKeydown?.(event.nativeEvent)}
      html={{ __html: ask.html }}
      onOpened={ask.after}
    />
  );
}
