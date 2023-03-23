import { expect, test } from "@jest/globals";
const CodeParser = require("../utils/CodeParser.js");

test("Code parser", () => {
  const usercode = `function add(a, b) {
    const result = a + b;
    return result;
  }`;

  expect(CodeParser.getMemoryTrackingCode(usercode)).toContain("m(");
});
