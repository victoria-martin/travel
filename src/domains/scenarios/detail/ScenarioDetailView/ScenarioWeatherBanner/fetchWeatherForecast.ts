export interface DailyWeather {
  icon: string;
  label: string;
  maximum: number;
  minimum: number;
  rainChance: number | undefined;
}

const WEATHER_CODES = [
  { codes: [0], icon: '☀️', label: 'Dégagé' },
  { codes: [1], icon: '🌤️', label: 'Peu nuageux' },
  { codes: [2], icon: '⛅', label: 'Éclaircies' },
  { codes: [3], icon: '☁️', label: 'Couvert' },
  { codes: [45, 48], icon: '🌫️', label: 'Brouillard' },
  {
    codes: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
    icon: '🌧️',
    label: 'Pluie',
  },
  { codes: [71, 73, 75, 77, 85, 86], icon: '❄️', label: 'Neige' },
  { codes: [95, 96, 99], icon: '⛈️', label: 'Orages' },
];

const UNKNOWN_WEATHER = { icon: '🌡️', label: 'Temps variable' };

// One request per location and per day, shared by every render that asks for it.
const forecastCache = new Map<string, Promise<Map<string, DailyWeather>>>();

export function fetchWeatherForecast(locationKey: string): Promise<Map<string, DailyWeather>> {
  const cacheKey = `${window.dateToIso(new Date())}:${locationKey}`;
  const cached = forecastCache.get(cacheKey);
  if (cached) return cached;

  const [latitude, longitude] = locationKey.split(',');
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '16',
    timezone: 'auto',
  });
  const request = fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const daily = data.daily;
      if (!daily?.time) throw new Error('Open-Meteo: daily forecast missing');
      return new Map<string, DailyWeather>(
        daily.time.map((date: string, index: number) => {
          const code = daily.weather_code[index];
          const info =
            WEATHER_CODES.find((weatherCode) => weatherCode.codes.includes(code)) ??
            UNKNOWN_WEATHER;
          return [
            date,
            {
              icon: info.icon,
              label: info.label,
              maximum: daily.temperature_2m_max[index],
              minimum: daily.temperature_2m_min[index],
              rainChance: daily.precipitation_probability_max?.[index],
            },
          ];
        }),
      );
    })
    .catch((error: unknown) => {
      forecastCache.delete(cacheKey);
      throw error;
    });
  forecastCache.set(cacheKey, request);
  return request;
}
