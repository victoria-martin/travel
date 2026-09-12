function linkCell(item) {
  if (!item.link) return '—';
  return externalLink(item.link, 'Voir');
}
