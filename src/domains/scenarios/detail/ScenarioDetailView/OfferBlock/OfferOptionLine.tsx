import type { ProviderOption, Scenario } from '@/store/types';

export function OfferOptionLine({
  scenario,
  option,
  days,
}: {
  scenario: Scenario;
  option: ProviderOption;
  days: number;
}) {
  const unit = window.providerOptionUnit(option.unit);
  return (
    <label className="expense-line offer-option-line">
      <input
        type="checkbox"
        checked={(scenario.offerOptionIds || []).includes(option.id)}
        onChange={() => window.toggleScenarioOfferOption(scenario.id, option.id)}
      />
      <span className="expense-label">
        {option.label || 'Sans libellé'}
        {unit.suffix && <span className="expense-unit">{`${option.amount} € ${unit.suffix}`}</span>}
      </span>
      <strong>{window.formatEuros(window.optionAmount(option, days))}</strong>
    </label>
  );
}
