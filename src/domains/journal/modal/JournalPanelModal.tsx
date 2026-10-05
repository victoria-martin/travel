import { LeafletMap } from '@/platform/web/LeafletMap';
import { useTravelStore } from '@/store/useTravelStore';
import { journalMapMarkers } from '@/domains/journal/journalMapMarkers';

// Below 640px the journal side panel opens in this sheet; its only tab is the day's map.
export function JournalPanelModal({ payload }: { payload: { date: string; key: string } }) {
  useTravelStore();
  return (
    <>
      <h3>Carte</h3>
      <div className="scenario-map-block">
        <LeafletMap className="scenario-map-canvas" markers={journalMapMarkers(payload.date)} />
      </div>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={() => window.closeModal()}>
          Fermer
        </button>
      </div>
    </>
  );
}
