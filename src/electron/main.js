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
  const { userInput, userExecution } = payload;
  const targetCode = userInput + userExecution;
  const context = {
    console,
    setTimeout,
    setInterval,
    process: {
      exit: () => {
        throw new Error("process.exit() is not allowed");
      },
    },
  };
  const options = {
    timeout: 2000,
  };
  let result;
  let isError = false;

  vm.createContext(context);

  try {
    result = vm.runInNewContext(targetCode, context, options);
  } catch (errer) {
    result = errer.message;
    isError = true;
  }

  event.reply("userCode-reply", { result, isError });
});
