// Le ⚙️ de la barre latérale ouvre les réglages en modale : la barre défile, un panneau déplié
// dedans se rognait.
function settingsForm() {
  return /* HTML */ `
    <h3>Réglages</h3>
    ${settingsBlocks()}
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Fermer</button>
    </div>
  `;
}
