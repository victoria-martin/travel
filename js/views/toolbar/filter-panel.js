/*
  The panel owns the disclosure and the count, the list owns what it filters on: each block is the
  caller's own {count, html}. Nothing to filter on, no button.
*/
function filterPanel(blocks) {
  const own = blocks.filter(Boolean);
  if (!own.length) return '';
  return toolbarPanel({
    key: 'filter',
    icon: '▽',
    label: 'Filtrer',
    count: own.reduce((total, block) => total + block.count, 0),
    body: own.map((block) => block.html).join(''),
  });
}
