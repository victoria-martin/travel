import type { Travel } from '@/store/types';
import { useState } from 'react';

// A <select multiple> over COUNTRIES rather than free text: Infos utiles and the Phrases language read a recognised code.
export function TravelCountriesField({ payload }: { payload: Travel }) {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState<string[]>(() => {
    payload.countries ??= [];
    return payload.countries;
  });
  const wanted = search.trim().toLowerCase();
  const options = window.COUNTRIES.filter(
    (country) =>
      !wanted || country.label.toLowerCase().includes(wanted) || countries.includes(country.code),
  );
  return (
    <div className="field">
      <label htmlFor="travel-country-select">Pays</label>
      <div id="travel-countries">
        <input
          type="search"
          className="filter-search"
          placeholder="Chercher un pays…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          id="travel-country-select"
          multiple
          size={8}
          value={countries}
          onChange={(event) => {
            const codes = Array.from(event.target.selectedOptions).map((option) => option.value);
            payload.countries = codes;
            setCountries(codes);
          }}
        >
          {options.map((country) => (
            <option key={country.code} value={country.code}>
              {window.countryFlag(country.code)} {country.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
