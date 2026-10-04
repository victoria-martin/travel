import { useTravelStore } from '@/store/useTravelStore';

const NEW_PROVIDER_VALUE = '__new';

// Only the providers of its mode; the last item creates the missing one and selects it once created.
export function ProviderSelectField({
  id,
  mode,
  value,
  onChange,
}: {
  id: string;
  mode: string;
  value: string;
  onChange: (providerId: string) => void;
}) {
  useTravelStore();
  const noun = window.providerNoun(mode);
  return (
    <div className="field">
      <label htmlFor={id}>{noun.label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          if (event.target.value !== NEW_PROVIDER_VALUE) return onChange(event.target.value);
          window.askNewProvider(mode, (provider) => onChange(provider.id));
        }}
      >
        <option value="">{window.UNSET_TRANSPORT_MODE.label}</option>
        {window.providersOfMode(mode).map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
        <option value={NEW_PROVIDER_VALUE}>＋ Ajouter {noun.indefinite}</option>
      </select>
    </div>
  );
}
