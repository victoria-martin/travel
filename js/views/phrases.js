/*
  Phrases utiles en voyage, en dur dans le code : pas une collection du voyage, rien à synchroniser
  ni à éditer depuis l'app. Le texte FR ci-dessous est la clé canonique — c'est lui que lit le
  script tools/translate-phrases/translate.js et qui indexe js/views/phrases-translations.generated.js
  (PHRASE_TRANSLATIONS[fr][langue]). Regroupées par contexte plutôt qu'en une seule liste, sur le
  modèle recherche-sans-re-render de js/views/filters/search.js — un re-render arracherait le champ
  et sa saisie à chaque lettre.
*/
const PHRASE_CATEGORIES = [
  {
    title: 'Hôtel / logement',
    items: [
      { fr: 'Bonjour, vous avez une réservation au nom de… ?' },
      { fr: 'À quelle heure est le petit-déjeuner ?' },
      { fr: 'À quelle heure devons-nous quitter la chambre ?' },
      { fr: 'On peut laisser les bagages ici ?' },
      { fr: 'Il y a un parking à proximité ?' },
      { fr: 'Le parking est compris dans le prix ?' },
      { fr: 'On a un problème avec la climatisation.' },
      { fr: 'Où est-ce que je peux me garer ?' },
      { fr: "Est-ce qu'il est possible de payer par carte ?" },
    ],
  },
  {
    title: 'Restaurant / bar',
    items: [
      { fr: "Est-ce qu'on peut avoir une table pour deux, s'il vous plaît ?" },
      { fr: "Qu'est-ce que vous nous conseillez ?" },
      { fr: 'Vous avez quelque chose de végétarien ?' },
      { fr: "C'est épicé ?" },
      { fr: "Sans oignon, s'il vous plaît." },
      { fr: 'On peut commander ?' },
      { fr: "Vous pouvez nous apporter encore un peu d'eau ?" },
      { fr: "L'addition, s'il vous plaît." },
      { fr: 'On a terminé, merci.' },
      { fr: 'On peut payer séparément ?' },
      {
        fr: "Est-ce qu'il est possible de l'emporter ?",
        note: 'Utile si vous ne finissez pas un plat',
      },
      { fr: 'Excusez-moi, où sont les toilettes ?' },
      {
        fr: "Vous avez besoin d'autre chose ?",
        note: "On te la dira souvent — réponse : « Non, c'est bon, merci »",
      },
    ],
  },
  {
    title: 'Voiture / route',
    items: [
      { fr: 'On doit payer le péage ici ?' },
      { fr: "Où est-ce qu'on peut faire le plein ?" },
      { fr: "C'est loin d'ici ?" },
      { fr: 'On peut y aller en voiture ?' },
      { fr: 'Où peut-on se garer sans entrer dans la ZTL ?' },
    ],
  },
  {
    title: 'Courses / commerces',
    items: [
      { fr: 'Ça coûte combien ?' },
      { fr: 'Vous avez un sac ?' },
      { fr: 'Je peux payer par carte ?' },
      { fr: "J'en prends deux, merci." },
      { fr: 'Vous avez quelque chose de local ?' },
    ],
  },
  {
    title: 'Chien',
    items: [
      { fr: 'Et avec le chien ?', note: 'La plus courte et naturelle des trois' },
      { fr: 'Le chien est accepté ?' },
      { fr: 'Le chien peut entrer ?' },
      { fr: "Est-ce qu'on peut s'asseoir dehors avec le chien ?" },
    ],
  },
  {
    title: 'Petites phrases de conversation',
    items: [
      { fr: 'Tout va bien ? / Ça va ?', note: 'Réponse simple : « Sì, grazie! » en italien' },
      { fr: "Ça va comme ça / C'est bon comme ça." },
      { fr: 'Pas de problème.' },
      { fr: "Mais de rien / T'inquiète." },
      { fr: 'Mais bien sûr / Aucun souci.' },
      { fr: 'On verra.' },
      { fr: 'Attends une seconde.' },
      { fr: 'Une seconde.' },
      { fr: 'Exactement.' },
      { fr: "Effectivement / C'est bien ça." },
      { fr: 'Si seulement ! / Avec plaisir !' },
      {
        fr: "Je ne parle pas bien la langue, pouvez-vous parler plus lentement, s'il vous plaît ?",
      },
    ],
  },
];
window.PHRASE_CATEGORIES = PHRASE_CATEGORIES;

