import { RadioCardField } from '@/shared/form-fields/RadioCardField';

// The Phrases page's own settings, in its ⋮ and in the Réglages modal.
export function PhraseSettings() {
  return (
    <div className="filter-block">
      <p className="filter-title">Phrases</p>
      <RadioCardField
        label="Style des phrases"
        name="translation-style"
        options={window.PHRASE_STYLES}
        selectedKey={window.phraseStyle().key}
        onChange={(key) => window.setPhraseStyle(key)}
      />
    </div>
  );
}
