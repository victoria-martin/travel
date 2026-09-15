function deleteButton(collection, id) {
  return /* HTML */ `<button
    class="icon-btn"
    onclick="deleteItem('${collection}','${id}')"
    title="Supprimer"
  >
    ${svgIcon('trash-2')}
  </button>`;
}
