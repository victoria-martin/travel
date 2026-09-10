function accommodationTypeSelect(a) {
  const current = accType(a.type);
  return /* HTML */ `<select
    class="inline-select"
    title="Type d'hébergement"
    onchange="setAccommodationType('${a.id}', this.value)"
  >
    ${Object.entries(ACCOMMODATION_TYPES)
      .map(
        ([key, t]) =>
          `<option value="${key}" ${t === current ? 'selected' : ''}>${t.emoji} ${t.label}</option>`,
      )
      .join('')}
  </select>`;
}

function accommodationStatusSelect(a) {
  const current = accStatus(a.status);
  return /* HTML */ `<select
    class="inline-select"
    title="Statut"
    onchange="setAccommodationStatus('${a.id}', this.value)"
  >
    ${Object.entries(ACCOMMODATION_STATUSES)
      .map(
        ([key, s]) =>
          `<option value="${key}" ${s === current ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
      )
      .join('')}
  </select>`;
}
