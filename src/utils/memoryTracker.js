module.exports = function MemoryTracker() {
  this.storage = [];
  this.count = 0;

  this.setStorage = function (start, type) {
    this.count++;

    const newTracking = {
      count: this.count,
      totalMemory: process.memoryUsage().heapTotal,
      usedMemory: process.memoryUsage().heapUsed,
      timeStamp: new Date().getTime(),
      startLine: start,
      type: type,
    };

    this.storage.push(newTracking);
  };

  this.getStorage = function () {
    return this.storage;
  };
};
