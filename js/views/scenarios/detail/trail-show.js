/*
  Le fil du trajet se montre ou se cache : sur un scénario court il ne dit rien de plus que la
  liste. C'est une préférence d'affichage, elle vaut pour tous les scénarios.
*/
function trailShown() {
  return prefs.trailShown !== false;
}

function toggleTrailShown() {
  prefs.trailShown = !trailShown();
  persistPrefs();
  render();
}

function trailShowOption() {
  return switchField('Afficher le fil', trailShown(), 'toggleTrailShown()');
}
