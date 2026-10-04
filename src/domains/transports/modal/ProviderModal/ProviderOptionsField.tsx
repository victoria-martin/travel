import { Icon } from '@/shared/Icon';
import type { Provider, ProviderOption } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';

// Each keystroke writes into the payload, so a row added later never loses what was typed; labels used elsewhere feed the datalist.
export function ProviderOptionsField({ payload }: { payload: Provider }) {
  const providers = useTravelStore((store) => store.data.providers);
  const [options, setOptions] = useState<ProviderOption[]>(() => {
    payload.options ??= [];
    return [...payload.options];
  });
  const commit = (next: ProviderOption[]) => {
    payload.options = next;
    setOptions([...next]);
  };
  const setField = (index: number, field: keyof ProviderOption, value: string) => {
    const next = [...options];
    next[index] = { ...next[index], [field]: value };
    commit(next);
  };
  const labels = [
    ...new Set(
      window
        .ofCurrentTravel(providers)
        .flatMap((provider) => (provider.options || []).map((option) => option.label))
        .filter(Boolean),
    ),
  ].sort((labelA, labelB) => labelA.localeCompare(labelB));

  return (
    <div className="field">
      <label>Options</label>
      <div id="provider-options">
        {options.map((option, index) => (
          <div key={option.id} className="provider-option-row">
            <input
              type="text"
              list="provider-option-labels"
              placeholder="Nom de l'option"
              value={option.label}
              autoFocus={index === options.length - 1 && !option.label && !option.amount}
              onChange={(event) => setField(index, 'label', event.target.value)}
            />
            <input
              type="text"
              className="provider-option-amount"
              placeholder="Montant"
              value={option.amount}
              onChange={(event) => setField(index, 'amount', event.target.value)}
            />
            <select
              value={option.unit}
              onChange={(event) => setField(index, 'unit', event.target.value)}
            >
              {Object.entries(window.PROVIDER_OPTION_UNITS).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="icon-btn"
              title="Retirer cette option"
              onClick={() => commit(options.filter((_, at) => at !== index))}
            >
              <Icon name="x" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={() =>
            commit([...options, { id: window.uid(), label: '', amount: '', unit: 'flat' }])
          }
        >
          <Icon name="plus" /> Ajouter une option
        </button>
      </div>
      <datalist id="provider-option-labels">
        {labels.map((label) => (
          <option key={label} value={label} />
        ))}
      </datalist>
    </div>
  );
}
