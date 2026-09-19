/*
  La porte HomeExchange : le type est celui de la porte, d'où le champ caché que le scrape écrit
  déjà. Le prix est le GP par nuit — c'est le type qui dit la monnaie.
*/
function homeExchangeAccommodationForm(p) {
  return /* HTML */ `
    <h3>Ajouter depuis HomeExchange</h3>
    <input type="hidden" id="f-type" value="homeExchange" />
    <div class="field">
      <label>Lien HomeExchange</label
      ><input
        id="f-link"
        type="text"
        value="${escapeHtml(p.link)}"
        placeholder="https://..."
        onpaste="importHomeExchangePaste()"
        onchange="importHomeExchangeLink()"
      />
    </div>
    <div class="field">
      <label>Nom</label
      ><input id="f-name" type="text" value="${escapeHtml(p.name)}" />
    </div>
    ${locateFields(p)}
    <div class="field-row">
      <div class="field">
        <label>GP / nuit</label
        ><input
          id="f-price"
          type="text"
          value="${escapeHtml(p.price)}"
          title="Un calcul marche aussi : =625/4"
          onblur="applyPriceFormula(this)"
        />
      </div>
      <div class="field">
        <label>Dates</label
        ><input id="f-dates" type="text" value="${escapeHtml(p.dates)}" />
        <small class="field-hint">ex. 12–14 juin</small>
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
