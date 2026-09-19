function renderHomeView() {
  const travel = currentTravel();
  return /* HTML */ `
    ${homeHeader(travel)}
    <div class="home-cards">${homeScenarioCard()} ${homePackingCard()} ${homeTodoCard()}</div>
  `;
}

function homeHeader(travel) {
  const title = travel ? `${escapeHtml(travel.emoji)} ${escapeHtml(travel.name)}` : 'Accueil';
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">${title}</h2>
      <p class="view-sub">${homeDatesLabel(travel)}</p>
    </div>
  </div>`;
}

function homeDatesLabel(travel) {
  const start = travel && isoToDate(travel.startDate);
  if (!start) return '';
  const end = travel.endDate && isoToDate(travel.endDate);
  const range = end
    ? `${formatHomeDate(start)} → ${formatHomeDate(end)}`
    : formatHomeDate(start);
  const today = new Date(new Date().toDateString());
  const days = Math.round((start - today) / 86400000);
  return days > 0 ? `${range} · J-${days}` : range;
}

function formatHomeDate(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
