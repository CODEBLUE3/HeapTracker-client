import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { style } from "../styles/styleCode";

const POSITION_UNIT = "px";

const Container = styled.div`
  visibility: ${(props) =>
    props.visibility === "true" ? "visible" : "hidden"};
  position: absolute;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  padding: 10px 20px;

  background-color: ${(props) => props.theme.chartModal};
  border-radius: ${style.borderRadius};
  font-size: 1rem;
`;

export default function VariableBarModal() {
  const { variableCount, variableName } = useSelector(
    (state) => state.variableBarModal.variableBarData,
  );
  const { visibility, top, left } = useSelector(
    (state) => state.variableBarModal.styles,
  );

  return (
    <Container
      visibility={String(visibility)}
      top={top + POSITION_UNIT}
      left={left + POSITION_UNIT}
    >
      <div className="variableName">
        변수 이름 : {variableName && variableName}
      </div>
      <div className="count">{variableCount && variableCount} 번 할당됨</div>
    </Container>
  );
}
