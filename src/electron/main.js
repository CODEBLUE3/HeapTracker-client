const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const vm = require("vm");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
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

ipcMain.on("userCode", (event, payload) => {
  //사용자에게 받은 코드
  const { userInput, userExecution } = payload;

  const result = userInput + userExecution;

  event.reply("userCode-reply", result);
});
