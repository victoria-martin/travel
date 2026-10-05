import { Icon } from '@/shared/Icon';

export function JournalPhotos({ date }: { date: string }) {
  const photos = window.getJournalEntry(window.currentTravelId() || '', date)?.photos ?? [];
  if (!photos.length) return null;
  return (
    <div className="journal-photos">
      {photos.map((url) => (
        <div key={url} className="journal-photo">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={url} alt="" loading="lazy" />
          </a>
          <button
            type="button"
            className="journal-photo-remove"
            title="Retirer"
            onClick={() => window.removeJournalPhoto(date, url)}
          >
            <Icon name="x" />
          </button>
        </div>
      ))}
    </div>
  );
}
