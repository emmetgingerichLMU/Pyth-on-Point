import assert from "node:assert/strict";
import parse from "../src/parser.js"; // Assuming you have a parsing mechanism
import analyze from "../src/analyzer.js";
import {
  program,
  naturalLanguageFunctionDefinition,
  variable,
  printStatement,
  binaryExpression,
  stringLiteral,
  predictiveLoop,
  predictiveRange,
  comparisonStatement,
} from "../src/core.js";

// Semantic checks for PythOnPoint language
const semanticChecks = [
  ["print statements", 'print "Hello PythOnPoint!"'],
  [
    "one liner function definition",
    'let name = "Ari"\ndefine greet(name) then print "Hello " + name',
  ],
  ["predictive loop", "for x in predictive_range(1, 10, prime) { print(x) }"],
  ["comparison statement", "compare 1 to 2"],
  // Add more checks as needed for your language features
];

// Programs with expected semantic errors
const semanticErrors = [
  ["undeclared variable in print", "print x", /Identifier x not declared/],
  [
    "misused natural language keyword",
    "define greet(name) then print nombre",
    /Identifier nombre not declared/,
  ],
  // Add more error checks as needed for your language features
];

describe("The analyzer for PythOnPoint", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`correctly analyzes ${scenario}`, () => {
      // Assuming `parse` returns an AST directly suitable for analysis in this example
      const ast = parse(source); // Implement parse function based on your setup
      assert.doesNotThrow(() => analyze(ast));
    });
  }

  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`detects error for ${scenario}`, () => {
      const ast = parse(source); // Implement parse function based on your setup
      assert.throws(() => analyze(ast), errorMessagePattern);
    });
  }

  it("produces the expected representation for a simple print statement", () => {
    const source = 'print "Hello, PythOnPoint!"';
    const ast = parse(source); // Implement parse function based on your setup
    const analyzedAst = analyze(ast);
    assert.deepEqual(
      analyzedAst,
      program([printStatement(stringLiteral("Hello, PythOnPoint!"))])
    );
  });

  // Additional specific representation tests as needed...
});
