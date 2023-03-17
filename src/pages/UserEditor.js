import styled from "styled-components";
import CodeInput from "../component/CodeInput";
import CodeExecution from "../component/CodeExecution";
import CodeResult from "../component/CodeResult";
import { useState } from "react";
import { color } from "../styles/styleCode";

const Button = styled.button`
  display: block;
  color: ${color.defaultBoxBackground};
  font-size: 20px;
  height: 50px;
  width: 200px;
  background-color: ${color.defaultButton};
  margin: 10px;
  border: none;
  border-radius: 20px;
`;

export default function UserEditor() {
  const [userInput, setUserInput] = useState("");
  const [userExecution, setUserExecution] = useState("");
  const [codeResult, setCodeResult] = useState("");

  function handleUserInput(value) {
    setUserInput(value);
  }

  function handleUserExeution(value) {
    setUserExecution(value);
  }

  function sendCode() {
    window.electronAPI.sendCode(userInput, userExecution);
    window.electronAPI.replyCode(setCodeResult);
  }

  return (
    <>
      <CodeInput value={userInput} onChange={handleUserInput} />
      <CodeExecution value={userExecution} onChange={handleUserExeution} />
      <Button onClick={sendCode}>제출하기</Button>
      <CodeResult result={codeResult} />
    </>
  );
}
