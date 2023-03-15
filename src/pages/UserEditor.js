import styled from "styled-components";
import CodeInput from "../component/CodeInput";
import CodeExecution from "../component/CodeExecution";
import CodeResult from "../component/CodeResult";

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
  return (
    <>
      <CodeInput />
      <CodeExecution />
      <Button>제출하기</Button>
      <CodeResult />
    </>
  );
}
