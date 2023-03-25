import { expect, test } from "@jest/globals";
const MemoryTracker = require("../../src/utils/MemoryTracker.js");
const { getMemoryTrackingCode } = require("../../src/utils/CodeParser");

test("MemoryTracker execute", () => {
  const usercode = `function add(a, b) {
    const result = a + b;
    return result;
  }
  add(1,2)`;

  expect(new MemoryTracker().execute(usercode)).toBe(3);
});

test("MemoryTracker extractMemory", () => {
  const usercode = `function add(a, b) {
        const result = a + b;
        return result;
      }
      add(1,2)`;

  const code = getMemoryTrackingCode(usercode);
  const memoryTracker = new MemoryTracker();
  const insertFunction = memoryTracker.setStorage.bind(memoryTracker);

  expect(memoryTracker.extractMemory(code, insertFunction)).toBe(3);
  expect(memoryTracker.getStorage()).toBeTruthy();
});
