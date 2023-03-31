import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { style, lightTheme, darkTheme } from "../styles/styleCode";
import { useSelector, useDispatch } from "react-redux";
import {
  setChartModalData,
  setChartModalStyle,
  hiddenChartModal,
} from "../features/chartModal/chartModalSlice";
import {
  hiddenVariableChartModal,
  setVariableBarModalData,
  setVariableBarModalStyle,
} from "../features/chartModal/variableBarModalSlice";

import LineChart from "../utils/LineChart";
import BarChart from "../utils/BarChart";
import VariableBarChart from "../utils/VariableBarChart";

const CHART_DURATION_TIME = 5000;

const ChartControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  font-size: ${style.controlButtonSize};
  height: 30px;
  width: 100px;
  background-color: ${(props) => props.theme.buttonBackground};
  margin: ${style.controlButtonMargin};
  border: none;
  border-radius: ${style.borderRadius};
  :disabled {
    background-color: ${(props) => props.theme.buttonDisabled};
  }
`;

const Controller = styled.div`
  display: flex;
  justify-content: center;
`;

export default function Chart() {
  const dispatch = useDispatch();
  const [chart, setChart] = useState();
  const [lineChart, setlineChart] = useState();
  const [barChart, setBarChart] = useState();
  const [variableBarChart, setVariableBarChart] = useState();

  const [playStatus, setPlayStatus] = useState("stop");

  const themeType = useSelector((state) => state.appTheme.colorTheme);
  const chartColor = useSelector((state) => state.appTheme.chartColor);
  const memoryData = useSelector(
    (state) => state.heapMemory.heapMemoryData.result,
  );
  const userInput = useSelector((state) => state.userCode.userInput);
  const chartType = useSelector((state) => state.chartType.type);

  useEffect(() => {
    if (!chart) return;

    chart.setColor(themeType === "dark" ? darkTheme : lightTheme).drawChart();
  }, [themeType]);

  useEffect(() => {
    if (!chart) return;

    lineChart.setLineColor(chartColor);
    barChart.setLineColor(chartColor);
    variableBarChart.setLineColor(chartColor);
  }, [chartColor]);

  function checkNodeHover(isHover, ...node) {
    const [data, style] = node;

    if (isHover) {
      dispatch(setChartModalData(data));
      dispatch(setChartModalStyle(style));
      return;
    }

    dispatch(hiddenChartModal(false));
  }

  function checkBarHover(isHover, ...node) {
    const [data, style] = node;

    if (isHover) {
      dispatch(setVariableBarModalData(data));
      dispatch(setVariableBarModalStyle(style));
      return;
    }

    dispatch(hiddenVariableChartModal(false));
  }

  function handleChartPlay() {
    if (playStatus === "play") return;

    if (!chart) return;

    chart.setCodeData(userInput);
    chart.setData(memoryData, CHART_DURATION_TIME);
    chart.playback();
    setPlayStatus("play");
  }

  function handleChartPause() {
    if (playStatus === "stop") return;

    if (!chart) return;

    chart.pause();
    setPlayStatus("pause");
  }

  function handleChartStop() {
    if (playStatus === "stop") return;

    if (!chart) return;

    chart.stop();
    setPlayStatus("stop");
  }

  useEffect(() => {
    const initChart = new LineChart(
      "chart",
      checkNodeHover,
      darkTheme,
    ).drawChart();

    setlineChart(initChart);
    setBarChart(new BarChart("chart", checkNodeHover, darkTheme));
    setVariableBarChart(
      new VariableBarChart("chart", checkBarHover, darkTheme),
    );
    setChart(initChart);
  }, []);

  useEffect(() => {
    if (!chart) return;
    handleChartStop();

    chart.setData(memoryData, CHART_DURATION_TIME);
  }, [memoryData]);

  useEffect(() => {
    if (!chart) return;

    chart.drawClear();
    if (chart) chart.stop();
    handleChartStop();

    if (chartType === "lineChart") {
      if (!lineChart) return;

      setChart(lineChart.drawChart());
      return;
    }
    if (chartType === "barChart") {
      if (!barChart) return;

      setChart(barChart.drawChart());
      return;
    }
    if (chartType === "variableBarChart") {
      if (!variableBarChart) return;

      setChart(variableBarChart.resetBackround());
      return;
    }
  }, [chartType]);

  return (
    <>
      <canvas id="chart" width="580px" height="400px"></canvas>
      <Controller>
        <ChartControlButton
          onClick={handleChartPlay}
          data-testid="start-button"
          disabled={playStatus === "play" ? true : false}
        >
          시작
        </ChartControlButton>
        <ChartControlButton
          onClick={handleChartPause}
          data-testid="pause-button"
          disabled={
            playStatus === "pause" || playStatus === "stop" ? true : false
          }
        >
          일시정지
        </ChartControlButton>
        <ChartControlButton
          onClick={handleChartStop}
          data-testid="stop-button"
          disabled={playStatus === "stop" ? true : false}
        >
          정지
        </ChartControlButton>
      </Controller>
    </>
  );
}
