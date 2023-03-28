import { useSelector } from "react-redux";
import styled from "styled-components";
import { style } from "../styles/styleCode";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

const CodeContainer = styled.div`
  flex-direction: column;
  height: 61.5vh;
  margin: ${style.defaultComponentMargin};
  border: 2px solid ${(props) => props.theme.defaultBorder};
`;

export default function CodeInput({ value, onChange }) {
  const theme = useSelector((state) => state.appTheme.colorTheme);

  return (
    <CodeContainer>
      <CodeMirror
        data-testid="codemirror-input"
        value={value}
        height="475px"
        minHeight="400px"
        extensions={[javascript({ jsx: false })]}
        onChange={onChange}
        theme={theme}
      />
    </CodeContainer>
  );
}
