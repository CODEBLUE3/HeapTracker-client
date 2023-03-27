// @ts-check
const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

let electronApp;
let page;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [__dirname + "/../../src/electron/main.js"],
  });
  page = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test.describe("e2e test", () => {
  test("페이지의 이름이 Heap Tracker입니다", async () => {
    const title = await page.title();
    expect(title).toBe("Heap Tracker");
  });

  test("코드 실행 결과 창이 초기화 되어있습니다", async () => {
    await page.locator("execute-button", { hasText: "실행" });
    await page.locator("code-result", { hasText: "ready" });

    await page.locator("start-button", { hasText: "시작" });
    await page.locator("pause-button", { hasText: "일시정지" });
    await page.locator("stop-button", { hasText: "종료" });

    await page.locator("memory-duration", { hasText: "0 us" });
    await page.locator("memory-max", { hasText: "0 bytes" });
    await page.locator("memory-min", { hasText: "0 bytes" });
    await page.locator("memory-used", { hasText: "0 bytes" });
    await page.locator("memory-count", { hasText: "0" });
  });

  test("유저에게 입력받은 함수와 실행문의 결과 값이 랜더링 됩니다", async () => {
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
  });

  test("코드 실행 결과 창에 값이 입력되었을 때, 렌더링 됩니다", async () => {
    const duration = await page.getByTestId("memory-duration").textContent();
    expect(Number(duration?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);

    const max = await page.getByTestId("memory-max").textContent();
    expect(Number(max?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);

    const min = await page.getByTestId("memory-min").textContent();
    expect(Number(min?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);

    const used = await page.getByTestId("memory-used").textContent();
    expect(Number(used?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);

    const count = await page.getByTestId("memory-count").textContent();
    expect(Number(count?.replace(/[^0-9]/g, ""))).toBeGreaterThan(1);
  });

  /**
   * FIX: 추후 논의 후 테스트 코드 작성 필요
   */

  test("시작 버튼을 클릭하면 차트가 재생됩니다", async () => {
    await page.getByTestId("start-button").click();
  });

  test("일시정지 버튼을 클릭하면 차트가 멈춥니다", async () => {
    await page.getByTestId("pause-button").click();
  });

  test("차트 노드에 hover 이벤트가 일어납니다", async () => {});

  test("모달이 생성됩니다", async () => {
    await page.locator("chartModal", { hasText: 0 });
  });

  test("종료 버튼을 클릭하면 차트가 초기화 됩니다", async () => {
    await page.getByTestId("stop-button");
  });
});
