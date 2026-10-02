import { HomeCard } from './HomeCard';

export function PackingCard() {
  const items = window.travelPackingItems();
  const done = items.filter((item) => item.checked).length;

  return (
    <HomeCard
      icon="luggage"
      title="Valise"
      cta={items.length ? 'Ouvrir la valise' : 'Composer la valise'}
      onClick={() => window.goTo('valise')}
    >
      {items.length ? (
        <p className="home-card-meta">
          {done}/{items.length} déjà préparé{done > 1 ? 's' : ''}
        </p>
      ) : (
        <p className="home-card-empty">Rien dans la valise pour l&apos;instant.</p>
      )}
    </HomeCard>
  );
}