/*
  Trois peintures pour la même carte de phrase, testables depuis le menu Affichage sans toucher au
  code : le HTML reste identique (translation-item), seule la classe modifier change la mise en page en
  CSS — sur le modèle d'OUT_OF_RANGE_STYLES (availability-badge.js).
*/
const PHRASE_STYLES = [
  { key: 'classique', label: 'Classique (cartes)', modifier: 'translation-style-classique' },
  { key: 'duo', label: 'Duo (langue | français)', modifier: 'translation-style-duo' },
  { key: 'minimal', label: 'Minimal (liste sobre)', modifier: 'translation-style-minimal' },
];

function phraseStyle() {
  return PHRASE_STYLES.find((s) => s.key === prefs.phraseStyle) || PHRASE_STYLES[0];
}

function setPhraseStyle(key) {
  prefs.phraseStyle = key;
  persistPrefs();
  render();
}

function phraseStyleOption() {
  return radioCardField(
    'Style des phrases',
    'translation-style',
    PHRASE_STYLES,
    phraseStyle().key,
    'setPhraseStyle',
  );
}

/*
  Une trad ajoutée depuis l'app est un dépannage local (localStorage, non synchronisé) : elle
  comble le trou tout de suite dans ce navigateur, mais reste à reporter à la main dans
  js/views/phrases-translations.generated.js pour qu'elle survive à un vidage de cache et vaille
  pour tout le monde — PHRASE_OVERRIDES gagne sur PHRASE_TRANSLATIONS dans phraseTranslation().
*/
const PHRASE_OVERRIDES_KEY = 'voyage-toscane-translation-overrides';
let phraseOverrides = readStore(PHRASE_OVERRIDES_KEY) || {};

function phraseOverride(fr, lang) {
  return (phraseOverrides[fr] && phraseOverrides[fr][lang]) || '';
}

function setPhraseOverride(fr, lang, text) {
  phraseOverrides[fr] = phraseOverrides[fr] || {};
  phraseOverrides[fr][lang] = text;
  writeStore(PHRASE_OVERRIDES_KEY, phraseOverrides);
  render();
}

function editPhraseTranslation(fr, lang) {
  const current = phraseTranslation(fr, lang);
  const text = window.prompt(`Traduction (${languageLabel(lang)}) de « ${fr} »`, current);
  if (text === null) return;
  setPhraseOverride(fr, lang, text.trim());
}

// data-fr en attribut plutôt qu'inliné dans l'onclick : le FR contient presque toujours des
// apostrophes (« qu'est-ce », « s'il vous plaît »), qui casseraient une chaîne JS entre quotes.
function editPhraseTranslationFromButton(button) {
  editPhraseTranslation(button.dataset.fr, button.dataset.lang);
}

/*
  Une phrase ajoutée depuis l'app est locale (localStorage, comme les trads de dépannage) : elle
  vit dans une catégorie existante, ou dans aucune (`category: ''`) le temps de la ranger plus tard
  — elle atterrit alors dans la catégorie virtuelle "Sans catégorie" (phraseCategoriesWithCustom).
  `emptyCustomPhrase` + `MODAL_TYPES.phrase` suivent le patron des autres formulaires
  (js/modals/modal.js) — bouton Enregistrer #f-save, lu par readCustomPhraseForm.
*/
const PHRASE_CUSTOM_KEY = 'voyage-toscane-custom-phrases';
const PHRASE_NO_CATEGORY = 'Sans catégorie';
let phraseCustomItems = readStore(PHRASE_CUSTOM_KEY) || [];

function emptyCustomPhrase() {
  return { id: null, category: '', fr: '', note: '' };
}

function getCustomPhrase(id) {
  return phraseCustomItems.find((p) => p.id === id) || null;
}

function readCustomPhraseForm(id) {
  return {
    id: id || uid(),
    category: document.getElementById('translation-category').value,
    fr: document.getElementById('translation-fr-input').value.trim(),
    note: document.getElementById('translation-note-input').value.trim(),
  };
}

