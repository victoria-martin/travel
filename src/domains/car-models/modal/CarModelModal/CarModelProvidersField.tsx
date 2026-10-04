import { AddByNameRow } from '@/shared/form-fields/AddByNameRow';
import { MultiSelectField } from '@/shared/form-fields/MultiSelectField';
import type { CarModel } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';

type CarModelPayload = CarModel & { providerIds?: string[] };

// The relation lives on the provider (`modelIds`): this field mirrors it; a provider with a noted offer stays ticked.
export function CarModelProvidersField({ payload }: { payload: CarModelPayload }) {
  useTravelStore();
  const [providerIds, setProviderIds] = useState<string[]>(() => {
    payload.providerIds ??= window.carModelProviders(payload.id).map((provider) => provider.id);
    return payload.providerIds;
  });
  const update = (ids: string[]) => {
    payload.providerIds = ids;
    setProviderIds(ids);
  };
  const offered = new Set(window.carModelOffers(payload.id).map((offer) => offer.providerId));

  return (
    <MultiSelectField
      id="model-provider-select"
      label="Proposé par"
      options={window.providersOfMode('car').map((provider) => ({
        value: provider.id,
        label: provider.name,
        disabled: offered.has(provider.id),
        title: offered.has(provider.id) ? 'Une offre est relevée chez lui' : undefined,
      }))}
      selected={providerIds}
      emptyHint="Aucun loueur dans le voyage."
      onChange={update}
    >
      <AddByNameRow
        id="model-provider-name"
        placeholder="Nouveau loueur"
        onAdd={(name) => {
          const provider = window.createProviderNamed(name, 'car');
          update([...new Set([...providerIds, provider.id])]);
        }}
      />
    </MultiSelectField>
  );
}
