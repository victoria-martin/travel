import { useTravelStore } from '../../store/useTravelStore';
import { CountryInfoCard } from './CountryInfoView/CountryInfoCard';

// Porte js/views/country-info/country-info.js. Pas de sélecteur : travelCountries() dérive de
// plusieurs collections (voyage, hébergements, attractions) à la fois, inutile de le refaire ici —
// la souscription sert juste à re-rendre quand l'une d'elles change.
export function CountryInfoView() {
  useTravelStore();
  const countries = window.travelCountries();

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Infos utiles</h2>
          <p className="view-sub">Numéros d&apos;urgence et ambassade, par pays du voyage</p>
        </div>
      </div>
      {countries.length ? (
        <div className="country-info-grid">
          {countries.map((country) => (
            <CountryInfoCard key={country} country={country} />
          ))}
        </div>
      ) : (
        <p className="hint">Aucun pays repéré sur ce voyage encore.</p>
      )}
    </>
  );
}
