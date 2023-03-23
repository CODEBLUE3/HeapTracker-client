const vm = require("vm");
module.exports = function MemoryTracker() {
  this.storage = [];
  this.count = 0;

  this.setStorage = function (codePosition, codeType) {
    this.count++;

    const newTracking = {
      count: this.count,
      totalMemory: process.memoryUsage().heapTotal,
      usedMemory: process.memoryUsage().heapUsed,
      timeStamp: process.hrtime.bigint(),
      codePosition,
      codeType,
    };

    this.storage.push(newTracking);
  };

  this.getStorage = function () {
    return this.storage;
  };

  this.execute = function (code) {
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

    const options = { timeout: 2000 };

    vm.createContext(context);

    return vm.runInNewContext(code, context, options);
  };

  this.extractMemory = function (code, m) {
    const context = {
      console,
      setTimeout,
      setInterval,
      process: {
        exit: () => {
          throw new Error("process.exit() is not allowed");
        },
      },
      m,
    };

    const options = { timeout: 2000 };

    vm.createContext(context);

    return vm.runInNewContext(code, context, options);
  };

  return this;
};
