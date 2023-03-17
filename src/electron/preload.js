const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  validateUserCode: (userInput, userExecution) =>
    ipcRenderer.send("userCode", { userInput, userExecution }),
  getCodeResult: (codeResult) =>
    ipcRenderer.on("codeResult", (event, payload) => codeResult(payload)),
  executeHeapTracker: (userInput, userExecution) =>
    ipcRenderer.send("heapTracker", { userInput, userExecution }),
  getTrackingArray: (trackingResult) =>
    ipcRenderer.on("trackingResult", (event, payload) =>
      trackingResult(payload),
    ),
  removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),
});
