function scenarioRecapRow(r) {
  return /* HTML */ `<div class="acc-recap-row">
    <span
      >${r.acc ? `${accType(r.acc.type).emoji} ${escapeHtml(r.acc.name)} <span class="acc-recap-city">· ${escapeHtml(r.acc.city)}</span>` : '<span class="acc-recap-city">Sans hébergement</span>'}</span
    >
    <strong>${nightsLabel(r.nights)}</strong>
  </div>`;
}
