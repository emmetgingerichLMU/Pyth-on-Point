// analyzer.js

/**
 * Checks if a given code snippet is an AutoHealingStatement.
 * @param {string} code - The code snippet to check.
 * @returns {boolean} - True if the code is an AutoHealingStatement, false otherwise.
 */
function isAutoHealingStatement(code) {
  const divisionRegex = /^\d+\/\d+$/; // Simplified regex for division operation
  return divisionRegex.test(code.trim());
}

/**
 * Checks if a given code snippet is a NaturalLanguageFunctionDefinition.
 * @param {string} code - The code snippet to check.
 * @returns {boolean} - True if the code is a NaturalLanguageFunctionDefinition, false otherwise.
 */
function isNaturalLanguageFunctionDefinition(code) {
  const nlfdRegex = /^define\s+".+"\s*$/;
  return nlfdRegex.test(code.trim());
}

/**
 * Checks if a given code snippet is a PredictiveLoop.
 * @param {string} code - The code snippet to check.
 * @returns {boolean} - True if the code is a PredictiveLoop, false otherwise.
 */
function isPredictiveLoop(code) {
  const predictiveLoopRegex =
    /^for\s+\w+\s+in\s+predictive_range\(\s*\d+,\s*\d+,\s*pattern\s*=\s*".+"\s*\)\s*\{.*\}$/;
  return predictiveLoopRegex.test(code.trim());
}

/**
 * Analyzes the syntax of a given Pyth-on-Point code snippet.
 * @param {string} code - The Pyth-on-Point code to analyze.
 * @returns {string} - A message indicating the type of statement or an error.
 */
export function analyzeSyntax(code) {
  if (isAutoHealingStatement(code)) {
    return "AutoHealingStatement detected.";
  } else if (isNaturalLanguageFunctionDefinition(code)) {
    return "NaturalLanguageFunctionDefinition detected.";
  } else if (isPredictiveLoop(code)) {
    return "PredictiveLoop detected.";
  } else {
    return "Unknown or invalid statement.";
  }
}
