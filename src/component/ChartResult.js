import React, { useState } from "react";

export default function ChartResult({ data }) {
  const totalRunTime = data ? data[data.length - 1].timeStamp : "";
  const max_Memory = data
    ? data.reduce((prev, current) =>
        prev.usedMemory > current.usedMemory ? prev : current,
      ).usedMemory
    : "";
  const min_Memory = data
    ? data.reduce((prev, current) =>
        prev.usedMemory < current.usedMemory ? prev : current,
      ).usedMemory
    : "";

  return (
    <ul>
      <li className="title">React</li>
      <li>
        <div className="name">TOTAL RUN TIME</div>
        <div className="data">{totalRunTime}</div>
      </li>
      <li>
        <div className="name">MAX MEMORY</div>
        <div className="data">{max_Memory}</div>
      </li>
      <li>
        <div className="name">MIN MEMORY</div>
        <div className="data">{min_Memory}</div>
      </li>
    </ul>
  );
}
