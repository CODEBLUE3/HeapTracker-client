const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { getMemoryTrackingCode } = require("../utils/CodeParser");
const MemoryTracker = require("../utils/MemoryTracker");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 780,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("validateUserCode", (event, payload) => {
  const { userInput, userExecution } = payload;
  const targetCode = userInput + userExecution;

  let result;
  let isError = false;

  try {
    result = new MemoryTracker().execute(targetCode);
  } catch (error) {
    result = error.message;
    isError = true;
  }

  event.reply("validateUserCodeReply", { result, isError });
});

ipcMain.on("executeHeapTracker", (event, payload) => {
  const { userInput, userExecution } = payload;

  const targetCode = getMemoryTrackingCode(userInput) + userExecution;
  const memoryTracker = new MemoryTracker();
  const insertFunction = memoryTracker.setStorage.bind(memoryTracker);

  let result;
  let isError = false;

  try {
    memoryTracker.extractMemory(targetCode, insertFunction);
    result = memoryTracker.getStorage();
  } catch (errer) {
    result = errer.message;
    isError = true;
  }

  event.reply("executeHeapTrackerReply", { result, isError });
});
