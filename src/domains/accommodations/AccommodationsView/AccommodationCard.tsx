import { Icon } from '@/shared/Icon';
import { MissingAddressBadge } from '@/shared/MissingAddressBadge';
import { OutOfRangeBadge } from '@/shared/OutOfRangeBadge';
import type { Accommodation } from '@/store/types';
import { FavoriteCell, PriceCell, StatusBadge, TypeBadge } from '../cells';
import { EditableTextCell } from '@/shared/cells/EditableTextCell';

export function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  const place = [accommodation.city, accommodation.county].filter(Boolean).join(' · ');
  return (
    <div className="card">
      <div className="card-top">
        <p className="card-name">
          {accommodation.name}{' '}
          <OutOfRangeBadge reason={window.accommodationSearchOutOfRange(accommodation)} />
          <MissingAddressBadge address={accommodation.address} />
        </p>
        <FavoriteCell accommodation={accommodation} />
      </div>
      <div className="card-selects">
        <TypeBadge accommodation={accommodation} />
        <StatusBadge accommodation={accommodation} />
      </div>
      <div className="card-meta">
        <span>
          <Icon name="map-pin" /> {place || 'non localisé'}
        </span>
        <span>
          <Icon name="euro" /> <PriceCell accommodation={accommodation} />
        </span>
        {accommodation.dates && (
          <span>
            <Icon name="calendar" /> {accommodation.dates}
          </span>
        )}
        <span>
          <Icon name="file-text" />{' '}
          <EditableTextCell
            value={accommodation.notes}
            placeholder="Notes…"
            onSave={(notes) => {
              accommodation.notes = notes;
              window.saveNow();
            }}
          />
        </span>
      </div>
      {accommodation.tags.length > 0 && (
        <span className="tag-chips">
          {accommodation.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </span>
      )}
      <div className="card-actions">
        <button
          type="button"
          className="btn-outline btn btn-small"
          onClick={() => window.openModal('accommodation', accommodation.id)}
        >
          Modifier
        </button>
        <button
          type="button"
          className="btn-danger btn btn-small"
          onClick={() => window.deleteItem('accommodations', accommodation.id)}
        >
          Suppr.
        </button>
        {accommodation.link && (
          <a
            href={accommodation.link}
            target="_blank"
            rel="noreferrer"
            className="btn-outline btn btn-small"
          >
            Lien
          </a>
        )}
        {accommodation.bookingLink && (
          <a
            href={accommodation.bookingLink}
            target="_blank"
            rel="noreferrer"
            className="btn-outline btn btn-small"
          >
            Booking
          </a>
        )}
      </div>
    </div>
  );
}
