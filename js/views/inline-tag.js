// Un mot de vocabulaire qu'on ne change pas ici : la pastille d'un déclencheur de menu, sans son
// geste — elle n'appelle donc pas le clic.
function staticTag(word) {
  return `<span class="inline-tag inline-tag-static">${tagLabel(word.emoji, word.label)}</span>`;
}
