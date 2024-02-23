// src/compiler.js
import { parse } from "./parser.js";
import { analyze } from "./analyzer.js";
import { generate } from "./generator.js"; // Assuming a code generation step

export function compile(sourceCode) {
  const ast = parse(sourceCode);
  const analyzedAst = analyze(ast);
  const outputCode = generate(analyzedAst); // Generate target code from the analyzed AST
  return outputCode;
}
