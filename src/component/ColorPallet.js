import React, { useState, useRef } from "react";
import styled from "styled-components";

const Pallet = styled.div`
  position: absolute;
  display: none;

  font-size: 1rem;
  border: 1px solid ${(props) => props.theme.defaultFont};

  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.defaultFont};
`;

const Color = styled.div`
  width: 15px;
  height: 15px;
  margin: 5px;

  :hover {
    width: 14px;
    height: 14px;
    border: 1px solid ${(props) => props.theme.defaultFont};
  }
`;

function ColorPallet({ display, parent, isShow }) {
  const colorArray = [
    "#B80000",
    "#DB3E00",
    "#FCCB00",
    "#008B02",
    "#006B76",
    "#1273DE",
    "#1E90FF",
    "#5300EB",
  ];

  const handleColorClick = (e) => {
    isShow(e.target.id);
  };

  return (
    <Pallet
      style={{
        display: display,
        left: parent.current ? parent.current.offsetLeft - 30 : 0,
      }}
    >
      {colorArray.map((color, item) => {
        return (
          <Color
            id={color}
            key={color}
            onClick={handleColorClick}
            style={{ backgroundColor: color }}
          />
        );
      })}
    </Pallet>
  );
}

export default ColorPallet;
