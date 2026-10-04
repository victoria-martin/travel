import { normalizeSearch } from '@/shared/normalizeSearch';
import type { Scenario, Step, Ville } from '@/store/types';

export interface WeatherDayPlan {
  index: number;
  date: Date | null;
  locationKey: string | null;
}

function stepOfDay(steps: Step[], dayIndex: number): Step | null {
  let elapsedNights = 0;
  for (const step of steps) {
    const nights = window.stepNights(step);
    if (dayIndex < elapsedNights + nights) return step;
    elapsedNights += nights;
  }
  return steps[steps.length - 1] ?? null;
}

function locationKeyOf(step: Step, villes: Ville[]): string | null {
  const place = window.stepPlace(step);
  const coords = place?.lat && place.lng ? [Number(place.lat), Number(place.lng)] : null;
  if (coords?.every(Number.isFinite)) return coords.join(',');

  const cityName = normalizeSearch((place && 'city' in place && place.city) || step.name);
  const city = villes.find((ville) => normalizeSearch(ville.name) === cityName);
  if (!city?.lat || !city.lng) return null;
  const cityCoords = [Number(city.lat), Number(city.lng)];
  return cityCoords.every(Number.isFinite) ? cityCoords.join(',') : null;
}

export function weatherDays(scenario: Scenario, villes: Ville[]): WeatherDayPlan[] {
  const steps = window.visibleSteps(scenario);
  const start = window.scenarioStart(scenario);
  const dayCount = Math.max(window.totalDays(scenario) || 1, 1);
  return Array.from({ length: dayCount }, (_, index) => {
    const step = stepOfDay(steps, index);
    return {
      index,
      date: start ? window.dateAfter(start, index) : null,
      locationKey: step ? locationKeyOf(step, villes) : null,
    };
  });
}
