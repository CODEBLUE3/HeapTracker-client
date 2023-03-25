// @ts-check
const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

let page;

test.describe("e2e test", () => {
  test("launch app", async () => {
    const electronApp = await electron.launch({
      args: [__dirname + "/../src/electron/main.js"],
    });

    page = await electronApp.firstWindow();
    const title = await page.title();
    expect(title).toBe("Heap Tracker");

    await page
      .locator("div")
      .filter({ hasText: /^함수 코드91›$/ })
      .getByRole("textbox").fill(`function add(a, b) {
          const result = a + b;
          return result;
        }`);

    await page
      .locator("div")
      .filter({ hasText: /^함수실행 코드91›$/ })
      .getByRole("textbox")
      .fill(`add(1,3);`);

    await page.getByRole("button", { name: "실행" }).click();

    await electronApp.close();
  });
});
