function toggleAttractionFavorite(id) {
  const a = getAttraction(id);
  a.favorite = !a.favorite;
  saveNow();
  render();
}
