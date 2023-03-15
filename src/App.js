import React from "react";
import styled from "styled-components";
import UserEditor from "./pages/UserEditor";

function App() {
  return (
    <Main>
      <LeftContainer>
        <UserEditor />
      </LeftContainer>
      <RightContainer>
        <div>chart</div>
      </RightContainer>
    </Main>
  );
}

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

export default App;
