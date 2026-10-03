import type { Attraction } from '@/store/types';

export const CitiesHeader = ({
  attractions,
  items,
}: {
  attractions: Attraction[];
  items: Attraction[];
}) => {
  const cities = new Set(attractions.map((attraction) => attraction.city).filter(Boolean));

  return (
    <div>
      <h2 className="view-title">Villes</h2>
      <p className="view-sub">
        {cities.size} ville{cities.size > 1 ? 's' : ''} — {items.length} lieu
        {items.length > 1 ? 'x' : ''}
      </p>
    </div>
  );
};
