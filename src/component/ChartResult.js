import React from "react";
import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const ResultContainer = styled.div`
  height: 30%;

  ul {
    padding: 20px;
    height: 30vh;

    background-color: ${color.defaultBoxBackground};
    border-radius: ${style.borderRadius};
  }

  .title {
    text-align: center;
    line-height: 4vh;
    height: 4vh;

    font-size: 1.6rem;
    font-weight: 900;
  }

  .info {
    display: flex;
    justify-content: space-around;
    align-items: center;

    font-size: 1rem;
    height: 4vh;
    margin-top: 1vh;

    border-bottom: 0.2px solid gray;
  }

  .name {
    margin-left: 4vh;
    width: 180px;
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

export default function ChartResult({ resultData }) {
  return (
    <ResultContainer>
      <ul>
        <li className="title">RESULT</li>
        <li className="info">
          <div className="name">RUN TIME</div>
          <div className="data">
            {Number(resultData.duration ? resultData.duration : 0)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            us
          </div>
        </li>
        <li className="info">
          <div className="name">MAX MEMORY</div>
          <div className="data">
            {(resultData.maxMemory ? resultData.maxMemory : 0)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            bytes
          </div>
        </li>
        <li className="info">
          <div className="name">MIN MEMORY</div>
          <div className="data">
            {(resultData.minMemory ? resultData.minMemory : 0)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            bytes
          </div>
        </li>
        <li className="info">
          <div className="name">USED MEMORY</div>
          <div className="data">
            {(
              (resultData.maxMemory ? resultData.maxMemory : 0) -
              (resultData.minMemory ? resultData.minMemory : 0)
            )
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
            bytes
          </div>
        </li>
        <li className="info">
          <div className="name">NODE COUNT</div>
          <div className="data">
            {(resultData.count ? resultData.count : 0)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </li>
      </ul>
    </ResultContainer>
  );
}
