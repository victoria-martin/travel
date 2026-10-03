import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import { FieldRow } from '@/shared/layout/FieldRow';
import { TextField } from '@/shared/form-fields/TextField';
import type { Ville } from '@/store/types';

type VillePayload = Ville & {
  matches: { label: string; city?: string; lat: string; lng: string }[];
  status: string;
};

/*
  Port de villeForm/saveVille (js/views/villes/modal/{form,save}.js). Pas de LegacyMarkup ici : la
  recherche d'adresse est propre à la ville (locateVille/applyVilleMatch mutent modal.payload et
  rappellent render() eux-mêmes), assez courte pour rester en JSX direct plutôt que déléguée.
*/
export function VilleModal({ payload }: { payload: VillePayload }) {
  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une ville" />
      <TextField id="ville-name" label="Nom" defaultValue={payload.name} />
      <div className="locate-row">
        <button type="button" className="btn btn-ghost btn-small" onClick={() => window.locateVille()}>
          Localiser
        </button>
      </div>
      <div className="geocode-status">{payload.status}</div>
      <div className="geocode-matches">
        {payload.matches.map((match, index) => (
          <button
            key={match.label}
            type="button"
            className="geocode-match"
            onClick={() => window.applyVilleMatch(index)}
          >
            {match.label}
          </button>
        ))}
      </div>
      <FieldRow>
        <TextField id="ville-lat" label="Latitude" defaultValue={payload.lat} />
        <TextField id="ville-lng" label="Longitude" defaultValue={payload.lng} />
      </FieldRow>
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveVille(payload.id || '')} />
      </div>
    </>
  );
}
