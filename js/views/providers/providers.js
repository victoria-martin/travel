function renderProvidersTab() {
  const items = sortItems('prestataires', ofCurrentTravel(state.providers));
  if (!items.length)
    return emptyState(
      'Aucun loueur ni compagnie',
      'Ajoute un premier prestataire, ou crée-le depuis un trajet.',
    );
  return listTable('prestataires', items);
}
