import { Button } from '@/shared/buttons/Button';
import { Icon } from '@/shared/Icon';
import type { Scenario } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useWeatherForecasts } from './ScenarioWeatherBanner/useWeatherForecasts';
import { useWeatherBannerHeight } from './ScenarioWeatherBanner/useWeatherBannerHeight';
import { WeatherDay } from './ScenarioWeatherBanner/WeatherDay';
import { weatherDays } from './ScenarioWeatherBanner/weatherDays';

export function ScenarioWeatherBanner({ scenario }: { scenario: Scenario }) {
  const store = useTravelStore();
  const bannerRef = useWeatherBannerHeight();
  const days = weatherDays(scenario, window.ofCurrentTravel(store.data.villes));
  const forecasts = useWeatherForecasts(
    days.flatMap((day) => (day.date && day.locationKey ? [day.locationKey] : [])),
  );

  return (
    <div ref={bannerRef} className={`scenario-weather-banner style-${window.weatherBannerStyle()}`}>
      <div className="scenario-weather-head">
        <div className="scenario-weather-main">
          <span className="scenario-weather-icon">
            <Icon name="cloud" />
          </span>
          <div>
            <strong>Météo du voyage</strong>
            <span>{days.length} jours · prévisions jusqu’à 16 jours</span>
          </div>
        </div>
        <Button size="small" onClick={() => window.toggleWeatherBanner()}>
          <Icon name="cloud" /> Masquer
        </Button>
      </div>
      <div className="scenario-weather-days" aria-label="Frise météo du scénario">
        {days.map((day) => (
          <WeatherDay
            key={day.index}
            day={day}
            forecast={day.locationKey ? forecasts.get(day.locationKey) : undefined}
          />
        ))}
      </div>
      <a
        // className="scenario-weather-attribution"
        href="https://open-meteo.com/"
        target="_blank"
        rel="noreferrer"
      >
        Données météo : Open-Meteo
      </a>
    </div>
  );
}
