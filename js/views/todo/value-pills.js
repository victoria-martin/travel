// A value is free text: it travels by index rather than inside an onclick string.
function todoValuePills(kind, column, values, call) {
  return /* HTML */ `<div class="filter-pills">
    ${filterValues(kind, column)
      .map((value, i) =>
        filterPill({
          label: filterValueLabel(column, value),
          active: values.includes(value),
          onclick: call(i),
        }),
      )
      .join('')}
  </div>`;
}
