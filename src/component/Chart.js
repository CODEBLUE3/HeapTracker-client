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
import VariableBarChart from "../utils/VariableBarChart";
import BarChart from "../utils/BarChart";

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
  const [playStatus, setPlayStatus] = useState("stop");

  const themeType = useSelector((state) => state.appTheme.colorTheme);
  const memoryData = useSelector(
    (state) => state.heapMemory.heapMemoryData.result,
  );
  const codeData = useSelector((state) => state.userCode.userInput);
  const chartType = useSelector((state) => state.chartType.type);

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
    if (!chart) return;

    chart.setData(memoryData, CHART_DURATION_TIME);
    handleChartStop();
  }, [memoryData]);

  useEffect(() => {
    if (!chart) return;

    chart.setColor(themeType === "dark" ? darkTheme : lightTheme).drawChart();
  }, [themeType]);

  useEffect(() => {
    if (!chart) return;

    if (chartType === "variableBarChart") {
      chart.setCodeData(codeData);
    }
  }, [codeData]);

  useEffect(() => {
    if (chartType === "lineChart") {
      setChart(
        new LineChart("lineChart", checkNodeHover, darkTheme).drawChart(),
      );
      return;
    }

    if (chartType === "barChart") {
      setChart(new BarChart("barChart", checkNodeHover, darkTheme).drawChart());
      return;
    }

    if (chartType === "variableBarChart") {
      setChart(
        new VariableBarChart(
          "variableBarChart",
          checkBarHover,
          darkTheme,
        ).drawAxis(),
      );
      return;
    }
  }, [chartType]);

  return (
    <>
      <canvas id="lineChart" width="550px" height="400px"></canvas>
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
          종료
        </ChartControlButton>
      </Controller>
    </>
  );
}
