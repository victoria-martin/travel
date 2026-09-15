// A value is free text: it travels by index rather than inside an onclick string.
function todoValuePills(kind, column, values, call) {
  return /* HTML */ `<div class="filter-pills">
    ${todoFilterValues(kind, column)
      .map((value, i) =>
        filterPill({
          label: todoValueLabel(column, value),
          active: values.includes(value),
          onclick: call(i),
        }),
      )
      .join('')}
  </div>`;
}
