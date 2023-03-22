import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { style } from "../styles/styleCode";
import { javascript } from "@codemirror/lang-javascript";

const CodeContainer = styled.div`
  flex-direction: column;
  margin: ${style.defaultComponentMargin};
  height: 70%;
`;

export default function CodeInput({ value, onChange }) {
  return (
    <CodeContainer>
      <div>함수 코드</div>
      <CodeMirror
        value={value}
        height="500px"
        minHeight="400px"
        extensions={[javascript({ jsx: false })]}
        onChange={onChange}
      />
    </CodeContainer>
  );
}
