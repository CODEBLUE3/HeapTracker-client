import React from "react";
import styled from "styled-components";

import UserEditor from "./pages/UserEditor";
import OutputResult from "./pages/OutputResult";
import GlobalStyle from "./styles/GlobalStyle";

const Main = styled.div`
  background-color: #fafafa;
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const LeftContainer = styled.div`
  float: left;
  width: 48%;
  flex-direction: column;
  margin: 5px;
  padding: 10px;
`;

const RightContainer = styled.div`
  float: right;
  width: 48%;
  flex-direction: column;
  margin: 5px;
`;

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Main>
        <LeftContainer>
          <UserEditor />
        </LeftContainer>
        <RightContainer>
          <OutputResult />
        </RightContainer>
      </Main>
    </>
  );
}
