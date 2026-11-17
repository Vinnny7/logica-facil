'use strict';

const Logic = (() => {
  const operators = {
    and: {
      label: 'E',
      expression: 'P ∧ Q',
      rule: 'O E só é verdadeiro quando P e Q são verdadeiros.',
      calculate: (p, q) => p && q,
    },
    or: {
      label: 'OU',
      expression: 'P ∨ Q',
      rule: 'O OU é verdadeiro quando pelo menos uma proposição é verdadeira, inclusive quando as duas são.',
      calculate: (p, q) => p || q,
    },
    not: {
      label: 'NÃO',
      expression: '¬P',
      rule: 'O NÃO inverte o valor de P.',
      calculate: (p) => !p,
    },
  };

  function truthRows(operator) {
    const combinations = operator === 'not'
      ? [[true], [false]]
      : [[true, true], [true, false], [false, true], [false, false]];
    return combinations.map((values) => ({
      values,
      result: operators[operator].calculate(...values),
    }));
  }

  return { operators, truthRows };
})();

if (typeof module !== 'undefined') module.exports = Logic;
