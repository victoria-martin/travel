/*
  Le select de type sert la modale complète et la porte Booking, dont le scrape écrit dedans :
  Booking loge aussi bien un hôtel qu'une maison, c'est la seule porte où le type reste une question.
*/
function accommodationTypeField(p) {
  return /* HTML */ `<div class="field">
    <label>Type</label>
    <select id="f-type">
      <option value="" ${p.type ? '' : 'selected'}>
        ${UNSET_ACCOMMODATION_TYPE.emoji} ${UNSET_ACCOMMODATION_TYPE.label}
      </option>
      ${Object.entries(ACCOMMODATION_TYPES)
        .map(
          ([key, t]) =>
            `<option value="${key}" ${p.type === key ? 'selected' : ''}>${t.label}</option>`,
        )
        .join('')}
    </select>
  </div>`;
}
