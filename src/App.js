import React, { useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

function App() {
  const [usercode, setUserCode] = useState({});

  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
    setUserCode(value);
  }, []);

  const handleRunCode = () => {
    console.log("value:", usercode);
  };

  return (
    <Main>
      <LeftContainer>
        <div>Hello World!</div>
        <CodeMirror
          value="console.log('hello world!');"
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />
        <button type="button" onClick={handleRunCode}>
          코드실행
        </button>
      </LeftContainer>
      <RightContainer>
        <div>chart</div>
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
