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
};
