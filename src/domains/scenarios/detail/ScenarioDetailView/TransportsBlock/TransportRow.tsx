import { Icon } from '@/shared/Icon';
import { TagLabel } from '@/shared/TagLabel';
import type { Scenario, Transport } from '@/store/types';

export function TransportRow({
  scenario,
  transport,
}: {
  scenario: Scenario;
  transport: Transport;
}) {
  const moment = window.transportMoment(transport.departDate, transport.departTime);
  return (
    <div className="expense-line">
      <span className="expense-label">
        <TagLabel
          emoji={window.transportMode(transport.mode).emoji}
          label={window.transportLegLabel(transport)}
        />
        {moment && <span className="expense-unit">{moment}</span>}
      </span>
      <strong className="expense-amount-open">{window.priceLabel(transport)}</strong>
      <button
        type="button"
        className="icon-btn"
        title="Retirer du scénario"
        onClick={() => window.detachScenarioTransport(scenario.id, transport.id)}
      >
        <Icon name="x" />
      </button>
    </div>
  );
}
