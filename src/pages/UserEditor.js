import styled from "styled-components";
import CodeInput from "../component/CodeInput";
import CodeExecution from "../component/CodeExecution";
import CodeResult from "../component/CodeResult";
import { useEffect, useState } from "react";

const Button = styled.button`
  display: block;
  color: white;
  font-size: 20px;
  height: 50px;
  width: 200px;
  background-color: #1e90ff;
  margin: 10px;
  border: none;
  border-radius: 20px;
`;

export default function UserEditor() {
  const [userInput, setUserInput] = useState("");
  const [userExecution, setUserExecution] = useState("");
  const [codeResult, setCodeResult] = useState("");
  const { ipcRenderer } = window.require("electron");

  function handleUserInput(value) {
    setUserInput(value);
  }

  function handleUserExeution(value) {
    setUserExecution(value);
  }

  function sendCode() {
    ipcRenderer.send("userCode", { userInput, userExecution });
  }

  useEffect(() => {
    ipcRenderer.on("userCode-reply", (event, payload) => {
      setCodeResult(payload);
    });

    return () => {
      ipcRenderer.removeAllListeners("userCode-reply");
    };
  }, []);

  return (
    <>
      <CodeInput value={userInput} onChange={handleUserInput} />
      <CodeExecution value={userExecution} onChange={handleUserExeution} />
      <Button onClick={sendCode}>제출하기</Button>
      <CodeResult result={codeResult} />
    </>
  );
}