function saveCustomPhrase(id) {
  const phrase = readCustomPhraseForm(id);
  if (!phrase.fr) return;
  const idx = phraseCustomItems.findIndex((p) => p.id === phrase.id);
  if (idx === -1) phraseCustomItems.push(phrase);
  else phraseCustomItems[idx] = phrase;
  writeStore(PHRASE_CUSTOM_KEY, phraseCustomItems);
  closeModal();
}

function deleteCustomPhrase(id) {
  if (!confirm('Supprimer cette phrase ?')) return;
  phraseCustomItems = phraseCustomItems.filter((p) => p.id !== id);
  writeStore(PHRASE_CUSTOM_KEY, phraseCustomItems);
  render();
}

// Formulaire : src/domains/phrases/modal/AddTranslationModal.tsx (docs/en-cours/react-migration-plan.md § 4).

// Les phrases en dur (PHRASE_CATEGORIES) et celles ajoutées (phraseCustomItems) partagent
// l'affichage : une phrase custom porte juste `customId`, qui décide des boutons Modifier/Supprimer.
// Celles sans catégorie (category: '') atterrissent dans une section virtuelle en fin de liste.
function phraseCategoriesWithCustom() {
  const asItem = (p) => ({ fr: p.fr, note: p.note, customId: p.id });
  const categories = PHRASE_CATEGORIES.map((category) => ({
    ...category,
    items: [
      ...category.items,
      ...phraseCustomItems.filter((p) => p.category === category.title).map(asItem),
    ],
  }));
  const uncategorized = phraseCustomItems.filter((p) => !p.category).map(asItem);
  if (uncategorized.length) categories.push({ title: PHRASE_NO_CATEGORY, items: uncategorized });
  return categories;
}

let phraseSearch = '';
let phraseLang = '';

// Les pays du voyage (js/countries.js) donnent une ou plusieurs langues (js/language-by-country.js) ;
// la première fois qu'on ouvre la page, ou si le voyage a changé, on part sur la première.
function travelPhraseLanguages() {
  const travel = currentTravel();
  const codes = (travel && travel.countries) || [];
  const langs = [];
  codes.forEach((code) => {
    languageByCountry(code).forEach((lang) => {
      if (!langs.includes(lang)) langs.push(lang);
    });
  });
  return langs;
}

function currentPhraseLang() {
  const available = travelPhraseLanguages();
  if (available.includes(phraseLang)) return phraseLang;
  return available[0] || '';
}

function setPhraseLang(lang) {
  phraseLang = lang;
  render();
}

