function editButton(modalKind, id) {
  return /* HTML */ `<button
    class="icon-btn"
    onclick="openModal('${modalKind}','${id}')"
    title="Modifier"
  >
    ✎
  </button>`;
}
