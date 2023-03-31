import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { style } from "../styles/styleCode";
import HelpButton from "./HelpButton";
import ToggleButton from "./ToggleButton";

const ResultContainer = styled.div`
  height: 32vh;
  margin: 0px 30px;
  border-radius: ${style.borderRadius};
  background-color: ${(props) => props.theme.boxBackground};

  ul {
    height: 80vh;
    margin: 10px;
    margin-top: -5px;
  }

  .title {
    height: 3.9vh;
    line-height: 3.9vh;
    text-align: center;

    font-size: 1.6rem;
    font-weight: 900;

    color: ${(props) => props.theme.defaultFont};
  }

  .info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 3.9vh;

    font-size: 1rem;
    margin-top: 0.5vh;
    border-bottom: 0.2px solid gray;

    color: ${(props) => props.theme.defaultFont};
  }

  .name {
    width: 220px;
    margin-left: 4vh;
  }

  .name::before {
    content: "🔷";
    margin-right: 10px;
  }

  .data {
    width: 180px;
    text-align: center;
  }
`;

const RowContainer = styled.div`
  display: float;
  flex-direction: row;
  font-size: 1.8rem;
  margin: 5px 0px;
`;

const Title = styled.div`
  display: flex;
  float: left;
  width: 57%;
  justify-content: flex-end;
  padding: 10px 10px;
  font-weight: bold;
  color: ${(props) => props.theme.defaultFont};
`;

const ColorButton = styled.div`
  display: flex;
  float: right;
  width: 30%;
  justify-content: flex-end;
  padding: 10px;
`;

export default function ChartResult() {
  const memoryData = useSelector(
    (state) => state.heapMemory.heapMemoryData.result,
  );

  const [duration, setDuration] = useState(0);
  const [maxMemory, setMaxMemory] = useState(0);
  const [minMemory, setMinMemory] = useState(0);
  const [usedMemory, setUsedMemory] = useState(0);
  const [unitToggle, setUnitToggle] = useState(true);

  useEffect(() => {
    if (!memoryData) return;

    let min = Infinity;
    let max = 0;
    memoryData?.forEach((element) => {
      min = Math.min(min, element.usedMemory);
      max = Math.max(max, element.usedMemory);
    });

    setMaxMemory(max);
    setMinMemory(min);
    setUsedMemory((memoryData ? max : 0) - (memoryData ? min : 0));
    setDuration(memoryData?.at(-1).timeStamp - memoryData?.at(0).timeStamp);
  }, [memoryData]);

  const toggleState = (toggle) => {
    setUnitToggle(toggle);
  };

  return (
    <ResultContainer data-testid="chart-result">
      <RowContainer>
        <Title>RESULT</Title>
        <ColorButton>
          <ToggleButton click={toggleState} />
        </ColorButton>
      </RowContainer>
      <ul>
        <li className="info">
          <div className="name">
            RUN TIME{" "}
            <HelpButton modalId="help1" info="함수의 총 실행 시간입니다." />
          </div>
          <div className="data" data-testid="memory-duration">
            {Math.floor(unitToggle ? duration : duration / 1000)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            {unitToggle ? "us" : "ms"}
          </div>
        </li>
        <li className="info">
          <div className="name">
            MAX MEMORY{" "}
            <HelpButton
              modalId="help2"
              info="코드 실행 중의 최대 메모리 할당 값 입니다."
            />
          </div>
          <div className="data" data-testid="memory-max">
            {Math.floor(unitToggle ? maxMemory : maxMemory / 1000)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            {unitToggle ? "bytes" : "kilobytes"}
          </div>
        </li>
        <li className="info">
          <div className="name">
            MIN MEMORY{" "}
            <HelpButton
              modalId="help3"
              info="코드가 시작되는 시점의 메모리 할당 값 입니다. "
            />
          </div>
          <div className="data" data-testid="memory-min">
            {Math.floor(unitToggle ? minMemory : minMemory / 1000)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            {unitToggle ? "bytes" : "kilobytes"}
          </div>
        </li>
        <li className="info">
          <div className="name">
            USED MEMORY{" "}
            <HelpButton
              modalId="help4"
              info="힙메모리의 최대 값에서 시작 값을 뺀 순수 사용된 값 입니다."
            />
          </div>
          <div className="data" data-testid="memory-used">
            {Math.floor(unitToggle ? usedMemory : usedMemory / 1000)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            {unitToggle ? "bytes" : "kilobytes"}
          </div>
        </li>
        <li className="info">
          <div className="name">
            NODE COUNT{" "}
            <HelpButton
              modalId="help5"
              info="메모리 탐색을 위해 실행된 트랙킹 함수 실행 횟수입니다."
            />
          </div>
          <div className="data" data-testid="memory-count">
            {(memoryData ? memoryData.length : 0)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </li>
      </ul>
    </ResultContainer>
  );
}
