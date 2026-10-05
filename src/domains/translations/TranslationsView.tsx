import { ToolbarButton } from '@/shared/buttons/ToolbarButton';
import { SettingsMenu } from '@/shared/menu/SettingsMenu';
import { ListModeToggle } from '@/shared/toolbar/ListModeToggle';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { PhraseCategory } from './TranslationsView/PhraseCategory';
import { PhraseSettings } from './TranslationsView/PhraseSettings';

function matchesSearch(item: { fr: string; note?: string }, lang: string, wanted: string): boolean {
  if (!wanted) return true;
  return [item.fr, window.phraseTranslation(item.fr, lang), item.note].some(
    (text) => text && text.toLowerCase().includes(wanted),
  );
}

/*
  Porte js/views/phrases.js. Two independent axes on the same cards: the list mode picks the
  chrome (box or flat row), the style (⋮) picks the typography.
*/

export function TranslationsView() {
  useTravelStore();
  const [query, setQuery] = useState('');

  const available = window.travelPhraseLanguages();
  const lang = window.currentPhraseLang();
  const wanted = query.trim().toLowerCase();
  const mode = window.listViewMode.phrases;
  const containerClass = `${window.phraseStyle().modifier} ${mode === 'table' ? 'translation-mode-list' : 'translation-mode-card'}`;
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
          <ToolbarButton
            icon="plus"
            label="Phrase"
            variant="primary"
            onClick={() => window.openModal('phrase')}
          />
          <ListModeToggle kind="phrases" />
          <span className="toolbar-separator" />
          <SettingsMenu>
            <PhraseSettings />
          </SettingsMenu>
        </div>
      </div>
      <input
        className="translation-search"
        type="search"
        placeholder="Chercher…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div id="translation-categories" className={containerClass}>
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
