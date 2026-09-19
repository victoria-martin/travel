/*
  Le prestataire qui manque au milieu d'une saisie : son formulaire se pose par-dessus la modale
  ouverte sans la re-rendre, comme la question de fermeture — les champs du trajet ne vivent que
  dans le DOM tant qu'ils ne sont pas enregistrés. Le mode n'y est pas un champ : c'est celui du
  trajet ou de la voiture qui a demandé la création. Entrée et Échap sont traitées ici, sinon la
  modale du dessous les prendrait pour les siennes.
*/
let providerAsk = null;

function askNewProvider(selectId, mode) {
  if (providerAsk) return;
  const noun = providerNoun(mode);
  const current = transportMode(mode);
  providerAsk = document.createElement('div');
  providerAsk.className = 'overlay overlay-ask';
  providerAsk.onclick = (e) => {
    if (e.target === providerAsk) closeProviderAsk();
  };
  providerAsk.onkeydown = (e) => providerAskKeydown(e, selectId, mode);
  providerAsk.innerHTML = /* HTML */ `<div class="modal modal-ask provider-ask">
    <h3>Ajouter ${noun.indefinite}</h3>
    <div class="field">
      <label>${tagLabel(current.emoji, current.label)}</label>
      <input id="new-provider-name" type="text" />
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeProviderAsk()">Annuler</button>
      <button class="btn" onclick="confirmNewProvider('${selectId}','${mode}')">Créer</button>
    </div>
  </div>`;
  document.getElementById('app').appendChild(providerAsk);
  document.getElementById('new-provider-name').focus();
}

function providerAskKeydown(event, selectId, mode) {
  if (event.key !== 'Enter' && event.key !== 'Escape') return;
  event.preventDefault();
  if (event.key === 'Escape') return closeProviderAsk();
  confirmNewProvider(selectId, mode);
}

function confirmNewProvider(selectId, mode) {
  const name = document.getElementById('new-provider-name').value.trim();
  if (!name) return;
  selectCreatedProvider(selectId, createProviderNamed(name, mode));
  closeProviderAsk();
}

function closeProviderAsk() {
  providerAsk.remove();
  providerAsk = null;
}
