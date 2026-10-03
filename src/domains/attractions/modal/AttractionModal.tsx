import { Icon } from '@/shared/Icon';
import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { WordSelectField } from '@/shared/WordSelectField';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TagsField } from '@/shared/form-fields/TagsField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { Attraction } from '@/store/types';
import { useState } from 'react';

/*
  Port d'attractionForm/saveAttraction (js/views/attractions/modal/{form,save}.js). Deux blocs
  restent délégués en LegacyMarkup, pas réimplémentés ici : `locateFields` (recherche d'adresse +
  géocodage, sous-système à lui) et `attractionScenarioActions` (ajout à un scénario). `tags` est
  contrôlé (TagsField) comme pour FixedCostModal ; tout le reste est non contrôlé.
*/
export function AttractionModal({ payload }: { payload: Attraction }) {
  // wordSelectChanged lit cette valeur pour remettre le select en l'état si "＋ Ajouter…" est
  // annulé — le poser ici remplace l'initialisation que faisait attractionForm() à chaque peinture.
  window.wordSelectValues['a-type'] = payload.type || '';
  window.wordSelectValues['a-status'] = payload.status || '';

  const [tags, setTags] = useState(payload.tags);

  function handleTagsChange(next: string[]) {
    setTags(next);
    payload.tags = next;
  }

  const accommodationOptions = window.attractionAccommodations().map((accommodation) => ({
    value: accommodation.id,
    label: `${window.accType(accommodation.type).emoji} ${accommodation.name}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="un lieu" />
      <FieldRow>
        <WordSelectField
          id="a-type"
          label="Type"
          bank="attractionTypes"
          dict={window.ATTRACTION_TYPES}
          defaultValue={payload.type}
          unset={window.UNSET_ATTRACTION_TYPE}
          addLabel="Ajouter un type"
        />
        <WordSelectField
          id="a-status"
          label="Statut"
          bank="attractionStatuses"
          dict={window.ATTRACTION_STATUSES}
          defaultValue={payload.status}
          unset={window.UNSET_ATTRACTION_STATUS}
          addLabel="Ajouter un statut"
        />
      </FieldRow>
      <TextField id="a-name" label="Nom" defaultValue={payload.name} />
      <TextareaField
        id="a-description"
        label="Description"
        rows={3}
        defaultValue={payload.description}
      />
      <TagsField
        label="Tags"
        tags={tags}
        vocabulary={window.allAttractionTags()}
        onChange={handleTagsChange}
      />
      <LegacyMarkup html={window.locateFields(payload)} />
      <SelectField
        id="a-accommodation"
        label="Hébergement"
        defaultValue={payload.accommodationId}
        placeholder="Aucun"
        options={accommodationOptions}
      />
      <FieldRow>
        <TextField id="a-budget" label="Budget" defaultValue={payload.budget} />
        <TextField id="a-amount-min" label="Prix mini" defaultValue={payload.amountMin} />
        <TextField id="a-amount-max" label="Prix maxi" defaultValue={payload.amountMax} />
      </FieldRow>
      <div className="field">
        <label htmlFor="a-maps-link">Lien Google Maps</label>
        <input
          id="a-maps-link"
          type="text"
          defaultValue={payload.mapsLink}
          placeholder="https://..."
          onPaste={(event) => window.importGoogleMapsPaste(event.currentTarget, 'a-name')}
          onChange={(event) => window.importGoogleMapsLink(event.currentTarget, 'a-name')}
        />
      </div>
      <TextField id="a-link" label="Lien" defaultValue={payload.link} />
      <FieldRow>
        <div className="field">
          <label htmlFor="a-hours">Horaires</label>
          <input id="a-hours" type="text" defaultValue={payload.hours} />
          <small className="field-hint">ex. Mar.-dim. 12h-15h</small>
        </div>
        <TextField id="a-phone" label="Téléphone" defaultValue={payload.phone} />
      </FieldRow>
      <label className="filter-option" style={{ padding: '0 0 6px 0' }}>
        <input type="checkbox" id="a-favorite" defaultChecked={payload.favorite} />
        <Icon name="star" fill /> Coup de cœur
      </label>
      <LegacyMarkup html={window.attractionScenarioActions()} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveAttraction(payload.id || '')} />
      </div>
    </>
  );
}
