import { expect } from "chai";
import { analyzeSyntax } from "../src/analyzer.js";

describe("Syntax Analysis Tests", () => {
  it("detects AutoHealingStatement correctly", () => {
    const code = "100/2";
    expect(analyzeSyntax(code)).to.match(/AutoHealingStatement detected./);
  });

  it("detects NaturalLanguageFunctionDefinition correctly", () => {
    const code = 'define "createReport(date, temperature) then generateReport"';
    expect(analyzeSyntax(code)).to.match(
      /NaturalLanguageFunctionDefinition detected./
    );
  });

  it("detects PredictiveLoop correctly", () => {
    const code = 'for x in predictive_range(1, 10, pattern="prime") { log(x) }';
    expect(analyzeSyntax(code)).to.match(/PredictiveLoop detected./);
  });

  it("returns error for unknown statement", () => {
    const code = "this is not a valid statement";
    expect(analyzeSyntax(code)).to.match(/Unknown or invalid statement./);
  });
});
