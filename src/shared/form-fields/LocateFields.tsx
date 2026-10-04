import { FieldRow } from '@/shared/layout/FieldRow';
import { useTravelStore } from '@/store/useTravelStore';
import { useShallow } from 'zustand/react/shallow';
import { type Located, locateSummary } from './LocateFields/locateSummary';

/*
  Fixed ids: one modal is open at a time, and the geocoder and the page scrapers (booking.js,
  airbnb.js, google-maps.js) write into these fields by id — hence uncontrolled inputs.
*/
export function LocateFields({ payload }: { payload: Located }) {
  const villes = useTravelStore(useShallow((store) => window.ofCurrentTravel(store.data.villes)));
  const places = useTravelStore(
    useShallow((store) => [
      ...window.ofCurrentTravel(store.data.accommodations),
      ...window.ofCurrentTravel(store.data.attractions),
    ]),
  );
  const suggestions = (key: string) =>
    Array.from(
      new Set(
        key === 'city'
          ? villes.map((ville) => ville.name)
          : places
              .map((place) => (place as unknown as Record<string, string>)[key])
              .filter(Boolean),
      ),
    ).sort();
  const levelRows = [];
  for (let index = 0; index < window.PLACE_LEVELS.length; index += 2)
    levelRows.push(window.PLACE_LEVELS.slice(index, index + 2));

  return (
    <>
      <div className="field">
        <label htmlFor="geo-address">Adresse</label>
        <div className="locate-row">
          <input
            id="geo-address"
            type="text"
            defaultValue={payload.address || ''}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              event.preventDefault();
              window.locateAddress();
            }}
          />
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => window.locateAddress()}
          >
            Localiser
          </button>
        </div>
      </div>
      <div id="geocode-status" className="geocode-status">
        {locateSummary(payload)}
      </div>
      <div id="geocode-matches" className="geocode-matches" />
      <FieldRow>
        <div className="field">
          <label htmlFor="geo-lat">Latitude</label>
          <input id="geo-lat" type="text" defaultValue={payload.lat} />
        </div>
        <div className="field">
          <label htmlFor="geo-lng">Longitude</label>
          <input id="geo-lng" type="text" defaultValue={payload.lng} />
        </div>
      </FieldRow>
      {levelRows.map((row) => (
        <FieldRow key={row[0].key}>
          {row.map((level) => (
            <div className="field" key={level.key}>
              <label htmlFor={`geo-${level.key}`}>{level.label}</label>
              <input
                id={`geo-${level.key}`}
                type="text"
                list={`geo-${level.key}-options`}
                defaultValue={(payload as Record<string, string | undefined>)[level.key] || ''}
              />
              <datalist id={`geo-${level.key}-options`}>
                {suggestions(level.key).map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </div>
          ))}
        </FieldRow>
      ))}
    </>
  );
}
