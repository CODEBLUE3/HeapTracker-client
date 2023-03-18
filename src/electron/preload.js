const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  validateUserCode: (userInput, userExecution) =>
    ipcRenderer.send("validateUserCode", { userInput, userExecution }),
  validateUserCodeReply: (codeValidateResult) =>
    ipcRenderer.on("validateUserCodeReply", (event, payload) =>
      codeValidateResult(payload),
    ),
  executeHeapTracker: (userInput, userExecution) =>
    ipcRenderer.send("executeHeapTracker", { userInput, userExecution }),
  executeHeapTrackerReply: (heapTrackingResult) =>
    ipcRenderer.on("executeHeapTrackerReply", (event, payload) =>
      heapTrackingResult(payload),
    ),
  removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),
});
