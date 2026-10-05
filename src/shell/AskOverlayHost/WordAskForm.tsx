import { FieldRow } from '@/shared/layout/FieldRow';
import { useState } from 'react';

const WORD_SWATCHES = [
  '#35607d',
  '#c98a3e',
  '#a6462e',
  '#7c8b5e',
  '#3e6259',
  '#6b5b95',
  '#5f6b72',
  '#4e7a9b',
];

// A missing word (type, status) created over the open form without re-rendering it.
export function WordAskForm({
  bank,
  onCreate,
  onClose,
}: {
  bank: string;
  onCreate: (word: { key: string; label: string; emoji: string }) => void;
  onClose: () => void;
}) {
  const { noun, color } = window.WORD_BANKS[bank];
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('');
  const [swatch, setSwatch] = useState(WORD_SWATCHES[0]);
  const create = () => {
    if (!label.trim()) return;
    const word = window.createWord(bank, {
      label: label.trim(),
      emoji: emoji.trim(),
      color: swatch,
    });
    onClose();
    onCreate(word);
  };
  return (
    <div
      className="modal modal-ask"
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== 'Escape') return;
        event.preventDefault();
        if (event.key === 'Escape') onClose();
        else create();
      }}
    >
      <h3>Ajouter {noun}</h3>
      <FieldRow>
        <div className="field" style={{ flex: '0 0 64px' }}>
          <label htmlFor="new-word-emoji">Emoji</label>
          <input
            id="new-word-emoji"
            type="text"
            maxLength={4}
            placeholder="🏷️"
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="new-word-label">Libellé</label>
          <input
            id="new-word-label"
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
      </FieldRow>
      {color && (
        <div className="field">
          <label>Couleur</label>
          <div className="accent-swatches">
            {WORD_SWATCHES.map((candidate) => (
              <button
                type="button"
                key={candidate}
                className={`accent-swatch ${candidate === swatch ? 'selected' : ''}`}
                style={{ background: candidate }}
                onClick={() => setSwatch(candidate)}
              />
            ))}
          </div>
        </div>
      )}
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Annuler
        </button>
        <button type="button" className="btn" onClick={create}>
          Créer
        </button>
      </div>
    </div>
  );
}
