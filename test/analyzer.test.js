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
    "natural language function definition",
    'let name = "Ari"\ndefine greet(name) then print "Hello " + name',
  ],
  ["predictive loop", "for x in predictive_range(1, 10, prime) { print(x) }"],
  ["comparison statement", "compare 1 to 2"],
  [
    "variable declaration and usage",
    `let x = 5
     print x`,
  ],
  [
    "binary expression",
    `let result = 2 + 3
     print result`,
  ],
  [
    "function call",
    `define greet(name) then print "Hello " + name
     greet("Alice")`,
  ],
  [
    "nested function definition",
    `define outer() then
       define inner() then
         print "Inside inner"
       inner()
     outer()`,
  ],
  [
    "return statement",
    `define square(x) then
       return x * x
     print square(5)`,
  ],
  [
    "yield statement",
    `define countDown(n) then
       for i in predictive_range(n, 0, prime) then
         yield i
     for num in countDown(5) then
       print num`,
  ],
  [
    "comparison with variables",
    `let x = 10
     let y = 20
     compare x to y`,
  ],
  [
    "multiple variable declarations",
    `let x = 5
     let y = 10
     let z = x + y
     print z`,
  ],
  [
    "function with multiple parameters",
    `define add(a, b) then
       return a + b
     print add(3, 7)`,
  ],
  [
    "nested predictive loops",
    `for i in predictive_range(1, 5, prime) then
       for j in predictive_range(1, 3, fibonacci) then
         print i * j`,
  ],
  [
    "complex binary expressions",
    `let x = (10 + 5) * 3 - 8 / 2
     print x`,
  ],
  [
    "function with conditional return",
    `define isEven(n) then
       if n % 2 == 0 then
         return true
       else
         return false
     print isEven(4)`,
  ],
  [
    "recursive function call",
    `define factorial(n) then
       if n == 0 then
         return 1
       else
         return n * factorial(n - 1)
     print factorial(5)`,
  ],
  [
    "higher-order function",
    `define applyTwice(func, x) then
       return func(func(x))
     define square(x) then
       return x * x
     print applyTwice(square, 3)`,
  ],
  [
    "closure",
    `define outerFunction() then
       let counter = 0
       define innerFunction() then
         counter = counter + 1
         print counter
       return innerFunction
     let increment = outerFunction()
     increment()
     increment()`,
  ],
  [
    "predictive loop with complex range",
    `for i in predictive_range(1 + 2, 10 * 2, prime) then
       print i`,
  ],
  [
    "logical operators",
    `let x = true
     let y = false
     let z = x and y
     print z`,
  ],
  [
    "short-circuiting logical operators",
    `define isDivisibleBy(n, d) then
       return n % d == 0
     let x = 10
     if isDivisibleBy(x, 2) or isDivisibleBy(x, 3) then
       print "Divisible by 2 or 3"
     else
       print "Not divisible by 2 or 3"`,
  ],
  [
    "nested comparison statements",
    `let x = 5
     let y = 10
     let z = 7
     compare x to y
     compare y to z`,
  ],
  [
    "optional parameters",
    `define greet(name, greeting = "Hello") then
       print greeting + ", " + name
     greet("Alice")
     greet("Bob", "Hi")`,
  ],
  [
    "default parameter values",
    `define multiply(a, b = 2) then
       return a * b
     print multiply(5)
     print multiply(5, 3)`,
  ],
  [
    "predictive loop with no pattern",
    `for i in predictive_range(1, 5) then
       print i`,
  ],
  [
    "print statement with variable",
    `let message = "Hello, PythOnPoint!"
     print message`,
  ],
  [
    "print statement with binary expression",
    `let x = 5
     let y = 3
     print "Result: " + (x + y)`,
  ],
  [
    "predictive loop with different pattern",
    `for i in predictive_range(1, 20, fibonacci) then
       print i`,
  ],
  [
    "predictive loop with variable bounds",
    `let start = 1
     let end = 10
     for i in predictive_range(start, end, prime) then
       print i`,
  ],
  ["comparison statement with literals", `compare 5 to 10`],
  [
    "comparison statement with complex expressions",
    `let x = 5
     let y = 3
     compare (x * 2) to (y * 3)`,
  ],
  [
    "variable declaration with literal",
    `let x = 10
     print x`,
  ],
  [
    "variable declaration with binary expression",
    `let x = 5 + 3
     print x`,
  ],
  [
    "binary expression with variables",
    `let x = 5
     let y = 3
     let result = x * y
     print result`,
  ],
  [
    "binary expression with function call",
    `define square(n) then
       return n * n
     let x = 5
     let result = square(x) + 1
     print result`,
  ],
  [
    "comparison with variables and literals",
    `let x = 5
     compare x to 10`,
  ],
  [
    "multiple variable declarations with binary expressions",
    `let x = 5
     let y = 3
     let sum = x + y
     let product = x * y
     print sum
     print product`,
  ],
  [
    "nested comparison statements with variables",
    `let x = 5
     let y = 10
     let z = 7
     compare x to y
     compare y to z
     compare x to z`,
  ],
];
// Add more checks as needed for your language features

