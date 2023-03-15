import React, { useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

import Chart from "./component/Chart";

function App() {
  return (
    <Main>
      <LeftContainer></LeftContainer>
      <RightContainer>
        <Chart />
      </RightContainer>
    </Main>
  );
}

const Main = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const LeftContainer = styled.div`
  background: #ffffdd;
  float: left;
  width: 48%;
  flex-direction: column;
  margin: 5px;
`;

const RightContainer = styled.div`
  background: #ddffff;
  float: right;
  width: 48%;
  flex-direction: column;
  margin: 5px;
`;

export default App;
