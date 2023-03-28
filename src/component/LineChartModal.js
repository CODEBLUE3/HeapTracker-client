import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { style } from "../styles/styleCode";

const POSITION_UNIT = "px";
const REMOVE_CODE_TYPE_ARRAY = [
  "statement",
  "Declaration",
  "Expression",
  "Statement",
];

const Container = styled.div`
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};

  padding: 10px 20px;
  border-radius: ${style.borderRadius};
  font-size: 1rem;

  background-color: ${(props) => props.theme.chartModal};
  visibility: ${(props) =>
    props.visibility === "true" ? "visible" : "hidden"};
`;

export default function ChartModal() {
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
    <Container
      visibility={String(visibility)}
      top={top + POSITION_UNIT}
      left={left + POSITION_UNIT}
      data-testid="chartModal"
    >
      <div className="codeCount">{codeCount && codeCount}th node</div>
      <div className="codeType">
        {codeType ? `Type: ${shortCodeType}` : `Code Position: ${codePosition}`}
      </div>
      <div className="usedMemory">Used Memory: {usedMemory && usedMemory}</div>
      <div className="timeStamp">Time: {timeStamp && usTimestamp} us</div>
    </Container>
  );
}
