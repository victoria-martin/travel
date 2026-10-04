export function ActualExpenseButton() {
  return (
    <button
      type="button"
      className="btn btn-small"
      onClick={() => window.openModal('actual-expense')}
    >
      Dépense réelle
    </button>
  );
}
