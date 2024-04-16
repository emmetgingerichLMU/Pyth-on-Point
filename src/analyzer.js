import * as core from "./core.js";

// A few declarations to save typing
const INT = core.intType;
const FLOAT = core.floatType;
const STRING = core.stringType;
const BOOLEAN = core.boolType;
const ANY = core.anyType;
const VOID = core.voidType;

class Context {
  // Like most statically-scoped languages, Carlos contexts will contain a
  // map for their locally declared identifiers and a reference to the parent
  // context. The parent of the global context is null. In addition, the
  // context records whether analysis is current within a loop (so we can
  // properly check break statements), and reference to the current function
  // (so we can properly check return statements).
  constructor({
    parent = null,
    locals = new Map(),
    inLoop = false,
    function: f = null,
  }) {
    Object.assign(this, { parent, locals, inLoop, function: f });
  }
  add(name, entity) {
    this.locals.set(name, entity);
  }
  lookup(name) {
    return this.locals.get(name) || this.parent?.lookup(name);
  }
  static root() {
    return new Context({
      locals: new Map(Object.entries(core.standardLibrary)),
    });
  }
  newChildContext(props) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() });
  }
}

export default function analyze(match) {
  // Track the context manually via a simple variable. The initial context
  // contains the mappings from the standard library. Add to this context
  // as necessary. When needing to descent into a new scope, create a new
  // context with the current context as its parent. When leaving a scope,
  // reset this variable to the parent context.
  let context = Context.root();

  // The single gate for error checking. Pass in a condition that must be true.
  // Use errorLocation to give contextual information about the error that will
  // appear: this should be an object whose "at" property is a parse tree node.
  // Ohm's getLineAndColumnMessage will be used to prefix the error message. This
  // allows any semantic analysis errors to be presented to an end user in the
  // same format as Ohm's reporting of syntax errors.
  function must(condition, message, errorLocation) {
    if (!condition) {
      const prefix = errorLocation.at.source.getLineAndColumnMessage();
      throw new Error(`${prefix}${message}`);
    }
  }

  // Next come a number of carefully named utility functions that keep the
  // analysis code clean and readable. Without these utilities, the analysis
  // code would be cluttered with if-statements and error messages. Each of
  // the utilities accept a parameter that should be an object with an "at"
  // property that is a parse tree node. This is used to provide contextual
  // information in the error message.

  function mustNotAlreadyBeDeclared(name, at) {
    must(!context.lookup(name), `Identifier ${name} already declared`, at);
  }

  function mustHaveBeenFound(entity, name, at) {
    must(entity, `Identifier ${name} not declared`, at);
  }

  function mustHaveNumericType(e, at) {
    must([INT, FLOAT].includes(e.type), "Expected a number", at);
  }

  function mustHaveNumericOrStringType(e, at) {
    must(
      [INT, FLOAT, STRING].includes(e.type),
      "Expected a number or string",
      at
    );
  }

  function mustHaveBooleanType(e, at) {
    must(e.type === BOOLEAN, "Expected a boolean", at);
  }

  function mustHaveIntegerType(e, at) {
    must(e.type === INT, "Expected an integer", at);
  }

  function mustHaveAnArrayType(e, at) {
    must(e.type?.kind === "ArrayType", "Expected an array", at);
  }

  function mustHaveAnOptionalType(e, at) {
    must(e.type?.kind === "OptionalType", "Expected an optional", at);
  }

  function mustHaveAStructType(e, at) {
    must(e.type?.kind === "StructType", "Expected a struct", at);
  }

  function mustHaveAnOptionalStructType(e, at) {
    // Used to check e?.x expressions, e must be an optional struct
    must(
      e.type?.kind === "OptionalType" && e.type.baseType?.kind === "StructType",
      "Expected an optional struct",
      at
    );
  }

  function mustBothHaveTheSameType(e1, e2, at) {
    must(
      equivalent(e1.type, e2.type),
      "Operands do not have the same type",
      at
    );
  }

  function mustAllHaveSameType(expressions, at) {
    // Used to check the elements of an array expression, and the two
    // arms of a conditional expression, among other scenarios.
    must(
      expressions
        .slice(1)
        .every((e) => equivalent(e.type, expressions[0].type)),
      "Not all elements have the same type",
      at
    );
  }

  function mustBeAType(e, at) {
    // This is a rather ugly hack
    must(e?.kind.endsWith("Type"), "Type expected", at);
  }

  function mustBeAnArrayType(t, at) {
    must(t?.kind === "ArrayType", "Must be an array type", at);
  }

  function includesAsField(structType, type) {
    // Whether the struct type has a field of type type, directly or indirectly
    return structType.fields.some(
      (field) =>
        field.type === type ||
        (field.type?.kind === "StructType" && includesAsField(field.type, type))
    );
  }

  function mustNotBeSelfContaining(structType, at) {
    const containsSelf = includesAsField(structType, structType);
    must(!containsSelf, "Struct type must not be self-containing", at);
  }

  function equivalent(t1, t2) {
    return (
      t1 === t2 ||
      (t1?.kind === "OptionalType" &&
        t2?.kind === "OptionalType" &&
        equivalent(t1.baseType, t2.baseType)) ||
      (t1?.kind === "ArrayType" &&
        t2?.kind === "ArrayType" &&
        equivalent(t1.baseType, t2.baseType)) ||
      (t1?.kind === "FunctionType" &&
        t2?.kind === "FunctionType" &&
        equivalent(t1.returnType, t2.returnType) &&
        t1.paramTypes.length === t2.paramTypes.length &&
        t1.paramTypes.every((t, i) => equivalent(t, t2.paramTypes[i])))
    );
  }

  function assignable(fromType, toType) {
    return (
      toType == ANY ||
      equivalent(fromType, toType) ||
      (fromType?.kind === "FunctionType" &&
        toType?.kind === "FunctionType" &&
        // covariant in return types
        assignable(fromType.returnType, toType.returnType) &&
        fromType.paramTypes.length === toType.paramTypes.length &&
        // contravariant in parameter types
        toType.paramTypes.every((t, i) =>
          assignable(t, fromType.paramTypes[i])
        ))
    );
  }

  function typeDescription(type) {
    switch (type.kind) {
      case "IntType":
        return "int";
      case "FloatType":
        return "float";
      case "StringType":
        return "string";
      case "BoolType":
        return "boolean";
      case "VoidType":
        return "void";
      case "AnyType":
        return "any";
      case "StructType":
        return type.name;
      case "FunctionType":
        const paramTypes = type.paramTypes.map(typeDescription).join(", ");
        const returnType = typeDescription(type.returnType);
        return `(${paramTypes})->${returnType}`;
      case "ArrayType":
        return `[${typeDescription(type.baseType)}]`;
      case "OptionalType":
        return `${typeDescription(type.baseType)}?`;
    }
  }

  function mustBeAssignable(e, { toType: type }, at) {
    const message = `Cannot assign a ${typeDescription(
      e.type
    )} to a ${typeDescription(type)}`;
    must(assignable(e.type, type), message, at);
  }

  function mustNotBeReadOnly(e, at) {
    must(!e.readOnly, `Cannot assign to constant ${e.name}`, at);
  }

  function mustHaveDistinctFields(type, at) {
    const fieldNames = new Set(type.fields.map((f) => f.name));
    must(fieldNames.size === type.fields.length, "Fields must be distinct", at);
  }

  function mustHaveMember(structType, field, at) {
    must(
      structType.fields.map((f) => f.name).includes(field),
      "No such field",
      at
    );
  }

  function mustBeInLoop(at) {
    must(context.inLoop, "Yield can only appear in a loop", at);
  }

  function mustBeInAFunction(at) {
    must(context.function, "Return can only appear in a function", at);
  }

  function mustBeCallable(e, at) {
    const callable =
      e?.kind === "StructType" || e.type?.kind === "FunctionType";
    must(callable, "Call of non-function or non-constructor", at);
  }

  function mustNotReturnAnything(f, at) {
    must(f.type.returnType === VOID, "Something should be returned", at);
  }

  function mustReturnSomething(f, at) {
    must(
      f.type.returnType !== VOID,
      "Cannot return a value from this function",
      at
    );
  }

  function mustBeReturnable(e, { from: f }, at) {
    mustBeAssignable(e, { toType: f.type.returnType }, at);
  }

  function mustHaveCorrectArgumentCount(argCount, paramCount, at) {
    const message = `${paramCount} argument(s) required but ${argCount} passed`;
    must(argCount === paramCount, message, at);
  }

  const builder = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(statements) {
      return core.program(statements.children.map((s) => s.rep()));
    },

    FunctionStatement(functionName, _open, args, _close) {
      const funName = functionName.sourceString;
      const fun = context.lookup(funName);
      mustHaveBeenFound(fun, funName, { at: functionName });
      mustBeCallable(fun, { at: functionName });
      const argReps = args.asIteration().children.map((a) => a.rep());
      if (fun.kind === "Function") {
        mustHaveCorrectArgumentCount(
          argReps.length,
          fun.type.paramTypes.length,
          {
            at: args,
          }
        );
        argReps.forEach((arg, i) => {
          mustBeAssignable(
            arg,
            { toType: fun.type.paramTypes[i] },
            { at: args }
          );
        });
        return core.callExpression(fun, argReps);
      } else {
        // Handle struct constructor calls if necessary
        // ...
      }
    },

    _iter(...children) {
      return children.map((child) => child.rep());
    },

    functionName(name) {
      return name.sourceString;
    },

    NaturalLanguageFunctionDefinition(
      _define,
      functionName,
      _open,
      parameters,
      _close,
      _then,
      functionBody
    ) {
      const name = functionName.sourceString;
      const fun = core.fun(name);
      mustNotAlreadyBeDeclared(name, { at: functionName });
      context.add(name, fun);

      context = context.newChildContext({ inLoop: false, function: fun });
      const paramNames = parameters
        .asIteration()
        .children.map((p) => p.sourceString);
      paramNames.forEach((paramName) => {
        const param = core.variable(paramName);
        context.add(paramName, param);
      });

      const body = functionBody.rep();
      context = context.parent;

      fun.paramNames = paramNames;
      fun.body = body;

      return core.naturalLanguageFunctionDefinition(
        name,
        paramNames,
        body,
        fun
      );
    },
    PredictiveLoop(
      _for,
      variable,
      _in,
      _predictiveRangeWithOpenP,
      number1,
      _comma1,
      number2,
      _comma2,
      patternType,
      _closeP,
      _openB,
      loopBody,
      _closeB
    ) {
      mustNotAlreadyBeDeclared(variable.sourceString, { at: variable });
      const low = { value: Number(number1.sourceString), type: INT };
      const high = { value: Number(number2.sourceString), type: INT };
      mustHaveIntegerType(low, { at: number1 });
      mustHaveIntegerType(high, { at: number2 });
      const iterator = core.variable(variable.sourceString, INT, true);
      context = context.newChildContext({ inLoop: true });
      context.add(variable.sourceString, iterator);
      const body = loopBody.rep();
      context = context.parent;
      return core.predictiveRange(iterator, low, high, patternType, body);
    },
    ComparisonStatement(_compare, expression1, _to, expression2) {
      const expr1 = expression1.rep();
      const expr2 = expression2.rep();
      return core.comparisonStatement(expr1, expr2);
    },
    PrintStatement(_print, expression) {
      const expr = expression.rep();
      if (expr.kind === "Variable") {
        const varName = expr.name;
        const entity = context.lookup(varName);
        mustHaveBeenFound(entity, varName, { at: expression });
        return core.printStatement(entity);
      } else {
        return core.printStatement(expr);
      }
    },
    ReturnStatement(_return, expression) {
      const expr = expression.rep();
      mustBeInAFunction({ at: _return });
      return core.returnStatement(expr);
    },
    YieldStatement(_yield, expression) {
      const expr = expression.rep();
      mustBeInLoop({ at: _yield });
      return core.yieldStatement(expr);
    },
    FunctionBody(statement) {
      return statement.children.map((s) => s.rep());
    },
    LoopBody(statement) {
      return statement.children.map((s) => s.rep());
    },
    // Define representations for other constructs as necessary.
    // This includes mapping grammar rules for expressions and literals.
    number(_digits) {
      return core.numberLiteral(parseInt(_digits.sourceString, 10), INT);
    },
    string(_open, chars, _close) {
      return core.stringLiteral(chars.sourceString, STRING);
    },
    variable(chars) {
      return chars.sourceString;
    },
    Expression_use(id) {
      const varName = id.sourceString;
      const entity = context.lookup(varName);
      mustHaveBeenFound(entity, varName, { at: id });
      return core.variable(varName);
    },
    VariableDeclaration(_let, id, _equal, expression) {
      const name = id.sourceString;
      mustNotAlreadyBeDeclared(name, { at: id });
      const value = expression.rep();
      const variable = core.variable(name, value.type);
      context.add(name, variable);
      return core.variableDeclaration(variable, value);
    },

    Expression_binary(expression1, op, expression2) {
      const left = expression1.rep();
      const right = expression2.rep();
      const operator = op.sourceString;

      if (
        operator === "+" ||
        operator === "-" ||
        operator === "*" ||
        operator === "/"
      ) {
        if (
          operator === "+" &&
          (left.type === STRING || right.type === STRING)
        ) {
          //STRING = String(left) + String(right);
          return core.binaryExpression(operator, left, right, STRING);
        } else {
          if (left.kind === "Variable") {
            console.log("TYPE AND KIND OF STRING::", left.type, left.kind);
            const varName = left.name;
            const entity = context.lookup(varName);
            mustHaveBeenFound(entity, varName, { at: expression1 });
            mustHaveNumericType(entity, { at: expression1 });
          } else {
            mustHaveNumericType(left, { at: expression1 });
          }
          if (right.kind === "Variable") {
            const varName = right.name;
            const entity = context.lookup(varName);
            mustHaveBeenFound(entity, varName, { at: expression2 });
            mustHaveNumericType(entity, { at: expression2 });
          } else {
            mustHaveNumericType(right, { at: expression2 });
          }
          const resultType =
            left.type === INT && right.type === INT ? INT : FLOAT;
          return core.binaryExpression(operator, left, right, resultType);
        }
      } else if (operator === "and" || operator === "or") {
        mustHaveBooleanType(left, { at: expression1 });
        mustHaveBooleanType(right, { at: expression2 });
        return core.binaryExpression(operator, left, right, BOOLEAN);
      } else {
        throw new Error(`Invalid binary operator: ${operator}`);
      }
    },
    // Continue defining rep operations for other grammar rules as needed.
    Expression_parens(_open, expression, _close) {
      return expression.rep();
    },
  });

  return builder(match).rep();
}
