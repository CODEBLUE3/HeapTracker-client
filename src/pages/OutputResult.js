import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import ChartModal from "../component/ChartModal";
import ChartResult from "../component/ChartResult";
import Chart from "../component/Chart";

import { setHeapMemoryData } from "../features/heapMemory/heapMemorySlice";
import { setChartType } from "../features/chartType/chartTypeSlice";

const Container = styled.div`
  height: 100vh;
  padding: 20px 40px;
`;

const ChartNavigation = styled.nav`
  display: flex;
  justify-content: center;
  margin: 40px 0 20px;

  button {
    background-color: ${(props) => props.theme.background};
    border: 2px solid ${(props) => props.theme.defaultFont};
    color: ${(props) => props.theme.defaultFont};

    margin: 0 10px 0;
    padding: 10px;
    border-radius: 10px;

    transition: all 0.6s;
  }

  button:hover {
    background-color: ${(props) => props.theme.buttonBackground};
    border: 2px solid ${(props) => props.theme.buttonFont};
    color: ${(props) => props.theme.buttonFont};
  }
`;

export default function OutputResult() {
  const dispatch = useDispatch();

  function handleChartType(e) {
    if (e.target.className === "lineChart") {
      dispatch(setChartType("lineChart"));
      return;
    }

    if (e.target.className === "barChart") {
      dispatch(setChartType("barChart"));
      return;
    }

    if (e.target.className === "variableBarChart") {
      dispatch(setChartType("variableBarChart"));
      return;
    }
  }

  function setMemoryArray(data) {
    if (data.result.length > 0) {
      const baseTime = Number(data.result[0].timeStamp);

      data.result.forEach((element) => {
        element.timeStamp = Number(element.timeStamp) - baseTime;
      });

      dispatch(setHeapMemoryData(data));
    }
  }

  useEffect(() => {
    window.electronAPI.executeHeapTrackerReply(setMemoryArray);
  }, []);

  return (
    <Container>
      <ChartNavigation onClick={handleChartType}>
        <button className="lineChart">Memory-LineChart</button>
        <button className="barChart">Memory-BarChart</button>
        <button className="variableBarChart">Value-UsedChart</button>
      </ChartNavigation>
      <Chart />
      <ChartModal />
      <ChartResult />
    </Container>
  );
}
