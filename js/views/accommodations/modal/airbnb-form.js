/*
  La porte Airbnb : le type est celui de la porte, d'où le champ caché que le scrape écrit déjà.
  Le prix reste à saisir, Airbnb ne le sert pas dans sa page.
*/
function airbnbAccommodationForm(p) {
  return /* HTML */ `
    <h3>Ajouter depuis Airbnb</h3>
    <input type="hidden" id="f-type" value="airbnb" />
    <div class="field">
      <label>Lien Airbnb</label
      ><input
        id="f-link"
        type="text"
        value="${escapeHtml(p.link)}"
        placeholder="https://www.airbnb.fr/rooms/..."
        onpaste="importAirbnbPaste()"
        onchange="importAirbnbLink()"
      />
    </div>
    <div class="field">
      <label>Nom</label
      ><input
        id="f-name"
        type="text"
        value="${escapeHtml(p.name)}"
        placeholder="Appartement au cœur de Sienne"
      />
    </div>
    ${locateFields(p)}
    <div class="field-row">
      <div class="field">
        <label>Prix</label
        ><input
          id="f-price"
          type="text"
          value="${escapeHtml(p.price)}"
          placeholder="120"
          title="Un calcul marche aussi : =625/4"
          onblur="applyPriceFormula(this)"
        />
      </div>
      <div class="field">
        <label>Dates</label
        ><input id="f-dates" type="text" value="${escapeHtml(p.dates)}" placeholder="12–14 juin" />
      </div>
    </div>
    <div class="field">
      <label>Notes</label><textarea id="f-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveAccommodation('')">Enregistrer</button>
    </div>
  `;
}
