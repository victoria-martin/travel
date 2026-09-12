function cardEditButton(modalKind, id) {
  return /* HTML */ `<button
    class="btn-ghost btn btn-small"
    onclick="openModal('${modalKind}','${id}')"
  >
    Modifier
  </button>`;
}
