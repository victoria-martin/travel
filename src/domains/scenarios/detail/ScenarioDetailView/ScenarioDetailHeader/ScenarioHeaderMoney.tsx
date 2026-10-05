export function ScenarioHeaderMoney({ money }: { money: { euros: number; guestPoints: number } }) {
  return (
    <div className="scenario-header-money">
      {money.guestPoints > 0 && <span>{window.formatGuestPoints(money.guestPoints)}</span>}
      <strong className="scenario-header-total">{window.formatEuros(money.euros)}</strong>
    </div>
  );
}
