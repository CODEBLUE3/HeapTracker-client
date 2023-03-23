import React, { useEffect, useState } from "react";
import LineChart from "../utils/LineChart";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";
import { useSelector } from "react-redux";

const CHART_DURATION_TIME = 10000;

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

export default function Chart() {
  const [chart, setChart] = useState();
  const memoryData = useSelector(
    (state) => state.heapMemory.heapMemoryData.result,
  );

  useEffect(() => {
    if (!memoryData) return;

    chart.setData(memoryData, CHART_DURATION_TIME);
  }, [memoryData]);

  useEffect(() => {
    setChart(new LineChart("lineChart"));
  }, []);

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
