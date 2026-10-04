import { Button } from '@/shared/buttons/Button';
import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';

// Les corps des onglets restent dans js/views/scenarios/detail/side-tabs.js (legacy) ; seuls les
// boutons du header sont portés ici.
const SIDE_TABS = [
  { key: 'map', icon: 'map', label: 'Carte' },
  { key: 'transports', icon: 'plane', label: 'Transports' },
  { key: 'money', icon: 'euro', label: 'Argent' },
  { key: 'valise', icon: 'luggage', label: 'Valise' },
];

// Des boutons séparés, pas un toggle-group : recliquer l'actif referme le panneau.
export function ScenarioSideTabsButtons({ scenarioId }: { scenarioId: string }) {
  const active = window.prefs.scenarioSidePanel;
  return (
    <>
      {SIDE_TABS.map((tab) => (
        <Button
          key={tab.key}
          variant="outline"
          size="small"
          title={tab.label}
          className={tab.key === active ? 'active' : ''}
          onClick={() => window.onScenarioPanelToggle(scenarioId, tab.key)}
        >
          <ToolbarFace icon={tab.icon} label={tab.label} />
        </Button>
      ))}
    </>
  );
}
