import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { CarModel } from '@/store/types';

/*
  Port de carModelForm/saveCarModel (js/views/car-models/modal/{form,save}.js). Fuel et boîte sont
  des dicts simples sans "＋ Ajouter" (CAR_FUELS/CAR_GEARBOXES), comme le statut d'OfferModal : un
  SelectField ordinaire suffit, pas de WordSelectField. « Proposé par » reste en LegacyMarkup
  (carModelProvidersField) : multi-select + création de loueur inline, repeint depuis l'extérieur de
  React (repaintCarModelProviders), même mécanisme que les options/modèles d'OfferModal et
  ProviderModal. La suggestion de consommation (suggestCarConsumption) lit/écrit directement les
  champs fuel/consommation/boîte par id au fil de la frappe du nom — non réimplémentée, juste
  rebranchée via `onInput`.
*/
export function CarModelModal({ payload }: { payload: CarModel }) {
  const fuelOptions = Object.entries(window.CAR_FUELS).map(([key, fuel]) => ({
    value: key,
    label: `${fuel.emoji} ${fuel.label}`,
  }));
  const gearboxOptions = Object.entries(window.CAR_GEARBOXES).map(([key, gearbox]) => ({
    value: key,
    label: `${gearbox.emoji} ${gearbox.label}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="un modèle" />
      <TextField
        id="model-name"
        label="Modèle"
        defaultValue={payload.name}
        onInput={() => window.suggestCarConsumption()}
      />
      <FieldRow>
        <SelectField
          id="model-fuel"
          label="Motorisation"
          defaultValue={payload.fuel}
          placeholder={`${window.UNSET_CAR_FUEL.emoji} ${window.UNSET_CAR_FUEL.label}`}
          options={fuelOptions}
        />
        <div className="field">
          <label htmlFor="model-consumption">Consommation</label>
          <input id="model-consumption" type="text" defaultValue={payload.consumption} />
          <small id="model-consumption-hint" className="field-hint">
            ex. 6,5 L/100
          </small>
        </div>
        <SelectField
          id="model-gearbox"
          label="Boîte"
          defaultValue={payload.gearbox}
          placeholder={`${window.UNSET_CAR_GEARBOX.emoji} ${window.UNSET_CAR_GEARBOX.label}`}
          options={gearboxOptions}
        />
      </FieldRow>
      <LegacyMarkup html={window.carModelProvidersField(payload)} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveCarModel(payload.id || '')} />
      </div>
    </>
  );
}
