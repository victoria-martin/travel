function cardDeleteButton(collection, id) {
  return /* HTML */ `<button
    class="btn-danger btn btn-small"
    onclick="deleteItem('${collection}','${id}')"
  >
    Suppr.
  </button>`;
}
