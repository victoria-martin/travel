import { Button } from '@/shared/buttons/Button';
import { ScenarioTransportDropdown } from '@/shared/select/ScenarioTransportDropdown';
import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';
import type { Scenario } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { TransportRow } from './TransportsBlock/TransportRow';

// A transport belongs to the trip: the scenario holds a reference, and ✕ detaches it without deleting it.
export function TransportsBlock({ scenario }: { scenario: Scenario }) {
  const store = useTravelStore();
  const scenarioTransports = window.getScenarioTransports(scenario);
  return (
    <div className="scenario-extra">
      <div className="scenario-extra-head">
        <div className="acc-recap-title">Transports</div>
      </div>
      {scenarioTransports.length === 0 ? (
        <div className="scenario-extra-empty">
          Aucun trajet rattaché — ceux du voyage restent sur la page Transports.
        </div>
      ) : (
        scenarioTransports.map((transport) => (
          <TransportRow key={transport.id} scenario={scenario} transport={transport} />
        ))
      )}
      <div className="scenario-extra-actions">
        <ScenarioTransportDropdown
          scenario={scenario}
          transports={window.ofCurrentTravel(store.data.transports)}
        />
        <Button
          size="small"
          title="Ajouter un trajet"
          ariaLabel="Ajouter un trajet"
          onClick={() => window.openModal('transport', '', scenario.id)}
        >
          <ToolbarFace icon="plus" label="Ajouter un trajet" />
        </Button>
      </div>
    </div>
  );
}
