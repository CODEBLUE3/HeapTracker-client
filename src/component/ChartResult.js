import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const StyledWrapper = styled.div`
  ul {
    padding: 20px;
    height: 40vh;

    background-color: ${color.defaultBoxBackground};
    border-radius: ${style.borderRadius};
  }

  .title {
    text-align: center;
    line-height: 10vh;
    height: 10vh;

    font-size: 1.6rem;
    font-weight: 900;
  }

  .info {
    display: flex;
    justify-content: space-around;
    align-items: center;

    font-size: 1rem;
    height: 8vh;
    margin-top: 1vh;

    border-bottom: 0.2px solid gray;
  }

  .name::before {
    content: "🔷";
    margin-right: 10px;
  }
`;

export default function ChartResult() {
  const memoryData = useSelector(
    (state) => state.heapMemory.heapMemoryData.result,
  );
  const duration = memoryData?.at(-1).timeStamp - memoryData?.at(0).timeStamp;
  let minMemory = Infinity;
  let maxMemory = 0;

  memoryData?.forEach((element) => {
    minMemory = Math.min(minMemory, element.usedMemory);
    maxMemory = Math.max(maxMemory, element.usedMemory);
  });

  return (
    <StyledWrapper>
      <ul>
        <li className="title">RESULT</li>
        <li className="info">
          <div className="name">TOTAL RUN TIME</div>
          <div className="data">
            {memoryData &&
              `${duration}ns, ${Math.floor(Number(duration) / 1000000)}`}
          </div>
        </li>
        <li className="info">
          <div className="name">MAX MEMORY</div>
          <div className="data">{memoryData && maxMemory}bytes</div>
        </li>
        <li className="info">
          <div className="name">MIN MEMORY</div>
          <div className="data">{memoryData && minMemory}bytes</div>
        </li>
        <li className="info">
          <div className="name">TOTAL NODE COUNT</div>
          <div className="data">{memoryData && memoryData.length}</div>
        </li>
      </ul>
    </StyledWrapper>
  );
}
