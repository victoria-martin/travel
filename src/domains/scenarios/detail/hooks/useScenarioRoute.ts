import type { Scenario } from '@/store/types';
import { useEffect, useState } from 'react';

interface RoadLeg {
  distance: number;
  duration: number;
}

interface RouteResult {
  line: [number, number][];
  legs: RoadLeg[];
}

type RouteState =
  | { key: string; status: 'idle'; route: null }
  | { key: string; status: 'loading'; route: null }
  | { key: string; status: 'ready'; route: RouteResult }
  | { key: string; status: 'error'; route: null };

export interface ScenarioRoute {
  status: 'idle' | 'loading' | 'ready' | 'error';
  route: RouteResult | null;
  scenarioId: string | null;
}

export function useScenarioRoute(
  scenario: Scenario | null,
  points: [number, number][],
): ScenarioRoute {
  const key = points.map(([latitude, longitude]) => `${latitude},${longitude}`).join(';');
  const [routeState, setRouteState] = useState<RouteState>({
    key: '',
    status: 'idle',
    route: null,
  });

  useEffect(() => {
    let isCurrent = true;

    if (!scenario || points.length < 2) {
      setRouteState({ key, status: 'idle', route: null });
      return () => {
        isCurrent = false;
      };
    }

    setRouteState({ key, status: 'loading', route: null });
    const routePoints = key
      .split(';')
      .map((point) => point.split(',').map(Number) as [number, number]);
    window
      .fetchRoute(routePoints)
      .then((route) => {
        if (isCurrent) setRouteState({ key, status: 'ready', route });
      })
      .catch((error: unknown) => {
        console.warn('Tronçons routiers indisponibles', error);
        if (isCurrent) setRouteState({ key, status: 'error', route: null });
      });

    return () => {
      isCurrent = false;
    };
  }, [key]);

  return {
    status: routeState.key === key ? routeState.status : points.length < 2 ? 'idle' : 'loading',
    route: routeState.key === key ? routeState.route : null,
    scenarioId: scenario?.id ?? null,
  };
}
