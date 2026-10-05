import { Icon } from '@/shared/Icon';
import type { Scenario } from '@/store/types';

export function ScenarioFavoriteButton({ scenario }: { scenario: Scenario }) {
  return (
    <button
      type="button"
      className="btn-outline btn btn-square"
      title={scenario.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      onClick={() => window.toggleScenarioFavorite(scenario.id)}
    >
      <Icon name="star" fill={scenario.favorite} />
    </button>
  );
}
