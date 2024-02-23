const { parse } = require('./parser');

describe('PythOnPoint Parser Tests', () => {
  test('Valid AutoHealingStatement', () => {
    const input = '10 / 2';
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.succeeded()).toBe(true);
  });

  test('Valid NaturalLanguageFunctionDefinition', () => {
    const input = 'define "sum(x,y) then x + y"';
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.succeeded()).toBe(true);
  });

  test('Valid PredictiveLoop', () => {
    const input = 'for x in predictive_range(1,10,"pattern"="prime") { x + 1 }';
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.succeeded()).toBe(true);
  });

  test('Invalid Statement', () => {
    const input = 'invalid statement';
    const result = parse(input);
    expect(result).toBeNull();
  });
});

