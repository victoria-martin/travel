import { Icon } from '@/shared/Icon';
import { useTravelStore } from '@/store/useTravelStore';
import { useRef } from 'react';

export function TravelSelector() {
  const travels = useTravelStore((store) => store.data.travels);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const current = window.currentTravel();
  const others = travels.filter((travel) => !current || travel.id !== current.id);
  const close = () => detailsRef.current?.removeAttribute('open');

  return (
    <details className="travel-selector" ref={detailsRef}>
      <summary className="travel-current" title="Changer de voyage">
        <span className="travel-emoji">{current ? current.emoji : '🧳'}</span>
        <span className="travel-identity">
          <span className="travel-name">{current ? current.name : 'Aucun voyage'}</span>
          <span className="travel-sub">{window.travelSubtitle(current)}</span>
        </span>
        <svg className="travel-chevron" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </summary>
      <div className="travel-menu">
        {others.map((travel) => (
          <button
            type="button"
            key={travel.id}
            className="travel-menu-item"
            onClick={() => {
              close();
              window.selectTravel(travel.id);
            }}
          >
            <span className="travel-emoji">{travel.emoji}</span>
            {travel.name}
          </button>
        ))}
        {others.length > 0 && <div className="travel-menu-sep" />}
        {current && (
          <button
            type="button"
            className="travel-menu-item"
            onClick={() => {
              close();
              window.openTravelModal(current.id);
            }}
          >
            <Icon name="pencil" /> Modifier ce voyage
          </button>
        )}
        <button
          type="button"
          className="travel-menu-item"
          onClick={() => {
            close();
            window.openTravelModal();
          }}
        >
          + Nouveau voyage
        </button>
      </div>
    </details>
  );
}
