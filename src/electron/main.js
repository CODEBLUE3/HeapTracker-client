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

  //vm을 실행시키는 context의 설정입니다.
  //설정 시 vm환경에서 사용할 수 있게 됩니다.
  const context = {
    console,
    require,
    process: {
      memoryUsage: process.memoryUsage,
    },
    setTimeout,
  };
  vm.createContext(context);

  let result;
  let isError = false;

  try {
    result = vm.runInNewContext(userInput + userExecution, context);
  } catch (errer) {
    result = errer.message;
    isError = true;
  }

  event.reply("userCode-reply", { result, isError });
});
