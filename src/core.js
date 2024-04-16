export const boolType = { kind: "BoolType" };
export const intType = { kind: "IntType" };
export const floatType = { kind: "FloatType" };
export const stringType = { kind: "StringType" };
export const voidType = { kind: "VoidType" };
export const anyType = { kind: "AnyType" };

export function program(statements) {
  return { kind: "Program", statements };
}

export function fun(name) {
  return { kind: "Function", name };
}

export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body };
}

export function naturalLanguageFunctionDefinition(name, paramNames, body, fun) {
  return {
    kind: "NaturalLanguageFunctionDefinition",
    name,
    paramNames,
    body,
    fun,
  };
}

export function predictiveLoop(iterator, number1, number2, loopBody) {
  return {
    kind: "PredictiveLoop",
    iterator,
    number1,
    number2,
    loopBody,
  };
}

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

export function rangeParams(start, end, patternType) {
  return { kind: "RangeParams", start, end, patternType };
}

export function variable(name, type) {
  return { kind: "Variable", name, type };
}

export function callExpression(callee, args) {
  return { kind: "CallExpression", callee, args };
}

export function expression(type, ...args) {
  // This is a placeholder. You might need different expression functions
  // for different kinds of expressions, such as binary expressions,
  // literal values, variable references, etc.
  return { kind: "Expression", type, args };
}

export function predictiveRange(iterator, number1, number2, patternType, body) {
  return {
    kind: "PredictiveRange",
    iterator,
    number1,
    number2,
    patternType,
    body,
  };
}

// Define additional constructs here as needed.

// Example for literals and binary operations, adjust as necessary.
export function numberLiteral(value, type) {
  return { kind: "NumberLiteral", value, type };
}

export function stringLiteral(value, type) {
  return { kind: "StringLiteral", value, type };
}

export function binaryExpression(op, left, right) {
  return { kind: "BinaryExpression", op, left, right };
}

// Example for variables and variable declarations.
export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer };
}

// Add additional utility functions as necessary to support the full range of your grammar.
export const standardLibrary = Object.freeze({
  int: intType,
  float: floatType,
  boolean: boolType,
  string: stringType,
  void: voidType,
  any: anyType,
  /*π: variable("π", true, floatType),
  print: fun("print", anyToVoidType),
  sin: fun("sin", floatToFloatType),
  cos: fun("cos", floatToFloatType),
  exp: fun("exp", floatToFloatType),
  ln: fun("ln", floatToFloatType),
  hypot: fun("hypot", floatFloatToFloatType),
  bytes: fun("bytes", stringToIntsType),
  codepoints: fun("codepoints", stringToIntsType),*/
});
