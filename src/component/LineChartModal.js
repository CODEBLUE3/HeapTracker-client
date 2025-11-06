import React from "react";
import { useSelector } from "react-redux";
import ModalContainer from "./ModalContainer";

const REMOVE_CODE_TYPE_ARRAY = [
  "statement",
  "Declaration",
  "Expression",
  "Statement",
];

export default function LineChartModal() {
  const { codeCount, codeType, codePosition, usedMemory, timeStamp } =
    useSelector((state) => state.chartModal.data);
  const { visibility, top, left } = useSelector(
    (state) => state.chartModal.styles,
  );

  const usTimestamp = Math.floor(Number(timeStamp)) / 1000;
  const shortCodeType =
    codeType &&
    REMOVE_CODE_TYPE_ARRAY.map((type) => {
      if (codeType.includes(type)) return codeType.replace(type, "");
    }).filter((node) => node);

  return (
    <ModalContainer
      visibility={visibility}
      top={top}
      left={left}
      testId="chartModal"
    >
      <div className="codeCount">{codeCount && codeCount}th node</div>
      <div className="codeType">
        {codeType ? `Type: ${shortCodeType}` : `Code Position: ${codePosition}`}
      </div>
      <div className="usedMemory">Used Memory: {usedMemory && usedMemory}</div>
      <div className="timeStamp">Time: {timeStamp && usTimestamp} us</div>
    </ModalContainer>
  );
}
