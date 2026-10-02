import { Icon } from '../../../shared/Icon';
import type { Scenario } from '../../../store/types';

// Port de journalDayList/journalDayCard (js/views/journal/day-cards.js).
export function DayCards({ scenario, date }: { scenario: Scenario | null; date: string }) {
  const scenarioDays = scenario ? window.journalScenarioDays(scenario) : [];
  const entryDays = window.journalEntriesForTravel(window.currentTravelId() || '').map((e) => e.date);
  const days = Array.from(new Set([...scenarioDays, ...entryDays])).sort();

  return (
    <div className="journal-day-cards">
      {days.map((day, index) => {
        const entry = window.getJournalEntry(window.currentTravelId() || '', day);
        const parsed = window.isoToDate(day);
        return (
          <button
            key={day}
            type="button"
            className={`journal-day-card ${day === date ? 'active' : ''}`}
            onClick={() => window.selectJournalDay(day)}
          >
            <span className="journal-day-card-number">Jour {index + 1}</span>
            <span className="journal-day-card-date">
              {parsed ? window.formatStepDate(parsed) : day}
            </span>
            {entry && (entry.text || entry.photos.length > 0) && (
              <span className="journal-day-card-dot" title="Entrée écrite" />
            )}
          </button>
        );
      })}
      <button
        type="button"
        className="journal-day-card journal-day-add"
        onClick={() => window.promptJournalDay()}
      >
        <Icon name="plus" />
        <span>Jour</span>
      </button>
    </div>
  );
}
