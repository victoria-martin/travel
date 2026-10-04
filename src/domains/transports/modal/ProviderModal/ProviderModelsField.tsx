import { AddByNameRow } from '@/shared/form-fields/AddByNameRow';
import { MultiSelectField } from '@/shared/form-fields/MultiSelectField';
import type { Provider } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';

// A model stays the trip's: the provider only ticks the ones it offers, and a typed one joins the catalog.
export function ProviderModelsField({ payload }: { payload: Provider }) {
  useTravelStore();
  const [modelIds, setModelIds] = useState<string[]>(() => {
    payload.modelIds ??= [];
    return payload.modelIds;
  });
  const update = (ids: string[]) => {
    payload.modelIds = ids;
    setModelIds(ids);
  };

  return (
    <MultiSelectField
      id="provider-model-select"
      label="Modèles proposés"
      options={window.travelCarModels().map((model) => ({ value: model.id, label: model.name }))}
      selected={modelIds}
      emptyHint="Aucun modèle au catalogue du voyage."
      onChange={update}
    >
      <AddByNameRow
        id="provider-model-name"
        placeholder="Nouveau modèle"
        onAdd={(name) => {
          const model = window.createCarModelNamed(name, '', '');
          update([...new Set([...modelIds, model.id])]);
        }}
      />
    </MultiSelectField>
  );
}
