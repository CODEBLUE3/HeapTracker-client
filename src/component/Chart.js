import React, { useEffect, useState } from "react";
import LineChart from "../utils/msChart";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  font-size: 18px;
  height: 30px;
  width: 100px;
  background-color: ${color.blue};
  margin: 10px;
  border: none;
  border-radius: ${style.borderRadius};
`;

const Controller = styled.div`
  display: flex;
`;

export default function Chart() {
  const [chart, setChart] = useState();

  useEffect(() => {
    setChart(new LineChart("lineChart", 5000));
  }, []);

  function handleChartPlay() {
    chart.playback();
  }

  function handleChartPause() {
    chart.pause();
  }

  function handleChartStop() {
    chart.stop();
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