// Programs with expected semantic errors
const semanticErrors = [
  ["undeclared variable in print", "print x", /Identifier x not declared/],
  [
    "misused natural language keyword",
    "define greet(name) then print nombre",
    /Identifier nombre not declared/,
  ],
  [
    "invalid binary expression operands",
    `let result = 2 + "hello"`,
    /Expected a number/,
  ],
  [
    "redeclared variable",
    `let x = 1
     let x = 2`,
    /Identifier x already declared/,
  ],
  [
    "undefined function call",
    `greet("Alice")`,
    /Identifier greet not declared/,
  ],
  [
    "wrong number of arguments",
    `define greet(name) then print "Hello " + name
     greet()`,
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "invalid argument type",
    `define square(x) then return x * x
     square("5")`,
    /Cannot assign a string to a int/,
  ],
  [
    "return outside function",
    `let x = 5
     return x`,
    /Return can only appear in a function/,
  ],
  [
    "yield outside loop",
    `define generateNumber() then
       yield 42
     generateNumber()`,
    /Yield can only appear in a loop/,
  ],
  [
    "invalid operands for comparison",
    `compare 1 to true`,
    /Operands do not have the same type/,
  ],
  [
    "multiple variable declarations",
    `let x = 5
     let y = 10
     let z = x + y
     print z`,
  ],
  [
    "function with multiple parameters",
    `define add(a, b) then
       return a + b
     print add(3, 7)`,
  ],
  [
    "nested predictive loops",
    `for i in predictive_range(1, 5, prime) then
       for j in predictive_range(1, 3, fibonacci) then
         print i * j`,
  ],
  [
    "complex binary expressions",
    `let x = (10 + 5) * 3 - 8 / 2
     print x`,
  ],
  [
    "function with conditional return",
    `define isEven(n) then
       if n % 2 == 0 then
         return true
       else
         return false
     print isEven(4)`,
  ],
  [
    "recursive function call",
    `define factorial(n) then
       if n == 0 then
         return 1
       else
         return n * factorial(n - 1)
     print factorial(5)`,
  ],
  [
    "higher-order function",
    `define applyTwice(func, x) then
       return func(func(x))
     define square(x) then
       return x * x
     print applyTwice(square, 3)`,
  ],
  [
    "closure",
    `define outerFunction() then
       let counter = 0
       define innerFunction() then
         counter = counter + 1
         print counter
       return innerFunction
     let increment = outerFunction()
     increment()
     increment()`,
  ],
  [
    "predictive loop with complex range",
    `for i in predictive_range(1 + 2, 10 * 2, prime) then
       print i`,
  ],
  [
    "logical operators",
    `let x = true
     let y = false
     let z = x and y
     print z`,
  ],
  [
    "short-circuiting logical operators",
    `define isDivisibleBy(n, d) then
       return n % d == 0
     let x = 10
     if isDivisibleBy(x, 2) or isDivisibleBy(x, 3) then
       print "Divisible by 2 or 3"
     else
       print "Not divisible by 2 or 3"`,
  ],
  [
    "nested comparison statements",
    `let x = 5
     let y = 10
     let z = 7
     compare x to y
     compare y to z`,
  ],
  [
    "optional parameters",
    `define greet(name, greeting = "Hello") then
       print greeting + ", " + name
     greet("Alice")
     greet("Bob", "Hi")`,
  ],
  [
    "default parameter values",
    `define multiply(a, b = 2) then
       return a * b
     print multiply(5)
     print multiply(5, 3)`,
  ],
  [
    "predictive loop with no pattern",
    `for i in predictive_range(1, 5) then
       print i`,
  ],
  [
    "undeclared variable in binary expression",
    `let result = x + 5`,
    /Identifier x not declared/,
  ],
  [
    "misused natural language keyword in function body",
    `define greet(name) then
       print "Hello, " + nombre`,
    /Identifier nombre not declared/,
  ],
  [
    "invalid binary expression operands with variables",
    `let x = 5
     let y = "hello"
     let result = x + y`,
    /Expected a number/,
  ],
  [
    "redeclared variable in function",
    `define test() then
       let x = 5
       let x = 10`,
    /Identifier x already declared/,
  ],
  [
    "undefined function call in binary expression",
    `let result = square(5) + 1`,
    /Identifier square not declared/,
  ],
  [
    "complex binary expression with invalid operands",
    `let x = 5
     let y = "hello"
     let result = (x * 2) + (y / 3)`,
    /Expected a number/,
  ],
  [
    "logical operators with invalid operands",
    `let x = 5
     let y = "hello"
     let result = x and y`,
    /Expected a boolean/,
  ],
];
// Add more error checks as needed for your language features

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

  it("produces the expected representation for variable declaration and usage", () => {
    const source = `let x = 5
                  print x`;
    const ast = parse(source);
    const analyzedAst = analyze(ast);
    assert.deepEqual(
      analyzedAst,
      program([
        assignmentStatement(variable("x"), numericLiteral(5)),
        printStatement(variable("x")),
      ])
    );
  });

  it("produces the expected representation for function call", () => {
    const source = `define greet(name) then print "Hello " + name\n
                  greet("Alice")`;
    const ast = parse(source);
    const analyzedAst = analyze(ast);
    assert.deepEqual(
      analyzedAst,
      program([
        naturalLanguageFunctionDefinition(
          "greet",
          ["name"],
          printStatement(
            binaryExpression("+", stringLiteral("Hello "), variable("name"))
          )
        ),
        functionCall("greet", [stringLiteral("Alice")]),
      ])
    );
  });

  // Additional specific representation tests as needed...
});
