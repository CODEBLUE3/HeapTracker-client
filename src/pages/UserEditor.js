import styled from "styled-components";
import CodeInput from "../component/CodeInput";
import CodeExecution from "../component/CodeExecution";
import CodeResult from "../component/CodeResult";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserCode } from "../features/userCode/userCodeSlice";
import { setColorTheme } from "../features/appTheme/appThemeSlice";

const Container = styled.div`
  height: 100vh;
  padding: 10px 40px;
`;

const ThemeSelect = styled.select`
  display: flex;
  margin: 30px 0 20px;
`;

const Title = styled.div`
  display: flex;

  color: ${(props) => props.theme.defaultFont};
  font-weight: 600;

  margin: 30px 0 20px;
`;

const ExecButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => props.theme.buttonFont};
  font-size: 1rem;
  background-color: ${(props) => props.theme.buttonBackground};
  border: 2px solid ${(props) => props.theme.defaultBorder};
  border-radius: 5px;

  width: 12%;
  :disabled {
    background-color: ${(props) => props.theme.buttonDisabled};
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RowTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default function UserEditor() {
  const [userInput, setUserInput] = useState("");
  const [userExecution, setUserExecution] = useState("");
  const [codeResult, setCodeResult] = useState("");
  const dispatch = useDispatch();

  function handleUserInput(value) {
    setUserInput(value);
  }

  function handleUserExeution(value) {
    setUserExecution(value);
  }

  function handleSelectChange({ target }) {
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
      <Title>실행 결과</Title>
      <CodeResult result={codeResult} />
    </Container>
  );
}
