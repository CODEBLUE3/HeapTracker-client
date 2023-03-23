import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
  visibility: hidden;
`;

export default function ChartModal() {
  const modal = useSelector((state) => state.ChartModal);

  return (
    <Container>
      <div className="chartModal">
        chartModal
        <div className="codeCount"></div>
        <div className="codeType"></div>
        <div className="usedMemory"></div>
        <div className="timeStamp"></div>
      </div>
    </Container>
  );
}
