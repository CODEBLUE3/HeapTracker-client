import React, { useEffect, useState } from "react";
import useInterval from "../hooks/useInterval";
import LineChart from "../utils/msChart";
//import styled from "styled-components";

function Chart() {
  const [chart, setChart] = useState();

  useInterval(() => {
    //일단 max가 100이라 랜덤 100으로 설정
    //데이터가 들어오는 곳
    chart.updateData([Date.now(), Math.random() * 100]);
  }, 1000);

  useEffect(() => {
    setChart(new LineChart("lineChart"));
  }, []);

  return <canvas id="lineChart" width="400px" height="300px"></canvas>;
}

export default Chart;
