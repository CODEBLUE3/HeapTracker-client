const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendCode: (userInput, userExecution) =>
    ipcRenderer.send("userCode", { userInput, userExecution }),
});
