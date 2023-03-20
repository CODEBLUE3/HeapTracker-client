import React, { useState, useEffect } from "react";

import Chart from "../component/Chart";
import ChartResult from "../component/ChartResult";

export default function OutputResult() {
  const [chartData, setChartData] = useState();
  const [chartResult, setChartResult] = useState({});

  const setMemoryArray = (data) => {
    if (data.result.length > 0) {
      let minMemory = Infinity;
      let maxMemory = 0;

      data.result.forEach((element) => {
        minMemory = Math.min(minMemory, element.usedMemory);
        maxMemory = Math.max(maxMemory, element.usedMemory);
      });

      setChartResult({
        duration: data.result.at(-1).timeStamp - data.result.at(0).timeStamp,
        minMemory: minMemory,
        maxMemory: maxMemory,
        count: data.result.length,
      });

      setChartData(data);
    }
  };

  useEffect(() => {
    window.electronAPI.executeHeapTrackerReply(setMemoryArray);
  }, []);

  return (
    <>
      <Chart data={chartData} />
      <ChartResult resultData={chartResult} />
    </>
  );
}
