import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const Container = styled.div`
  visibility: ${(props) =>
    props.visibility === "true" ? "visible" : "hidden"};
  position: absolute;
  background-color: ${color.chartModal};
  border-radius: ${style.borderRadius};
  padding: 10px 20px;
  font-size: 1rem;
`;

export default function ChartModal() {
  const {
    codeCount,
    codeType,
    codePositon,
    usedMemory,
    timeStamp,
    visibility,
  } = useSelector((state) => state.chartModal);

  return (
    <Container visibility={String(visibility)}>
      <div className="codeCount">{codeCount && codeCount}th node</div>
      <div className="codeType">
        {codeType ? `Type: ${codeType}` : `Code Position: ${codePositon}`}
      </div>
      <div className="usedMemory">Used Memory: {usedMemory && usedMemory}</div>
      <div className="timeStamp">Time: {timeStamp && timeStamp}</div>
    </Container>
  );
}
