import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import ChartModal from "../component/ChartModal";
import ChartResult from "../component/ChartResult";
import Chart from "../component/Chart";
import { setHeapMemoryData } from "../features/heapMemory/heapMemorySlice";

const Container = styled.div`
  height: 100vh;
`;

export default function OutputResult() {
  const dispatch = useDispatch();

  const setMemoryArray = (data) => {
    if (data.result.length > 0) {
      const baseTime = Number(data.result[0].timeStamp);

      data.result.forEach((element) => {
        element.timeStamp = Number(element.timeStamp) - baseTime;
      });

      dispatch(setHeapMemoryData(data));
    }
  };

  useEffect(() => {
    window.electronAPI.executeHeapTrackerReply(setMemoryArray);
  }, []);

  return (
    <Container>
      <Chart />
      <ChartModal />
      <ChartResult />
    </Container>
  );
}
