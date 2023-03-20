import React, { useState, useEffect } from "react";
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

export default function ChartResult({ data }) {
  const [RunTime, setRunTime] = useState();
  const [maxMemory, setmaxMemory] = useState();
  const [minMemory, setminMemory] = useState();
  const [nodeCount, setnodeCount] = useState();

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.result.length > 0) {
      setRunTime(Number(data.result.at(-1).timeStamp));
      setmaxMemory(data.result.maxMemoryText);
      setminMemory(data.result.minMemoryText);
      setnodeCount(data.result.length);
    }
  }, [data]);

  return (
    <StyledWrapper>
      <ul>
        <li className="title">RESULT</li>
        <li className="info">
          <div className="name">TOTAL RUN TIME</div>
          <div className="data">
            {RunTime}ns, {Math.round(RunTime / 1000000)}ms
          </div>
        </li>
        <li className="info">
          <div className="name">MAX MEMORY</div>
          <div className="data">{maxMemory}bytes</div>
        </li>
        <li className="info">
          <div className="name">MIN MEMORY</div>
          <div className="data">{minMemory}bytes</div>
        </li>
        <li className="info">
          <div className="name">TOTAL NODE COUNT</div>
          <div className="data">{nodeCount}</div>
        </li>
      </ul>
    </StyledWrapper>
  );
}
