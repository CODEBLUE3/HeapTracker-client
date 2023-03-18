import React, { useEffect, useState } from "react";
import LineChart from "../utils/msChart";
import styled from "styled-components";

const CHART_DURATION_TIME = 5000;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  font-size: 18px;
  height: 30px;
  width: 100px;
  background-color: #1e90ff;
  margin: 10px;
  border: none;
  border-radius: 20px;
`;

const Controller = styled.div`
  display: flex;
`;

export default function Chart() {
  const [chart, setChart] = useState();

  const setMemoryArray = (datas) => {
    setChart(new LineChart("lineChart", datas.result, CHART_DURATION_TIME));
  };

  useEffect(() => {
    window.electronAPI.executeHeapTrackerReply(setMemoryArray);
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
      <canvas id="lineChart" width="400px" height="300px"></canvas>
      <Controller>
        <Button onClick={handleChartPlay}>시작</Button>
        <Button onClick={handleChartPause}>일시정지</Button>
        <Button onClick={handleChartStop}>종료</Button>
      </Controller>
    </>
  );
}
