import { parse } from "../src/parser.js";

describe("PythOnPoint Parser Tests", () => {
  it("Valid AutoHealingStatement", () => {
    const input = "10 / 2";
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.succeeded()).toBe(true);
  });

  it("Valid NaturalLanguageFunctionDefinition", () => {
    const input = 'define "sum(x,y) then x + y"';
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.succeeded()).toBe(true);
  });

  it("Valid PredictiveLoop", () => {
    const input = 'for x in predictive_range(1,10,"pattern"="prime") { x + 1 }';
    const result = parse(input);
    expect(result).not.toBeNull();
    expect(result.succeeded()).toBe(true);
  });

  it("Invalid Statement", () => {
    const input = "invalid statement";
    const result = parse(input);
    expect(result).toBeNull();
  });
});
