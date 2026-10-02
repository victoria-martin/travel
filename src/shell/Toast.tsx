// Port de toastHtml (js/flash.js, maintenant retiré — ce composant le remplace).
export function Toast() {
  if (!window.activeToast) return null;
  return (
    <div className="toast" role="status">
      {window.activeToast}
    </div>
  );
}
