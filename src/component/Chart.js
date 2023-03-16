import React, { useEffect, useState } from "react";
import LineChart from "../utils/msChart";

export default function Chart() {
  const [chart, setChart] = useState();

  useEffect(() => {
    setChart(new LineChart("lineChart", 5));
  }, []);

  return <canvas id="lineChart" width="400px" height="300px"></canvas>;
}
