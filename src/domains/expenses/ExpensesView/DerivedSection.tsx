// Port de derivedExpensesList/derivedExpenseGroup/derivedExpenseLine (js/views/expenses/derived.js).
export function DerivedSection() {
  const groups = window.derivedExpenseGroups();

  if (!groups.length) {
    return (
      <div className="scenario-extra-empty">
        Rien à calculer — rien de réservé, aucune voiture par défaut.
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <div className="expense-group" key={group.key}>
          <button type="button" className="expense-group-head" onClick={() => window.goTo(group.view)}>
            {group.label}
          </button>
          {group.items.map((line, index) => (
            <div className="expense-line" key={index}>
              <span className="expense-icon">{line.icon}</span>
              <span className="expense-label">{line.label}</span>
              <strong className={`expense-amount ${line.amount === null ? 'expense-amount-open' : ''}`}>
                {line.display}
              </strong>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
