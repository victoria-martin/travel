#!/usr/bin/env node
/*
  Traduit par batch les phrases FR de js/views/phrases.js via l'API DeepL, et écrit le résultat dans
  js/views/phrases-translations.generated.js. Ne tourne jamais au runtime de l'app — un script
  qu'on lance à la main, une fois par langue à ajouter, sur le modèle de la génération offline de
  car-models/consumption-db.js.

  Usage :
    DEEPL_API_KEY=xxx node tools/translate-phrases/translate.js es de

  `it` reste écrit à la main dans le fichier généré (qualité native) : le script ne touche jamais
  cette clé, même si `it` est passé en argument.
*/
const fs = require('fs');
const path = require('path');
const { PHRASE_CATEGORIES } = require('../../js/views/phrases.js');

const OUT_PATH = path.join(__dirname, '../../js/views/phrases-translations.generated.js');

// Codes DeepL cible (API v2) pour les langues que js/language-by-country.js sait produire.
const DEEPL_TARGETS = {
  it: 'IT',
  es: 'ES',
  de: 'DE',
  en: 'EN-GB',
  pt: 'PT-PT',
  nl: 'NL',
  el: 'EL',
  ru: 'RU',
  tr: 'TR',
  zh: 'ZH',
  ja: 'JA',
  ko: 'KO',
  pl: 'PL',
  sv: 'SV',
  da: 'DA',
  no: 'NB',
  fi: 'FI',
  cs: 'CS',
  sk: 'SK',
  sl: 'SL',
  hr: 'HR',
  ro: 'RO',
  hu: 'HU',
  bg: 'BG',
  et: 'ET',
  lv: 'LV',
  lt: 'LT',
  uk: 'UK',
  id: 'ID',
};

async function translateBatch(texts, target, apiKey) {
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: texts, source_lang: 'FR', target_lang: target }),
  });
  if (!res.ok) throw new Error(`DeepL a répondu ${res.status} : ${await res.text()}`);
  const data = await res.json();
  return data.translations.map((t) => t.text);
}

function readExisting() {
  if (!fs.existsSync(OUT_PATH)) return {};
  delete require.cache[require.resolve(OUT_PATH)];
  return require(OUT_PATH).PHRASE_TRANSLATIONS;
}

function write(translations) {
  const body = `/*
  Généré par tools/translate-phrases/translate.js — ne pas éditer les langues autres que \`it\` à la
  main, elles seront écrasées au prochain run. Clé : le texte FR canonique de
  js/views/phrases.js (\`item.fr\`), exactement. \`it\` est écrit à la main (qualité native, jamais
  passé par DeepL) ; les autres langues s'ajoutent en relançant le script avec leur code.
*/
const PHRASE_TRANSLATIONS = ${JSON.stringify(translations, null, 2)};

if (typeof module !== 'undefined') module.exports = { PHRASE_TRANSLATIONS };
`;
  fs.writeFileSync(OUT_PATH, body);
  console.log(`Écrit ${OUT_PATH}`);
}

async function main() {
  const targets = process.argv.slice(2);
  if (!targets.length) {
    console.error('Usage : DEEPL_API_KEY=xxx node tools/translate-phrases/translate.js es de …');
    process.exit(1);
  }
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error('DEEPL_API_KEY manquant dans l\'environnement.');
    process.exit(1);
  }

  const texts = [...new Set(PHRASE_CATEGORIES.flatMap((c) => c.items.map((i) => i.fr)))];
  const translations = readExisting();

  for (const lang of targets) {
    if (lang === 'it') {
      console.log('`it` est écrit à la main, ignoré.');
      continue;
    }
    const deeplTarget = DEEPL_TARGETS[lang];
    if (!deeplTarget) {
      console.warn(`Langue "${lang}" non mappée vers un code DeepL, ignorée.`);
      continue;
    }
    console.log(`Traduction vers ${lang} (${texts.length} phrases)…`);
    const translated = await translateBatch(texts, deeplTarget, apiKey);
    texts.forEach((text, i) => {
      translations[text] = translations[text] || {};
      translations[text][lang] = translated[i];
    });
  }

  write(translations);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
