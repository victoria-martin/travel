function accommodationStatusField(p) {
  wordSelectValues['f-status'] = p.status || '';
  return /* HTML */ `<div class="field">
    <label>Statut</label>
    <select id="f-status" onchange="wordSelectChanged('f-status', 'accommodationStatuses')">
      <option value="" ${p.status ? '' : 'selected'}>
        ${UNSET_ACCOMMODATION_STATUS.emoji} ${UNSET_ACCOMMODATION_STATUS.label}
      </option>
      ${Object.entries(ACCOMMODATION_STATUSES)
        .map(
          ([key, s]) =>
            `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
        )
        .join('')}
      <option value="${NEW_WORD_VALUE}">＋ Ajouter un statut</option>
    </select>
  </div>`;
}
