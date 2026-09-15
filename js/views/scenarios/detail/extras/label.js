// Le libellé suit ce que la ligne référence ; une référence effacée le dit plutôt que de laisser
// une pastille vide.
function extraLabel(line) {
  const attraction = extraAttraction(line);
  if (attraction)
    return tagLabel(attractionType(attraction.type).emoji, escapeHtml(attraction.name));
  const cost = extraCost(line);
  if (cost) return tagLabel(EXPENSE_ICON, escapeHtml(costLabel(cost)));
  return tagLabel('❔', line.costId ? 'Dépense supprimée' : 'Activité supprimée');
}
