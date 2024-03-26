export function program(statements) {
  return { kind: "Program", statements };
}

export function naturalLanguageFunctionDefinition(
  functionName,
  parameters,
  functionBody,
  fun
) {
  return {
    kind: "NaturalLanguageFunctionDefinition",
    functionName,
    parameters,
    functionBody,
    fun,
  };
}

export function fun(name, type) {
  return { kind: "Function", name, type };
}

export function predictiveLoop(
  variable,
  predictiveRange,
  rangeParams,
  loopBody
) {
  return {
    kind: "PredictiveLoop",
    variable,
    predictiveRange,
    rangeParams,
    loopBody,
  };
}

export const standardLibrary = Object.freeze({});

export function comparisonStatement(expression1, expression2) {
  return { kind: "ComparisonStatement", expression1, expression2 };
}

export function printStatement(expression) {
  return { kind: "PrintStatement", expression };
}

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression };
}

export function yieldStatement(expression) {
  return { kind: "YieldStatement", expression };
}

export function variable(name) {
  return { kind: "Variable", name };
}

export function expression(type, ...args) {
  // This is a placeholder. You might need different expression functions
  // for different kinds of expressions, such as binary expressions,
  // literal values, variable references, etc.
  return { kind: "Expression", type, args };
}

export function predictiveRange(start, end, patternType) {
  return { kind: "PredictiveRange", start, end, patternType };
}

// Define additional constructs here as needed.

// Example for literals and binary operations, adjust as necessary.
export function numberLiteral(value) {
  return { kind: "NumberLiteral", value };
}

export function stringLiteral(value) {
  return { kind: "StringLiteral", value };
}

export function binaryExpression(op, left, right) {
  return { kind: "BinaryExpression", op, left, right };
}

// Example for variables and variable declarations.
export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer };
}

// Add additional utility functions as necessary to support the full range of your grammar.
