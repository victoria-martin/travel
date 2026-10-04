import { EditableTextCell } from '@/shared/cells/EditableTextCell';
import { Icon } from '@/shared/Icon';
import type { Accommodation } from '@/store/types';

export function StepCheckInTime({ accommodation }: { accommodation: Accommodation }) {
  return (
    <span className="step-check-in-time" title="Heure d'arrivée">
      <Icon name="clock" />
      <EditableTextCell
        value={accommodation.checkInTime}
        placeholder=""
        onSave={(checkInTime) => window.setAccommodationCheckInTime(accommodation.id, checkInTime)}
      />
    </span>
  );
}
