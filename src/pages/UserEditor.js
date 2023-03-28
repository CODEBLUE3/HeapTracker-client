import styled from "styled-components";
import CodeInput from "../component/CodeInput";
import CodeExecution from "../component/CodeExecution";
import CodeResult from "../component/CodeResult";
import { useState, useEffect } from "react";
import { style } from "../styles/styleCode";
import { useDispatch, useSelector } from "react-redux";
import { setUserCode } from "../features/userCode/userCodeSlice";
import { setColorTheme } from "../features/appGlobal/appGlobalSlice";

const Container = styled.div.attrs((props) => ({
  transform: props.checked ? "translateX(0px)" : "translateX(20px)",
  color: props.checked ? "yellow" : "#398ab3",
}))`
  height: 100vh;
`;

const ThemeSelect = styled.select`
  display: flex;
`;

const ExecButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.buttonFont};
  font-size: 1.3rem;
  background-color: ${(props) => props.theme.buttonBackground};
  border: none;
  border-radius: 20px;
  margin: 0px ${style.defaultComponentMargin};
  width: 15%;
  :disabled {
    background-color: ${(props) => props.theme.buttonDisabled};
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${style.defaultComponentMargin};
  margin-top: 5px;
`;

const RowTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 5px;
`;

const Title = styled.div`
  display: flex;
  margin-top: 5px;
  color: ${(props) => props.theme.defaultFont};
`;

export default function UserEditor() {
  const [userInput, setUserInput] = useState("");
  const [userExecution, setUserExecution] = useState("");
  const [codeResult, setCodeResult] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.appGlobal.colorTheme);

  function handleUserInput(value) {
    setUserInput(value);
  }

  function handleUserExeution(value) {
    setUserExecution(value);
  }

  function handleSelectChange({ target }) {
    console.info("handleSelectChange", target.value);
    dispatch(setColorTheme(target.value));
  }

  function sendCode() {
    window.electronAPI.validateUserCode(userInput, userExecution);
    window.electronAPI.validateUserCodeReply(setCodeResult);
    dispatch(
      setUserCode({
        userInput,
        userExecution,
      }),
    );
  }

  useEffect(() => {
    if (!codeResult.isError) {
      window.electronAPI.executeHeapTracker(userInput, userExecution);
    }
  }, [codeResult]);

  return (
    <Container>
      <RowTitle>
        <Title>함수 코드</Title>
        <ThemeSelect name="theme" onChange={handleSelectChange}>
          <option value="dark">Dark Theme</option>
          <option value="light">Light Theme</option>
        </ThemeSelect>
      </RowTitle>
      <CodeInput value={userInput} onChange={handleUserInput} />
      <RowContainer>
        <Title>함수 실행 코드</Title>
      </RowContainer>
      <RowContainer>
        <CodeExecution value={userExecution} onChange={handleUserExeution} />
        <ExecButton
          data-testid="execute-button"
          onClick={sendCode}
          disabled={userInput.length === 0 && userExecution.length === 0}
        >
          실행
        </ExecButton>
      </RowContainer>
      <CodeResult result={codeResult} />
    </Container>
  );
}
