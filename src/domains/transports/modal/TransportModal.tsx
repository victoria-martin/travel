import { Icon } from '@/shared/Icon';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import { ProviderSelectField } from '@/shared/form-fields/ProviderSelectField';
import type { Transport } from '@/store/types';
import { useState } from 'react';
import { TransportEndpointFields } from './TransportModal/TransportEndpointFields';

// Port de transportForm/saveTransport (js/views/transports/modal/{form,save}.js) — saveTransport
// (inchangée) lit les champs par id. Le select de compagnie suit le mode choisi.
export function TransportModal({ payload }: { payload: Transport }) {
  const [mode, setMode] = useState(payload.mode);
  const [providerId, setProviderId] = useState(payload.providerId);
  const modeOptions = Object.entries(window.TRANSPORT_MODES).map(([key, mode]) => ({
    value: key,
    label: `${mode.emoji} ${mode.label}`,
  }));
  const statusOptions = Object.entries(window.TRANSPORT_STATUSES).map(([key, status]) => ({
    value: key,
    label: `${status.emoji} ${status.label}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="un transport" />
      <FieldRow>
        <SelectField
          id="t-mode"
          label="Mode"
          defaultValue={payload.mode}
          placeholder={`${window.UNSET_TRANSPORT_MODE.emoji} ${window.UNSET_TRANSPORT_MODE.label}`}
          options={modeOptions}
          onChange={(event) => {
            payload.mode = event.target.value;
            setMode(payload.mode);
          }}
        />
        <SelectField
          id="t-status"
          label="Statut"
          defaultValue={payload.status}
          placeholder={`${window.UNSET_TRANSPORT_STATUS.emoji} ${window.UNSET_TRANSPORT_STATUS.label}`}
          options={statusOptions}
        />
      </FieldRow>
      <TransportEndpointFields
        side="from"
        label="Départ"
        placeId={payload.fromAttractionId}
        precision={payload.fromPrecision}
      />
      <TransportEndpointFields
        side="to"
        label="Arrivée"
        placeId={payload.toAttractionId}
        precision={payload.toPrecision}
      />
      <FieldRow>
        <TextField
          id="t-depart-date"
          label="Part le"
          type="date"
          defaultValue={payload.departDate}
        />
        <TextField id="t-depart-time" label="Heure" type="time" defaultValue={payload.departTime} />
      </FieldRow>
      <FieldRow>
        <TextField
          id="t-arrive-date"
          label="Arrive le"
          type="date"
          defaultValue={payload.arriveDate}
        />
        <TextField id="t-arrive-time" label="Heure" type="time" defaultValue={payload.arriveTime} />
      </FieldRow>
      <FieldRow>
        <ProviderSelectField
          id="t-provider"
          mode={mode}
          value={providerId}
          onChange={(id) => {
            payload.providerId = id;
            setProviderId(id);
          }}
        />
        <TextField id="t-reference" label="Numéro / référence" defaultValue={payload.reference} />
      </FieldRow>
      <FieldRow>
        <TextField id="t-budget" label="Budget" defaultValue={payload.budget} />
        <TextField id="t-amount-min" label="Prix mini" defaultValue={payload.amountMin} />
        <TextField id="t-amount-max" label="Prix maxi" defaultValue={payload.amountMax} />
      </FieldRow>
      <TextField id="t-link" label="Lien" defaultValue={payload.link} />
      <TextareaField id="t-notes" label="Notes" rows={2} defaultValue={payload.notes} />
      <label className="filter-option" style={{ padding: '0 0 6px 0' }}>
        <input type="checkbox" id="t-favorite" defaultChecked={payload.favorite} />
        <Icon name="star" fill /> Coup de cœur
      </label>
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveTransport(payload.id || '')} />
      </div>
    </>
  );
}
