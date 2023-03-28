import React, { useEffect, useState } from "react";
import LineChart from "../utils/LineChart";
import styled from "styled-components";
import { style, lightTheme, darkTheme } from "../styles/styleCode";
import { useSelector, useDispatch } from "react-redux";
import {
  setChartModalData,
  setChartModalStyle,
  hiddenChartModal,
} from "../features/chartModal/chartModalSlice";
import VariableBarChart from "../utils/VariableBarChart";
import {
  hiddenVariableChartModal,
  setVariableBarModalData,
  setVariableBarModalStyle,
} from "../features/chartModal/variableBarModalSlice";

const CHART_DURATION_TIME = 3000;

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

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 20px;
`;

const Item = styled.div`
  position: relative;
  display: flex;
  margin-top: 5px;
  margin: 0px 20px;
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

  useEffect(() => {
    if (!chart) return;

    chart.setColor(themeType === "dark" ? darkTheme : lightTheme).drawChart();
  }, [themeType]);

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
    if (chart) {
      chart.setCodeData(codeData);
    }
  }, [codeData]);

  useEffect(() => {
    setChart(
      new VariableBarChart("chart", checkBarHover, darkTheme).drawAxis(),
    );
  }, []);

  return (
    <>
      <RowContainer>
        <Item>
          <button>Memory-LineChart</button>
          <button>Memory-BarChart</button>
          <button>Value-UsedChart</button>
        </Item>
      </RowContainer>
      <canvas id="chart" width="530px" height="400px"></canvas>
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
