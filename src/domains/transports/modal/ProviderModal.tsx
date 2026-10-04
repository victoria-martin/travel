import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import { FieldRow } from '@/shared/layout/FieldRow';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import type { Provider } from '@/store/types';
import { useState } from 'react';
import { ProviderModelsField } from './ProviderModal/ProviderModelsField';
import { ProviderOptionsField } from './ProviderModal/ProviderOptionsField';

// Port de providerForm/saveProvider (js/views/providers/modal/{form,save}.js) — #f-save délègue à
// window.saveProvider(id) inchangée. Seule la voiture a des modèles : le bloc suit le mode choisi.
export function ProviderModal({ payload }: { payload: Provider }) {
  const [mode, setMode] = useState(payload.mode);
  const modeOptions = Object.entries(window.PROVIDER_MODES).map(([key, mode]) => ({
    value: key,
    label: `${mode.emoji} ${mode.label}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="un loueur ou une compagnie" />
      <FieldRow>
        <SelectField
          id="prov-mode"
          label="Mode"
          defaultValue={payload.mode}
          placeholder={`${window.UNSET_TRANSPORT_MODE.emoji} ${window.UNSET_TRANSPORT_MODE.label}`}
          options={modeOptions}
          onChange={(event) => {
            payload.mode = event.target.value;
            setMode(payload.mode);
          }}
        />
        <TextField id="prov-name" label="Nom" defaultValue={payload.name} />
      </FieldRow>
      <TextField id="prov-logo" label="Logo (url d'image)" defaultValue={payload.logo} />
      <FieldRow>
        <TextField id="prov-site" label="Site" defaultValue={payload.site} />
        <TextField id="prov-booking" label="Réservation" defaultValue={payload.bookingUrl} />
      </FieldRow>
      <ProviderOptionsField payload={payload} />
      {mode === 'car' && <ProviderModelsField payload={payload} />}
      <TextareaField id="prov-notes" label="Notes" defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveProvider(payload.id || '')} />
      </div>
    </>
  );
}
