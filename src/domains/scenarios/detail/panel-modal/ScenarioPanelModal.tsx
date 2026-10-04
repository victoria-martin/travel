import { useTravelStore } from '@/store/useTravelStore';
import { SCENARIO_SIDE_TABS } from '../ScenarioDetailView/scenarioSideTabs';

// Below 640px the side panel has no column of its own: its tab opens in this sheet instead.
export function ScenarioPanelModal({ payload }: { payload: { scenarioId: string; key: string } }) {
  const store = useTravelStore();
  const scenario = store.data.scenarios.find((candidate) => candidate.id === payload.scenarioId);
  const tab = SCENARIO_SIDE_TABS.find((candidate) => candidate.key === payload.key);
  if (!scenario || !tab) return <></>;
  return (
    <>
      <h3>{tab.label}</h3>
      <tab.Body scenario={scenario} />
      <div className="modal-actions">
        <button type="button" className="btn" onClick={() => window.closeModal()}>
          Fermer
        </button>
      </div>
    </>
  );
}
