import React from "react";
import { useDispatch } from "react-redux";
import { setHeapMemoryData } from "../../src/features/heapMemory/heapMemorySlice";
import { chartMock } from "./ChartMockData";

export default function ReduxMockFunction() {
  const dispatch = useDispatch();

  function setMemoryArray() {
    dispatch(setHeapMemoryData(chartMock));
  }

  return (
    <>
      <button data-testid="dispatch-button" onClick={setMemoryArray}></button>
    </>
  );
}
