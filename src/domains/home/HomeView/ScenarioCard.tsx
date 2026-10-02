import { HomeCard } from './HomeCard';

export function ScenarioCard() {
  const scenario = window.chosenScenario();

  if (!scenario) {
    return (
      <HomeCard
        icon="compass"
        title="Scénario choisi"
        cta="Choisir un scénario"
        onClick={() => window.goTo('scenarios')}
      >
        <p className="home-card-empty">Aucun scénario choisi pour l&apos;instant.</p>
      </HomeCard>
    );
  }

  const total = window.scenarioTotal(scenario);
  const meta = [window.nightsLabel(window.totalNights(scenario)), window.formatEuros(total.euros)];
  if (total.guestPoints) meta.push(window.formatGuestPoints(total.guestPoints));

  return (
    <HomeCard
      icon="compass"
      title="Scénario choisi"
      cta="Ouvrir le scénario"
      onClick={() => window.openScenario(scenario.id)}
    >
      <p className="home-card-name">{scenario.name}</p>
      <p className="home-card-meta">{meta.join(' · ')}</p>
    </HomeCard>
  );
}
