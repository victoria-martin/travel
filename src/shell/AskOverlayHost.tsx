import { OverlayHost } from '@/shell/OverlayHost';
import { ProviderAskForm } from './AskOverlayHost/ProviderAskForm';
import { RouteAccommodationForm } from './AskOverlayHost/RouteAccommodationForm';
import { WordAskForm } from './AskOverlayHost/WordAskForm';

// One question over the current screen at a time (window.activeAsk), one form per `kind`.
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
    <OverlayHost onClose={ask.onClose}>
      <RouteAccommodationForm
        scenarioId={ask.scenarioId}
        stepId={ask.stepId}
        points={ask.points}
        onClose={ask.onClose}
      />
    </OverlayHost>
  );
}
