import { TextCell } from '@/shared/cells/TextCell';
import type { Transport } from '@/store/types';

// Lecture seule pour ce lot : pas encore le flux « précision libre sous le lieu » pour from/to —
// la précision s'affiche en ligne plutôt qu'en sous-ligne (.row-notes), un détail visuel à revoir.
export function EndpointCell({ placeId, precision }: { placeId: string; precision: string }) {
  const place = window.transportPlaceName(placeId);
  if (!place) return <TextCell value={precision} />;
  return (
    <>
      {place}
      {precision && <div className="row-notes">{precision}</div>}
    </>
  );
}

export function ScheduleCell({ date, time }: { date: string; time: string }) {
  return <TextCell value={window.transportMoment(date, time)} />;
}

export function ProviderCell({ transport }: { transport: Transport }) {
  const lead = window.providerName(transport.providerId);
  if (!lead) return <TextCell value={transport.reference} />;
  return (
    <>
      {lead}
      {transport.reference && <div className="row-notes">{transport.reference}</div>}
    </>
  );
}

export function PriceCell({ transport }: { transport: Transport }) {
  return <TextCell value={window.priceLabel(transport)} />;
}
