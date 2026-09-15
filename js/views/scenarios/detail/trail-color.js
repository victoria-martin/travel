/*
  Le fil du trajet se lit de deux façons : l'avancement de chaque étape, comme la bande de la liste,
  ou le type de son hébergement. C'est une préférence d'affichage, elle vaut pour tous les
  scénarios.
*/
function trailColorByType() {
  return prefs.trailColorByType === true;
}

function toggleTrailColor() {
  prefs.trailColorByType = !trailColorByType();
  persistPrefs();
  render();
}

function trailColorOption() {
  return switchField('Coloré par type d’hébergement', trailColorByType(), 'toggleTrailColor()');
}
