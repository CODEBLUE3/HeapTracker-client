import React, { useState, useEffect } from "react";

import Chart from "../component/Chart";
import ChartResult from "../component/ChartResult";
import { chartMock } from "../mock/chartMock";

export default function OutputResult() {
  const [chartData, setChartData] = useState();

  useEffect(() => {
    setChartData(chartMock);
  }, []);

  return (
    <>
      <Chart data={chartData} />
      <ChartResult data={chartData} />
    </>
  );
}
