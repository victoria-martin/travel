export function CloseModalButton() {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}>
      Annuler
    </button>
  );
}
