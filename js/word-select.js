/*
  Un mot ajouté à la volée rejoint directement le dictionnaire du domaine (ACCOMMODATION_TYPES…) :
  tout ce qui le lit — helpers, tableaux, légende, filtres — le voit sans rien savoir de l'ajout.
  Il est retenu en local (prefs, jamais synchronisé) et réappliqué au chargement.
*/
const WORD_BANKS = {
  accommodationTypes: { dict: ACCOMMODATION_TYPES, noun: 'un type d’hébergement', color: true },
  accommodationStatuses: { dict: ACCOMMODATION_STATUSES, noun: 'un statut d’hébergement', color: false },
  attractionTypes: { dict: ATTRACTION_TYPES, noun: 'un type de lieu', color: true },
  attractionStatuses: { dict: ATTRACTION_STATUSES, noun: 'un statut de lieu', color: false },
};

const NEW_WORD_VALUE = '__new';
const wordSelectValues = {};

function loadCustomWords() {
  Object.entries(WORD_BANKS).forEach(([bank, { dict }]) => {
    (prefs.customWords[bank] || []).forEach((word) => {
      dict[word.key] = word;
    });
  });
}

function slugWordKey(label, dict) {
  const base =
    label
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .map((word, i) => (i === 0 ? word : word[0].toUpperCase() + word.slice(1)))
      .join('') || 'mot';
  let key = base;
  let n = 2;
  while (dict[key]) key = base + n++;
  return key;
}

// La sélection courante se retient ici : l'item ＋ n'est pas un choix, elle sert à la reposer si
// la création est annulée, comme providerSelectValues le fait pour un prestataire.
function wordSelectChanged(id, bank) {
  const select = document.getElementById(id);
  if (select.value !== NEW_WORD_VALUE) {
    wordSelectValues[id] = select.value;
    return;
  }
  select.value = wordSelectValues[id] || '';
  askNewWord(id, bank);
}
