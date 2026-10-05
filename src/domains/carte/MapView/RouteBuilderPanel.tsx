import { Icon } from '@/shared/Icon';
import { FieldRow } from '@/shared/layout/FieldRow';
import { ScenarioStepDropdown } from '@/shared/select/ScenarioStepDropdown';
import { SidePanel } from './SidePanel';
import { useRouteSummary } from './RouteBuilderPanel/useRouteSummary';

/*
  A free route between map points, temporary like a view mode: the gesture lives in the legacy
  routeBuilder global. Rows are dragged through the legacy HTML5 handlers (route-builder.js).
*/
export function RouteBuilderPanel() {
  const points = window.routeBuilder.points;
  const summary = useRouteSummary(points.map((point) => [point.lat, point.lng]));
  if (!window.routeBuilder.active) return null;
  return (
    <SidePanel title="Itinéraire">
      {points.length === 0 ? (
        <div className="route-builder-hint">Clique des points sur la carte.</div>
      ) : (
        points.map((point, index) => (
          <div
            key={`${point.id}-${index}`}
            className="route-builder-row"
            draggable
            onDragStart={(event) => window.startRoutePointDrag(event, index)}
            onDragOver={(event) => window.overRoutePointRow(event)}
            onDrop={(event) => window.dropOnRoutePointRow(event, index)}
            onDragEnd={() => window.endRoutePointDrag()}
          >
            <span className="route-builder-handle" title="Glisser pour réordonner">
              ⠿
            </span>
            <span className="route-builder-index">{index + 1}.</span>
            <span className="route-builder-name">{point.name}</span>
            <button
              type="button"
              className="icon-btn"
              title="Retirer"
              onClick={() => window.removeRouteBuilderPoint(index)}
            >
              <Icon name="x" />
            </button>
          </div>
        ))
      )}
      {points.length > 1 && <div className="route-builder-summary">{summary}</div>}
      {points.length > 0 && (
        <FieldRow>
          <ScenarioStepDropdown
            className="route-scenario-dropdown"
            label="Ajouter à un scénario"
            onPick={(scenarioId, stepId) => window.addRouteToStep(scenarioId, stepId)}
          />
          <button type="button" className="btn btn-outline" onClick={() => window.addRouteToPlan()}>
            Ajouter au plan
          </button>
        </FieldRow>
      )}
      {points.length > 0 && (
        <button type="button" className="link-btn" onClick={() => window.clearRouteBuilderPoints()}>
          Effacer
        </button>
      )}
    </SidePanel>
  );
}
