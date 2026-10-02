import { Icon } from '../../../shared/Icon';
import type { PhraseItem as PhraseItemType } from '../types';

// Port de phraseItemHtml/phraseStatusButton (js/views/phrases.js).
export function PhraseItem({ item, lang }: { item: PhraseItemType; lang: string }) {
  const translated = window.phraseTranslation(item.fr, lang);

  return (
    <li className="phrase-item">
      <div className="phrase-it-row">
        {translated ? (
          <p className="phrase-it">{translated}</p>
        ) : (
          <p className="phrase-missing">
            Traduction pas encore générée pour {window.languageLabel(lang)}
          </p>
        )}
        <button
          type="button"
          className={`icon-btn phrase-status-btn ${translated ? 'phrase-status-ok' : 'phrase-status-missing'}`}
          title={translated ? 'Corriger la traduction' : 'Ajouter la traduction'}
          onClick={() => window.editPhraseTranslation(item.fr, lang)}
        >
          <Icon name={translated ? 'circle-check' : 'circle-alert'} />
        </button>
      </div>
      <p className="phrase-fr">{item.fr}</p>
      {item.note && <p className="phrase-note">{item.note}</p>}
      {item.customId && (
        <div className="phrase-custom-actions">
          <button
            type="button"
            className="icon-btn phrase-edit-btn"
            title="Modifier / ranger cette phrase"
            onClick={() => window.openModal('phrase', item.customId as string)}
          >
            <Icon name="pencil" />
          </button>
          <button
            type="button"
            className="icon-btn phrase-delete-btn"
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
