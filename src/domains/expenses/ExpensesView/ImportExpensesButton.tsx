export function ImportExpensesButton() {
  return (
    <button
      type="button"
      className="toolbar-btn"
      onClick={() => window.openModal('import-expenses')}
    >
      Importer un fichier
    </button>
  );
}
