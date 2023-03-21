import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { style } from "../styles/styleCode";
import { javascript } from "@codemirror/lang-javascript";

const CodeContainer = styled.div`
  flex-direction: column;
  margin: 20px ${style.defaultComponentMargin};
  width: 85%;
  height: 70px;
`;

export default function CodeExecution({ value, onChange }) {
  return (
    <CodeContainer>
      <div>함수실행 코드</div>
      <CodeMirror
        value={value}
        height="70px"
        extensions={[javascript({ jsx: false })]}
        onChange={onChange}
      />
    </CodeContainer>
  );
}
