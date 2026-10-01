const scenarioWeatherCache = new Map();

function weatherBannerShown() {
  return prefs.weatherBannerShown === true;
}

function weatherBannerStyle() {
  const style = prefs.weatherBannerStyle || 'standard';
  return ['standard', 'compact', 'line'].includes(style) ? style : 'standard';
}

function toggleWeatherBanner() {
  prefs.weatherBannerShown = !weatherBannerShown();
  persistPrefs();
  render();
}

function setWeatherBannerStyle(style) {
  prefs.weatherBannerStyle = style;
  persistPrefs();
  render();
}

function weatherDateString(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function scenarioWeatherStep(scenario, dayIndex) {
  const steps = visibleSteps(scenario);
  let elapsedNights = 0;
  for (const step of steps) {
    const nights = stepNights(step);
    if (dayIndex < elapsedNights + nights) return step;
    elapsedNights += nights;
  }
  return steps[steps.length - 1] || null;
}

function scenarioWeatherCoords(step) {
  const place = stepPlace(step);
  const coords = place && place.lat && place.lng ? [Number(place.lat), Number(place.lng)] : null;
  if (coords && coords.every(Number.isFinite)) return coords;

  const cityName = place?.city || step.name;
  const normalizedCityName = normalizeListSearch(cityName || '');
  const city = ofCurrentTravel(state.villes).find(
    (item) => normalizeListSearch(item.name || '') === normalizedCityName,
  );
  if (!city || !city.lat || !city.lng) return null;
  const cityCoords = [Number(city.lat), Number(city.lng)];
  return cityCoords.every(Number.isFinite) ? cityCoords : null;
}

function weatherCodeInfo(code) {
  if (code === 0) return { icon: '☀️', label: 'Dégagé' };
  if (code === 1) return { icon: '🌤️', label: 'Peu nuageux' };
  if (code === 2) return { icon: '⛅', label: 'Éclaircies' };
  if (code === 3) return { icon: '☁️', label: 'Couvert' };
  if ([45, 48].includes(code)) return { icon: '🌫️', label: 'Brouillard' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { icon: '🌧️', label: 'Pluie' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: '❄️', label: 'Neige' };
  if ([95, 96, 99].includes(code)) return { icon: '⛈️', label: 'Orages' };
  return { icon: '🌡️', label: 'Temps variable' };
}

function scenarioWeatherForecast(coords) {
  const today = weatherDateString(new Date());
  const locationKey = coords.join(',');
  const cacheKey = `${today}:${locationKey}`;
  if (scenarioWeatherCache.has(cacheKey)) return scenarioWeatherCache.get(cacheKey);

  const params = new URLSearchParams({
    latitude: String(coords[0]),
    longitude: String(coords[1]),
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
      return new Map(
        daily.time.map((date, index) => [
          date,
          {
            ...weatherCodeInfo(daily.weather_code[index]),
            maximum: daily.temperature_2m_max[index],
            minimum: daily.temperature_2m_min[index],
            rainChance: daily.precipitation_probability_max?.[index],
          },
        ]),
      );
    })
    .catch((error) => {
      scenarioWeatherCache.delete(cacheKey);
      throw error;
    });
  scenarioWeatherCache.set(cacheKey, request);
  return request;
}

function updateWeatherLocation(locationKey, forecast) {
  document.querySelectorAll('.scenario-weather-day[data-weather-location]').forEach((day) => {
    if (day.dataset.weatherLocation !== locationKey) return;
    const actual = forecast.get(day.dataset.weatherDate);
    const icon = day.querySelector('.scenario-weather-visual');
    const summary = day.querySelector('.scenario-weather-day-summary');
    if (!actual) {
      if (icon) icon.textContent = '';
      if (summary) summary.textContent = 'Prévision indisponible à cette date';
      return;
    }
    if (icon) icon.textContent = actual.icon;
    if (!summary) return;
    const temperatures = [actual.maximum, actual.minimum]
      .filter(Number.isFinite)
      .map((temperature) => `${Math.round(temperature)}°`)
      .join(' / ');
    const rain = Number.isFinite(actual.rainChance) ? ` · ${actual.rainChance}% pluie` : '';
    summary.textContent = `${temperatures} · ${actual.label}${rain}`;
  });
}

function loadScenarioWeather() {
  const locations = new Map();
  document.querySelectorAll('.scenario-weather-day[data-weather-location]').forEach((day) => {
    const locationKey = day.dataset.weatherLocation;
    if (!locations.has(locationKey)) locations.set(locationKey, locationKey.split(',').map(Number));
  });
  locations.forEach((coords, locationKey) => {
    scenarioWeatherForecast(coords)
      .then((forecast) => updateWeatherLocation(locationKey, forecast))
      .catch((error) => {
        console.warn('Prévisions météo indisponibles', error);
        updateWeatherLocation(locationKey, new Map());
      });
  });
}

function weatherStyleOptions() {
  const options = [
    { key: 'standard', label: 'Standard' },
    { key: 'compact', label: 'Compact' },
    { key: 'line', label: 'Lignes' },
  ];

  return options
    .map(
      (option) => /* HTML */ `
        <label
          class="weather-style-option ${weatherBannerStyle() === option.key ? 'selected' : ''}"
        >
          <input
            type="radio"
            name="weather-banner-style"
            ${weatherBannerStyle() === option.key ? 'checked' : ''}
            onchange="setWeatherBannerStyle('${option.key}')"
          />
          <span>${option.label}</span>
        </label>
      `,
    )
    .join('');
}

function weatherBannerStyleOption() {
  return /* HTML */ `
    <div class="page-submenu">
      <p class="filter-title">Météo</p>
      ${switchField('Afficher la météo', weatherBannerShown(), 'toggleWeatherBanner()')}
      <div class="weather-style-picker">
        <span class="weather-style-label">Style</span>
        ${weatherStyleOptions()}
      </div>
    </div>
  `;
}

function scenarioWeatherBanner(scenario) {
  if (!weatherBannerShown()) return '';
  const totalDaysCount = Math.max(totalDays(scenario) || 1, 1);
  const start = scenarioStart(scenario);

  const days = Array.from({ length: totalDaysCount }, (_, index) => {
    const dayDate = start ? dateAfter(start, index) : null;
    const step = scenarioWeatherStep(scenario, index);
    const coords = step ? scenarioWeatherCoords(step) : null;
    const locationAttributes = coords
      ? `data-weather-location="${coords.join(',')}" data-weather-date="${weatherDateString(dayDate)}"`
      : '';
    const summary = !dayDate
      ? 'Date à renseigner'
      : coords
        ? 'Chargement de la prévision…'
        : 'Coordonnées manquantes';
    return /* HTML */ ` <div
      class="scenario-weather-day"
      aria-label="Jour ${index + 1}"
      ${locationAttributes}
    >
      <span class="scenario-weather-day-line"></span>
      <div class="scenario-weather-day-top">
        <div>
          <span class="scenario-weather-day-number">J${index + 1}</span>
          <span class="scenario-weather-day-date"
            >${dayDate ? escapeHtml(formatStepDay(dayDate)) : `Jour ${index + 1}`}</span
          >
        </div>
        <span class="scenario-weather-visual" aria-hidden="true"></span>
      </div>
      <span class="scenario-weather-day-summary">${summary}</span>
    </div>`;
  });

  Promise.resolve().then(loadScenarioWeather);
  return /* HTML */ ` <div class="scenario-weather-banner style-${weatherBannerStyle()}">
    <div class="scenario-weather-head">
      <div class="scenario-weather-main">
        <span class="scenario-weather-icon">${svgIcon('cloud')}</span>
        <div>
          <strong>Météo du voyage</strong>
          <span>${totalDaysCount} jours · prévisions jusqu’à 16 jours</span>
        </div>
      </div>
      <button class="btn btn-small btn-ghost" onclick="toggleWeatherBanner()">
        ${svgIcon('cloud')} Masquer
      </button>
    </div>
    <div class="scenario-weather-days" aria-label="Frise météo du scénario">${days.join('')}</div>
    <a
      class="scenario-weather-attribution"
      href="https://open-meteo.com/"
      target="_blank"
      rel="noreferrer"
      >Données météo : Open-Meteo</a
    >
  </div>`;
}

function scenarioWeatherToggleButton() {
  return toolbarButton({
    icon: svgIcon('cloud'),
    label: 'Météo',
    active: weatherBannerShown(),
    onclick: 'toggleWeatherBanner()',
  });
}
