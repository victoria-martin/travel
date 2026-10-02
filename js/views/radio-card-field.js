/*
  Un choix fermé à peu d'options (zone d'étape, style météo, style de phrase, indicateur hors
  dispo) se pose en rangée de cartes plutôt qu'en <select> natif : chaque option se lit et se
  compare d'un coup d'œil, sur un seul patron partagé par les quatre écrans qui en ont besoin.
*/
function radioCardField(label, name, options, selectedKey, onChange) {
  return /* HTML */ `<div class="radio-card-field">
    <span class="radio-card-label">${label}</span>
    <div class="radio-card-grid">
      ${options
        .map(
          (option) => /* HTML */ `
            <label class="radio-card ${selectedKey === option.key ? 'selected' : ''}">
              <input
                type="radio"
                name="${name}"
                ${selectedKey === option.key ? 'checked' : ''}
                onchange="${onChange}('${option.key}')"
              />
              ${option.preview ? `<span class="radio-card-preview">${option.preview}</span>` : ''}
              <span class="radio-card-name">${option.label}</span>
            </label>
          `,
        )
        .join('')}
    </div>
  </div>`;
}
