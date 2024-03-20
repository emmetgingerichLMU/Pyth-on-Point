import * as fs from "node:fs";
import * as ohm from "ohm-js";

// // Define the PythOnPoint grammar
// const PythOnPointGrammar = ohm.grammar(`
// PythOnPoint {
//   Program         = Statement+
//   Statement       = AutoHealingStatement
//                    | NaturalLanguageFunctionDefinition
//                    | PredictiveLoop
//                    | ComparisonStatement
//                    | (AnyOtherStatement)*
//                    | "\\n"
//   AutoHealingStatement = number:String "/" number:String -- division
//                        | (AnyOtherOperation)*
//   NaturalLanguageFunctionDefinition
//                    = "define" "\\""\\"" FunctionName "(" Parameters ")" "then" FunctionBody "\\""\\""
//   PredictiveLoop  = "for" Variable "in" PredictiveRange "(" RangeParams ")" "{" LoopBody "}"
//   ComparisonStatement = "compare" Expression "to" Expression
//   FunctionName    = letter+
//   Parameters      = Parameter ("," Parameter)*
//   Parameter       = Variable
//   FunctionBody    = Statement+
//   PredictiveRange = "predictive_range"
//   RangeParams     = Number "," Number "," "pattern" "=" PatternType
//   PatternType     = "\\""\\"" ("prime" | AnyOtherPattern) "\\""\\""
//   LoopBody        = Statement+
//   Expression      = Number
//                    | String
//                    | Variable
//                    | "(" Expression ")"
//                    | Expression BinaryOp Expression
//   Number          = digit+
//   String          = "\\""\\"" letter+ "\\""\\""
//   Variable        = letter+
//   BinaryOp        = "+" | "-" | "*" | "/" | "and" | "or"
//   AnyOtherStatement = (letter | digit | punctuation | space)+
//   AnyOtherOperation = (letter | digit | punctuation | space)+
//   AnyOtherPattern   = (letter | digit | punctuation | space)+
// }
// `);

const PythOnPointGrammar = ohm.grammar(
  fs.readFileSync("./src/pyth-on-point.ohm")
);

export function parse(input) {
  const match = PythOnPointGrammar.match(input);
  if (match.succeeded()) {
    console.log("Match succeeded!");
    return match;
  } else {
    console.error("Match failed:", match.message);
    return null;
  }
}
