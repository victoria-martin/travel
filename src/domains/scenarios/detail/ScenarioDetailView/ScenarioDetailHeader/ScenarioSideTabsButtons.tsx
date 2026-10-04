import { Button } from '@/shared/buttons/Button';
import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';
import { SCENARIO_SIDE_TABS } from '../scenarioSideTabs';

// Des boutons séparés, pas un toggle-group : recliquer l'actif referme le panneau.
export function ScenarioSideTabsButtons({ scenarioId }: { scenarioId: string }) {
  const active = window.prefs.scenarioSidePanel;
  return (
    <>
      {SCENARIO_SIDE_TABS.map((tab) => (
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
