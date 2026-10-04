import { useState } from 'react';

// A closed palette: an accent colour has to hold up next to the rest of the app.
const TRAVEL_ACCENTS = ['#35607d', '#c98a3e', '#a6462e', '#7c8b5e', '#3e6259', '#6b5b95'];

// Picking repaints the card live (paintTravelModal); saveTravel reads the hidden field.
export function TravelAccentSwatches({ initialAccent }: { initialAccent: string }) {
  const [accent, setAccent] = useState(initialAccent);
  const pick = (color: string) => {
    setAccent(color);
    window.paintTravelModal(color);
  };
  return (
    <div className="field">
      <label>Couleur d&apos;accent</label>
      <div className="accent-swatches">
        <button
          type="button"
          className={`accent-swatch accent-none ${accent ? '' : 'selected'}`}
          title="Aucune couleur"
          onClick={() => pick('')}
        >
          —
        </button>
        {TRAVEL_ACCENTS.map((color) => (
          <button
            type="button"
            key={color}
            className={`accent-swatch ${accent === color ? 'selected' : ''}`}
            style={{ background: color }}
            title={color}
            onClick={() => pick(color)}
          />
        ))}
      </div>
      <input id="travel-accent" type="hidden" value={accent} readOnly />
    </div>
  );
}
