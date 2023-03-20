import React, { useState, useEffect } from "react";

import Chart from "../component/Chart";
import ChartResult from "../component/ChartResult";

export default function OutputResult() {
  const [chartData, setChartData] = useState();

  const setMemoryArray = (data) => {
    setChartData(data);
  };

  useEffect(() => {
    window.electronAPI.executeHeapTrackerReply(setMemoryArray);
  }, []);

  return (
    <>
      <Chart data={chartData} />
      <ChartResult data={chartData} />
    </>
  );
}
