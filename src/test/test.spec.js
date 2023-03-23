import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import { _electron as electron } from "playwright";
import { expect, test } from "@playwright/test";

let electronApp;
let window;

test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild();
  // parse the packaged Electron app and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  electronApp = await electron.launch({
    args: [appInfo.main], // main file from package.json
    executablePath: appInfo.executable, // path to the Electron executable
  });
  window = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test("example test", async () => {
  const title = await window.title();
  expect(title).toBe("Heap Tracker");
});

test("example test2", async () => {
  await window.getByRole("button", { name: "실행" }).click();
});
