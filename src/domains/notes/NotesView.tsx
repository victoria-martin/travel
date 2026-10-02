import { useShallow } from 'zustand/react/shallow';
import { useTravelStore } from '../../store/useTravelStore';

/*
  Porte js/views/notes.js. `defaultValue`, pas `value` : la saisie ne redéclenche jamais le store
  (window.setTripNote ne fait pas de render()), un champ contrôlé afficherait donc un texte périmé
  dès la première frappe — le champ non contrôlé garde ça, comme le `textarea` legacy.
*/
export function NotesView() {
  const note = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.tripNotes)[0] ?? null),
  );

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Notes</h2>
          <p className="view-sub">Bloc-notes libre, partagé via le Sheet</p>
        </div>
      </div>
      <textarea
        className="notes-area"
        placeholder="Idées, liens, questions à trancher…"
        defaultValue={note?.text || ''}
        onInput={(event) => window.setTripNote(event.currentTarget.value)}
      />
    </>
  );
}
