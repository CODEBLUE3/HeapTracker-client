import React, { useEffect, useState } from "react";
import LineChart from "../utils/msChart";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const CHART_DURATION_TIME = 6000;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  font-size: 18px;
  height: 30px;
  width: 100px;
  background-color: ${color.defaultButton};
  margin: 10px;
  border: none;
  border-radius: ${style.borderRadius};
`;

const Controller = styled.div`
  display: flex;
`;

export default function Chart({ data }) {
  const [chart, setChart] = useState();

  useEffect(() => {
    if (!data) {
      return;
    }
    setChart(new LineChart("lineChart", data.result, CHART_DURATION_TIME));
  }, [data]);

  function handleChartPlay() {
    if (chart) {
      chart.playback();
    }
  }

  function handleChartPause() {
    if (chart) {
      chart.pause();
    }
  }

  function handleChartStop() {
    if (chart) {
      chart.stop();
    }
  }

  return (
    <>
      <canvas id="lineChart" width="400px" height="300px"></canvas>
      <div id="chartModal"></div>
      <Controller>
        <Button onClick={handleChartPlay}>시작</Button>
        <Button onClick={handleChartPause}>일시정지</Button>
        <Button onClick={handleChartStop}>종료</Button>
      </Controller>
    </>
  );
}
