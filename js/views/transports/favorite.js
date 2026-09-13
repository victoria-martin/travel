function toggleTransportFavorite(id) {
  const t = getTransport(id);
  t.favorite = !t.favorite;
  saveNow();
  render();
}
