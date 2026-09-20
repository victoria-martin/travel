const RESOURCE_LABELS = {
  travels: 'Voyage',
  accommodations: 'Hébergement',
  attractions: 'Lieu',
  transports: 'Transport',
  providers: 'Prestataire',
  carModels: 'Modèle',
  offers: 'Offre',
  fixedCosts: 'Charge',
  packingItems: 'Article',
  freeTodos: 'Tâche',
  todoLists: 'Liste',
};

function deleteItem(dataKey, id) {
  if (!confirm('Supprimer cet élément ?')) return;
  const label = RESOURCE_LABELS[dataKey] || 'Ressource';
  state[dataKey] = state[dataKey].filter((x) => x.id !== id);
  saveNow();
  showToast(`${label} supprimé`);
}
