import { useEffect, useState } from 'react';
import { type DailyWeather, fetchWeatherForecast } from './fetchWeatherForecast';

// A location absent from the result is still loading; a failed one maps to an empty forecast.
export function useWeatherForecasts(
  locationKeys: string[],
): Map<string, Map<string, DailyWeather>> {
  const key = [...new Set(locationKeys)].join(';');
  const [forecasts, setForecasts] = useState(new Map<string, Map<string, DailyWeather>>());

  useEffect(() => {
    let isCurrent = true;
    const keep = (locationKey: string, forecast: Map<string, DailyWeather>) => {
      if (!isCurrent) return;
      setForecasts((previous) => new Map(previous).set(locationKey, forecast));
    };

    key
      .split(';')
      .filter(Boolean)
      .forEach((locationKey) => {
        fetchWeatherForecast(locationKey)
          .then((forecast) => keep(locationKey, forecast))
          .catch((error: unknown) => {
            console.warn('Prévisions météo indisponibles', error);
            keep(locationKey, new Map());
          });
      });

    return () => {
      isCurrent = false;
    };
  }, [key]);

  return forecasts;
}
