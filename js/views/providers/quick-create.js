/*
  Le prestataire qui manque au milieu d'une saisie : son formulaire se pose par-dessus la modale
  ouverte sans la re-rendre, comme la question de fermeture. Le mode n'y est pas un champ : c'est celui du
  trajet ou de la voiture qui a demandé la création. Entrée et Échap sont traitées ici, sinon la
  modale du dessous les prendrait pour les siennes.
*/
let providerAskCallback = null;

// onCreate(provider) reçoit le prestataire créé : le select qui l'a demandé le sélectionne.
function askNewProvider(mode, onCreate) {
  if (activeAsk) return;
  providerAskCallback = onCreate;
  const noun = providerNoun(mode);
  const current = providerMode(mode);
  const html = /* HTML */ `<div class="modal modal-ask provider-ask">
    <h3>Ajouter ${noun.indefinite}</h3>
    <div class="field">
      <label>${tagLabel(current.emoji, current.label)}</label>
      <input id="new-provider-name" type="text" />
    </div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeProviderAsk()">Annuler</button>
      <button class="btn" onclick="confirmNewProvider('${mode}')">Créer</button>
    </div>
  </div>`;
  showAskOverlay(html, {
    onKeydown: (e) => providerAskKeydown(e, mode),
    after: () => document.getElementById('new-provider-name').focus(),
  });
}

function providerAskKeydown(event, mode) {
  if (event.key !== 'Enter' && event.key !== 'Escape') return;
  event.preventDefault();
  if (event.key === 'Escape') return closeProviderAsk();
  confirmNewProvider(mode);
}

function confirmNewProvider(mode) {
  const name = document.getElementById('new-provider-name').value.trim();
  if (!name) return;
  const provider = createProviderNamed(name, mode);
  closeProviderAsk();
  if (providerAskCallback) providerAskCallback(provider);
}

function closeProviderAsk() {
  closeAskOverlay();
}
