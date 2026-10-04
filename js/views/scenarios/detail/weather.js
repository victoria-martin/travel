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

const WEATHER_BANNER_STYLES = [
  { key: 'standard', label: 'Standard' },
  { key: 'compact', label: 'Compact' },
  { key: 'line', label: 'Lignes' },
];

window.WEATHER_BANNER_STYLES = WEATHER_BANNER_STYLES;

function weatherBannerStyleOption() {
  return /* HTML */ `
    <div class="page-submenu">
      <p class="filter-title">Météo</p>
      ${switchField('Afficher la météo', weatherBannerShown(), 'toggleWeatherBanner()')}
      ${radioCardField(
        'Style',
        'weather-banner-style',
        WEATHER_BANNER_STYLES,
        weatherBannerStyle(),
        'setWeatherBannerStyle',
      )}
    </div>
  `;
}
