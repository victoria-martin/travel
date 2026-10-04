function setRecapFold(key, open) {
  prefs.recapFolds[key] = open;
  persistPrefs();
}
