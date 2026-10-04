function cardEditButton(modalKind, id) {
  return /* HTML */ `<button
    class="btn-outline btn btn-small"
    onclick="openModal('${modalKind}','${id}')"
  >
    Modifier
  </button>`;
}
