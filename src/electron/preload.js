const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendCode: (userInput, userExecution) =>
    ipcRenderer.send("userCode", { userInput, userExecution }),
  replayCode: (setCodeResult) =>
    ipcRenderer.on("userCode-reply", (event, payload) => {
      setCodeResult(payload);
    }),
  removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),
});
