// TEMP : masqué sous 640px (.import-expenses-btn, styles.css) — FileReader (lecture du CSV) pas
// encore adapté au mobile, à reprendre plus tard plutôt que de le désactiver pour de bon.
export function ImportExpensesButton() {
  return (
    <button
      type="button"
      className="btn btn-outline btn-small import-expenses-btn"
      onClick={() => window.openModal('import-expenses')}
    >
      Importer un fichier
    </button>
  );
}
