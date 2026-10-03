import { Icon } from '@/shared/Icon';
import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { useTravelStore } from '@/store/useTravelStore';
import { useEffect } from 'react';
import { DayCards } from './JournalView/DayCards';

/*
  Porte js/views/journal/{journal,day-cards,side-tabs}.js. La carte en-tête (sélecteur de
  scénario) et le rang de jours sont de vrais composants React. Le panneau du jour (éditeur
  markdown, dropdown {}, photos, pastilles planifiées, refs non résolues, panneau carte) reste
  délégué via LegacyMarkup : tout tourne autour d'un unique textarea et de sa position de caret
  (document.getElementById('journal-text'), sélection, insertion au curseur) — un bloc
  profondément impératif, même famille que RouteBuilderPanel/NewCityButton (§ 5 du plan), pas
  une liste ou un formulaire ordinaire à reconstruire en React.
*/
export function JournalView() {
  useTravelStore();
  const scenarioId = window.defaultJournalScenarioId();
  const scenario = scenarioId ? window.getScenario(scenarioId) : null;
  if (scenario && !window.prefs.journalDate) {
    const days = window.journalScenarioDays(scenario);
    if (days.length) window.prefs.journalDate = days[0];
  }
  const date = window.prefs.journalDate as string;
  const sidePanelOpen = !!window.prefs.journalSidePanel;

  useEffect(() => {
    if (sidePanelOpen) window.initJournalMap();
  }, [scenario?.id, date, sidePanelOpen]);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Journal</h2>
          <p className="view-sub">Un carnet de bord, jour par jour</p>
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
            className={`toolbar-btn ${window.prefs.journalSidePanel === 'map' ? 'active' : ''}`}
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
        <LegacyMarkup html={window.journalDayPanel(scenario, date)} />
      )}
    </>
  );
}
