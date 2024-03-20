import assert from "node:assert/strict";
import { parse } from "../src/parser.js";

// Assuming your grammar expects specific structures for each type of statement,
// adjust your test inputs to match these structures.
const syntaxChecks = [
  ["a valid ComparisonStatement", `compare 1 to 2`], // Adjusted for demonstration
  ["a valid NaturalLanguageFunctionDefinition", `define sum(x,y) then x + y`],
  ["a valid PredictiveLoop", `for x in predictive_range(1,10,prime) { x + 1 }`],
];

const syntaxErrors = [
  ["an invalid statement", "invalid statement"],
];

describe("The PythOnPoint parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`properly parses ${scenario}`, () => {
      const result = parse(source);
      assert(result !== null); // Ensure parsing succeeded
      // If your parse function or another utility function returns a more complex structure,
      // assert on the expected structure here.
    });
  }

  for (const [scenario, source] of syntaxErrors) {
    it(`does not permit ${scenario}`, () => {
      const result = parse(source);
      assert.strictEqual(result, null); // Ensure parsing failed as expected
    });
  }
});
