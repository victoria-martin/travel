import { Icon } from '@/shared/Icon';

export function ScenarioBackButton() {
  return (
    <button
      type="button"
      className="btn-outline btn btn-square"
      onClick={() => window.goTo('scenarios')}
    >
      <Icon name="arrow-left" />
    </button>
  );
}
