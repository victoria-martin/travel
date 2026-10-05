import { TagLabel } from '@/shared/TagLabel';
import type { Provider } from '@/store/types';
import { useState } from 'react';

// A missing provider created over the open form; its mode is the one of the form that asked.
export function ProviderAskForm({
  mode,
  onCreate,
  onClose,
}: {
  mode: string;
  onCreate: (provider: Provider) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const noun = window.providerNoun(mode);
  const current = window.providerMode(mode);
  const create = () => {
    if (!name.trim()) return;
    const provider = window.createProviderNamed(name.trim(), mode);
    onClose();
    onCreate(provider);
  };
  return (
    <div
      className="modal modal-ask provider-ask"
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== 'Escape') return;
        event.preventDefault();
        if (event.key === 'Escape') onClose();
        else create();
      }}
    >
      <h3>Ajouter {noun.indefinite}</h3>
      <div className="field">
        <label htmlFor="new-provider-name">
          <TagLabel emoji={current.emoji} label={current.label} />
        </label>
        <input
          id="new-provider-name"
          type="text"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
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
