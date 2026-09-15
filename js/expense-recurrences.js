/*
  Ce qu'une dépense multiplie. Le montant saisi est unitaire, et la récurrence dit sur quoi le
  compter ; le nombre, lui, ne vit jamais sur la dépense — il vient de là où elle est comptée, un
  scénario donnant ses nuits, ses jours et les voyageurs du voyage.
*/
const DEFAULT_EXPENSE_RECURRENCE = 'once';

const EXPENSE_RECURRENCES = {
  once: { label: 'Une fois', emoji: '1️⃣', unit: '', count: () => 1 },
  perNight: { label: 'Par nuit', emoji: '🌙', unit: '/ nuit', count: (span) => span.nights },
  perDay: { label: 'Par jour', emoji: '📅', unit: '/ jour', count: (span) => span.days },
  perTraveler: {
    label: 'Par voyageur',
    emoji: '🧑',
    unit: '/ voyageur',
    count: (span) => span.travelers,
  },
};

// Une valeur inconnue — le texte libre d'avant — retombe sur la récurrence par défaut.
function expenseRecurrenceKey(recurrence) {
  return EXPENSE_RECURRENCES[recurrence] ? recurrence : DEFAULT_EXPENSE_RECURRENCE;
}

function expenseRecurrence(recurrence) {
  return EXPENSE_RECURRENCES[expenseRecurrenceKey(recurrence)];
}

// Hors d'un scénario, rien ne dit sur combien compter : le montant garde alors son unité.
function expenseAmountLabel(cost) {
  return [cost.amount, expenseRecurrence(cost.recurrence).unit].filter(Boolean).join(' ');
}

function expenseAmount(cost, span) {
  return priceNumber(cost.amount) * expenseRecurrence(cost.recurrence).count(span);
}
