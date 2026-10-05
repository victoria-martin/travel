import { Icon } from '@/shared/Icon';
import { useTravelStore } from '@/store/useTravelStore';
import { DayCards } from './JournalView/DayCards';
import { JournalDayPanel } from './JournalView/JournalDayPanel';

export function JournalView() {
  useTravelStore();
  const scenarioId = window.defaultJournalScenarioId();
  const scenario = scenarioId ? window.getScenario(scenarioId) : null;
  if (scenario && !window.prefs.journalDate) {
    const days = window.journalScenarioDays(scenario);
    if (days.length) window.prefs.journalDate = days[0];
  }
  const date = window.prefs.journalDate as string;

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Journal</h2>
          <span className="view-sub">Un carnet de bord, jour par jour</span>
        </div>
        <div className="view-header-actions">
          <select
            className="journal-scenario-select"
            value={scenarioId || ''}
            onChange={(event) => window.setJournalScenario(event.target.value)}
          >
            <option value="">— Choisir un scénario —</option>
            {window.journalScenarioOptions().map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={`btn btn-outline btn-small ${window.prefs.journalSidePanel === 'map' ? 'active' : ''}`}
            title="Carte"
            onClick={() => window.onJournalPanelToggle(date || '', 'map')}
          >
            <span className="toolbar-icon">
              <Icon name="map" />
            </span>
            <span className="toolbar-label">Carte</span>
          </button>
        </div>
      </div>
      <DayCards scenario={scenario} date={date} />
      {!scenario ? (
        <div className="empty-state">
          <strong>Choisis un scénario</strong>
          Les jours du journal se datent sur le séjour d&apos;un scénario.
        </div>
      ) : !date ? (
        <div className="empty-state">
          <strong>Aucun jour</strong>
          Ajoute un jour depuis le rang ci-dessus.
        </div>
      ) : (
        <JournalDayPanel key={date} scenario={scenario} date={date} />
      )}
    </>
  );
}
