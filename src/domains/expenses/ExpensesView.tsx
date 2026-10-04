import { SettingsMenu } from '@/shared/settings/SettingsMenu';
import { useTravelStore } from '@/store/useTravelStore';
import { ActualExpenseButton } from './ExpensesView/ActualExpenseButton';
import { ActualExpensesTable } from './ExpensesView/ActualExpensesTable';
import { AddBudgetButton } from './ExpensesView/AddBudgetButton';
import { BudgetTable } from './ExpensesView/BudgetTable';
import { DerivedSection } from './ExpensesView/DerivedSection';
import { ImportExpensesButton } from './ExpensesView/ImportExpensesButton';
import { SummaryMetrics } from './ExpensesView/SummaryMetrics';

/*
  Porte js/views/expenses/{expenses,header,total,actual,derived}.js, scope réduit comme ailleurs :
  tri (sortPanel) et menu ⋮ complet pas repris — seule la préférence transverse (SettingsMenu).
  Budget prévu et Dépenses réelles restent des `<table>` en clair (comme en legacy) plutôt que
  `DataTable` : des lignes de total/non-budgétisé s'intercalent, que l'abstraction DataTable (une
  ligne = un item) ne sait pas représenter.
*/
export function ExpensesView() {
  useTravelStore();
  const scenario = window.expenseBudgetScenario();

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Dépenses</h2>
          <span className="view-sub">Budget du scénario et dépenses réelles du voyage</span>
        </div>
        <div className="view-header-actions">
          <AddBudgetButton scenario={scenario} />
          <ActualExpenseButton />
          <ImportExpensesButton />
          <SettingsMenu />
        </div>
      </div>
      <SummaryMetrics scenario={scenario} />
      <section className="list-section">
        <div className="list-section-head">
          <div>
            <h3 className="list-section-title">Budget prévu</h3>
            <div className="expenses-section-subtitle">
              {scenario ? scenario.name : 'Aucun scénario retenu'}
            </div>
          </div>
        </div>
        <BudgetTable scenario={scenario} />
      </section>
      <section className="list-section">
        <div className="list-section-head">
          <div>
            <h3 className="list-section-title">Dépenses réelles</h3>
            <div className="expenses-section-subtitle">
              {window.actualExpenses().length} entrées · par date
            </div>
          </div>
        </div>
        <ActualExpensesTable />
      </section>
      <details className="list-section expenses-calculated">
        <summary>
          <span className="list-section-title">Calculé depuis les réservations</span>
          <strong>{window.formatEuros(window.derivedExpensesTotal())}</strong>
        </summary>
        <DerivedSection />
      </details>
    </>
  );
}
