import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Chart from "../component/Chart";
import ChartResult from "../component/ChartResult";
import { setNodeData } from "../features/heapMemory/heapMemorySlice";

export default function OutputResult() {
  const dispatch = useDispatch();

  const setMemoryArray = (data) => {
    if (data.result.length > 0) {
      const baseTime = Number(data.result[0].timeStamp);

      data.result.forEach((element) => {
        element.timeStamp = Number(element.timeStamp) - baseTime;
      });

      dispatch(setNodeData(data));
    }
  };

  useEffect(() => {
    window.electronAPI.executeHeapTrackerReply(setMemoryArray);
  }, []);

  return (
    <>
      <Chart />
      <ChartResult />
    </>
  );
}
