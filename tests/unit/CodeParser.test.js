import { expect, test } from "@jest/globals";
import CodeParser from "../../src/utils/codeParser";

test("Code parser", () => {
  const usercode = `function add(a, b) {
    const result = a + b;
    return result;
  }`;

  expect(CodeParser.getMemoryTrackingCode(usercode)).toContain("m(");
});
