const DISABLED_FIELDS: { field: 'police' | 'firefighters' | 'medical'; label: string }[] = [
  { field: 'police', label: 'Police' },
  { field: 'firefighters', label: 'Pompiers' },
  { field: 'medical', label: 'Secours' },
];

// Port de countryInfoCardHtml (js/views/country-info/country-info.js) : seule "note" s'édite, le
// reste vient du seed (COUNTRY_INFO_SEED) ou d'un enregistrement déjà vérifié à la main.
export function CountryInfoCard({ country }: { country: string }) {
  const info = window.countryInfoDefaults(country);

  return (
    <section className="country-info-card">
      <h3 className="country-info-title">{country}</h3>
      <div className="field-row">
        {DISABLED_FIELDS.map(({ field, label }) => (
          <div className="field" key={field}>
            <label>{label}</label>
            <input type="text" defaultValue={info[field]} disabled />
          </div>
        ))}
      </div>
      <div className="field">
        <label>Numéro d&apos;urgence unique</label>
        <input type="text" defaultValue={info.emergencyNumber} disabled />
      </div>
      <div className="field">
        <label>Ambassade / consulat (adresse, téléphone)</label>
        <textarea className="country-info-embassy" defaultValue={info.embassy} disabled />
      </div>
      <div className="field">
        <label>Note</label>
        <textarea
          defaultValue={info.note}
          onInput={(event) =>
            window.setCountryInfoField(country, 'note', event.currentTarget.value)
          }
        />
      </div>
    </section>
  );
}
