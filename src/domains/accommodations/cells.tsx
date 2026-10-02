import { FavoriteCell as SharedFavoriteCell } from '../../shared/cells/FavoriteCell';
import { EditableTextCell } from '../../shared/cells/EditableTextCell';
import { Icon } from '../../shared/Icon';
import { TagDropdown } from '../../shared/TagDropdown';
import type { Accommodation } from '../../store/types';

export function FavoriteCell({ accommodation }: { accommodation: Accommodation }) {
  return (
    <SharedFavoriteCell
      favorite={accommodation.favorite}
      onToggle={() => window.toggleFavorite(accommodation.id)}
    />
  );
}

export function NameCell({ accommodation }: { accommodation: Accommodation }) {
  return (
    <>
      <strong>{accommodation.name}</strong>
      <div className="row-notes">
        <EditableTextCell
          value={accommodation.notes}
          placeholder="Notes…"
          onSave={(notes) => {
            accommodation.notes = notes;
            window.saveNow();
          }}
        />
      </div>
    </>
  );
}

export function TypeBadge({ accommodation }: { accommodation: Accommodation }) {
  return (
    <TagDropdown
      className="type-dropdown"
      dict={window.ACCOMMODATION_TYPES}
      current={window.accType(accommodation.type)}
      onPick={(key) => window.setAccommodationType(accommodation.id, key)}
    />
  );
}

export function StatusBadge({ accommodation }: { accommodation: Accommodation }) {
  return (
    <TagDropdown
      className="status-dropdown"
      dict={window.ACCOMMODATION_STATUSES}
      current={window.accStatus(accommodation.status)}
      onPick={(key) => window.setAccommodationStatus(accommodation.id, key)}
    />
  );
}

export function PriceCell({ accommodation }: { accommodation: Accommodation }) {
  return (
    <>
      <EditableTextCell
        value={accommodation.price}
        placeholder=" - "
        onSave={(price) => {
          accommodation.price = price;
          window.saveNow();
        }}
      />{' '}
      {window.accommodationPriceUnit(accommodation)}
    </>
  );
}

export function ActionsCell({ accommodation }: { accommodation: Accommodation }) {
  return (
    <>
      <button
        type="button"
        className="icon-btn"
        title="Modifier"
        aria-label={`Modifier ${accommodation.name}`}
        onClick={() => window.openModal('accommodation', accommodation.id)}
      >
        <Icon name="pencil" />
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Dupliquer"
        aria-label={`Dupliquer ${accommodation.name}`}
        onClick={() => window.duplicateAccommodation(accommodation.id)}
      >
        ⧉
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Supprimer"
        aria-label={`Supprimer ${accommodation.name}`}
        onClick={() => window.deleteItem('accommodations', accommodation.id)}
      >
        <Icon name="trash-2" />
      </button>
    </>
  );
}
