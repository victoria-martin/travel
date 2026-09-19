/*
  Les quatre niveaux administratifs d'un lieu, du plus large au plus fin. Toute chose localisée les
  porte — hébergements, lieux et activités — et tout ce qui les affiche, les saisit ou les filtre
  parcourt cette liste : ajouter un niveau ne touche qu'elle.
  L'ordre est celui du fil d'Ariane HomeExchange (`country` / `admin1` / `admin2` / `admin3`) et
  celui de la lecture : « Italie · Ligurie · Savone · Castelbianco ».
*/
const PLACE_LEVELS = [
  { key: 'country', label: 'Pays' },
  { key: 'region', label: 'Région' },
  { key: 'county', label: 'Province' },
  { key: 'city', label: 'Ville' },
];

const PLACE_LEVEL_KEYS = PLACE_LEVELS.map((level) => level.key);

function placeLevelsOf(source) {
  return Object.fromEntries(PLACE_LEVEL_KEYS.map((key) => [key, source[key] || '']));
}

function emptyPlaceLevels() {
  return placeLevelsOf({});
}
