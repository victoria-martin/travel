// dismissModal() (pas closeModal()) : redemande « enregistrer les modifications ? » si le
// formulaire a `edits: true` et que quelque chose a été tapé — closeModal() fermerait en silence.
export function CloseModalButton() {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => window.dismissModal()}>
      {/* <button type="button" className="btn btn-ghost" onClick={() => window.closeModal()}> */}
      Annuler
    </button>
  );
}
