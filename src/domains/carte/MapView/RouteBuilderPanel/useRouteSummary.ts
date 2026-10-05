import { useEffect, useState } from 'react';

// Distance and duration of the drawn route, fetched like the line itself (fetchRoute caches it).
export function useRouteSummary(points: [number, number][]): string {
  const key = points.map((point) => point.join(',')).join(';');
  const [summary, setSummary] = useState('');
  useEffect(() => {
    let isCurrent = true;
    setSummary('');
    if (points.length < 2) return;
    window
      .fetchRoute(points)
      .then(({ legs }) => {
        if (!isCurrent) return;
        const distance = legs.reduce((sum, leg) => sum + leg.distance, 0);
        const duration = legs.reduce((sum, leg) => sum + leg.duration, 0);
        setSummary(`${(distance / 1000).toFixed(1)} km · ${Math.round(duration / 60)} min`);
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return summary;
}
