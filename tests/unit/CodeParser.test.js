import { expect, test } from "@jest/globals";
import CodeParser from "../../src/utils/codeParser";

const usercode = `function add(a, b) {
  const result = a + b;
  return result;
}`;

describe("CodeParser util test", () => {
  test("CodeParser getMemoryTrackingCode test", () => {
    expect(CodeParser.getMemoryTrackingCode(usercode)).toContain("m(");
  });

  test("CodeParser getPositionCodeInfo test", () => {
    expect(CodeParser.getPositionCodeInfo(usercode, 31)).toBeTruthy();
  });

  test("CodeParser getPositionCodeInfo error test", () => {
    expect(CodeParser.getPositionCodeInfo(usercode, 23)).toBeNull();
  });
});
