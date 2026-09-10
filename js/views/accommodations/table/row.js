function accommodationRow(a, columns) {
  return /* HTML */ `<tr>
    ${columns
      .map(
        (c) => `<td${c.key === 'actions' ? ' style="white-space:nowrap;"' : ''}>${c.cell(a)}</td>`,
      )
      .join('')}
  </tr>`;
}
