// @ts-check
const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

let page;

test("launch app", async () => {
  const electronApp = await electron.launch({
    args: [__dirname + "/../../src/electron/main.js"],
  });

  page = await electronApp.firstWindow();
  const title = await page.title();
  expect(title).toBe("Heap Tracker");

  // close app
  await electronApp.close();
});
