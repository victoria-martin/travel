/*
  La barre d'outils ne porte que des gestes sur la vue ; les données du scénario — son étoile, son
  nom, sa date de départ — vivent ensemble dans le bloc d'identité.
*/
function weatherBannerShown() {
  return prefs.weatherBannerShown === true;
}

function weatherBannerStyle() {
  return prefs.weatherBannerStyle || 'timeline';
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

function weatherStyleOptions() {
  const options = [
    { key: 'timeline', label: 'Frise horizontale' },
    { key: 'strip', label: 'Bandeau fin' },
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
      <div class="weather-style-picker">${weatherStyleOptions()}</div>
    </div>
  `;
}

function scenarioWeatherBanner(s) {
  if (!weatherBannerShown()) return '';
  const totalDaysCount = Math.max(totalDays(s) || 1, 1);
  const start = scenarioStart(s);
  const skyPool = ['ensoleillé', 'voilé', 'plutôt nuageux', 'venté', 'orages faibles'];

  const days = Array.from({ length: totalDaysCount }, (_, index) => {
    const seed =
      Number(
        String(s.startDate || '2026-01-01')
          .replaceAll('-', '')
          .slice(-2),
      ) + index;
    const temp = 12 + (seed % 11);
    const sky = skyPool[seed % skyPool.length];
    const weatherIcon =
      sky.includes('orages') || sky.includes('vent')
        ? '⛈️'
        : sky.includes('nuage')
          ? '🌤️'
          : sky.includes('voilé')
            ? '⛅'
            : '☀️';
    const dayDate = start ? dateAfter(start, index) : null;
    return /* HTML */ ` <div class="scenario-weather-day" aria-label="Jour ${index + 1}">
      <span class="scenario-weather-day-line"></span>
      <div class="scenario-weather-day-top">
        <div>
          <span class="scenario-weather-day-number">J${index + 1}</span>
          <span class="scenario-weather-day-date"
            >${dayDate ? escapeHtml(formatStepDay(dayDate)) : `Jour ${index + 1}`}</span
          >
        </div>
        <span class="scenario-weather-visual" aria-hidden="true">${weatherIcon}</span>
      </div>
      <span class="scenario-weather-day-summary">${temp}° · ${sky}</span>
    </div>`;
  });

  return /* HTML */ ` <div class="scenario-weather-banner style-${weatherBannerStyle()}">
    <div class="scenario-weather-head">
      <div class="scenario-weather-main">
        <span class="scenario-weather-icon">${svgIcon('cloud')}</span>
        <div>
          <strong>Météo du voyage</strong>
          <span>${totalDaysCount} jours · tendance douce</span>
        </div>
      </div>
      <button class="btn btn-small btn-ghost" onclick="toggleWeatherBanner()">
        ${svgIcon('cloud')} Masquer
      </button>
    </div>
    <div class="scenario-weather-days" aria-label="Frise météo du scénario">${days.join('')}</div>
  </div>`;
}

function scenarioDetailHeader(s) {
  const count = visibleSteps(s).length;
  return /* HTML */ `<div class="view-header scenario-header">
    <div class="scenario-header-identity">
      <button class="btn-ghost btn btn-small back-link" onclick="goTo('scenarios')">
        ${svgIcon('arrow-left')} Tous les scénarios
      </button>
      <div class="scenario-header-name">
        ${favoriteStar(s.favorite, `toggleScenarioFavorite('${s.id}')`)}
        <div class="scenario-header-name-text">
          <h2 class="view-title">
            ${editableText(s.name, `renameScenario('${s.id}', this.innerText)`, {
              key: `scenario:${s.id}:name`,
              placeholder: 'Nom du scénario…',
            })}
          </h2>
          <p class="view-sub">
            ${scenarioStartDateField(s)} · ${count} étape${count > 1 ? 's' : ''} ·
            ${nightsLabel(totalNights(s))}
          </p>
        </div>
      </div>
    </div>
    <div class="view-header-actions">
      ${toolbarButton({
        icon: svgIcon('cloud'),
        label: 'Météo',
        active: weatherBannerShown(),
        onclick: 'toggleWeatherBanner()',
      })}
      ${toolbarSeparator()} ${scenarioSideTabsButtons(s.id)} ${toolbarSeparator()} ${toolbarMenu()}
    </div>
    ${scenarioHeaderMoney(s)}
  </div>`;
}

// Le total ferme la ligne des métadonnées : les GuestPoints d'abord, les euros en grand au bout.
function scenarioHeaderMoney(s) {
  const total = scenarioTotal(s);
  return /* HTML */ `<div class="scenario-header-money">
    ${total.guestPoints ? `<span>${formatGuestPoints(total.guestPoints)}</span>` : ''}
    <strong class="scenario-header-total">${formatEuros(total.euros)}</strong>
  </div>`;
}

function scenarioStartDateField(s) {
  return /* HTML */ `<input
    class="scenario-start-date"
    type="date"
    value="${s.startDate || ''}"
    onchange="setScenarioStartDate('${s.id}', this.value)"
  />`;
}

function setScenarioStartDate(id, date) {
  getScenario(id).startDate = date;
  saveNow();
  render();
}
