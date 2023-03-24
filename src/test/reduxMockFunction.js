import React from "react";
import { useDispatch } from "react-redux";
import { setHeapMemoryData } from "../features/heapMemory/heapMemorySlice";
import { chartMock } from "../mock/chartMock";

export default function ReduxMockFunction() {
  const dispatch = useDispatch();

  function setMemoryArray() {
    console.log("setMemoryArray");
    dispatch(setHeapMemoryData(chartMock));
  }

  return (
    <>
      <button data-testid="dispatchButton" onClick={setMemoryArray}></button>
    </>
  );
}
