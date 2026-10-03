import { Icon } from '@/shared/Icon';
import type { PhraseItem as PhraseItemType } from '../types';

// Port de phraseItemHtml/phraseStatusButton (js/views/phrases.js).
export function PhraseItem({ item, lang }: { item: PhraseItemType; lang: string }) {
  const translated = window.phraseTranslation(item.fr, lang);

  return (
    <li className="translation-item">
      <div className="translation-it-row">
        {translated ? (
          <p className="translation-it">{translated}</p>
        ) : (
          <p className="translation-missing">
            Traduction pas encore générée pour {window.languageLabel(lang)}
          </p>
        )}
        <button
          type="button"
          className={`icon-btn translation-status-btn ${translated ? 'translation-status-ok' : 'translation-status-missing'}`}
          title={translated ? 'Corriger la traduction' : 'Ajouter la traduction'}
          onClick={() => window.editPhraseTranslation(item.fr, lang)}
        >
          <Icon name={translated ? 'circle-check' : 'circle-alert'} />
        </button>
      </div>
      <p className="translation-fr">{item.fr}</p>
      {item.note && <p className="translation-note">{item.note}</p>}
      {item.customId && (
        <div className="translation-custom-actions">
          <button
            type="button"
            className="icon-btn translation-edit-btn"
            title="Modifier / ranger cette phrase"
            onClick={() => window.openModal('phrase', item.customId as string)}
          >
            <Icon name="pencil" />
          </button>
          <button
            type="button"
            className="icon-btn translation-delete-btn"
            title="Supprimer cette phrase"
            onClick={() => window.deleteCustomPhrase(item.customId as string)}
          >
            <Icon name="trash-2" />
          </button>
        </div>
      )}
    </li>
  );
}
