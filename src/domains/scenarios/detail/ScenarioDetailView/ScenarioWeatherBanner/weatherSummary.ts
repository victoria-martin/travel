import type { DailyWeather } from './fetchWeatherForecast';
import type { WeatherDayPlan } from './weatherDays';

export function weatherSummary(
  day: WeatherDayPlan,
  forecast: Map<string, DailyWeather> | undefined,
) {
  if (!day.date) return { icon: '', text: 'Date à renseigner' };
  if (!day.locationKey) return { icon: '', text: 'Coordonnées manquantes' };
  if (!forecast) return { icon: '', text: 'Chargement de la prévision…' };
  const actual = forecast.get(window.dateToIso(day.date));
  if (!actual) return { icon: '', text: 'Prévision indisponible à cette date' };
  const temperatures = [actual.maximum, actual.minimum]
    .filter(Number.isFinite)
    .map((temperature) => `${Math.round(temperature)}°`)
    .join(' / ');
  const rain = Number.isFinite(actual.rainChance) ? ` · ${actual.rainChance}% pluie` : '';
  return { icon: actual.icon, text: `${temperatures} · ${actual.label}${rain}` };
}
