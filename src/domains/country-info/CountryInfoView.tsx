import { useTravelStore } from '@/store/useTravelStore';
import { CountryInfoCard } from './CountryInfoView/CountryInfoCard';

// No selector: travelCountries() reads several collections, the subscription only re-renders.
export function CountryInfoView() {
  useTravelStore();
  const countries = window.travelCountries();

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Infos utiles</h2>
          <span className="view-sub">Numéros d&apos;urgence et ambassade, par pays du voyage</span>
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
