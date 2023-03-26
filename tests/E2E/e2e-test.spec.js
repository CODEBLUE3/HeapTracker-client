// @ts-check
const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

test.describe("e2e test", () => {
  let page;

  test("launch app", async () => {
    const electronApp = await electron.launch({
      args: [__dirname + "/../../src/electron/main.js"],
    });

    page = await electronApp.firstWindow();
    const title = await page.title();
    expect(title).toBe("Heap Tracker");

    await page.locator("execute-button", { hasText: "실행" });
    await page.locator("code-result", { hasText: "ready" });
    await page.locator("code-result", { hasText: "ready" });

    await page.locator("start-button", { hasText: "시작" });
    await page.locator("pause-button", { hasText: "일시정지" });
    await page.locator("stop-button", { hasText: "종료" });

    await page.locator("memory-duration", { hasText: "0 us" });
    await page.locator("memory-max", { hasText: "0 bytes" });
    await page.locator("memory-min", { hasText: "0 bytes" });
    await page.locator("memory-used", { hasText: "0 bytes" });
    await page.locator("memory-count", { hasText: "0" });

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

    await page.locator("code-result", { hasText: "4" });

    const duration = await page.getByTestId("memory-duration").textContent();
    expect(Number(duration?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);
    const max = await page.getByTestId("memory-duration").textContent();
    expect(Number(max?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);
    const min = await page.getByTestId("memory-duration").textContent();
    expect(Number(min?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);
    const used = await page.getByTestId("memory-duration").textContent();
    expect(Number(used?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);
    const count = await page.getByTestId("memory-duration").textContent();
    expect(Number(count?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);

    await page.getByTestId("start-button").click();
    await page.getByTestId("pause-button").click();
    await page.getByTestId("stop-button").click();

    await electronApp.close();
  });
});
