import { useShallow } from 'zustand/react/shallow';
import { Icon } from '../../../shared/Icon';
import type { Scenario } from '../../../store/types';
import { useTravelStore } from '../../../store/useTravelStore';
import { SidePanel } from './SidePanel';

// Port de scenario-panel.js. Le tracé lui-même (drawScenarioOnMap) reste délégué au legacy, voir
// MapView.tsx (`afterMarkers`) — il dépend des étapes/groupes du scénario, à ne pas re-dériver
// ici tant que le détail d'un Scénario n'est pas porté.
function ScenarioItem({ id, icon, label }: { id: string | null; icon: string; label: string }) {
  const active = (window.mapFilters.scenarioId || null) === id;
  return (
    <button
      type="button"
      className={`map-scenario-item ${active ? 'active' : ''}`}
      onClick={() => window.setMapScenario(id || '')}
    >
      <span className="map-scenario-item-icon">
        <Icon name={icon} />
      </span>
      <span className="map-scenario-item-label">{label}</span>
    </button>
  );
}

function ScopeToggle() {
  return (
    <div className="toggle-group">
      <button
        type="button"
        className={`toolbar-btn ${!window.mapFilters.scenarioOnly ? 'active' : ''}`}
        title="Tous les lieux"
        aria-label="Tous les lieux"
        onClick={() => window.setMapScenarioOnly(false)}
      >
        <span className="toolbar-icon">
          <Icon name="map" />
        </span>
        <span className="toolbar-label">Tous les lieux</span>
      </button>
      <button
        type="button"
        className={`toolbar-btn ${window.mapFilters.scenarioOnly ? 'active' : ''}`}
        title="Lieux du scénario"
        aria-label="Lieux du scénario"
        onClick={() => window.setMapScenarioOnly(true)}
      >
        <span className="toolbar-icon">
          <Icon name="compass" />
        </span>
        <span className="toolbar-label">Lieux du scénario</span>
      </button>
    </div>
  );
}

export function ScenarioPanel() {
  const scenarios = useTravelStore(
    useShallow((store): Scenario[] =>
      window.activeScenarios(window.ofCurrentTravel(store.data.scenarios)),
    ),
  );

  return (
    <>
      <SidePanel title="Scénarios">
        <div className="map-scenario-list">
          <ScenarioItem id={null} icon="compass" label="Tous les lieux" />
          {scenarios.map((scenario) => (
            <ScenarioItem key={scenario.id} id={scenario.id} icon="map" label={scenario.name} />
          ))}
        </div>
      </SidePanel>
      {window.mapFilters.scenarioId && <ScopeToggle />}
    </>
  );
}
