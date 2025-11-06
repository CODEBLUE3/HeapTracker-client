import React from "react";
import { useSelector } from "react-redux";
import ModalContainer from "./ModalContainer";

export default function VariableBarModal() {
  const { variableCount, variableName } = useSelector(
    (state) => state.variableBarModal.variableBarData,
  );
  const { visibility, top, left } = useSelector(
    (state) => state.variableBarModal.styles,
  );

  return (
    <ModalContainer visibility={visibility} top={top} left={left}>
      <div className="variableName">
        변수 이름 : {variableName && variableName}
      </div>
      <div className="count">호출 횟수 : {variableCount && variableCount}</div>
    </ModalContainer>
  );
}
