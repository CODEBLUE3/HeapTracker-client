import React, { useEffect, useState } from "react";
import LineChart from "../utils/LineChart";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";
import { useSelector, useDispatch } from "react-redux";
import {
  setChartModalData,
  setChartModalStyle,
  hiddenChartModal,
} from "../features/chartModal/chartModalSlice";

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
  const dispatch = useDispatch();
  const memoryData = useSelector(
    (state) => state.heapMemory.heapMemoryData.result,
  );

  function checkNodeHover(isHover, ...node) {
    const [data, style] = node;

    if (isHover) {
      dispatch(setChartModalData(data));
      dispatch(setChartModalStyle(style));
      return;
    }

    dispatch(hiddenChartModal(false));
  }

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

  useEffect(() => {
    if (!memoryData) return;

    chart.setData(memoryData, CHART_DURATION_TIME);
  }, [memoryData]);

  useEffect(() => {
    setChart(new LineChart("lineChart", checkNodeHover));
  }, []);

  return (
    <>
      <canvas id="lineChart" width="550px" height="400px"></canvas>
      <Controller>
        <ChartControlButton
          onClick={handleChartPlay}
          data-testid="start-button"
        >
          시작
        </ChartControlButton>
        <ChartControlButton
          onClick={handleChartPause}
          data-testid="pause-button"
        >
          일시정지
        </ChartControlButton>
        <ChartControlButton onClick={handleChartStop} data-testid="stop-button">
          종료
        </ChartControlButton>
      </Controller>
    </>
  );
}
