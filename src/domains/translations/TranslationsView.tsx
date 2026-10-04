import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { PhraseCategory } from './TranslationsView/PhraseCategory';

function matchesSearch(item: { fr: string; note?: string }, lang: string, wanted: string): boolean {
  if (!wanted) return true;
  return [item.fr, window.phraseTranslation(item.fr, lang), item.note].some(
    (text) => text && text.toLowerCase().includes(wanted),
  );
}

/*
  Porte js/views/phrases.js, scope réduit : catégories (en dur + phrases custom), recherche,
  sélecteur de langue, traduction (+ correction via window.prompt, déléguée). Restent, pas
  bloquants : style de carte (classique/duo/minimal), mode liste/cartes, formulaire d'ajout/édition
  react (openModal suffit pour l'instant, comme partout ailleurs).
*/

export function TranslationsView() {
  useTravelStore();
  const [query, setQuery] = useState('');

  const available = window.travelPhraseLanguages();
  const lang = window.currentPhraseLang();
  const wanted = query.trim().toLowerCase();
  const categories = window
    .phraseCategoriesWithCustom()
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => matchesSearch(item, lang, wanted)),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Phrases clé</h2>
          <span className="view-sub">
            {available.length
              ? `Pratique pour le voyage, par contexte — ${window.languageLabel(lang)}`
              : 'Aucun pays choisi pour ce voyage — ajoute-les dans la modale du voyage.'}
          </span>
        </div>
        <div className="view-header-actions">
          {available.length > 1 && (
            <select
              className="translation-lang-select"
              value={lang}
              onChange={(event) => window.setPhraseLang(event.target.value)}
            >
              {available.map((code) => (
                <option key={code} value={code}>
                  {window.languageLabel(code)}
                </option>
              ))}
            </select>
          )}
          <button type="button" className="btn btn-small" onClick={() => window.openModal('phrase')}>
            Phrase
          </button>
        </div>
      </div>
      <input
        className="translation-search"
        type="search"
        placeholder="Chercher…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div id="translation-categories">
        {!lang ? (
          <p className="hint">
            Choisis un ou plusieurs pays dans la modale du voyage pour voir les phrases traduites.
          </p>
        ) : categories.length === 0 ? (
          <p className="hint">Aucune phrase pour cette recherche.</p>
        ) : (
          categories.map((category) => (
            <PhraseCategory key={category.title} category={category} lang={lang} />
          ))
        )}
      </div>
    </>
  );
}
