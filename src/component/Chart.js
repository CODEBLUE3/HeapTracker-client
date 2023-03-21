import React, { useEffect, useState } from "react";
import LineChart from "../utils/msChart";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const CHART_DURATION_TIME = 30000;

const ChartControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  font-size: ${style.controlButtonSize};
  height: 30px;
  width: 100px;
  background-color: ${color.defaultButton};
  margin: ${style.controlButtonMargin};
  border: none;
  border-radius: ${style.borderRadius};
`;

const Controller = styled.div`
  display: flex;
  justify-content: center;
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
      <canvas id="lineChart" width="550px" height="400px"></canvas>
      <Controller>
        <ChartControlButton onClick={handleChartPlay}>시작</ChartControlButton>
        <ChartControlButton onClick={handleChartPause}>
          일시정지
        </ChartControlButton>
        <ChartControlButton onClick={handleChartStop}>종료</ChartControlButton>
      </Controller>
    </>
  );
}
