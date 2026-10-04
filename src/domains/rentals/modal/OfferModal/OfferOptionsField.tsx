import { Icon } from '@/shared/Icon';
import type { Offer } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useRef, useState } from 'react';

// The offer only ticks its provider's catalog; a typed option joins that catalog and gets ticked.
export function OfferOptionsField({ payload, providerId }: { payload: Offer; providerId: string }) {
  useTravelStore();
  const [optionIds, setOptionIds] = useState<string[]>(() => {
    payload.optionIds ??= [];
    return payload.optionIds;
  });
  const labelRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLSelectElement>(null);
  const update = (ids: string[]) => {
    payload.optionIds = ids;
    setOptionIds(ids);
  };
  const provider = window.getProvider(providerId);

  const add = () => {
    const label = labelRef.current?.value.trim() ?? '';
    const amount = amountRef.current?.value.trim() ?? '';
    if (!provider || (!label && !amount)) return;
    const option = { id: window.uid(), label, amount, unit: unitRef.current?.value ?? 'flat' };
    provider.options.push(option);
    window.upsertProvider(provider);
    update([...optionIds, option.id]);
    if (labelRef.current) labelRef.current.value = '';
    if (amountRef.current) amountRef.current.value = '';
    labelRef.current?.focus();
  };

  return (
    <div className="field">
      <label>Options et assurances</label>
      <div id="rental-offer-options">
        {!provider ? (
          <p className="filter-hint">Choisis d&apos;abord un loueur.</p>
        ) : (
          <>
            {provider.options.map((option) => (
              <label key={option.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={optionIds.includes(option.id)}
                  onChange={() =>
                    update(
                      optionIds.includes(option.id)
                        ? optionIds.filter((id) => id !== option.id)
                        : [...optionIds, option.id],
                    )
                  }
                />
                {window.providerOptionLabel(option)}
              </label>
            ))}
            <div className="provider-option-row">
              <input
                id="offer-option-label"
                ref={labelRef}
                type="text"
                placeholder="Nom de l'option"
              />
              <input
                id="offer-option-amount"
                ref={amountRef}
                className="provider-option-amount"
                type="text"
                placeholder="Montant"
              />
              <select id="offer-option-unit" ref={unitRef}>
                {Object.entries(window.PROVIDER_OPTION_UNITS).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.label}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-secondary btn-small" onClick={add}>
                <Icon name="plus" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