// Deux axes indépendants sur la même carte : le mode (liste/cartes) choisit le chrome — boîte ou
// ligne plate —, le style (Affichage) choisit la typo. Les deux se combinent toujours : changer
// l'un ne fait jamais perdre l'autre.
function renderTranslationsView() {
  const mode = listViewMode.phrases;
  const available = travelPhraseLanguages();
  const lang = currentPhraseLang();
  const containerClass = `${phraseStyle().modifier} ${mode === 'table' ? 'translation-mode-list' : 'translation-mode-card'}`;
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Phrases clé</h2>
        <p class="view-sub">${phrasesSubtitle(available, lang)}</p>
      </div>
      <div class="view-header-actions">
        ${available.length > 1 ? phraseLangSelect(available, lang) : ''}
        ${toolbarButton({ icon: svgIcon('plus'), label: 'Phrase', onclick: "openModal('phrase')", primary: true })}
        ${listModeToggle('phrases', mode)} ${toolbarSeparator()} ${toolbarMenu()}
      </div>
    </div>
    <input
      class="translation-search"
      type="search"
      placeholder="Chercher…"
      value="${escapeHtml(phraseSearch)}"
      oninput="searchPhrases(this)"
    />
    <div id="translation-categories" class="${containerClass}">${phraseCategoriesHtml(lang)}</div>
  `;
}

function phrasesSubtitle(available, lang) {
  if (!available.length)
    return 'Aucun pays choisi pour ce voyage — ajoute-les dans la modale du voyage.';
  return `Pratique pour le voyage, par contexte — ${languageLabel(lang)}`;
}

function phraseLangSelect(available, lang) {
  return /* HTML */ `<select class="translation-lang-select" onchange="setPhraseLang(this.value)">
    ${available
      .map(
        (l) => `<option value="${l}" ${l === lang ? 'selected' : ''}>${languageLabel(l)}</option>`,
      )
      .join('')}
  </select>`;
}

function searchPhrases(input) {
  phraseSearch = input.value;
  const container = document.getElementById('translation-categories');
  if (container) container.innerHTML = phraseCategoriesHtml(currentPhraseLang());
}

function phraseTranslation(fr, lang) {
  const override = phraseOverride(fr, lang);
  if (override) return override;
  const entry = PHRASE_TRANSLATIONS[fr];
  return entry && entry[lang] ? entry[lang] : '';
}

function phraseCategoriesHtml(lang) {
  if (!lang)
    return '<p class="hint">Choisis un ou plusieurs pays dans la modale du voyage pour voir les phrases traduites.</p>';
  const wanted = phraseSearch.trim().toLowerCase();
  const categories = phraseCategoriesWithCustom()
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => matchesPhraseSearch(item, lang, wanted)),
    }))
    .filter((category) => category.items.length > 0);
  if (!categories.length) return '<p class="hint">Aucune phrase pour cette recherche.</p>';
  return categories.map((category) => phraseCategoryHtml(category, lang)).join('');
}

function matchesPhraseSearch(item, lang, wanted) {
  if (!wanted) return true;
  return [item.fr, phraseTranslation(item.fr, lang), item.note].some(
    (text) => text && text.toLowerCase().includes(wanted),
  );
}

function phraseCategoryHtml(category, lang) {
  return /* HTML */ `
    <section class="translation-category">
      <h3 class="translation-category-title">${escapeHtml(category.title)}</h3>
      <ul class="translation-list">
        ${category.items.map((item) => phraseItemHtml(item, lang)).join('')}
      </ul>
    </section>
  `;
}

function phraseItemHtml(item, lang) {
  const translated = phraseTranslation(item.fr, lang);
  return /* HTML */ `
    <li class="translation-item">
      <div class="translation-it-row">
        ${
          translated
            ? `<p class="translation-it">${escapeHtml(translated)}</p>`
            : `<p class="translation-missing">Traduction pas encore générée pour ${languageLabel(lang)}</p>`
        }
        ${phraseStatusButton(item.fr, lang, translated)}
      </div>
      <p class="translation-fr">${escapeHtml(item.fr)}</p>
      ${item.note ? /* HTML */ `<p class="translation-note">${escapeHtml(item.note)}</p>` : ''}
      ${
        item.customId
          ? /* HTML */ `<div class="translation-custom-actions">
              <button
                type="button"
                class="icon-btn translation-edit-btn"
                title="Modifier / ranger cette phrase"
                onclick="openModal('phrase', '${item.customId}')"
              >
                ${svgIcon('pencil')}
              </button>
              <button
                type="button"
                class="icon-btn translation-delete-btn"
                title="Supprimer cette phrase"
                onclick="deleteCustomPhrase('${item.customId}')"
              >
                ${svgIcon('trash-2')}
              </button>
            </div>`
          : ''
      }
    </li>
  `;
}

// Vert (traduit) ou ambre (manquant) : l'icône porte l'état, le clic ouvre l'édition dans les deux
// cas — traduit se corrige, manquant se comble.
function phraseStatusButton(fr, lang, translated) {
  const icon = translated ? 'circle-check' : 'circle-alert';
  const modifier = translated ? 'translation-status-ok' : 'translation-status-missing';
  const title = translated ? 'Corriger la traduction' : 'Ajouter la traduction';
  return /* HTML */ `<button
    type="button"
    class="icon-btn translation-status-btn ${modifier}"
    data-fr="${escapeHtml(fr)}"
    data-lang="${lang}"
    title="${title}"
    onclick="editPhraseTranslationFromButton(this)"
  >
    ${svgIcon(icon)}
  </button>`;
}

if (typeof module !== 'undefined') module.exports = { PHRASE_CATEGORIES };
