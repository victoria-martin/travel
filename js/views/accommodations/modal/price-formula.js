/*
  Un prix se tape aussi en calcul : « =625/4 » devient 156 quand le champ perd le focus. Ce qui ne
  commence pas par « = » n'est jamais touché.
*/
const PRICE_FORMULA_PATTERN = /^[0-9+\-*/(). ]+$/;

function priceFormulaResult(text) {
  if (!text.startsWith('=')) return null;
  const expression = text.slice(1).replace(/,/g, '.');
  if (!PRICE_FORMULA_PATTERN.test(expression)) return null;
  try {
    const value = Function(`"use strict"; return (${expression});`)();
    return Number.isFinite(value) ? String(Math.round(value)) : null;
  } catch {
    return null;
  }
}

function applyPriceFormula(input) {
  const result = priceFormulaResult(input.value.trim());
  if (result !== null) input.value = result;
}
