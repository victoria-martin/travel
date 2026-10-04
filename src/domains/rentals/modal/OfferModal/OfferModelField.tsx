import { AddByNameRow } from '@/shared/form-fields/AddByNameRow';
import type { Offer } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';

// The provider's models, not the whole catalog; the one the offer already carries stays listed.
export function OfferModelField({ payload, providerId }: { payload: Offer; providerId: string }) {
  useTravelStore();
  const [modelId, setModelId] = useState(payload.modelId);
  const choose = (id: string) => {
    payload.modelId = id;
    setModelId(id);
  };
  const models = window.providerCarModels(providerId);
  const current = modelId ? window.getCarModel(modelId) : undefined;
  if (current && !models.includes(current)) models.push(current);

  return (
    <div className="field">
      <label htmlFor="offer-model">Modèle</label>
      <select id="offer-model" value={modelId} onChange={(event) => choose(event.target.value)}>
        <option value="">{payload.model || 'Aucun modèle'}</option>
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <AddByNameRow
        id="offer-model-name"
        placeholder="Nouveau modèle"
        onAdd={(name) => choose(window.createCarModelNamed(name, '', '').id)}
      />
    </div>
  );
}
