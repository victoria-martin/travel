import type { DailyWeather } from './fetchWeatherForecast';
import type { WeatherDayPlan } from './weatherDays';
import { weatherSummary } from './weatherSummary';

export function WeatherDay({
  day,
  forecast,
}: {
  day: WeatherDayPlan;
  forecast: Map<string, DailyWeather> | undefined;
}) {
  const summary = weatherSummary(day, forecast);
  return (
    <div className="scenario-weather-day" aria-label={`Jour ${day.index + 1}`}>
      <span className="scenario-weather-day-line"></span>
      <div className="scenario-weather-day-top">
        <div>
          <span className="scenario-weather-day-number">J{day.index + 1}</span>
          <span className="scenario-weather-day-date">
            {day.date ? window.formatStepDay(day.date) : `Jour ${day.index + 1}`}
          </span>
        </div>
        <span className="scenario-weather-visual" aria-hidden="true">
          {summary.icon}
        </span>
      </div>
      <span className="scenario-weather-day-summary">{summary.text}</span>
    </div>
  );
}
