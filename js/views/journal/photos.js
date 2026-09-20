/*
  Une photo ne s'écrit jamais en base64 dans l'entrée : une cellule du Sheet a une limite de taille
  bien trop petite pour ça (js/sync.js). Le fichier choisi part en base64 vers l'Apps Script, qui
  l'écrit dans le Drive du voyage et rend une URL — c'est cette URL, légère, qui vit dans
  journalEntries.photos. Nécessite l'action `uploadPhoto` d'apps-script/Code.js déployée.
*/
function journalPhotosBlock(date) {
  const entry = getJournalEntry(currentTravelId(), date);
  const photos = entry ? entry.photos : [];
  if (!photos.length) return '';
  return /* HTML */ `<div class="journal-photos" id="journal-photos">
    ${photos.map((url) => journalPhotoThumb(url, date)).join('')}
  </div>`;
}

function journalPhotoThumb(url, date) {
  return /* HTML */ `<div class="journal-photo">
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener"
      ><img src="${escapeHtml(url)}" alt="" loading="lazy"
    /></a>
    <button class="journal-photo-remove" title="Retirer" onclick="removeJournalPhoto('${date}', '${escapeHtml(url)}')">
      ${svgIcon('x')}
    </button>
  </div>`;
}

async function onJournalPhotoPicked(input, date) {
  const files = Array.from(input.files || []);
  input.value = '';
  if (!files.length) return;
  if (!syncActive()) {
    showToast('Configure la synchro (Google Sheet) avant d’importer des photos.');
    return;
  }
  showToast(`Import de ${files.length} photo${files.length > 1 ? 's' : ''}…`);
  for (const file of files) {
    try {
      const base64 = await readFileAsBase64(file);
      const { url, error } = await sheetPost({
        action: 'uploadPhoto',
        filename: file.name,
        mime: file.type || 'image/jpeg',
        base64,
      });
      if (error || !url) throw new Error(error || 'Réponse sans URL');
      addJournalPhoto(date, url);
    } catch (e) {
      console.warn('Import photo échoué', e);
      showToast('Une photo n’a pas pu être importée.');
    }
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
