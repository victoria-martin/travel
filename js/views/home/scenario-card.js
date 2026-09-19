function homeScenarioCard() {
  const scenario = chosenScenario();
  if (!scenario)
    return homeCard({
      icon: svgIcon('compass'),
      title: 'Scénario choisi',
      body: `<p class="home-card-empty">Aucun scénario choisi pour l'instant.</p>`,
      cta: 'Choisir un scénario',
      onclick: `goTo('scenarios')`,
    });
  const total = scenarioTotal(scenario);
  const meta = [nightsLabel(totalNights(scenario)), formatEuros(total.euros)];
  if (total.guestPoints) meta.push(formatGuestPoints(total.guestPoints));
  return homeCard({
    icon: svgIcon('compass'),
    title: 'Scénario choisi',
    body: /* HTML */ `<p class="home-card-name">${escapeHtml(scenario.name)}</p>
      <p class="home-card-meta">${meta.join(' · ')}</p>`,
    cta: 'Ouvrir le scénario',
    onclick: `openScenario('${scenario.id}')`,
  });
}
