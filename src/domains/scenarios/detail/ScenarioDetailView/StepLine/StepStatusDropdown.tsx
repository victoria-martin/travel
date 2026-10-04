import { OpenResourceMenuItem } from '@/shared/select/OpenResourceMenuItem';
import { AddWordMenuItem } from '@/shared/select/AddWordMenuItem';
import { TagDropdown } from '@/shared/select/TagDropdown';
import type { Accommodation } from '@/store/types';

// The status belongs to the accommodation: it is changed from the trip without visiting the Accommodations page.
export function StepStatusDropdown({ accommodation }: { accommodation: Accommodation }) {
  const booked = window.isBookedAccommodation(accommodation);
  return (
    <TagDropdown
      className={`status-dropdown${booked ? ' status-dropdown-booked' : ''}`}
      dict={window.ACCOMMODATION_STATUSES}
      current={window.accStatus(accommodation.status)}
      beforeItems={
        <OpenResourceMenuItem onSelect={() => window.openAccommodationSheet(accommodation.id)} />
      }
      afterItems={
        <AddWordMenuItem
          bank="accommodationStatuses"
          label="Ajouter un statut"
          onCreate={(key) => window.setAccommodationStatus(accommodation.id, key)}
        />
      }
      onPick={(key) => window.setAccommodationStatus(accommodation.id, key)}
    />
  );
}
