export function ActualExpenseButton() {
  return (
    <button
      type="button"
      className="toolbar-btn"
      onClick={() => window.openModal('actual-expense')}
    >
      Dépense réelle
    </button>
  );
}
