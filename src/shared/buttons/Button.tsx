export const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
  return (
    <button
      type="button"
      className="toolbar-btn" // TODO: à vérifier avant du'utliser ce composant partout
      onClick={onClick}
    >
      {label}
    </button>
  );
};
