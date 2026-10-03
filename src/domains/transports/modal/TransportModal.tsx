import { Icon } from '@/shared/Icon';
import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { Transport } from '@/store/types';

/*
  Port de transportForm/saveTransport (js/views/transports/modal/{form,save}.js). Mode et statut
  sont des dicts simples (TRANSPORT_MODES/TRANSPORT_STATUSES, pas de "＋ Ajouter") : SelectField
  ordinaire. Départ/arrivée (transportEndpointFields, select de lieu groupé par villes/autres lieux)
  et le bloc prestataire (transportProviderFields, filtré par mode) restent en LegacyMarkup — ce
  dernier se repeint depuis l'extérieur de React au changement de mode
  (repaintTransportProviderFields), même mécanisme que pour l'offre/le modèle de voiture. Le mode
  "voiture" a disparu de TRANSPORT_MODES (CLAUDE.md 2026-09-19) : plus de bloc exclusif à basculer,
  juste ce select filtré à repeindre.
*/
export function TransportModal({ payload }: { payload: Transport }) {
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
          onChange={() => window.repaintTransportProviderFields()}
        />
        <SelectField
          id="t-status"
          label="Statut"
          defaultValue={payload.status}
          placeholder={`${window.UNSET_TRANSPORT_STATUS.emoji} ${window.UNSET_TRANSPORT_STATUS.label}`}
          options={statusOptions}
        />
      </FieldRow>
      <LegacyMarkup
        html={window.transportEndpointFields(
          'from',
          'Départ',
          payload.fromAttractionId,
          payload.fromPrecision,
        )}
      />
      <LegacyMarkup
        html={window.transportEndpointFields(
          'to',
          'Arrivée',
          payload.toAttractionId,
          payload.toPrecision,
        )}
      />
      <FieldRow>
        <TextField id="t-depart-date" label="Part le" type="date" defaultValue={payload.departDate} />
        <TextField id="t-depart-time" label="Heure" type="time" defaultValue={payload.departTime} />
      </FieldRow>
      <FieldRow>
        <TextField id="t-arrive-date" label="Arrive le" type="date" defaultValue={payload.arriveDate} />
        <TextField id="t-arrive-time" label="Heure" type="time" defaultValue={payload.arriveTime} />
      </FieldRow>
      <div
        id="t-provider-block"
        dangerouslySetInnerHTML={{ __html: window.transportProviderFields(payload) }}
      />
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
