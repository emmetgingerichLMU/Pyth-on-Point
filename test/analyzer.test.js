import { expect } from "chai";
import Analyzer from "../src/analyzer.js";

describe("Syntax Analysis Tests", () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new Analyzer();
  });

  it("handles AutoHealingStatement with convertible types", () => {
    const ast = {
      type: "AutoHealingStatement",
      left: { type: "Literal", value: "100", dataType: "string" },
      right: { type: "Literal", value: 2, dataType: "number" },
    };
    expect(() => analyzer.visitAutoHealingStatement(ast)).not.to.throw();
  });

  it("throws on AutoHealingStatement with non-convertible types", () => {
    const ast = {
      type: "AutoHealingStatement",
      left: { type: "Literal", value: "not a number", dataType: "string" },
      right: { type: "Literal", value: 2, dataType: "number" },
    };
    expect(() => analyzer.visitAutoHealingStatement(ast)).to.throw();
  });

  it("validates NaturalLanguageFunctionDefinition without duplicate parameters", () => {
    const ast = {
      type: "NaturalLanguageFunctionDefinition",
      parameters: [{ name: "temperature", dataType: "number" }],
      body: [],
    };
    expect(() =>
      analyzer.visitNaturalLanguageFunctionDefinition(ast)
    ).not.to.throw();
  });

  it("throws on NaturalLanguageFunctionDefinition with duplicate parameters", () => {
    const ast = {
      type: "NaturalLanguageFunctionDefinition",
      parameters: [
        { name: "temperature", dataType: "number" },
        { name: "temperature", dataType: "number" },
      ],
      body: [],
    };
    expect(() =>
      analyzer.visitNaturalLanguageFunctionDefinition(ast)
    ).to.throw();
  });

  it("accepts valid PredictiveLoop", () => {
    const ast = {
      type: "PredictiveLoop",
      start: { type: "Literal", value: 1, dataType: "number" },
      end: { type: "Literal", value: 10, dataType: "number" },
      pattern: { type: "Literal", value: "prime", dataType: "string" },
      body: [],
    };
    expect(() => analyzer.visitPredictiveLoop(ast)).not.to.throw();
  });

  it("validates ComparisonStatement with compatible types", () => {
    const ast = {
      type: "ComparisonStatement",
      left: { type: "Literal", value: 10, dataType: "number" },
      right: { type: "Literal", value: 10, dataType: "number" },
    };
    expect(() => analyzer.visitComparisonStatement(ast)).not.to.throw();
  });

  it("throws on ComparisonStatement with incompatible types", () => {
    const ast = {
      type: "ComparisonStatement",
      left: { type: "Literal", value: "10", dataType: "string" },
      right: { type: "Literal", value: 10, dataType: "number" },
    };
    expect(() => analyzer.visitComparisonStatement(ast)).to.throw();
  });

  // Additional tests as needed for other features and edge cases
});
