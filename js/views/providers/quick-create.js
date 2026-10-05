/*
  Le prestataire qui manque au milieu d'une saisie : son formulaire (ProviderAskForm, React) se
  pose par-dessus la modale ouverte sans la re-rendre. Le mode n'y est pas un champ : c'est celui
  du trajet ou de la voiture qui a demandé la création.
*/

// onCreate(provider) reçoit le prestataire créé : le select qui l'a demandé le sélectionne.
function askNewProvider(mode, onCreate) {
  if (activeAsk) return;
  activeAsk = { kind: 'provider', mode, onCreate, onClose: closeAskOverlay };
  render();
}
