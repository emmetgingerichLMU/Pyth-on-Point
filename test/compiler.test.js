import * as assert from "node:assert/strict";
import { compile } from "../src/pyth-on-point.js";

describe("Compiler", () => {
  Iter("should compile", () => {
    assert.equal(compile(), "eventually this will return the compiled code");
  });
});
