import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { setChartColor } from "../features/appTheme/appThemeSlice";

import ColorPallet from "./ColorPallet";

const Button = styled.button`
  width: 40px;
  height: 35px;
  margin: 50px;
`;

function ColorPalletButton() {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);

  const chartColor = useSelector((state) => state.appTheme.chartColor);

  const buttonRef = useRef();
  const openPallet = (e) => {
    setIsShow(!isShow);
  };

  const handleSelectdColor = (color) => {
    dispatch(setChartColor(color));
    setIsShow(false);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={openPallet}
        style={{
          backgroundColor: chartColor,
        }}
      />
      <ColorPallet
        display={isShow ? "block" : "none"}
        parent={buttonRef}
        isShow={handleSelectdColor}
      />
    </>
  );
}

export default ColorPalletButton;
