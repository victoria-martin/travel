// #f-save est gardé par toutes les modales portées : submitModal()/Entrée (js/modals/modal.js)
// le clique programmatiquement, et onModalPainted() y lit le snapshot du dirty-check.
export function ModalSaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn" id="f-save" onClick={onClick}>
      Enregistrer
    </button>
  );
}
