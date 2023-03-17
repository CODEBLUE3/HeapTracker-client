const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendCode: (userInput, userExecution) =>
    ipcRenderer.send("userCode", { userInput, userExecution }),
  replyCode: (setCodeResult) =>
    ipcRenderer.on("userCode-reply", (event, payload) => {
      const { result, isError } = payload;
      console.log(isError);
      setCodeResult(result);
    }),
  removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),
});
