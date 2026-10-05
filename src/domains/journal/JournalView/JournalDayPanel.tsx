import { journalMapMarkers } from '@/domains/journal/journalMapMarkers';
import { LeafletMap } from '@/platform/web/LeafletMap';
import type { Scenario } from '@/store/types';
import { JournalEditor } from './JournalDayPanel/JournalEditor';
import { PlannedPills } from './JournalDayPanel/PlannedPills';
import { useJournalEditor } from './JournalDayPanel/useJournalEditor';

export function JournalDayPanel({ scenario, date }: { scenario: Scenario; date: string }) {
  const editor = useJournalEditor(date);
  return (
    <div className="journal-cols">
      <div className="journal-main view-scroller">
        <PlannedPills
          scenario={scenario}
          date={date}
          onInsert={(name) => editor.insertAtCaret(`{${name}}`)}
        />
        <JournalEditor scenario={scenario} date={date} editor={editor} />
      </div>
      {window.prefs.journalSidePanel === 'map' && (
        <div className="journal-side">
          <div className="scenario-map-block">
            <LeafletMap className="scenario-map-canvas" markers={journalMapMarkers(date)} />
          </div>
        </div>
      )}
    </div>
  );
}
