import { expect, test } from "@jest/globals";
const MemoryTracker = require("../../src/utils/MemoryTracker.js");

describe("MemoryTracker", () => {
  test("setStorage", () => {
    const codePosition = 10;
    const codeType = "variable";

    const memoryTracker = new MemoryTracker();

    memoryTracker.setStorage(codePosition, codeType);

    const storage = memoryTracker.getStorage();

    expect(storage[0].count).toBe(1);
    expect(storage[0].codePosition).toBe(codePosition);
    expect(storage[0].codeType).toBe(codeType);
  });

  test("execute", () => {
    const usercode = `function add(a, b) {
      const result = a + b;
      return result;
    }
    add(1,2)`;

    expect(new MemoryTracker().execute(usercode)).toBe(3);
  });

  test("extractMemory", () => {
    const code = `function add(a, b) {
      const result = a + b;m()
      return result;
    }
    m()
    add(1,2)`;
    const m = () => {};

    const memoryTracker = new MemoryTracker();

    expect(memoryTracker.extractMemory(code, m)).toBe(3);
  });
});
